"use client";

import { useState } from "react";

export default function LandingTaxCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState<number>(3500);
  const [taxRate, setTaxRate] = useState<number>(24);

  // Preset buttons
  const setPreset = (exp: number, tax: number) => {
    setMonthlyExpense(exp);
    setTaxRate(tax);
  };

  const annualExpense = monthlyExpense * 12;
  const estimatedDeductions = Math.round(annualExpense * (taxRate / 100));
  const hoursSaved = Math.round((monthlyExpense / 500) * 4); // ~4 hours per RM 500 expense volume

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
        gap: "24px",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
      }}
    >
      {/* SECTION HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border-visible)", paddingBottom: "16px" }}>
        <div>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--orange)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            [ INTERACTIVE TAX ESTIMATOR // REAL-TIME CALCULATOR ]
          </span>
          <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--heading)", fontWeight: "700", color: "var(--text-display)", margin: "4px 0 0 0" }}>
            ESTIMATE YOUR ANNUAL TAX SAVINGS &amp; TIME RECOVERY
          </h3>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setPreset(1500, 15)}
            style={{
              backgroundColor: monthlyExpense === 1500 ? "var(--surface-raised)" : "transparent",
              border: "1px solid var(--border-visible)",
              color: monthlyExpense === 1500 ? "var(--orange)" : "var(--text-secondary)",
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            [ FREELANCER ]
          </button>
          <button
            type="button"
            onClick={() => setPreset(4500, 24)}
            style={{
              backgroundColor: monthlyExpense === 4500 ? "var(--surface-raised)" : "transparent",
              border: "1px solid var(--border-visible)",
              color: monthlyExpense === 4500 ? "var(--orange)" : "var(--text-secondary)",
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            [ SME BUSINESS ]
          </button>
          <button
            type="button"
            onClick={() => setPreset(12000, 28)}
            style={{
              backgroundColor: monthlyExpense === 12000 ? "var(--surface-raised)" : "transparent",
              border: "1px solid var(--border-visible)",
              color: monthlyExpense === 12000 ? "var(--orange)" : "var(--text-secondary)",
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            [ ENTERPRISE ]
          </button>
        </div>
      </div>

      {/* INPUT SLIDERS & REAL-TIME DISPLAY GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", alignItems: "center" }}>
        {/* LEFT COLUMN: SLIDERS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* SLIDER 1: MONTHLY EXPENSES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-secondary)", letterSpacing: "0.06em" }}>
                MONTHLY BUSINESS EXPENSES:
              </label>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "14px", fontWeight: "700", color: "var(--orange)" }}>
                RM {monthlyExpense.toLocaleString()} / MO
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--orange)",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
              <span>RM 500</span>
              <span>RM 12,500</span>
              <span>RM 25,000+</span>
            </div>
          </div>

          {/* SLIDER 2: TAX BRACKET */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-secondary)", letterSpacing: "0.06em" }}>
                EFFECTIVE TAX BRACKET RATE:
              </label>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "14px", fontWeight: "700", color: "var(--text-display)" }}>
                {taxRate}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--text-display)",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
              <span>10% (LOW)</span>
              <span>20% (MID)</span>
              <span>30% (HIGH)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CALCULATED METRICS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px" }}>
          {/* CARD 1: ANNUAL TAX CLAIMABLE */}
          <div
            style={{
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--orange)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
              EST. ANNUAL TAX SAVINGS
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "var(--orange)" }}>
              RM {estimatedDeductions.toLocaleString()}
            </span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)" }}>
              ● 100% CLAIMS VERIFIED
            </span>
          </div>

          {/* CARD 2: TIME RECOVERY */}
          <div
            style={{
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border-visible)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
              PRE-ACCOUNTING RECOVERED
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700", color: "var(--text-display)" }}>
              ~{hoursSaved} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>HRS/YR</span>
            </span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-secondary)" }}>
              AUTOMATED OCR PIPELINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
