"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import TeamWorkspaceModal from "../../components/TeamWorkspaceModal";

interface ReceiptRecord {
  id: string;
  merchant: string;
  category: "business" | "tax" | "household" | "warranties" | "medical";
  date: string;
  amount: number;
  status: "VERIFIED" | "PENDING";
  itemsCount: number;
}

const INITIAL_RECEIPTS: ReceiptRecord[] = [
  { id: "JK-R-8849", merchant: "APPLE STORE KLCC", category: "warranties", date: "2026-07-20", amount: 1299.00, status: "VERIFIED", itemsCount: 2 },
  { id: "JK-R-8848", merchant: "SHELL FUEL INSTRUMENT", category: "business", date: "2026-07-19", amount: 120.00, status: "VERIFIED", itemsCount: 1 },
  { id: "JK-R-8847", merchant: "VILLAGE GROCER SUBANG", category: "household", date: "2026-07-18", amount: 245.50, status: "VERIFIED", itemsCount: 14 },
  { id: "JK-R-8846", merchant: "CLINIC MEDICARE CENTRAL", category: "medical", date: "2026-07-16", amount: 180.00, status: "VERIFIED", itemsCount: 3 },
  { id: "JK-R-8845", merchant: "PARKSON DEPARTMENT STORE", category: "tax", date: "2026-07-14", amount: 340.00, status: "VERIFIED", itemsCount: 5 },
  { id: "JK-R-8844", merchant: "PETRONAS DIESEL HUB", category: "business", date: "2026-07-12", amount: 95.00, status: "VERIFIED", itemsCount: 1 },
];

interface MonthRecord {
  month: string;
  year: number;
  label: string;
  totalExpenditure: number;
  taxDeductible: number;
  receiptCount: number;
  status: "OPEN" | "CLOSED" | "LOCKED";
  closedDate?: string;
}

const MONTHS_DATA_2026: MonthRecord[] = [
  { month: "07", year: 2026, label: "JULY 2026", totalExpenditure: 4849.50, taxDeductible: 1895.50, receiptCount: 24, status: "OPEN" },
  { month: "06", year: 2026, label: "JUNE 2026", totalExpenditure: 5120.00, taxDeductible: 2140.00, receiptCount: 31, status: "CLOSED", closedDate: "2026-07-01" },
  { month: "05", year: 2026, label: "MAY 2026", totalExpenditure: 3980.20, taxDeductible: 1450.80, receiptCount: 19, status: "CLOSED", closedDate: "2026-06-01" },
  { month: "04", year: 2026, label: "APRIL 2026", totalExpenditure: 6240.00, taxDeductible: 2890.00, receiptCount: 38, status: "CLOSED", closedDate: "2026-05-01" },
  { month: "03", year: 2026, label: "MARCH 2026", totalExpenditure: 4110.50, taxDeductible: 1620.00, receiptCount: 22, status: "CLOSED", closedDate: "2026-04-01" },
  { month: "02", year: 2026, label: "FEBRUARY 2026", totalExpenditure: 3450.00, taxDeductible: 1100.00, receiptCount: 16, status: "LOCKED", closedDate: "2026-03-01" },
  { month: "01", year: 2026, label: "JANUARY 2026", totalExpenditure: 4890.00, taxDeductible: 1980.00, receiptCount: 27, status: "LOCKED", closedDate: "2026-02-01" },
];

export default function MonthsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [receipts] = useState<ReceiptRecord[]>(INITIAL_RECEIPTS);
  const [months] = useState<MonthRecord[]>(MONTHS_DATA_2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(6);
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-20");
  const [monthsViewMode, setMonthsViewMode] = useState<"CALENDAR" | "CARDS">("CALENDAR");
  const [selectedMonthDetail, setSelectedMonthDetail] = useState<MonthRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("[SCAN COMPLETE] Receipt ingested into telemetry archive.");
    }, 1500);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "var(--black)" }}>
      {/* REUSABLE SIDEBAR */}
      <DashboardSidebar
        activeNav="months"
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
        />

        {/* DASHBOARD MONTHS BODY CONTENT */}
        <div className="animate-slide-left" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* HERO BANNER */}
          <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                ACCOUNTING PERIODS // FINANCIAL TELEMETRY
              </span>
              <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
                <MatrixText text="MONTHLY TELEMETRY BREAKDOWN" />
              </h1>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                &gt; FISCAL PERIOD RECONCILIATION &amp; CALENDAR AUDIT TRAIL
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setMonthsViewMode(monthsViewMode === "CALENDAR" ? "CARDS" : "CALENDAR")}
                style={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border-visible)",
                  color: "var(--text-display)",
                  fontFamily: "var(--font-data)",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                [ VIEW MODE: {monthsViewMode} ]
              </button>
            </div>
          </div>

          {/* MONTHLY SUMMARY METRICS */}
          <div className="metrics-grid" style={metricsGridStyle}>
            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>ANNUAL TOTAL EXPENDITURE</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                {months.reduce((acc, m) => acc + m.totalExpenditure, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
              </span>
              <span style={metricSubtextStyle}>Across 12 fiscal periods</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>ANNUAL TAX CLAIMS ELIGIBLE</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                {months.reduce((acc, m) => acc + m.taxDeductible, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
              </span>
              <span style={metricSubtextStyle}>Audited tax deductions</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>CLOSED FISCAL PERIODS</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--success)", marginTop: "4px" }}>
                {months.filter((m) => m.status === "CLOSED" || m.status === "LOCKED").length} / {months.length} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MONTHS</span>
              </span>
              <span style={metricSubtextStyle}>Reconciled and locked</span>
            </div>
          </div>

          {/* MONTHS CONTENT: CALENDAR GRID OR PERIOD CARDS */}
          {monthsViewMode === "CALENDAR" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              
              {/* CALENDAR INSTRUMENT CONTAINER */}
              <div className="dot-grid-subtle calendar-instrument-card" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px" }}>
                
                {/* CALENDAR HEADER CONTROLS */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.04em" }}>
                      [ JULY 2026 FINANCIAL TELEMETRY CALENDAR ]
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => setCalendarMonth((prev) => (prev > 0 ? prev - 1 : 11))}
                      style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      [ ← PREV ]
                    </button>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", padding: "0 4px" }}>
                      {["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"][calendarMonth]} 2026
                    </span>
                    <button
                      onClick={() => setCalendarMonth((prev) => (prev < 11 ? prev + 1 : 0))}
                      style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      [ NEXT → ]
                    </button>
                  </div>
                </div>

                {/* SCROLLABLE CALENDAR GRID WRAPPER FOR MOBILE RESPONSIVENESS */}
                <div className="calendar-grid-wrapper">
                  <div className="calendar-grid-inner">
                    {/* DAYS OF THE WEEK HEADER */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", marginBottom: "8px", textAlign: "center" }}>
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((dayName) => (
                        <div key={dayName} style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em", padding: "6px 0", backgroundColor: "var(--surface-raised)", borderRadius: "4px" }}>
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* CALENDAR DAYS GRID (31 DAYS FOR JULY 2026) */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
                      {[0, 1].map((pad) => (
                        <div key={`pad-${pad}`} style={{ backgroundColor: "transparent", border: "1px border var(--border)", borderRadius: "6px", minHeight: "74px", opacity: 0.2 }} />
                      ))}

                      {Array.from({ length: 31 }, (_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = `2026-07-${dayNum < 10 ? "0" + dayNum : dayNum}`;
                        const isToday = dateStr === "2026-07-22";
                        const isSelected = selectedDate === dateStr;

                        const dayReceipts = receipts.filter((r) => r.date === dateStr);
                        const dayTotal = dayReceipts.reduce((acc, r) => acc + r.amount, 0);
                        const hasReceipts = dayReceipts.length > 0;

                        return (
                          <div
                            key={dayNum}
                            onClick={() => setSelectedDate(dateStr)}
                            style={{
                              backgroundColor: isToday
                                ? "rgba(74, 158, 92, 0.16)"
                                : isSelected
                                ? "rgba(255,255,255,0.08)"
                                : hasReceipts
                                ? "var(--surface-raised)"
                                : "var(--surface)",
                              border: isToday
                                ? "1px solid var(--success)"
                                : isSelected
                                ? "1px solid var(--text-display)"
                                : hasReceipts
                                ? "1px solid var(--border-visible)"
                                : "1px solid var(--border)",
                              borderRadius: "6px",
                              padding: "6px",
                              minHeight: "74px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              boxShadow: isToday ? "0 0 10px rgba(74, 158, 92, 0.2)" : "none",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: isSelected || hasReceipts ? "700" : "normal", color: isSelected ? "var(--text-display)" : "var(--text-secondary)" }}>
                                {dayNum}
                              </span>
                              {hasReceipts ? (
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                              ) : isToday ? (
                                <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "0 3px", borderRadius: "3px" }}>TODAY</span>
                              ) : null}
                            </div>

                            {hasReceipts ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
                                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", color: "var(--orange)" }}>
                                  {dayTotal.toFixed(2)} MYR
                                </span>
                                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)" }}>
                                  {dayReceipts.length} {dayReceipts.length === 1 ? "SLIP" : "SLIPS"}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
                                NO SLIPS
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SELECTED DAY TELEMETRY DETAILS PANEL */}
              <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.08em" }}>
                    [ DAILY TELEMETRY LOG // DATE: {selectedDate} ]
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                    {receipts.filter((r) => r.date === selectedDate).length} RECORDED RECEIPTS
                  </span>
                </div>

                {receipts.filter((r) => r.date === selectedDate).length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", border: "1px dashed var(--border-visible)", borderRadius: "6px", color: "var(--text-disabled)", fontFamily: "var(--font-data)", fontSize: "10px" }}>
                    NO RECEIPT SLIPS RECORDED ON {selectedDate}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {receipts.filter((r) => r.date === selectedDate).map((r) => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "6px", padding: "10px 12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)" }}>
                            {r.merchant}
                          </span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                            ID: {r.id} {"//"} CATEGORY: {r.category.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: "700", color: "var(--orange)" }}>
                          {r.amount.toFixed(2)} MYR
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* 12-MONTH PERIOD CARDS GRID */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {months.map((m) => (
                <div
                  key={m.month}
                  className="dot-grid-subtle"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border-visible)",
                    borderRadius: "10px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.06em" }}>
                      {m.label}
                    </span>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: m.status === "OPEN" ? "var(--success)" : "var(--text-secondary)", border: "1px solid var(--border-visible)", padding: "1px 6px", borderRadius: "4px" }}>
                      [{m.status}]
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>EXPENDITURE</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: "700", color: "var(--orange)" }}>
                        {m.totalExpenditure.toFixed(2)} <span style={{ fontSize: "9px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>TAX DEDUCTIBLE</span>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--orange)" }}>
                        {m.taxDeductible.toFixed(2)} MYR
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>RECEIPTS LOGGED</span>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-secondary)" }}>
                        {m.receiptCount} RECEIPT SLIPS
                      </span>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (m.totalExpenditure / 6500) * 100)}%`, height: "100%", backgroundColor: m.status === "OPEN" ? "var(--success)" : "var(--interactive)" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
                      {m.closedDate ? `CLOSED: ${m.closedDate}` : "CURRENT PERIOD"}
                    </span>
                    <button
                      onClick={() => setSelectedMonthDetail(m)}
                      style={{ background: "none", border: "none", color: "var(--interactive)", fontFamily: "var(--font-data)", fontSize: "10px", cursor: "pointer", padding: 0 }}
                    >
                      [ INSPECT MONTH ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* MONTHLY PERIOD INSPECTION MODAL */}
      {selectedMonthDetail && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>
                [ FISCAL PERIOD TELEMETRY // {selectedMonthDetail.label} ]
              </span>
              <button onClick={() => setSelectedMonthDetail(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "12px", cursor: "pointer" }}>[✕]</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", backgroundColor: "var(--surface-raised)", padding: "12px", borderRadius: "6px" }}>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>TOTAL EXPENDITURE</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--orange)" }}>{selectedMonthDetail.totalExpenditure.toFixed(2)} MYR</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)", display: "block" }}>TAX DEDUCTIBLE</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--orange)" }}>{selectedMonthDetail.taxDeductible.toFixed(2)} MYR</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => alert(`Exporting Tax Report for ${selectedMonthDetail.label} (CSV / PDF)`)} style={{ flex: 1, backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>
                [ EXPORT MONTHLY REPORT ]
              </button>
              <button onClick={() => setSelectedMonthDetail(null)} style={{ flex: 1, backgroundColor: "transparent", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}

      <TeamWorkspaceModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}

const heroBannerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "var(--space-md)", backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", flexWrap: "wrap", gap: "12px" };
const metricsGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-md)" };
const metricCardStyle: React.CSSProperties = { backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column" };
const metricLabelStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em" };
const metricSubtextStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", marginTop: "4px" };
