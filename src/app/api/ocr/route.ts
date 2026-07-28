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

// Gemini Flash Vision (Google AI)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Ollama Local Vision (moondream, llama3.2-vision, llava, garnet-ocr-3b)
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://172.17.0.1:11434";
const OLLAMA_OCR_MODEL = process.env.LOCAL_VISION_MODEL || "moondream:latest";

// Models known to support structured JSON output mode
const GROQ_JSON_MODE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "gemma2-9b-it",
  "mixtral-8x7b-32768",
];

// Small Ollama models that need simpler prompts
const SMALL_OLLAMA_MODELS = ["moondream", "garnet-ocr", "nano", "tiny"];

// Receipt-optimized system prompt for structured JSON extraction
const RECEIPT_SYSTEM_PROMPT = `You are an expert receipt OCR parser. Analyze the receipt image and extract ALL information into valid JSON.

RULES:
- Extract the EXACT merchant/store name from the header
- Extract the EXACT date in YYYY-MM-DD format (parse any date format you see)
- For ambiguous DD/MM vs MM/DD dates, prefer DD/MM/YYYY (Malaysian standard)
- Extract EVERY individual line item with its description, quantity, and unit price
- Calculate subtotal, tax (SST/GST), and total from the receipt
- Categorize as one of: "business", "tax", "household", "warranties", "medical"
- Currency is Malaysian Ringgit (RM/MYR) unless stated otherwise
- If a value is unclear, make your best estimate rather than returning 0
- Return ONLY valid JSON, no markdown fences, no explanation, no thinking

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
const OLLAMA_SIMPLE_PROMPT = `Read this receipt image carefully. Extract all text and return a JSON object with these fields:
- "merchant": store/shop name
- "date": date in YYYY-MM-DD format
- "category": "business"
- "subtotal": subtotal amount as number
- "tax": tax/SST amount as number
- "total": total amount as number
- "items": array of {"description": "item name", "qty": quantity, "price": unit price}
- "rawTextStream": all raw text from the receipt

Return ONLY valid JSON. No explanation. No thinking.`;

// ────────────────────────────────────────────────────────────────────────────────
// HELPER: Parse JSON from AI model response
// Handles: markdown fences, <think> tags, preamble text, escaped chars
// ────────────────────────────────────────────────────────────────────────────────

function parseModelJsonResponse(content: string, engineLabel: string): Record<string, unknown> {
  let cleaned = content;

  // Strip <think>...</think> reasoning tokens (Qwen, DeepSeek, etc.)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "");

  // Remove any BOM or zero-width chars
  cleaned = cleaned.replace(/[\uFEFF\u200B\u200C\u200D]/g, "");

  cleaned = cleaned.trim();

  // Attempt 1: Direct parse
  try {
    const parsed = JSON.parse(cleaned);
    return { ...parsed, engine: engineLabel };
  } catch {
    // continue
  }

  // Attempt 2: Extract the first complete JSON object { ... }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(jsonCandidate);
      return { ...parsed, engine: engineLabel };
    } catch {
      // Attempt 3: Try fixing common JSON issues (trailing commas, single quotes)
      try {
        const fixed = jsonCandidate
          .replace(/,\s*([}\]])/g, "$1")     // trailing commas
          .replace(/'/g, '"')                 // single quotes → double
          .replace(/(\w+)\s*:/g, '"$1":');    // unquoted keys
        const parsed = JSON.parse(fixed);
        return { ...parsed, engine: engineLabel };
      } catch {
        // fall through
      }
    }
  }

  // Attempt 4: Search for JSON array of items at minimum
  const arrayMatch = cleaned.match(/\[[\s\S]*?\]/);
  if (arrayMatch) {
    try {
      const items = JSON.parse(arrayMatch[0]);
      if (Array.isArray(items)) {
        return {
          merchant: "EXTRACTED",
          date: new Date().toISOString().split("T")[0],
          category: "business",
          subtotal: 0,
          tax: 0,
          total: 0,
          items,
          rawTextStream: content,
          engine: `${engineLabel} (PARTIAL)`,
        };
      }
    } catch {
      // fall through
    }
  }

  // Final fallback: return raw content
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

// ────────────────────────────────────────────────────────────────────────────────
// HELPER: Extract base64 and MIME type from data URL
// ────────────────────────────────────────────────────────────────────────────────

function extractBase64(imageBase64: string): { base64Clean: string; mimeType: string } {
  const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
  return { base64Clean, mimeType };
}

// ────────────────────────────────────────────────────────────────────────────────
// ENGINE 1: GROQ VISION (Cloud — Qwen/LLaMA via Groq API)
// ────────────────────────────────────────────────────────────────────────────────

async function runGroqVisionOCR(imageBase64: string): Promise<Record<string, unknown>> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured. Set it in your .env file.");
  }

  const { base64Clean, mimeType } = extractBase64(imageBase64);

  // Only use json_object response_format for models that support it
  const supportsJsonMode = GROQ_JSON_MODE_MODELS.some((m) => GROQ_MODEL.includes(m));

  const payload: Record<string, unknown> = {
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
  };

  if (supportsJsonMode) {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Groq API error ${response.status}: ${errBody.substring(0, 500)}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq API returned empty response content.");
  }

  const modelLabel = GROQ_MODEL.toUpperCase().replace(/[:/]/g, " ");
  return parseModelJsonResponse(content, `GROQ ${modelLabel}`);
}

// ────────────────────────────────────────────────────────────────────────────────
// ENGINE 2: GEMINI FLASH VISION (Google AI — gemini-2.5-flash)
// ────────────────────────────────────────────────────────────────────────────────

async function runGeminiVisionOCR(imageBase64: string): Promise<Record<string, unknown>> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured. Set it in your .env file.");
  }

  const { base64Clean, mimeType } = extractBase64(imageBase64);

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${RECEIPT_SYSTEM_PROMPT}\n\nParse this receipt image. Extract all merchant details, dates, line items, subtotals, tax, and total. Return structured JSON only.`,
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Clean,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${errBody.substring(0, 500)}`);
  }

  const result = await response.json();

  // Handle Gemini error responses
  if (result.error) {
    throw new Error(`Gemini API error: ${result.error.message || JSON.stringify(result.error)}`);
  }

  const content = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    // Check for blocked content
    const blockReason = result.candidates?.[0]?.finishReason;
    if (blockReason === "SAFETY") {
      throw new Error("Gemini blocked the image due to safety filters.");
    }
    throw new Error("Gemini API returned empty response content.");
  }

  return parseModelJsonResponse(content, `GEMINI ${GEMINI_MODEL.toUpperCase()}`);
}

// ────────────────────────────────────────────────────────────────────────────────
// ENGINE 3: OLLAMA LOCAL VISION (moondream / llama3.2-vision / llava)
// ────────────────────────────────────────────────────────────────────────────────

async function runOllamaVisionOCR(imageBase64: string, model?: string): Promise<Record<string, unknown>> {
  const { base64Clean } = extractBase64(imageBase64);
  const activeModel = model || OLLAMA_OCR_MODEL;

  // Use simpler prompt for small models, full prompt for capable models
  const isSmallModel = SMALL_OLLAMA_MODELS.some((s) => activeModel.toLowerCase().includes(s));
  const prompt = isSmallModel ? OLLAMA_SIMPLE_PROMPT : RECEIPT_SYSTEM_PROMPT + "\n\nParse this receipt image and return structured JSON only.";

  const payload = {
    model: activeModel,
    messages: [
      {
        role: "user",
        content: prompt,
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
    throw new Error(`Ollama API error ${response.status} (${activeModel}): ${errBody.substring(0, 500)}`);
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
// ENGINE 4: TESSERACT OCR (Local CLI — basic text extraction fallback)
// ────────────────────────────────────────────────────────────────────────────────

function execPromise(cmd: string, timeoutMs = 30000): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 10 * 1024 * 1024, timeout: timeoutMs }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Exec error: ${err.message}. stderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function runTesseractOCR(imageBase64: string): Promise<Record<string, unknown>> {
  const { base64Clean } = extractBase64(imageBase64);
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
      await execPromise(preprocessCmd, 15000);
    } catch {
      console.warn("ImageMagick preprocessing unavailable, using raw image.");
      await writeFile(preprocessedPath, imageBuffer);
    }

    const cmd = `tesseract "${preprocessedPath}" "${outputBase}" --psm 6 --oem 1 -l eng -c preserve_interword_spaces=1`;
    await execPromise(cmd, 30000);

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
// ENGINE 5: TESSERACT + OLLAMA HYBRID
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

// ────────────────────────────────────────────────────────────────────────────────
// RECEIPT TEXT PARSER (for Tesseract / PaddleOCR raw text output)
// Handles Malaysian receipt formats, DD/MM/YYYY dates, RM currency
// ────────────────────────────────────────────────────────────────────────────────

function parseReceiptText(rawText: string): Record<string, unknown> {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  // ── MERCHANT: First non-empty, non-date, non-number line ──
  let merchant = "MERCHANT";
  for (const line of lines) {
    const upper = line.toUpperCase();
    // Skip lines that are purely dates, numbers, or common receipt boilerplate
    if (/^\d/.test(line) && /\d$/.test(line)) continue;
    if (/^(DATE|TIME|RECEIPT|INVOICE|TAX|NO|TEL|FAX|ADDRESS)/i.test(upper)) continue;
    if (line.length < 3) continue;
    merchant = line;
    break;
  }

  // ── DATE EXTRACTION (priority: DD/MM/YYYY Malaysian standard) ──
  let date = new Date().toISOString().split("T")[0];
  for (const line of lines) {
    // ISO: 2026-07-28
    const isoMatch = line.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      date = isoMatch[0];
      break;
    }
    // YYYY/MM/DD
    const yyyySlash = line.match(/(\d{4})\/(\d{2})\/(\d{2})/);
    if (yyyySlash) {
      date = `${yyyySlash[1]}-${yyyySlash[2]}-${yyyySlash[3]}`;
      break;
    }
    // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY (Malaysian standard — DD/MM first)
    const dmyMatch = line.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (dmyMatch) {
      const [, a, b, y] = dmyMatch;
      const day = a.padStart(2, "0");
      const month = b.padStart(2, "0");
      // Validate: if month > 12, swap (it was MM/DD format)
      if (parseInt(month) > 12 && parseInt(day) <= 12) {
        date = `${y}-${day}-${month}`;
      } else {
        date = `${y}-${month}-${day}`;
      }
      break;
    }
    // DD/MM/YY (2-digit year)
    const dmyShort = line.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2})(?!\d)/);
    if (dmyShort) {
      const [, a, b, yy] = dmyShort;
      const y = parseInt(yy) > 50 ? `19${yy}` : `20${yy}`;
      const day = a.padStart(2, "0");
      const month = b.padStart(2, "0");
      if (parseInt(month) > 12 && parseInt(day) <= 12) {
        date = `${y}-${day}-${month}`;
      } else {
        date = `${y}-${month}-${day}`;
      }
      break;
    }
    // Long format: 28 Jul 2026, July 28, 2026
    const longMatch = line.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[\s,]+(\d{4})/i);
    if (longMatch) {
      const months: Record<string, string> = {
        jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
        jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
      };
      const [, d, m, y] = longMatch;
      date = `${y}-${months[m.toLowerCase().substring(0, 3)]}-${d.padStart(2, "0")}`;
      break;
    }
    // Reverse long: Jul 28, 2026
    const revLong = line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{1,2})[\s,]+(\d{4})/i);
    if (revLong) {
      const months: Record<string, string> = {
        jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
        jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
      };
      const [, m, d, y] = revLong;
      date = `${y}-${months[m.toLowerCase().substring(0, 3)]}-${d.padStart(2, "0")}`;
      break;
    }
  }

  // ── AMOUNTS: total, subtotal, tax ──
  let total = 0;
  let subtotal = 0;
  let tax = 0;

  // Helper to extract the last number from a line (handles RM, MYR prefix, commas)
  const extractAmount = (line: string): number => {
    const amtMatch = line.match(/(?:RM|MYR)?\s*(\d{1,3}(?:[,]\d{3})*(?:\.\d{1,2})?)(?:\s*(?:CR|DR)?)?$/i);
    if (amtMatch) {
      return parseFloat(amtMatch[1].replace(/,/g, ""));
    }
    // Fallback: last number in line
    const nums = line.match(/(\d+[,.]?\d*\.?\d+)/g);
    if (nums && nums.length > 0) {
      return parseFloat(nums[nums.length - 1].replace(",", ""));
    }
    return 0;
  };

  for (const line of lines) {
    const upper = line.toUpperCase();

    // Tax: SST, GST, TAX, CUKAI, SERVICE TAX
    if (/\b(SST|GST|(?:SERVICE\s+)?TAX|CUKAI)\b/i.test(upper) && !/\bTAX\s*INV/i.test(upper)) {
      const val = extractAmount(line);
      if (val > 0) tax = val;
    }

    // Grand Total / Total Paid / Total Due (highest priority total)
    if (/\b(GRAND\s*TOTAL|TOTAL\s*(?:PAID|DUE|AMOUNT|PAYABLE|SALE)|JUMLAH\s*BESAR|AMOUNT\s*DUE)\b/i.test(upper)) {
      const val = extractAmount(line);
      if (val > 0) total = val;
    } else if (/\bTOTAL\b/i.test(upper) && !/\bSUB/i.test(upper) && total === 0) {
      const val = extractAmount(line);
      if (val > 0) total = val;
    }

    // Subtotal
    if (/\b(SUB\s*TOTAL|SUBTOTAL)\b/i.test(upper)) {
      const val = extractAmount(line);
      if (val > 0) subtotal = val;
    }
  }

  // If we have subtotal but no total, derive total
  if (total === 0 && subtotal > 0) {
    total = subtotal + tax;
  }

  // If we have total but no subtotal, derive subtotal
  if (subtotal === 0 && total > 0) {
    subtotal = tax > 0 ? total - tax : Math.round((total / 1.06) * 100) / 100;
  }

  // If we have total but no tax, derive tax (6% SST Malaysia)
  if (tax === 0 && total > 0) {
    tax = Math.round((total - total / 1.06) * 100) / 100;
  }

  // ── LINE ITEMS ──
  const skipPatterns = /\b(TOTAL|SUBTOTAL|SUB TOTAL|SST|GST|TAX|CHANGE|CASH|CARD|VISA|MASTER|AMEX|THANK|WELCOME|DATE|TIME|ADDRESS|TEL|FAX|RECEIPT|INVOICE|CUKAI|ROUNDING|PAYMENT|BALANCE|TENDER|REF|TRANS|NO\.|REFUND)\b/i;

  const items: { description: string; qty: number; price: number }[] = [];
  for (const line of lines) {
    if (skipPatterns.test(line)) continue;
    if (line === merchant) continue;

    // Pattern: "ITEM NAME    RM 12.50" or "ITEM NAME    12.50"
    const itemMatch = line.match(/^(.+?)\s+(?:RM\s*)?(\d{1,3}(?:[,]\d{3})*\.\d{2})\s*$/i);
    if (itemMatch) {
      let desc = itemMatch[1].trim();
      const price = parseFloat(itemMatch[2].replace(/,/g, ""));
      if (price > 0 && price < 100000) {
        let qty = 1;
        // Check for qty patterns: "x2", "× 3", "2 x", "QTY: 2"
        const qtyMatch = desc.match(/(?:[xX×]\s*(\d+)|\b(\d+)\s*[xX×]|\bQTY[:\s]*(\d+))\s*$/i);
        if (qtyMatch) {
          qty = parseInt(qtyMatch[1] || qtyMatch[2] || qtyMatch[3]);
          desc = desc.replace(/\s*(?:[xX×]\s*\d+|\d+\s*[xX×]|QTY[:\s]*\d+)\s*$/i, "").trim();
        }
        // Check for leading qty: "2 ITEM NAME    12.50"
        const leadQty = desc.match(/^(\d+)\s+(.+)/);
        if (leadQty && parseInt(leadQty[1]) <= 20) {
          qty = parseInt(leadQty[1]);
          desc = leadQty[2].trim();
        }
        items.push({ description: desc.substring(0, 80), qty, price });
      }
    }
  }

  return {
    merchant: merchant.substring(0, 60),
    date,
    category: "business",
    subtotal,
    tax,
    total,
    items: items.length > 0 ? items : [{ description: "RECEIPT ITEM", qty: 1, price: total }],
    rawTextStream: rawText,
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// ENGINE 6: PADDLEOCR (Local Python3 + PaddleOCR)
// ────────────────────────────────────────────────────────────────────────────────

async function runPaddleOCR(imageBase64: string): Promise<Record<string, unknown>> {
  const { base64Clean } = extractBase64(imageBase64);
  const imageBuffer = Buffer.from(base64Clean, "base64");

  const tempDir = join(tmpdir(), "jk-receipt-ocr");
  await mkdir(tempDir, { recursive: true });
  const tempId = randomUUID();
  const inputPath = join(tempDir, `${tempId}.jpg`);

  try {
    await writeFile(inputPath, imageBuffer);

    // Python script: PaddleOCR with confidence filtering and Y-coordinate sorting
    const pyScript = `import sys, json
try:
    from paddleocr import PaddleOCR
    ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
    result = ocr.ocr(sys.argv[1], cls=True)
    entries = []
    if result:
        for block in result:
            if block:
                for line in block:
                    if line and len(line) > 1 and line[1]:
                        text = str(line[1][0]).strip()
                        confidence = float(line[1][1]) if len(line[1]) > 1 else 0.0
                        y_coord = float(line[0][0][1]) if line[0] else 0.0
                        if confidence >= 0.5 and len(text) > 0:
                            entries.append({"text": text, "y": y_coord, "conf": confidence})
    entries.sort(key=lambda e: e["y"])
    lines = [e["text"] for e in entries]
    avg_conf = sum(e["conf"] for e in entries) / len(entries) if entries else 0
    print(json.dumps({"success": True, "text": "\\n".join(lines), "avgConfidence": round(avg_conf, 3), "lineCount": len(lines)}))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))`;

    const pythonBin = process.env.PADDLE_PYTHON_PATH || "python3";
    const pyCmd = `${pythonBin} -c '${pyScript.replace(/'/g, "'\\''")}' "${inputPath}"`;
    const stdout = await execPromise(pyCmd, 60000); // 60s timeout

    let extractedText = "";
    try {
      const parsedPy = JSON.parse(stdout);
      if (parsedPy.success) {
        extractedText = parsedPy.text;
      } else {
        throw new Error(parsedPy.error || "PaddleOCR execution failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`PaddleOCR Python Error: ${msg}`);
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

    } else if (engine === "gemini") {
      // ── Gemini Flash Vision (Google AI) ──
      ocrResult = await runGeminiVisionOCR(imageBase64);

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
      ocrResult = await runTesseractWithOllamaRefine(imageBase64);

    } else {
      // ── AUTO: Groq → Gemini → Ollama → PaddleOCR → Tesseract ──
      ocrResult = await runAutoFallbackChain(imageBase64);
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

// ────────────────────────────────────────────────────────────────────────────────
// AUTO FALLBACK CHAIN: Groq → Gemini → Ollama → PaddleOCR → Tesseract
// ────────────────────────────────────────────────────────────────────────────────

async function runAutoFallbackChain(imageBase64: string): Promise<Record<string, unknown>> {
  // Stage 1: Groq Cloud Vision
  try {
    return await runGroqVisionOCR(imageBase64);
  } catch (groqErr) {
    console.warn("Auto fallback: Groq Vision failed:", groqErr instanceof Error ? groqErr.message : groqErr);
  }

  // Stage 2: Gemini Flash Vision
  if (GEMINI_API_KEY) {
    try {
      const result = await runGeminiVisionOCR(imageBase64);
      result.engine = `${result.engine} (FALLBACK)`;
      return result;
    } catch (geminiErr) {
      console.warn("Auto fallback: Gemini Vision failed:", geminiErr instanceof Error ? geminiErr.message : geminiErr);
    }
  }

  // Stage 3: Ollama Local Vision
  try {
    const result = await runOllamaVisionOCR(imageBase64);
    result.engine = `${result.engine} (FALLBACK)`;
    return result;
  } catch (ollamaErr) {
    console.warn("Auto fallback: Ollama Vision failed:", ollamaErr instanceof Error ? ollamaErr.message : ollamaErr);
  }

  // Stage 4: PaddleOCR Local
  try {
    const result = await runPaddleOCR(imageBase64);
    result.engine = "PADDLEOCR LOCAL (FALLBACK)";
    return result;
  } catch (paddleErr) {
    console.warn("Auto fallback: PaddleOCR failed:", paddleErr instanceof Error ? paddleErr.message : paddleErr);
  }

  // Stage 5: Tesseract Local (final fallback)
  try {
    const result = await runTesseractOCR(imageBase64);
    result.engine = "TESSERACT LOCAL (FALLBACK)";
    return result;
  } catch (tessErr) {
    console.error("Auto fallback: All 5 OCR engines failed:", tessErr instanceof Error ? tessErr.message : tessErr);
    throw new Error("All OCR engines failed. Please check your API keys and service availability.");
  }
}
