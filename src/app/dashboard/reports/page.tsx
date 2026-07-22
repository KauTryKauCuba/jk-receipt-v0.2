"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import TeamWorkspaceModal from "../../components/TeamWorkspaceModal";
import CameraScannerModal from "../../components/CameraScannerModal";

interface ReportSummary {
  id: string;
  category: "BUSINESS" | "TAX DEDUCTIBLE" | "HOUSEHOLD" | "WARRANTIES" | "MEDICAL";
  period: string;
  totalAmount: number;
  taxDeductibleAmount: number;
  itemCount: number;
  status: "AUDITED" | "PENDING_REVIEW" | "RECONCILED";
}

const INITIAL_REPORTS: ReportSummary[] = [
  { id: "REP-2026-07A", category: "BUSINESS", period: "JULY 2026", totalAmount: 1850.40, taxDeductibleAmount: 1850.40, itemCount: 12, status: "AUDITED" },
  { id: "REP-2026-07B", category: "TAX DEDUCTIBLE", period: "JULY 2026", totalAmount: 1420.00, taxDeductibleAmount: 1420.00, itemCount: 8, status: "AUDITED" },
  { id: "REP-2026-07C", category: "HOUSEHOLD", period: "JULY 2026", totalAmount: 890.50, taxDeductibleAmount: 0.00, itemCount: 15, status: "RECONCILED" },
  { id: "REP-2026-07D", category: "WARRANTIES", period: "JULY 2026", totalAmount: 1299.00, taxDeductibleAmount: 1299.00, itemCount: 2, status: "AUDITED" },
  { id: "REP-2026-07E", category: "MEDICAL", period: "JULY 2026", totalAmount: 380.00, taxDeductibleAmount: 380.00, itemCount: 4, status: "AUDITED" },
  { id: "REP-2026-06A", category: "BUSINESS", period: "JUNE 2026", totalAmount: 2450.00, taxDeductibleAmount: 2450.00, itemCount: 18, status: "RECONCILED" },
  { id: "REP-2026-06B", category: "TAX DEDUCTIBLE", period: "JUNE 2026", totalAmount: 1680.00, taxDeductibleAmount: 1680.00, itemCount: 11, status: "RECONCILED" },
];

const MONTHLY_TREND_DATA = [
  { month: "JAN", gross: 4890.00, tax: 1980.00 },
  { month: "FEB", gross: 3450.00, tax: 1100.00 },
  { month: "MAR", gross: 4110.00, tax: 1620.00 },
  { month: "APR", gross: 6240.00, tax: 2890.00 },
  { month: "MAY", gross: 3980.00, tax: 1450.00 },
  { month: "JUN", gross: 5120.00, tax: 2140.00 },
  { month: "JUL", gross: 5840.00, tax: 4949.90 },
];

const CATEGORY_BAR_DATA = [
  { category: "BUSINESS", gross: 4300.40, tax: 4300.40, color: "var(--text-display)" },
  { category: "TAX DEDUCTIBLE", gross: 3100.00, tax: 3100.00, color: "var(--success)" },
  { category: "WARRANTIES", gross: 1299.00, tax: 1299.00, color: "var(--orange)" },
  { category: "HOUSEHOLD", gross: 890.50, tax: 0.00, color: "var(--text-disabled)" },
  { category: "MEDICAL", gross: 380.00, tax: 380.00, color: "var(--interactive)" },
];

// Helper functions for dynamic high-precision SVG math
const X_COORDS = [30, 103, 176, 250, 323, 396, 470];

const getYCoord = (val: number) => {
  const maxVal = 7000;
  const topY = 15;
  const bottomY = 145;
  const chartHeight = bottomY - topY;
  return bottomY - (val / maxVal) * chartHeight;
};

const generateCubicPath = (data: typeof MONTHLY_TREND_DATA, key: "gross" | "tax") => {
  const pts = data.map((d, i) => ({ x: X_COORDS[i], y: getYCoord(d[key]) }));
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }
  return d;
};

const generateAreaPath = (data: typeof MONTHLY_TREND_DATA, key: "gross" | "tax") => {
  const linePath = generateCubicPath(data, key);
  const lastX = X_COORDS[X_COORDS.length - 1];
  const firstX = X_COORDS[0];
  return `${linePath} L ${lastX},145 L ${firstX},145 Z`;
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePeriod, setActivePeriod] = useState<string>("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [reports] = useState<ReportSummary[]>(INITIAL_REPORTS);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<ReportSummary | null>(null);

  // Graph 01 Custom Controls
  const [graph01Mode, setGraph01Mode] = useState<"AREA" | "LINE" | "BARS">("AREA");
  const [showGrossLayer, setShowGrossLayer] = useState(true);
  const [showTaxLayer, setShowTaxLayer] = useState(true);
  const [activeTrendIdx, setActiveTrendIdx] = useState<number | null>(6);

  // Graph 02 Controls
  const [activeCatIdx, setActiveCatIdx] = useState<number | null>(0);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("[SCAN COMPLETE] Receipt ingested into telemetry archive.");
    }, 1500);
  };

  const filteredReports = reports.filter((rep) => {
    const matchesPeriod = activePeriod === "ALL" || rep.period.includes(activePeriod);
    const matchesCategory = activeCategory === "ALL" || rep.category === activeCategory;
    const matchesQuery =
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesCategory && matchesQuery;
  });

  const totalGross = filteredReports.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalTaxClaimable = filteredReports.reduce((acc, r) => acc + r.taxDeductibleAmount, 0);
  const estimatedTaxSavings = totalTaxClaimable * 0.24;

  const currentTrendPoint = activeTrendIdx !== null ? MONTHLY_TREND_DATA[activeTrendIdx] : MONTHLY_TREND_DATA[6];
  const taxRatioPct = currentTrendPoint ? ((currentTrendPoint.tax / currentTrendPoint.gross) * 100).toFixed(1) : "84.7";

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "var(--black)" }}>
      {/* REUSABLE SIDEBAR */}
      <DashboardSidebar
        activeNav="reports"
        isScanning={isScanning}
        onTriggerScan={triggerScan}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        {/* REUSABLE NAVBAR */}
        <DashboardNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isScanning={isScanning}
          onTriggerScan={triggerScan}
          onOpenCamera={() => setIsCameraOpen(true)}
        />

        {/* DASHBOARD REPORTS BODY CONTENT */}
        <div className="animate-slide-left" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* HERO BANNER */}
          <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                ANALYTICS &amp; COMPLIANCE // FISCAL TELEMETRY
              </span>
              <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
                <MatrixText text="TAX &amp; P&amp;L REPORTS" />
              </h1>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                &gt; AUTOMATED EXPENSE BREAKDOWN, SCHEDULE C TAX CLAIMS &amp; AUDIT TRAIL EXPORTS
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => alert("[EXPORTING CSV] Compiling full telemetry report spreadsheet...")}
                style={actionBtnStyle}
              >
                [ EXPORT ALL (CSV) ]
              </button>
              <button
                onClick={() => alert("[GENERATE PDF] Compiling audit-ready P&L PDF document...")}
                style={primaryBtnStyle}
              >
                [ PRINT AUDIT PDF ]
              </button>
            </div>
          </div>

          {/* TELEMETRY METRICS CARDS */}
          <div className="metrics-grid" style={metricsGridStyle}>
            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>CUMULATIVE EXPENDITURE</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                {totalGross.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
              </span>
              <span style={metricSubtextStyle}>Total gross receipts logged</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>TAX DEDUCTIBLE EXPENDITURE</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                {totalTaxClaimable.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
              </span>
              <span style={metricSubtextStyle}>100% audited tax claims eligible</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>ESTIMATED TAX SAVINGS (24%)</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                {estimatedTaxSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
              </span>
              <span style={metricSubtextStyle}>Direct corporate tax offset</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* DUAL TELEMETRY GRAPHS SECTION (REFINED SVG ENGINES)             */}
          {/* ============================================================== */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-md)" }}>
            
            {/* GRAPH TYPE 1: REFINED MONTHLY TELEMETRY TREND (SMOOTH CUBIC BEZIER & MULTI-MODE) */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* GRAPH 01 HEADER CONTROLS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.06em", display: "block" }}>
                    [ GRAPH 01: MONTHLY TELEMETRY TREND ]
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                    Gross Spend vs Tax Deductible Claims (YTD 2026)
                  </span>
                </div>

                {/* GRAPH 01 VIEW MODE SWITCHER */}
                <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--surface-raised)", padding: "2px", borderRadius: "6px", border: "1px solid var(--border-visible)" }}>
                  {(["AREA", "LINE", "BARS"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setGraph01Mode(mode)}
                      style={{
                        backgroundColor: graph01Mode === mode ? "var(--text-display)" : "transparent",
                        color: graph01Mode === mode ? "var(--black)" : "var(--text-secondary)",
                        border: "none",
                        fontFamily: "var(--font-data)",
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOGGLEABLE INTERACTIVE LEGEND PILLS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "8px", padding: "8px 12px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setShowGrossLayer(!showGrossLayer)}
                    style={{
                      background: "none",
                      border: "none",
                      color: showGrossLayer ? "var(--orange)" : "var(--text-disabled)",
                      fontFamily: "var(--font-data)",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: showGrossLayer ? 1 : 0.4,
                    }}
                  >
                    <span style={{ width: "8px", height: "8px", backgroundColor: "var(--orange)", borderRadius: "50%", display: "inline-block" }} />
                    GROSS: {currentTrendPoint.gross.toLocaleString()} MYR
                  </button>

                  <button
                    onClick={() => setShowTaxLayer(!showTaxLayer)}
                    style={{
                      background: "none",
                      border: "none",
                      color: showTaxLayer ? "var(--success)" : "var(--text-disabled)",
                      fontFamily: "var(--font-data)",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: showTaxLayer ? 1 : 0.4,
                    }}
                  >
                    <span style={{ width: "8px", height: "8px", backgroundColor: "var(--success)", borderRadius: "50%", display: "inline-block" }} />
                    TAX: {currentTrendPoint.tax.toLocaleString()} MYR
                  </button>
                </div>

                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                  EFFICIENCY: {taxRatioPct}%
                </span>
              </div>

              {/* HIGH-PRECISION REFINED SVG TREND CANVAS WITH HTML Y-AXIS */}
              <div style={{ display: "flex", gap: "10px", alignItems: "stretch", width: "100%", height: "200px" }}>
                {/* UNSTRETCHED HTML Y-AXIS LABELS */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "4px 0", userSelect: "none" }}>
                  {["7.0k", "5.2k", "3.5k", "1.7k", "0.0k"].map((val, idx) => (
                    <span key={idx} style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", lineHeight: 1 }}>
                      {val}
                    </span>
                  ))}
                </div>

                {/* SVG GRAPH CANVAS */}
                <div style={{ flex: 1, height: "100%", position: "relative" }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 160" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="grossRefinedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="taxRefinedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--success)" stopOpacity="0.40" />
                        <stop offset="100%" stopColor="var(--success)" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[15, 47, 80, 112, 145].map((y, i) => (
                      <line key={i} x1="0" y1={y} x2="500" y2={y} stroke="var(--border)" strokeDasharray="3 3" strokeWidth="1" />
                    ))}

                  {/* RENDER MODE: AREA / LINE / BARS */}
                  {graph01Mode === "BARS" ? (
                    /* MONTHLY COMPARATIVE BARS MODE */
                    MONTHLY_TREND_DATA.map((d, idx) => {
                      const cx = X_COORDS[idx];
                      const grossY = getYCoord(d.gross);
                      const taxY = getYCoord(d.tax);
                      const isHovered = activeTrendIdx === idx;

                      return (
                        <g key={idx} onMouseEnter={() => setActiveTrendIdx(idx)} style={{ cursor: "pointer" }}>
                          {showGrossLayer && (
                            <rect
                              x={cx - 14}
                              y={grossY}
                              width="12"
                              height={145 - grossY}
                              fill={isHovered ? "var(--orange)" : "rgba(255, 92, 0, 0.4)"}
                              rx="2"
                            />
                          )}
                          {showTaxLayer && (
                            <rect
                              x={cx + 2}
                              y={taxY}
                              width="12"
                              height={145 - taxY}
                              fill={isHovered ? "var(--success)" : "rgba(74, 158, 92, 0.5)"}
                              rx="2"
                            />
                          )}
                        </g>
                      );
                    })
                  ) : (
                    /* AREA & SMOOTH CUBIC LINE MODE */
                    <>
                      {/* Area Fill (Only shown in AREA mode) */}
                      {graph01Mode === "AREA" && showGrossLayer && (
                        <path d={generateAreaPath(MONTHLY_TREND_DATA, "gross")} fill="url(#grossRefinedGrad)" style={{ transition: "opacity 0.3s ease" }} />
                      )}
                      {graph01Mode === "AREA" && showTaxLayer && (
                        <path d={generateAreaPath(MONTHLY_TREND_DATA, "tax")} fill="url(#taxRefinedGrad)" style={{ transition: "opacity 0.3s ease" }} />
                      )}

                      {/* Smooth Cubic Bezier Lines */}
                      {showGrossLayer && (
                        <path
                          d={generateCubicPath(MONTHLY_TREND_DATA, "gross")}
                          fill="none"
                          stroke="var(--orange)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transition: "opacity 0.3s ease" }}
                        />
                      )}
                      {showTaxLayer && (
                        <path
                          d={generateCubicPath(MONTHLY_TREND_DATA, "tax")}
                          fill="none"
                          stroke="var(--success)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transition: "opacity 0.3s ease" }}
                        />
                      )}
                    </>
                  )}

                  {/* ACTIVE HIGHLIGHT VERTICAL LASER RETICLE */}
                  {activeTrendIdx !== null && (
                    <g>
                      <line
                        x1={X_COORDS[activeTrendIdx]}
                        y1="10"
                        x2={X_COORDS[activeTrendIdx]}
                        y2="145"
                        stroke="var(--success)"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                      />
                      {/* Active Node Circles with Pulse Rings */}
                      {showGrossLayer && (
                        <circle
                          cx={X_COORDS[activeTrendIdx]}
                          cy={getYCoord(MONTHLY_TREND_DATA[activeTrendIdx].gross)}
                          r="6"
                          fill="var(--surface)"
                          stroke="var(--orange)"
                          strokeWidth="2.5"
                        />
                      )}
                      {showTaxLayer && (
                        <circle
                          cx={X_COORDS[activeTrendIdx]}
                          cy={getYCoord(MONTHLY_TREND_DATA[activeTrendIdx].tax)}
                          r="6"
                          fill="var(--surface)"
                          stroke="var(--success)"
                          strokeWidth="2.5"
                          filter="url(#glowGreen)"
                        />
                      )}
                    </g>
                  )}

                  {/* MOUSE HOVER DETECTION COLUMNS */}
                  {X_COORDS.map((cx, idx) => (
                    <rect
                      key={idx}
                      x={cx - 20}
                      y="10"
                      width="40"
                      height="135"
                      fill="transparent"
                      onMouseEnter={() => setActiveTrendIdx(idx)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* X-AXIS LABELS */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px 0 40px" }}>
                {MONTHLY_TREND_DATA.map((d, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveTrendIdx(i)}
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: "10px",
                      fontWeight: activeTrendIdx === i ? "700" : "normal",
                      color: activeTrendIdx === i ? "var(--text-display)" : "var(--text-disabled)",
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: "3px",
                      backgroundColor: activeTrendIdx === i ? "var(--surface-raised)" : "transparent",
                    }}
                  >
                    {d.month}
                  </span>
                ))}
              </div>
            </div>

            {/* GRAPH TYPE 2: CATEGORY DUAL COLUMN BAR CHART */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "10px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.06em", display: "block" }}>
                    [ GRAPH 02: CATEGORY EXPENDITURE COLUMNS ]
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                    Gross Expenditure vs Tax Claimable per Category
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>● REAL-TIME</span>
              </div>

              {/* ACTIVE HOVER CARD */}
              <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "6px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", color: "var(--text-display)" }}>
                  CAT: {activeCatIdx !== null ? CATEGORY_BAR_DATA[activeCatIdx].category : "BUSINESS"}
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--orange)", fontWeight: "700" }}>
                    GROSS: {activeCatIdx !== null ? CATEGORY_BAR_DATA[activeCatIdx].gross.toLocaleString() : "4,300.40"} MYR
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", fontWeight: "700" }}>
                    TAX: {activeCatIdx !== null ? CATEGORY_BAR_DATA[activeCatIdx].tax.toLocaleString() : "4,300.40"} MYR
                  </span>
                </div>
              </div>

              {/* DUAL COLUMN BARS CONTAINER */}
              <div style={{ width: "100%", height: "200px", display: "flex", alignItems: "flex-end", justifyContent: "space-around", padding: "10px 0 0 0", borderBottom: "1px solid var(--border-visible)" }}>
                {CATEGORY_BAR_DATA.map((cat, idx) => {
                  const grossHeightPct = Math.min(100, (cat.gross / 4500) * 100);
                  const taxHeightPct = Math.min(100, (cat.tax / 4500) * 100);
                  const isHovered = activeCatIdx === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setActiveCatIdx(idx)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        height: "100%",
                        justifyContent: "flex-end",
                        cursor: "pointer",
                        opacity: isHovered ? 1 : 0.75,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* DUAL COLUMN BAR PAIR */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "140px" }}>
                        {/* GROSS BAR */}
                        <div
                          style={{
                            width: "14px",
                            height: `${grossHeightPct}%`,
                            backgroundColor: isHovered ? "var(--orange)" : "rgba(255, 92, 0, 0.4)",
                            borderRadius: "3px 3px 0 0",
                            transition: "all 0.3s ease",
                          }}
                        />
                        {/* TAX BAR */}
                        <div
                          style={{
                            width: "14px",
                            height: `${taxHeightPct}%`,
                            backgroundColor: "var(--success)",
                            borderRadius: "3px 3px 0 0",
                            transition: "all 0.3s ease",
                            boxShadow: isHovered ? "0 0 8px rgba(74, 158, 92, 0.4)" : "none",
                          }}
                        />
                      </div>

                      {/* X-AXIS LABEL */}
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: isHovered ? "var(--text-display)" : "var(--text-disabled)", letterSpacing: "0.04em" }}>
                        {cat.category.substring(0, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* LEGEND */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "-4px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", backgroundColor: "var(--orange)", borderRadius: "2px" }} /> GROSS EXPENSE
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", backgroundColor: "var(--success)", borderRadius: "2px" }} /> TAX DEDUCTIBLE
                </span>
              </div>
            </div>

          </div>

          {/* FILTER TABS & SEARCH */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            {/* PERIOD TABS */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["ALL", "JULY 2026", "JUNE 2026"].map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  style={{
                    backgroundColor: activePeriod === period ? "var(--text-display)" : "var(--surface-raised)",
                    color: activePeriod === period ? "var(--black)" : "var(--text-secondary)",
                    border: "1px solid var(--border-visible)",
                    fontFamily: "var(--font-data)",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {period === "ALL" ? "[ ALL PERIODS ]" : `[ ${period} ]`}
                </button>
              ))}
            </div>

            {/* CATEGORY FILTER TABS */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["ALL", "BUSINESS", "TAX DEDUCTIBLE", "HOUSEHOLD", "WARRANTIES", "MEDICAL"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor: activeCategory === cat ? "rgba(255,255,255,0.1)" : "transparent",
                    color: activeCategory === cat ? "var(--text-display)" : "var(--text-disabled)",
                    border: activeCategory === cat ? "1px solid var(--text-display)" : "1px solid transparent",
                    fontFamily: "var(--font-data)",
                    fontSize: "10px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* REPORTS TABLE */}
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-visible)", backgroundColor: "var(--surface-raised)" }}>
                  <th style={thStyle}>REPORT ID</th>
                  <th style={thStyle}>CATEGORY</th>
                  <th style={thStyle}>PERIOD</th>
                  <th style={thStyle}>TOTAL AMOUNT</th>
                  <th style={thStyle}>TAX DEDUCTIBLE</th>
                  <th style={thStyle}>ITEMS</th>
                  <th style={thStyle}>STATUS</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((rep) => (
                  <tr key={rep.id} style={{ borderBottom: "1px solid var(--border)", transition: "background-color 0.15s ease" }} className="table-row-hover">
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontWeight: "700", color: "var(--text-display)" }}>{rep.id}</td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", backgroundColor: "var(--surface-raised)", padding: "2px 6px", borderRadius: "4px" }}>
                        {rep.category}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px" }}>{rep.period}</td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontWeight: "700", color: "var(--orange)" }}>
                      {rep.totalAmount.toFixed(2)} MYR
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontWeight: "700", color: rep.taxDeductibleAmount > 0 ? "var(--orange)" : "var(--text-disabled)" }}>
                      {rep.taxDeductibleAmount.toFixed(2)} MYR
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px" }}>{rep.itemCount} SLIPS</td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "1px 6px", borderRadius: "3px" }}>
                        ● {rep.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedReportDetail(rep)}
                        style={{
                          backgroundColor: "var(--surface-raised)",
                          border: "1px solid var(--border-visible)",
                          color: "var(--text-display)",
                          fontFamily: "var(--font-data)",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        [ VIEW REPORT ]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* REPORT DETAIL MODAL */}
      {selectedReportDetail && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>
                [ REPORT AUDIT DETAIL // {selectedReportDetail.id} ]
              </span>
              <button onClick={() => setSelectedReportDetail(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "12px", cursor: "pointer" }}>[✕]</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", backgroundColor: "var(--surface-raised)", padding: "12px", borderRadius: "6px" }}>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", display: "block" }}>REPORT CATEGORY</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>{selectedReportDetail.category}</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", display: "block" }}>FISCAL PERIOD</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>{selectedReportDetail.period}</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", display: "block" }}>GROSS EXPENDITURE</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--orange)" }}>{selectedReportDetail.totalAmount.toFixed(2)} MYR</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", display: "block" }}>TAX CLAIMABLE</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--orange)" }}>{selectedReportDetail.taxDeductibleAmount.toFixed(2)} MYR</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button onClick={() => alert(`Downloading CSV data for ${selectedReportDetail.id}...`)} style={{ flex: 1, backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>
                [ EXPORT CSV ]
              </button>
              <button onClick={() => alert(`Downloading PDF report for ${selectedReportDetail.id}...`)} style={{ flex: 1, backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", color: "var(--text-display)", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>
                [ PRINT PDF ]
              </button>
              <button onClick={() => setSelectedReportDetail(null)} style={{ backgroundColor: "transparent", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM & CAMERA MODALS */}
      <TeamWorkspaceModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={() => {
          setIsCameraOpen(false);
          triggerScan();
        }}
      />
    </div>
  );
}

const heroBannerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "var(--space-md)", backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", flexWrap: "wrap", gap: "12px" };
const metricsGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-md)" };
const metricCardStyle: React.CSSProperties = { backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column" };
const metricLabelStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em" };
const metricSubtextStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", marginTop: "4px" };
const thStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em", padding: "10px", textAlign: "left" };
const tdStyle: React.CSSProperties = { fontFamily: "var(--font-body)", fontSize: "11px", padding: "10px", verticalAlign: "middle" };
const actionBtnStyle: React.CSSProperties = { backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", color: "var(--text-display)", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };
const primaryBtnStyle: React.CSSProperties = { backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" };
