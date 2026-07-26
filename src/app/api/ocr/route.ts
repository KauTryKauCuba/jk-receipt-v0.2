import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

// ────────────────────────────────────────────────────────────────────────────────
// OCR ENGINE CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

// ────────────────────────────────────────────────────────────────────────────────
// GROQ VISION ENGINE (Primary — qwen/qwen3.6-27b via Groq API)
// ────────────────────────────────────────────────────────────────────────────────

async function runGroqVisionOCR(imageBase64: string): Promise<Record<string, unknown>> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured. Set it in your .env file.");
  }

  // Strip data URL prefix if present, keep only the base64 payload
  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

  // Detect MIME type from data URL or default to jpeg
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

  // Parse JSON from model response (strip markdown fences if present)
  const jsonStr = content
    .replace(/^```json?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonStr);
    return { ...parsed, engine: "GROQ QWEN 3.6-27B" };
  } catch {
    // If JSON parse fails, attempt to extract any JSON object from the response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return { ...parsed, engine: "GROQ QWEN 3.6-27B" };
      } catch {
        // Return raw text as fallback
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
      engine: "GROQ QWEN 3.6-27B (RAW)",
    };
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// TESSERACT OCR ENGINE (Local — requires tesseract-ocr installed on server)
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

  // Write temp image file
  const tempDir = join(tmpdir(), "jk-receipt-ocr");
  await mkdir(tempDir, { recursive: true });
  const tempId = randomUUID();
  const inputPath = join(tempDir, `${tempId}.jpg`);
  const outputBase = join(tempDir, `${tempId}_out`);
  const outputPath = `${outputBase}.txt`;

  try {
    await writeFile(inputPath, imageBuffer);

    // Tesseract CLI with receipt-optimized settings:
    // --psm 4 : Assume single column of text of variable sizes (receipts are narrow columns)
    // --oem 3 : Default LSTM + legacy combined for best accuracy
    // -l eng  : English language (add +msa for Malay if installed)
    const cmd = `tesseract "${inputPath}" "${outputBase}" --psm 4 --oem 3 -l eng -c preserve_interword_spaces=1`;

    await execPromise(cmd);

    // Read OCR output
    const { readFile: readFileAsync } = await import("fs/promises");
    const rawText = await readFileAsync(outputPath, "utf-8");

    // Parse receipt text with pattern matching
    const parsed = parseReceiptText(rawText);
    return { ...parsed, engine: "TESSERACT LOCAL" };
  } finally {
    // Cleanup temp files (non-blocking)
    unlink(inputPath).catch(() => {});
    unlink(outputPath).catch(() => {});
  }
}

// Receipt text parser for Tesseract raw OCR output
function parseReceiptText(rawText: string): Record<string, unknown> {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  // Extract merchant (usually first non-empty lines)
  const merchant = lines[0] || "MERCHANT";

  // Extract date patterns: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD MMM YYYY
  let date = new Date().toISOString().split("T")[0];
  for (const line of lines) {
    // YYYY-MM-DD
    const isoMatch = line.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      date = isoMatch[0];
      break;
    }
    // DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = line.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      break;
    }
    // DD MMM YYYY
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

  // Extract total amount — look for TOTAL, GRAND TOTAL, JUMLAH patterns
  let total = 0;
  let subtotal = 0;
  let tax = 0;

  for (const line of lines) {
    const upper = line.toUpperCase();

    // Tax / SST / GST
    if (/\b(SST|GST|TAX|CUKAI)\b/i.test(upper)) {
      const taxMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (taxMatch) {
        tax = parseFloat(taxMatch[1].replace(",", ""));
      }
    }

    // Grand total or Total (prioritize GRAND TOTAL)
    if (/\b(GRAND\s*TOTAL|TOTAL\s*(?:PAID|DUE|AMOUNT)|JUMLAH\s*BESAR)\b/i.test(upper)) {
      const totalMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (totalMatch) {
        total = parseFloat(totalMatch[1].replace(",", ""));
      }
    } else if (/\bTOTAL\b/i.test(upper) && total === 0) {
      const totalMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (totalMatch) {
        total = parseFloat(totalMatch[1].replace(",", ""));
      }
    }

    // Subtotal
    if (/\bSUB\s*TOTAL\b/i.test(upper)) {
      const stMatch = line.match(/(\d+[,.]?\d*\.?\d+)\s*$/);
      if (stMatch) {
        subtotal = parseFloat(stMatch[1].replace(",", ""));
      }
    }
  }

  // Extract line items — lines with prices (number at end of line)
  const items: { description: string; qty: number; price: number }[] = [];
  for (const line of lines) {
    const upper = line.toUpperCase();
    // Skip header/footer lines
    if (/\b(TOTAL|SUBTOTAL|SST|GST|TAX|CHANGE|CASH|CARD|VISA|MASTER|THANK|WELCOME|DATE|TIME|ADDRESS|TEL|RECEIPT|INVOICE)\b/i.test(upper)) {
      continue;
    }
    // Match lines with price at end: "ITEM NAME    12.50" or "ITEM NAME x2 12.50"
    const itemMatch = line.match(/^(.+?)\s+(\d+[,.]?\d*\.?\d+)\s*$/);
    if (itemMatch) {
      let desc = itemMatch[1].trim();
      const price = parseFloat(itemMatch[2].replace(",", ""));
      if (price > 0 && price < 100000) {
        // Check for quantity indicator
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

    const engine = (preferredEngine || "standard").toLowerCase();
    let ocrResult: Record<string, unknown>;

    if (engine === "tesseract") {
      // ── Tesseract Only ──
      ocrResult = await runTesseractOCR(imageBase64);

    } else if (engine === "groq") {
      // ── Groq Only ──
      ocrResult = await runGroqVisionOCR(imageBase64);

    } else {
      // ── Standard / Auto: Try Groq first, fall back to Tesseract ──
      try {
        ocrResult = await runGroqVisionOCR(imageBase64);
      } catch (groqErr) {
        console.warn("Groq Vision failed, attempting Tesseract fallback:", groqErr);
        try {
          ocrResult = await runTesseractOCR(imageBase64);
          ocrResult.engine = `TESSERACT LOCAL (FALLBACK)`;
        } catch (tessErr) {
          console.error("Both OCR engines failed:", tessErr);
          throw groqErr; // Throw original Groq error as it's the primary
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
