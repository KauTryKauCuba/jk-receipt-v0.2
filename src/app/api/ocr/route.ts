import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in server environment." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid imageBase64 string." },
        { status: 400 }
      );
    }

    // Ensure proper data URL format for Groq multimodal input
    const formattedImage = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const prompt = `System: You are an optical receipt parser. Read the attached image carefully and extract the text visible on THIS specific receipt.
Output ONLY a valid JSON block inside \`\`\`json ... \`\`\`. Do NOT output any reasoning or text outside the JSON block.

CRITICAL RULES:
- 'merchant': Store/vendor name printed on the receipt image (in uppercase).
- 'date': Transaction date in YYYY-MM-DD format (e.g. 2026-07-25).
- 'category': One of: "business", "tax", "household", "warranties", "medical".
- 'subtotal': Total before tax/SST.
- 'tax': Tax or SST amount paid (0.00 if none).
- 'total': Net total amount paid.
- 'items': Array of extracted line items. Each item MUST contain:
  - 'description': Item name printed on receipt.
  - 'qty': Quantity (number).
  - 'price': Line item total price (number).

\`\`\`json
{
  "merchant": "EXTRACTED_STORE_NAME",
  "date": "YYYY-MM-DD",
  "category": "business",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "items": [
    { "description": "EXTRACTED_ITEM_NAME", "qty": 1, "price": 0.00 }
  ],
  "rawTextStream": "ALL_TEXT_READABLE_FROM_IMAGE"
}
\`\`\``;

    // Dual/Triple Vision Model Fallback Chain (100% Free on Groq)
    const visionModels = [
      "llama-3.2-11b-vision-preview",
      "llama-3.2-90b-vision-preview",
      "qwen/qwen3.6-27b",
    ];

    let response: Response | null = null;
    let lastErrorText = "";

    for (const model of visionModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: {
                      url: formattedImage,
                    },
                  },
                ],
              },
            ],
            temperature: 0.1,
            max_tokens: 1500,
          }),
        });

        if (res.ok) {
          response = res;
          break;
        } else {
          lastErrorText = await res.text();
          console.warn(`Groq Vision model ${model} failed (${res.status}): ${lastErrorText}`);
        }
      } catch (e) {
        console.warn(`Model ${model} fetch exception:`, e);
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        { error: "Groq Vision API error", details: lastErrorText },
        { status: 400 }
      );
    }

    const data = await response.json();
    const contentString = data.choices?.[0]?.message?.content;

    if (!contentString) {
      return NextResponse.json(
        { error: "No response text received from Groq Vision model." },
        { status: 500 }
      );
    }

    // Strip out <think>...</think> reasoning blocks if present
    const cleanContent = contentString.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    let parsedResult: Record<string, unknown> = {};
    try {
      // 1. Try extracting json block between ```json ... ```
      const codeBlockMatch = cleanContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (codeBlockMatch && codeBlockMatch[1]) {
        parsedResult = JSON.parse(codeBlockMatch[1]);
      } else {
        // 2. Try extracting content between first { and LAST }
        const lastBraceIndex = cleanContent.lastIndexOf("}");
        const firstBraceIndex = cleanContent.indexOf("{");
        if (firstBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
          const jsonSubstring = cleanContent.substring(firstBraceIndex, lastBraceIndex + 1);
          parsedResult = JSON.parse(jsonSubstring);
        } else {
          parsedResult = JSON.parse(cleanContent);
        }
      }
    } catch {
      try {
        // Fallback last-ditch json extraction
        const match = cleanContent.match(/\{[\s\S]*\}/);
        if (match) {
          parsedResult = JSON.parse(match[0]);
        } else {
          throw new Error("No JSON structure matched");
        }
      } catch (err) {
        console.warn("Raw vision response was not pure JSON, parsing dynamic text stream:", cleanContent, err);
        
        // Dynamic fallback extractor from actual OCR text stream
        const lines = cleanContent
          .split("\n")
          .map((l: string) => l.replace(/[\*#_`]/g, "").trim())
          .filter((l: string) => l.length > 2 && !l.startsWith("{") && !l.startsWith("}"));

        // Extract merchant from first header line
        const headerCandidate = lines.find((l: string) => /^[A-Z0-9\s.&'-]{3,40}$/i.test(l)) || lines[0] || "STORE RECEIPT";
        const extractedMerchant = headerCandidate.toUpperCase();

        // Extract date
        const dateMatch = cleanContent.match(/(\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
        let extractedDate = dateMatch ? dateMatch[1].replace(/\//g, "-") : new Date().toISOString().split("T")[0];
        if (extractedDate.length === 8 && extractedDate.includes("-")) {
          const parts = extractedDate.split("-");
          if (parts[2].length === 2) {
            extractedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }

        // Extract monetary amounts (find highest number for total)
        const numberMatches = Array.from(cleanContent.matchAll(/(?:RM|\$)?\s*(\d+\.\d{2})/gi), (m: RegExpMatchArray) => parseFloat(m[1]));
        const extractedTotal = numberMatches.length > 0 ? Math.max(...numberMatches) : 0.00;
        const extractedSubtotal = numberMatches.length > 1 ? Math.min(...numberMatches) : extractedTotal;

        parsedResult = {
          merchant: extractedMerchant,
          date: extractedDate,
          category: "business",
          subtotal: extractedSubtotal,
          tax: Math.round((extractedTotal - extractedSubtotal) * 100) / 100 || 0.00,
          total: extractedTotal,
          items: [
            { description: `${extractedMerchant} RECORD`, qty: 1, price: extractedTotal }
          ],
          rawTextStream: cleanContent
        };
      }
    }

    // Sanitize merchant string (strip leading/trailing markdown asterisks and quotes)
    if (typeof parsedResult.merchant === "string") {
      parsedResult.merchant = parsedResult.merchant
        .replace(/^[\*\s"']+|[\*\s"']+$/g, "")
        .trim();
    }

    // Sanitize item descriptions
    if (Array.isArray(parsedResult.items)) {
      parsedResult.items = parsedResult.items.map((it: unknown) => {
        if (it && typeof it === "object" && "description" in it && typeof (it as { description: unknown }).description === "string") {
          const itemObj = it as { description: string; qty?: number; price?: number };
          return {
            ...itemObj,
            description: itemObj.description.replace(/^[\*\s"']+|[\*\s"']+$/g, "").trim(),
          };
        }
        return it;
      });
    }

    return NextResponse.json({ success: true, data: parsedResult });
  } catch (err: unknown) {
    console.error("OCR API Endpoint Exception:", err);
    const message = err instanceof Error ? err.message : "Internal OCR processing error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
