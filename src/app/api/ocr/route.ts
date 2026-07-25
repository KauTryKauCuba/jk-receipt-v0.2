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

    const prompt = `System: You are an ultra-high precision optical receipt parser for commercial receipts, thermal paper slips, and invoices.
Do NOT output any reasoning, chain-of-thought, or text outside the JSON code block. Output ONLY valid JSON inside \`\`\`json ... \`\`\`.

CRITICAL PARSING RULES:
- 'merchant': Full store/vendor name in uppercase (e.g. "99 SPEED MART SDN BHD", "STARBUCKS COFFEE", "SHELL").
- 'date': Date in YYYY-MM-DD format. If ambiguous, infer year 2026.
- 'category': Categorize as one of: "business", "tax", "household", "warranties", "medical".
- 'subtotal': Amount before tax/SST or discounts.
- 'tax': Tax or SST (6%/8%) amount paid.
- 'total': Final net total amount paid (e.g. MYR / USD total).
- 'items': Array of extracted product line items. Each line item MUST contain:
  - 'description': Clean item description in uppercase.
  - 'qty': Purchased quantity (number, default 1).
  - 'price': Total price for this line item (number).

\`\`\`json
{
  "merchant": "99 SPEED MART SDN. BHD.",
  "date": "2026-07-25",
  "category": "business",
  "subtotal": 28.45,
  "tax": 0.00,
  "total": 28.45,
  "items": [
    { "description": "DUTCH LADY MILK 1L", "qty": 1, "price": 7.50 },
    { "description": "PANADOL EXTRA (BOX)", "qty": 1, "price": 13.95 },
    { "description": "PLASTIC BAG", "qty": 1, "price": 0.20 }
  ],
  "rawTextStream": "FULL OCR STREAM LINES"
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
