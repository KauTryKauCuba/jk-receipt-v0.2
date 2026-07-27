"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import CameraScannerModal from "../../components/CameraScannerModal";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/line-charts-9";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

const RECHARTS_TREND_DATA = [
  { month: "JAN 2026", gross: 4890.00, tax: 1980.00 },
  { month: "FEB 2026", gross: 3450.00, tax: 1100.00 },
  { month: "MAR 2026", gross: 4110.00, tax: 1620.00 },
  { month: "APR 2026", gross: 6240.00, tax: 2890.00 },
  { month: "MAY 2026", gross: 3980.00, tax: 1450.00 },
  { month: "JUN 2026", gross: 5120.00, tax: 2140.00 },
  { month: "JUL 2026", gross: 5840.00, tax: 4949.90 },
];

const rechartsConfig = {
  gross: {
    label: "Gross Expenditure",
    color: "var(--orange)",
  },
  tax: {
    label: "Tax Claims",
    color: "var(--success)",
  },
} satisfies ChartConfig;

const RechartsCustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { month: string; gross: number; tax: number } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "8px", padding: "10px 12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
        <div style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", marginBottom: "4px" }}>
          {data.month} {"// AUDIT SNAPSHOT"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>GROSS:</span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--orange)" }}>${data.gross.toLocaleString("en-US", { minimumFractionDigits: 2 })} MYR</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>TAX CLAIM:</span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--success)" }}>${data.tax.toLocaleString("en-US", { minimumFractionDigits: 2 })} MYR</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

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

const CATEGORY_BAR_DATA = [
  { category: "BUSINESS", gross: 4300.40, tax: 4300.40, color: "var(--text-display)" },
  { category: "TAX DEDUCTIBLE", gross: 3100.00, tax: 3100.00, color: "var(--success)" },
  { category: "WARRANTIES", gross: 1299.00, tax: 1299.00, color: "var(--orange)" },
  { category: "HOUSEHOLD", gross: 890.50, tax: 0.00, color: "var(--text-disabled)" },
  { category: "MEDICAL", gross: 380.00, tax: 380.00, color: "var(--interactive)" },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePeriod, setActivePeriod] = useState<string>("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [reports] = useState<ReportSummary[]>(INITIAL_REPORTS);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<ReportSummary | null>(null);



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

  const latestTrendPoint = RECHARTS_TREND_DATA[RECHARTS_TREND_DATA.length - 1];
  const taxRatioPct = latestTrendPoint ? ((latestTrendPoint.tax / latestTrendPoint.gross) * 100).toFixed(1) : "84.7";

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "var(--black)" }}>
      {/* REUSABLE SIDEBAR */}
      <DashboardSidebar
        activeNav="reports"
        isScanning={isScanning}
        onTriggerScan={triggerScan}
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
            
            {/* GRAPH TYPE 1: REFINED MONTHLY TELEMETRY TREND (LINE-CHARTS-9 INTEGRATION) */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* GRAPH 01 HEADER CONTROLS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.08em", display: "block" }}>
                    [ GRAPH 01: MONTHLY TELEMETRY TREND ]
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                    Gross Spend vs Tax Deductible Claims (YTD 2026)
                  </span>
                </div>

                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                  EFFICIENCY: {taxRatioPct}%
                </span>
              </div>

              {/* RECHARTS COMPOSED CHART (LINE-CHARTS-9 ENGINE) */}
              <div style={{ width: "100%", height: "260px", minHeight: "260px", position: "relative" }}>
                <ChartContainer config={rechartsConfig} className="h-full w-full">
                  <ComposedChart
                    data={RECHARTS_TREND_DATA}
                    margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <pattern id="dotGridRecharts" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="8" cy="8" r="1" fill="#333333" fillOpacity="0.4" />
                      </pattern>
                      <filter id="dotShadowRecharts" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.8)" />
                      </filter>
                      <filter id="lineShadowGross" x="-100%" y="-100%" width="300%" height="300%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(255, 92, 0, 0.4)" />
                      </filter>
                      <filter id="lineShadowTax" x="-100%" y="-100%" width="300%" height="300%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(74, 158, 92, 0.4)" />
                      </filter>
                    </defs>

                    <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGridRecharts)" style={{ pointerEvents: 'none' }} />

                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#999999", fontFamily: "var(--font-data)" }}
                      tickMargin={10}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#666666", fontFamily: "var(--font-data)" }}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                      tickMargin={10}
                    />

                    <ChartTooltip content={<RechartsCustomTooltip />} />

                    <Line
                      type="monotone"
                      dataKey="gross"
                      stroke="#FF5C00"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#FF5C00", stroke: "#000000", strokeWidth: 1.5 }}
                      activeDot={{
                        r: 6,
                        fill: "#FF5C00",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="tax"
                      stroke="#4A9E5C"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#4A9E5C", stroke: "#000000", strokeWidth: 1.5 }}
                      activeDot={{
                        r: 6,
                        fill: "#4A9E5C",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                    />
                  </ComposedChart>
                </ChartContainer>
              </div>
            </div>

            {/* GRAPH TYPE 2: CATEGORY DUAL COLUMN BAR CHART */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.08em", display: "block" }}>
                    [ GRAPH 02: CATEGORY EXPENDITURE COLUMNS ]
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                    Gross Expenditure vs Tax Claimable per Category
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                  ● AUDITED AUDIT TELEMETRY
                </span>
              </div>

              {/* RECHARTS DUAL BAR CHART ENGINE */}
              <div style={{ width: "100%", height: "260px", minHeight: "260px", position: "relative" }}>
                <ChartContainer config={rechartsConfig} className="h-full w-full">
                  <ComposedChart
                    data={CATEGORY_BAR_DATA.map((c) => ({
                      category: c.category === "TAX DEDUCTIBLE" ? "TAX CLAIM" : c.category,
                      gross: c.gross,
                      tax: c.tax,
                    }))}
                    margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <pattern id="dotGridBar" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="8" cy="8" r="1" fill="#333333" fillOpacity="0.4" />
                      </pattern>
                    </defs>

                    <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGridBar)" style={{ pointerEvents: 'none' }} />

                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />

                    <XAxis
                      dataKey="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#999999", fontFamily: "var(--font-data)" }}
                      tickMargin={10}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#666666", fontFamily: "var(--font-data)" }}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                      tickMargin={10}
                    />

                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "8px", padding: "10px 12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                              <div style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", marginBottom: "4px" }}>
                                {data.category} {"// CATEGORY BREAKDOWN"}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>GROSS:</span>
                                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "#FF5C00" }}>${data.gross.toLocaleString("en-US", { minimumFractionDigits: 2 })} MYR</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>TAX CLAIM:</span>
                                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "#4A9E5C" }}>${data.tax.toLocaleString("en-US", { minimumFractionDigits: 2 })} MYR</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Bar dataKey="gross" fill="#FF5C00" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="tax" fill="#4A9E5C" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </ComposedChart>
                </ChartContainer>
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

      {/* CAMERA MODAL */}
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
