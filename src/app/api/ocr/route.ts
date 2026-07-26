import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

// ────────────────────────────────────────────────────────────────────────────────
// OCR ENGINE CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────────

// Groq Cloud Vision
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Ollama Local Vision (moondream, llama3.2-vision, llava, garnet-ocr-3b)
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://172.17.0.1:11434";
const OLLAMA_OCR_MODEL = process.env.LOCAL_VISION_MODEL || "moondream:latest";

// Receipt-optimized system prompt for structured JSON extraction
const RECEIPT_SYSTEM_PROMPT = `You are an expert receipt OCR parser. Analyze the receipt image and extract ALL information into valid JSON.

RULES:
- Extract the EXACT merchant/store name from the header
- Extract the EXACT date in YYYY-MM-DD format (parse any date format you see)
- Extract EVERY individual line item with its description, quantity, and unit price
- Calculate subtotal, tax (SST/GST), and total from the receipt
- Categorize as one of: "business", "tax", "household", "warranties", "medical"
- Currency is Malaysian Ringgit (RM/MYR) unless stated otherwise
- If a value is unclear, make your best estimate rather than returning 0
- Return ONLY valid JSON, no markdown fences, no explanation

JSON SCHEMA:
{
  "merchant": "STORE NAME",
  "date": "YYYY-MM-DD",
  "category": "business",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "items": [
    {"description": "ITEM NAME", "qty": 1, "price": 0.00}
  ],
  "rawTextStream": "Full raw text visible on the receipt"
}`;

// Simpler prompt for smaller Ollama models (garnet-ocr-3b, moondream)
const OLLAMA_RECEIPT_PROMPT = `Read this receipt image carefully. Extract all text and return a JSON object with these fields:
- "merchant": store/shop name
- "date": date in YYYY-MM-DD format
- "category": "business"
- "subtotal": subtotal amount as number
- "tax": tax/SST amount as number
- "total": total amount as number
- "items": array of {"description": "item name", "qty": quantity, "price": unit price}
- "rawTextStream": all raw text from the receipt

Return ONLY valid JSON. No explanation.`;

// ────────────────────────────────────────────────────────────────────────────────
// HELPER: Parse JSON from AI model response (handles markdown fences, etc.)
// ────────────────────────────────────────────────────────────────────────────────

function parseModelJsonResponse(content: string, engineLabel: string): Record<string, unknown> {
  // Strip markdown fences if present
  const jsonStr = content
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonStr);
    return { ...parsed, engine: engineLabel };
  } catch {
    // Attempt to extract any JSON object from the response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return { ...parsed, engine: engineLabel };
      } catch {
        // Fall through
      }
    }
    return {
      merchant: "PARSE ERROR",
      date: new Date().toISOString().split("T")[0],
      category: "business",
      subtotal: 0,
      tax: 0,
      total: 0,
      items: [],
      rawTextStream: content,
      engine: `${engineLabel} (RAW)`,
    };
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// GROQ VISION ENGINE (Cloud — qwen/qwen3.6-27b via Groq API)
// ────────────────────────────────────────────────────────────────────────────────

async function runGroqVisionOCR(imageBase64: string): Promise<Record<string, unknown>> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured. Set it in your .env file.");
  }

  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
  let mimeType = "image/jpeg";
  const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,/);
  if (mimeMatch) {
    mimeType = mimeMatch[1];
  }

  const payload = {
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: RECEIPT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Parse this receipt image. Extract all merchant details, dates, line items, subtotals, tax, and total. Return structured JSON only.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Clean}`,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  };

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq API returned empty response content.");
  }

  return parseModelJsonResponse(content, "GROQ QWEN 3.6-27B");
}

// ────────────────────────────────────────────────────────────────────────────────
// OLLAMA LOCAL VISION ENGINE (garnet-ocr-3b / llama3.2-vision / llava / moondream)
// ────────────────────────────────────────────────────────────────────────────────

async function runOllamaVisionOCR(imageBase64: string, model?: string): Promise<Record<string, unknown>> {
  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
  const activeModel = model || OLLAMA_OCR_MODEL;

  // Use Ollama's native /api/chat endpoint (supports images natively)
  const payload = {
    model: activeModel,
    messages: [
      {
        role: "user",
        content: OLLAMA_RECEIPT_PROMPT,
        images: [base64Clean],
      },
    ],
    stream: false,
    options: {
      temperature: 0.1,
      num_predict: 4096,
    },
  };

  const ollamaUrl = `${OLLAMA_HOST}/api/chat`;

  const response = await fetch(ollamaUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120000), // 2 minute timeout for local models
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Ollama API error ${response.status} (${activeModel}): ${errBody}`);
  }

  const result = await response.json();
  const content = result.message?.content;

  if (!content) {
    throw new Error(`Ollama returned empty response from ${activeModel}.`);
  }

  const modelLabel = activeModel.toUpperCase().replace(/[:/]/g, " ");
  return parseModelJsonResponse(content, `OLLAMA ${modelLabel}`);
}

// ────────────────────────────────────────────────────────────────────────────────
// TESSERACT OCR ENGINE (Local CLI — basic fallback)
// ────────────────────────────────────────────────────────────────────────────────

function execPromise(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Tesseract exec error: ${err.message}. stderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function runTesseractOCR(imageBase64: string): Promise<Record<string, unknown>> {
  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
  const imageBuffer = Buffer.from(base64Clean, "base64");

  const tempDir = join(tmpdir(), "jk-receipt-ocr");
  await mkdir(tempDir, { recursive: true });
  const tempId = randomUUID();
  const inputPath = join(tempDir, `${tempId}.jpg`);
  const preprocessedPath = join(tempDir, `${tempId}_preprocessed.png`);
  const outputBase = join(tempDir, `${tempId}_out`);
  const outputPath = `${outputBase}.txt`;

  try {
    await writeFile(inputPath, imageBuffer);

    // Image preprocessing with ImageMagick (if available)
    try {
      const preprocessCmd = [
        `convert "${inputPath}"`,
        `-colorspace Gray`,
        `-resize "2400x>"`,
        `-contrast-stretch 3%x3%`,
        `-sharpen 0x1`,
        `-despeckle`,
        `-density 300`,
        `-quality 100`,
        `"${preprocessedPath}"`,
      ].join(" ");
      await execPromise(preprocessCmd);
    } catch {
      console.warn("ImageMagick preprocessing unavailable, using raw image.");
      await writeFile(preprocessedPath, imageBuffer);
    }

    const cmd = `tesseract "${preprocessedPath}" "${outputBase}" --psm 6 --oem 1 -l eng -c preserve_interword_spaces=1`;
    await execPromise(cmd);

    const { readFile: readFileAsync } = await import("fs/promises");
    const rawText = await readFileAsync(outputPath, "utf-8");

    const parsed = parseReceiptText(rawText);
    return { ...parsed, engine: "TESSERACT LOCAL" };
  } finally {
    unlink(inputPath).catch(() => {});
    unlink(preprocessedPath).catch(() => {});
    unlink(outputPath).catch(() => {});
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// TESSERACT + OLLAMA HYBRID ENGINE
// Tesseract extracts raw text → Ollama AI parses it into structured data
// ────────────────────────────────────────────────────────────────────────────────

async function runTesseractWithOllamaRefine(imageBase64: string): Promise<Record<string, unknown>> {
  // Step 1: Try Tesseract raw text extraction
  let rawText = "";
  try {
    const tessResult = await runTesseractOCR(imageBase64);
    rawText = (tessResult.rawTextStream as string) || "";
  } catch {
    console.warn("Tesseract failed in hybrid mode, sending image directly to Ollama.");
  }

  // Step 2: Send image to Ollama vision for AI-powered parsing
  // Even if Tesseract failed, Ollama vision models can read images directly
  const result = await runOllamaVisionOCR(imageBase64);

  // Append Tesseract raw text if available for reference
  if (rawText && result.rawTextStream) {
    result.rawTextStream = `${result.rawTextStream}\n\n--- TESSERACT RAW ---\n${rawText}`;
  } else if (rawText) {
    result.rawTextStream = rawText;
  }

  result.engine = `OLLAMA ${OLLAMA_OCR_MODEL.toUpperCase()} + TESSERACT`;
  return result;
}

// Receipt text parser for Tesseract raw OCR output
function parseReceiptText(rawText: string): Record<string, unknown> {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  const merchant = lines[0] || "MERCHANT";

  let date = new Date().toISOString().split("T")[0];
  for (const line of lines) {
    const isoMatch = line.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) { date = isoMatch[0]; break; }
    const dmyMatch = line.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      break;
    }
    const longMatch = line.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{4})/i);
    if (longMatch) {
      const months: Record<string, string> = {
        jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
        jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
      };
      const [, d, m, y] = longMatch;
      date = `${y}-${months[m.toLowerCase().substring(0, 3)]}-${d.padStart(2, "0")}`;
      break;
    }
  }

  let total = 0;
  let subtotal = 0;
  let tax = 0;

  for (const line of lines) {
    const upper = line.toUpperCase();
    if (/\b(SST|GST|TAX|CUKAI)\b/i.test(upper)) {
      const taxMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (taxMatch) tax = parseFloat(taxMatch[1].replace(",", ""));
    }
    if (/\b(GRAND\s*TOTAL|TOTAL\s*(?:PAID|DUE|AMOUNT)|JUMLAH\s*BESAR)\b/i.test(upper)) {
      const totalMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (totalMatch) total = parseFloat(totalMatch[1].replace(",", ""));
    } else if (/\bTOTAL\b/i.test(upper) && total === 0) {
      const totalMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (totalMatch) total = parseFloat(totalMatch[1].replace(",", ""));
    }
    if (/\bSUB\s*TOTAL\b/i.test(upper)) {
      const stMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (stMatch) subtotal = parseFloat(stMatch[1].replace(",", ""));
    }
  }

  const items: { description: string; qty: number; price: number }[] = [];
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (/\b(TOTAL|SUBTOTAL|SST|GST|TAX|CHANGE|CASH|CARD|VISA|MASTER|THANK|WELCOME|DATE|TIME|ADDRESS|TEL|RECEIPT|INVOICE)\b/i.test(upper)) continue;
    const itemMatch = line.match(/^(.+?)\s+(\d+[,.]?\d*\.?\d+)\s*$/);
    if (itemMatch) {
      let desc = itemMatch[1].trim();
      const price = parseFloat(itemMatch[2].replace(",", ""));
      if (price > 0 && price < 100000) {
        let qty = 1;
        const qtyMatch = desc.match(/[xX×]\s*(\d+)\s*$/);
        if (qtyMatch) {
          qty = parseInt(qtyMatch[1]);
          desc = desc.replace(/\s*[xX×]\s*\d+\s*$/, "").trim();
        }
        items.push({ description: desc.substring(0, 60), qty, price });
      }
    }
  }

  return {
    merchant: merchant.substring(0, 50),
    date,
    category: "business",
    subtotal: subtotal || (total > 0 ? Math.round((total / 1.06) * 100) / 100 : 0),
    tax: tax || (total > 0 ? Math.round((total - total / 1.06) * 100) / 100 : 0),
    total,
    items: items.length > 0 ? items : [{ description: "RECEIPT ITEM", qty: 1, price: total }],
    rawTextStream: rawText,
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// PADDLEOCR ENGINE (Local Python3 + PaddleOCR)
// ────────────────────────────────────────────────────────────────────────────────

async function runPaddleOCR(imageBase64: string): Promise<Record<string, unknown>> {
  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
  const imageBuffer = Buffer.from(base64Clean, "base64");

  const tempDir = join(tmpdir(), "jk-receipt-ocr");
  await mkdir(tempDir, { recursive: true });
  const tempId = randomUUID();
  const inputPath = join(tempDir, `${tempId}.jpg`);

  try {
    await writeFile(inputPath, imageBuffer);

    // Python inline script invoking PaddleOCR engine
    const pyScript = `import sys, json
try:
    from paddleocr import PaddleOCR
    ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
    result = ocr.ocr(sys.argv[1], cls=True)
    lines = []
    if result:
        for block in result:
            if block:
                for line in block:
                    if line and len(line) > 1 and line[1]:
                        lines.append(str(line[1][0]))
    print(json.dumps({"success": True, "text": "\\n".join(lines)}))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))`;

    const pyCmd = `python3 -c '${pyScript.replace(/'/g, "'\\''")}' "${inputPath}"`;
    let stdout = "";
    try {
      stdout = await execPromise(pyCmd);
    } catch {
      // Fallback: attempt running python via user local path if system python3 fails
      const userPyCmd = `~/.local/bin/python3 -c '${pyScript.replace(/'/g, "'\\''")}' "${inputPath}"`;
      stdout = await execPromise(userPyCmd);
    }

    let extractedText = "";
    try {
      const parsedPy = JSON.parse(stdout);
      if (parsedPy.success) {
        extractedText = parsedPy.text;
      } else {
        throw new Error(parsedPy.error || "PaddleOCR execution failed.");
      }
    } catch {
      extractedText = stdout;
    }

    if (!extractedText.trim()) {
      throw new Error("PaddleOCR returned empty text output.");
    }

    const parsed = parseReceiptText(extractedText);
    return { ...parsed, engine: "PADDLEOCR LOCAL" };
  } finally {
    unlink(inputPath).catch(() => {});
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// API ROUTE HANDLER
// ────────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { imageBase64, preferredEngine } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64 payload." },
        { status: 400 }
      );
    }

    const engine = (preferredEngine || "groq").toLowerCase();
    let ocrResult: Record<string, unknown>;

    if (engine === "groq") {
      // ── Groq Cloud Vision (Primary) ──
      ocrResult = await runGroqVisionOCR(imageBase64);

    } else if (engine === "paddle" || engine === "paddleocr") {
      // ── PaddleOCR Local Engine ──
      ocrResult = await runPaddleOCR(imageBase64);

    } else if (engine === "ollama") {
      // ── Ollama Local Vision (moondream:latest) ──
      ocrResult = await runOllamaVisionOCR(imageBase64, "moondream:latest");

    } else if (engine === "llama32" || engine === "llama3.2-vision" || engine === "llama3.2") {
      // ── Ollama Local Vision (llama3.2-vision:latest) ──
      ocrResult = await runOllamaVisionOCR(imageBase64, "llama3.2-vision:latest");

    } else if (engine === "tesseract") {
      // ── Tesseract + Ollama Hybrid ──
      // Tesseract extracts text, Ollama refines into structured data
      ocrResult = await runTesseractWithOllamaRefine(imageBase64);

    } else {
      // ── Standard / Auto: Groq → Ollama → Tesseract+Ollama ──
      try {
        ocrResult = await runGroqVisionOCR(imageBase64);
      } catch (groqErr) {
        console.warn("Groq Vision failed, attempting Ollama local fallback:", groqErr);
        try {
          ocrResult = await runOllamaVisionOCR(imageBase64);
          ocrResult.engine = `OLLAMA ${OLLAMA_OCR_MODEL.toUpperCase()} (FALLBACK)`;
        } catch (ollamaErr) {
          console.warn("Ollama Vision failed, attempting Tesseract fallback:", ollamaErr);
          try {
            ocrResult = await runTesseractOCR(imageBase64);
            ocrResult.engine = "TESSERACT LOCAL (FALLBACK)";
          } catch (tessErr) {
            console.error("All OCR engines failed:", tessErr);
            throw groqErr;
          }
        }
      }
    }

    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        ...ocrResult,
        processingTimeMs: elapsed,
      },
    });
  } catch (err: unknown) {
    const elapsed = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    console.error(`OCR Route Exception (${elapsed}ms):`, err);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
