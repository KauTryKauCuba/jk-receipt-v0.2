"use client";

export default function LandingComparisonMatrix() {
  const comparisonRows = [
    {
      feature: "RECEIPT DATA INTAKE",
      traditional: "Manual key-in & paper shoebox sorting",
      jejaku: "Sub-second OCR & live camera vision stream",
    },
    {
      feature: "LINE-ITEM BREAKDOWN",
      traditional: "Lump sum totals without SST tax breakdown",
      jejaku: "Automatic itemized product & SST tax parsing",
    },
    {
      feature: "TAX DEDUCTION ELIGIBILITY",
      traditional: "Uncertain claims & risk of missing receipts",
      jejaku: "Instant tax category tagging & claim verification",
    },
    {
      feature: "AUDIT TRAIL LOGGING",
      traditional: "Physical binder folders susceptible to loss",
      jejaku: "Cryptographic SHA-256 telemetry audit logs",
    },
    {
      feature: "MULTI-USER & ACCOUNTANT SHARING",
      traditional: "Emailed spreadsheets & manual approvals",
      jejaku: "Encrypted role-based workspace permissions",
    },
  ];

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
      }}
    >
      <div style={{ borderBottom: "1px solid var(--border-visible)", paddingBottom: "14px" }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--orange)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          [ SYSTEM BENCHMARK // COMPARISON MATRIX ]
        </span>
        <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--heading)", fontWeight: "700", color: "var(--text-display)", margin: "4px 0 0 0" }}>
          TRADITIONAL MANUAL ACCOUNTING vs. JEJAKU ARCHIVE v0.2
        </h3>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-visible)" }}>
              <th style={{ textAlign: "left", fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", padding: "10px", width: "25%" }}>CAPABILITY</th>
              <th style={{ textAlign: "left", fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--error)", padding: "10px", width: "35%" }}>TRADITIONAL PRE-ACCOUNTING</th>
              <th style={{ textAlign: "left", fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", padding: "10px", width: "40%" }}>JEJAKU ARCHIVE v0.2 ARCHITECTURE</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < comparisonRows.length - 1 ? "1px solid var(--border)" : "none" }}>
                <td style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", padding: "12px 10px" }}>
                  {row.feature}
                </td>
                <td style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-secondary)", padding: "12px 10px" }}>
                  <span style={{ color: "var(--error)", marginRight: "6px" }}>✕</span>
                  {row.traditional}
                </td>
                <td style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "600", color: "var(--text-display)", padding: "12px 10px" }}>
                  <span style={{ color: "var(--success)", marginRight: "6px" }}>✓</span>
                  {row.jejaku}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
