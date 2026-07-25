"use client";

import { useState } from "react";
import Recreated3DReceipt from "./Recreated3DReceipt";

interface ReceiptPreset {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  tax: number;
  items: Array<{ description: string; qty: number; price: number }>;
}

const SAMPLE_PRESETS: ReceiptPreset[] = [
  {
    id: "JK-R-8930",
    merchant: "STARBUCKS COFFEE KLIAN",
    amount: 38.50,
    date: "2026-07-24",
    tax: 2.18,
    items: [
      { description: "ICED CARAMEL MACCHIATO", qty: 1, price: 19.50 },
      { description: "ALMOND CROISSANT", qty: 1, price: 12.00 },
      { description: "ESPRESSO EXTRA SHOT", qty: 1, price: 7.00 },
    ],
  },
  {
    id: "JK-R-9104",
    merchant: "PETRONAS PETROLEUM (SUBANG)",
    amount: 180.00,
    date: "2026-07-23",
    tax: 0.00,
    items: [
      { description: "PRIMAX 97 UNLEADED FUEL (LITRES)", qty: 52, price: 3.47 },
    ],
  },
  {
    id: "JK-R-9421",
    merchant: "APPLE STORE THE EXCHANGE TRX",
    amount: 4299.00,
    date: "2026-07-20",
    tax: 243.34,
    items: [
      { description: "MACBOOK AIR 15 M3 16GB", qty: 1, price: 4299.00 },
    ],
  },
  {
    id: "JK-R-9802",
    merchant: "TECK KEE SEAFOOD RESTAURANT",
    amount: 264.80,
    date: "2026-07-18",
    tax: 14.98,
    items: [
      { description: "STEAMED HONG KONG DRAGON GROUPER", qty: 1, price: 168.00 },
      { description: "SIGNATURE CLAYPOT TOFU", qty: 1, price: 38.00 },
      { description: "CHINESE TEA & RICE (TABLE 12)", qty: 1, price: 18.00 },
      { description: "SERVICE TAX (6%) & SST", qty: 1, price: 40.80 },
    ],
  },
];

export default function LandingInteractiveSandbox() {
  const [selectedPreset, setSelectedPreset] = useState<ReceiptPreset>(SAMPLE_PRESETS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleSelectPreset = (preset: ReceiptPreset) => {
    if (preset.id === selectedPreset.id) return;
    setIsScanning(true);
    setTimeout(() => {
      setSelectedPreset(preset);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div
      className="dot-grid-subtle"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-visible)",
        borderRadius: "16px",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
      }}
    >
      {/* HEADER & SAMPLE PRESET SELECTOR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-visible)", paddingBottom: "16px" }}>
        <div>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            [ LIVE OCR DEMO SANDBOX // INTERACTIVE RECEIPT PREVIEW ]
          </span>
          <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--heading)", fontWeight: "700", color: "var(--text-display)", margin: "4px 0 0 0" }}>
            EXPERIENCE SUB-SECOND OPTICAL OCR EXTRACTION
          </h3>
        </div>

        {/* RECEIPT SELECTOR BUTTONS */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                style={{
                  backgroundColor: isSelected ? "var(--text-display)" : "var(--surface-raised)",
                  color: isSelected ? "var(--black)" : "var(--text-display)",
                  border: isSelected ? "1px solid var(--text-display)" : "1px solid var(--border-visible)",
                  fontFamily: "var(--font-data)",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "all 0.15s ease",
                }}
              >
                [ {preset.merchant.split(" ")[0]} // RM {preset.amount.toFixed(2)} ]
              </button>
            );
          })}
        </div>
      </div>

      {/* SANDBOX GRID: 3D SILVER RECEIPT PASS ON LEFT, LIVE OCR LOG STREAM ON RIGHT */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "center" }}>
        {/* LEFT COLUMN: 3D SILVER RECEIPT WITH TILT PHYSICS */}
        <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "16px", position: "relative", minHeight: "360px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
          {isScanning ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", zIndex: 10 }}>
              <div className="dot-pulse" style={{ backgroundColor: "var(--orange)", width: "12px", height: "12px" }} />
              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--orange)", letterSpacing: "0.08em" }}>
                [ EXECUTING OCR OPTICAL BEAM... ]
              </span>
            </div>
          ) : (
            <Recreated3DReceipt
              receiptId={selectedPreset.id}
              merchant={selectedPreset.merchant}
              amount={selectedPreset.amount}
              date={selectedPreset.date}
              items={selectedPreset.items}
              tax={selectedPreset.tax}
              autoSpin={true}
            />
          )}
        </div>

        {/* RIGHT COLUMN: TELEMETRY STREAM LOGS & METADATA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "var(--black)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em" }}>
              SYS // REAL-TIME OCR STREAM TELEMETRY LOGS
            </span>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--success)", display: "flex", flexDirection: "column", gap: "4px", lineHeight: "1.4" }}>
              <span>&gt; INGESTING IMAGE BUFFER... 100% OK</span>
              <span>&gt; MERCHANT IDENTIFIED: &quot;{selectedPreset.merchant}&quot;</span>
              <span>&gt; EXTRACTED {selectedPreset.items.length} PRODUCT LINE ITEMS</span>
              <span>&gt; NET AMOUNT COMPUTED: RM {selectedPreset.amount.toFixed(2)} (SST: RM {selectedPreset.tax.toFixed(2)})</span>
              <span>&gt; SHA-256 HASH VERIFIED // {selectedPreset.id}-OK</span>
            </div>
          </div>

          {/* ITEM SUMMARY CHIPS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedPreset.items.map((it, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "10px",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border-visible)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {it.qty}x {it.description} — RM {(it.price * it.qty).toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
