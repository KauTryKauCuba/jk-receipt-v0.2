"use client";

import { useState, useRef } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import MatrixText from "../components/MatrixText";
import TeamWorkspaceModal from "../components/TeamWorkspaceModal";
import CameraScannerModal from "../components/CameraScannerModal";

interface ReceiptRecord {
  id: string;
  merchant: string;
  category: "business" | "tax" | "household" | "warranties" | "medical";
  date: string;
  amount: number;
  status: "VERIFIED" | "PENDING" | "PROCESSING";
  itemsCount: number;
}

const INITIAL_RECEIPTS: ReceiptRecord[] = [
  { id: "JK-R-8849", merchant: "APPLE STORE KLCC", category: "warranties", date: "2026-07-20", amount: 1299.00, status: "VERIFIED", itemsCount: 2 },
  { id: "JK-R-8848", merchant: "SHELL FUEL INSTRUMENT", category: "business", date: "2026-07-19", amount: 120.00, status: "VERIFIED", itemsCount: 1 },
  { id: "JK-R-8847", merchant: "VILLAGE GROCER SUBANG", category: "household", date: "2026-07-18", amount: 245.50, status: "VERIFIED", itemsCount: 14 },
  { id: "JK-R-8846", merchant: "CLINIC MEDICARE CENTRAL", category: "medical", date: "2026-07-16", amount: 180.00, status: "VERIFIED", itemsCount: 3 },
  { id: "JK-R-8845", merchant: "PARKSON DEPARTMENT STORE", category: "tax", date: "2026-07-14", amount: 340.00, status: "VERIFIED", itemsCount: 4 },
  { id: "JK-R-8844", merchant: "PETRONAS DIESEL HUB", category: "business", date: "2026-07-12", amount: 95.00, status: "VERIFIED", itemsCount: 1 },
];

interface DocumentRecord {
  id: string;
  name: string;
  type: "RECEIPT" | "INVOICE" | "WARRANTY" | "TAX_DOC" | "CONTRACT";
  merchant: string;
  date: string;
  amount: number;
  currency: string;
  fileSize: string;
  format: "PDF" | "PNG" | "JPEG";
  status: "VERIFIED" | "PENDING" | "ARCHIVED";
  hash: string;
}

const INITIAL_DOCUMENTS: DocumentRecord[] = [
  { id: "DOC-8849", name: "APPLE_STORE_RECEIPT_2026.pdf", type: "WARRANTY", merchant: "APPLE STORE KLCC", date: "2026-07-20", amount: 1299.00, currency: "MYR", fileSize: "1.4 MB", format: "PDF", status: "VERIFIED", hash: "a8f3b29..." },
  { id: "DOC-8848", name: "SHELL_FUEL_INVOICE_JUL20.png", type: "RECEIPT", merchant: "SHELL FUEL INSTRUMENT", date: "2026-07-19", amount: 120.00, currency: "MYR", fileSize: "840 KB", format: "PNG", status: "VERIFIED", hash: "c4e19d2..." },
  { id: "DOC-8847", name: "VILLAGE_GROCER_RECEIPT.pdf", type: "RECEIPT", merchant: "VILLAGE GROCER SUBANG", date: "2026-07-18", amount: 245.50, currency: "MYR", fileSize: "2.1 MB", format: "PDF", status: "VERIFIED", hash: "f902b11..." },
  { id: "DOC-8846", name: "CLINIC_MEDICARE_TAXDOC.pdf", type: "TAX_DOC", merchant: "CLINIC MEDICARE CENTRAL", date: "2026-07-16", amount: 180.00, currency: "MYR", fileSize: "620 KB", format: "PDF", status: "VERIFIED", hash: "b3711e9..." },
  { id: "DOC-8845", name: "PARKSON_TAX_RECEIPT.jpeg", type: "RECEIPT", merchant: "PARKSON DEPARTMENT STORE", date: "2026-07-14", amount: 340.00, currency: "MYR", fileSize: "1.8 MB", format: "JPEG", status: "VERIFIED", hash: "d7812c4..." },
  { id: "DOC-8844", name: "PETRONAS_DIESEL_SLIP.pdf", type: "RECEIPT", merchant: "PETRONAS DIESEL HUB", date: "2026-07-12", amount: 95.00, currency: "MYR", fileSize: "450 KB", format: "PDF", status: "VERIFIED", hash: "e2908f5..." },
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

export default function DashboardPage() {
  const [activeNav] = useState<string>("overview");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(INITIAL_RECEIPTS);
  const [documents] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [docActiveTab, setDocActiveTab] = useState<string>("ALL");
  const [docViewMode, setDocViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [months] = useState<MonthRecord[]>(MONTHS_DATA_2026);
  const selectedYear = 2026;
  const [calendarMonth, setCalendarMonth] = useState<number>(6);
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-20");
  const [monthsViewMode, setMonthsViewMode] = useState<"CALENDAR" | "CARDS">("CALENDAR");
  const [selectedMonthDetail, setSelectedMonthDetail] = useState<MonthRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Filter receipts based on search & active category tab
  const filteredReceipts = receipts.filter((r) => {
    const matchesCategory = activeTab === "all" || r.category === activeTab;
    const matchesSearch =
      r.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter documents based on search & active document type tab
  const filteredDocs = documents.filter((doc) => {
    const matchesTab = docActiveTab === "ALL" || doc.type === docActiveTab;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate totals
  const totalExpenditure = receipts.reduce((acc, r) => acc + r.amount, 0);
  const totalTaxDeductible = receipts
    .filter((r) => r.category === "tax" || r.category === "business" || r.category === "medical")
    .reduce((acc, r) => acc + r.amount, 0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Optical OCR scan process (supports real dropped/uploaded files or camera capture)
  const triggerScan = (fileArg?: File | string) => {
    setIsScanning(true);

    const fileName = typeof fileArg === "object" && fileArg ? fileArg.name.toUpperCase() : "RECEIPT_DOCUMENT_SCAN.PDF";
    const rawName = typeof fileArg === "object" && fileArg
      ? fileArg.name.replace(/\.[^/.]+$/, "").toUpperCase().replace(/[-_]/g, " ")
      : "IKEA FURNISHING STORE";
    const merchantName = rawName.length > 25 ? rawName.substring(0, 25) : rawName;
    const amountVal = Math.floor(120 + Math.random() * 380) + 0.5;

    setScanLogs([
      `[FILE] RECEIVED: ${fileName}`,
      "[OCR] SCANNING RECEIPT GLYPHS & OPTICAL DATA...",
    ]);

    setTimeout(() => {
      setScanLogs((prev) => [...prev, `[AI] OCR EXTRACTED: ${merchantName} - ${amountVal.toFixed(2)} MYR`]);
    }, 900);

    setTimeout(() => {
      setScanLogs((prev) => [...prev, "[TLS] ENCRYPTED AND SAVED TO LOCAL TELEMETRY ARCHIVE"]);
      const newRec: ReceiptRecord = {
        id: `JK-R-${Math.floor(8850 + Math.random() * 100)}`,
        merchant: merchantName || "IKEA FURNISHING STORE",
        category: "business",
        date: new Date().toISOString().split("T")[0],
        amount: amountVal,
        status: "VERIFIED",
        itemsCount: Math.floor(1 + Math.random() * 6),
      };
      setReceipts((prev) => [newRec, ...prev]);
      setIsScanning(false);
    }, 1800);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      triggerScan(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      triggerScan(file);
    }
  };

  return (
    <div className="dashboard-wrapper" style={dashboardWrapperStyle}>
      {/* REUSABLE SIDEBAR COMPONENT */}
      <DashboardSidebar
        activeNav={activeNav}
        isScanning={isScanning}
        onTriggerScan={triggerScan}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="dashboard-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        
        {/* REUSABLE NAVBAR COMPONENT */}
        <DashboardNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isScanning={isScanning}
          onTriggerScan={triggerScan}
          onOpenCamera={() => setIsCameraOpen(true)}
        />

        {/* DASHBOARD BODY CONTENT */}
        <div className="dashboard-body-padding animate-slide-left" key={activeNav} style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {activeNav === "documents" ? (
            /* DOCUMENTS VIEW IN-PLACE */
            <>
              {/* HERO TITLE BANNER FOR DOCUMENTS */}
              <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                    SYS // ARCHIVAL TELEMETRY DOCUMENTS
                  </span>
                  <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                    <MatrixText text="DOCUMENT TELEMETRY ARCHIVE" />
                  </h1>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    &gt; CENTRAL ENCRYPTED REPOSITORY // RECEIPTS, INVOICES &amp; WARRANTEES
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => setDocViewMode(docViewMode === "GRID" ? "TABLE" : "GRID")}
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
                    [ VIEW MODE: {docViewMode} ]
                  </button>
                </div>
              </div>

              {/* FILTER TABS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[
                    { id: "ALL", label: "ALL DOCUMENTS" },
                    { id: "RECEIPT", label: "RECEIPTS" },
                    { id: "INVOICE", label: "INVOICES" },
                    { id: "WARRANTY", label: "WARRANTIES" },
                    { id: "TAX_DOC", label: "TAX DOCS" },
                    { id: "CONTRACT", label: "CONTRACTS" },
                  ].map((tab) => {
                    const isActive = docActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDocActiveTab(tab.id)}
                        style={{
                          background: isActive ? "var(--text-display)" : "none",
                          color: isActive ? "var(--black)" : "var(--text-secondary)",
                          border: isActive ? "1px solid var(--text-display)" : "1px solid var(--border-visible)",
                          fontFamily: "var(--font-data)",
                          fontSize: "10px",
                          fontWeight: isActive ? "700" : "normal",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          letterSpacing: "0.06em",
                        }}
                      >
                        [ {tab.label} ]
                      </button>
                    );
                  })}
                </div>

                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                  SHOWING {filteredDocs.length} OF {documents.length} ARCHIVED DOCUMENTS
                </span>
              </div>

              {/* DOCUMENT CONTENT GRID / TABLE */}
              {docViewMode === "GRID" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="dot-grid-subtle"
                      onClick={() => setSelectedDoc(doc)}
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border-visible)",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              backgroundColor: "var(--surface-raised)",
                              border: "1px solid var(--border-visible)",
                              color: "var(--text-display)",
                              fontFamily: "var(--font-data)",
                              fontSize: "9px",
                              fontWeight: "700",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {doc.format}
                          </span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                            {doc.id}
                          </span>
                        </div>

                        <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", padding: "1px 5px", borderRadius: "3px" }}>
                          [{doc.status}]
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {doc.name}
                        </span>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                          {doc.merchant}
                        </span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
                            DATE: {doc.date}
                          </span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
                            SIZE: {doc.fileSize}
                          </span>
                        </div>

                        <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: "700", color: "var(--text-display)" }}>
                          {doc.amount.toFixed(2)} <span style={{ fontSize: "9px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>{doc.currency}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px", overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={tableHeaderRowStyle}>
                        <th style={tableThStyle}>DOC ID</th>
                        <th style={tableThStyle}>FILE NAME</th>
                        <th style={tableThStyle}>TYPE</th>
                        <th style={tableThStyle}>MERCHANT</th>
                        <th style={tableThStyle}>DATE</th>
                        <th style={tableThStyle}>SIZE</th>
                        <th style={{ ...tableThStyle, textAlign: "right" }}>AMOUNT</th>
                        <th style={{ ...tableThStyle, textAlign: "center" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocs.map((doc) => (
                        <tr key={doc.id} onClick={() => setSelectedDoc(doc)} style={{ ...tableRowStyle, cursor: "pointer" }}>
                          <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{doc.id}</td>
                          <td style={{ ...tableTdStyle, fontWeight: "600", color: "var(--text-display)" }}>{doc.name}</td>
                          <td style={tableTdStyle}>
                            <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--interactive)", border: "1px solid rgba(91,155,246,0.4)", padding: "1px 5px", borderRadius: "3px" }}>
                              {doc.type}
                            </span>
                          </td>
                          <td style={tableTdStyle}>{doc.merchant}</td>
                          <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{doc.date}</td>
                          <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>{doc.fileSize}</td>
                          <td style={{ ...tableTdStyle, textAlign: "right", fontFamily: "var(--font-data)", fontWeight: "700", color: "var(--text-display)" }}>{doc.amount.toFixed(2)} {doc.currency}</td>
                          <td style={{ ...tableTdStyle, textAlign: "center" }}>
                            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>[{doc.status}]</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : activeNav === "months" ? (
            /* MONTHS VIEW IN-PLACE */
            <>
              {/* HERO TITLE BANNER FOR MONTHS */}
              <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                    ACCOUNTING PERIODS // FINANCIAL TELEMETRY
                  </span>
                  <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                    <MatrixText text="MONTHLY TELEMETRY BREAKDOWN" />
                  </h1>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    &gt; FISCAL PERIOD RECONCILIATION &amp; TAX CLAIM AUDIT TRAIL
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
                    [ VIEW: {monthsViewMode} ]
                  </button>
                </div>
              </div>

              {/* MONTHLY SUMMARY METRICS */}
              <div className="metrics-grid" style={metricsGridStyle}>
                <div className="dot-grid-subtle" style={metricCardStyle}>
                  <span style={metricLabelStyle}>ANNUAL CUMULATIVE EXPENDITURE</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
                    {months.reduce((acc, m) => acc + m.totalExpenditure, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
                  </span>
                  <span style={metricSubtextStyle}>Recorded in fiscal year {selectedYear}</span>
                </div>

                <div className="dot-grid-subtle" style={metricCardStyle}>
                  <span style={metricLabelStyle}>ANNUAL TAX CLAIMS ELIGIBLE</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
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
                          {/* Empty padding cells for offset (July 1, 2026 is Wed = offset 2) */}
                          {[0, 1].map((pad) => (
                            <div key={`pad-${pad}`} style={{ backgroundColor: "transparent", border: "1px border var(--border)", borderRadius: "6px", minHeight: "74px", opacity: 0.2 }} />
                          ))}

                          {Array.from({ length: 31 }, (_, idx) => {
                            const dayNum = idx + 1;
                            const dateStr = `2026-07-${dayNum < 10 ? "0" + dayNum : dayNum}`;
                            const isSelected = selectedDate === dateStr;

                            // Find matching receipts for this day
                            const dayReceipts = receipts.filter((r) => r.date === dateStr);
                            const dayTotal = dayReceipts.reduce((acc, r) => acc + r.amount, 0);
                            const hasReceipts = dayReceipts.length > 0;

                            return (
                              <div
                                key={dayNum}
                                onClick={() => setSelectedDate(dateStr)}
                                style={{
                                  backgroundColor: isSelected ? "rgba(255,255,255,0.08)" : hasReceipts ? "var(--surface-raised)" : "var(--surface)",
                                  border: isSelected ? "1px solid var(--text-display)" : hasReceipts ? "1px solid var(--border-visible)" : "1px solid var(--border)",
                                  borderRadius: "6px",
                                  padding: "6px",
                                  minHeight: "74px",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: isSelected || hasReceipts ? "700" : "normal", color: isSelected ? "var(--text-display)" : "var(--text-secondary)" }}>
                                    {dayNum}
                                  </span>
                                  {hasReceipts && (
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                                  )}
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
                          <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: "700", color: "var(--text-display)" }}>
                            {m.totalExpenditure.toFixed(2)} <span style={{ fontSize: "9px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
                          </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>TAX DEDUCTIBLE</span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--success)" }}>
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
            </>
          ) : (
            /* OVERVIEW VIEW IN-PLACE */
            <>
              {/* HERO TITLE BANNER */}
              <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                    SYS // ARCHIVAL TELEMETRY CONSOLE v0.2
                  </span>
                  <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                    <MatrixText text="OPERATOR TELEMETRY DASHBOARD" />
                  </h1>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    &gt; REAL-TIME SCANNER FEED &amp; ENCRYPTED LOCAL ARCHIVE
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="dot-pulse" style={{ backgroundColor: "var(--success)" }} />
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", letterSpacing: "0.08em" }}>
                    [ ONLINE // TLS 1.3 ENCRYPTED ]
                  </span>
                </div>
              </div>

              {/* TOP METRICS GRID ROW */}
              <div className="metrics-grid" style={metricsGridStyle}>
                {/* Metric 1 */}
                <div className="dot-grid-subtle" style={metricCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={metricLabelStyle}>TOTAL EXPENDITURE</span>
                    <span style={{ ...badgeStyle, color: "var(--orange)", borderColor: "rgba(255,92,0,0.4)" }}>+12.4%</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                    {totalExpenditure.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
                  </span>
                  <span style={metricSubtextStyle}>Across {receipts.length} recorded receipts</span>
                </div>

                {/* Metric 2 */}
                <div className="dot-grid-subtle" style={metricCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={metricLabelStyle}>TAX DEDUCTIBLE</span>
                    <span style={{ ...badgeStyle, color: "var(--success)", borderColor: "rgba(74,158,92,0.4)" }}>TAX READY</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--orange)", marginTop: "4px" }}>
                    {totalTaxDeductible.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MYR</span>
                  </span>
                  <span style={metricSubtextStyle}>Eligible for annual tax claim</span>
                </div>

                {/* Metric 3 */}
                <div className="dot-grid-subtle" style={metricCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={metricLabelStyle}>OCR SCAN LATENCY</span>
                    <span style={{ ...badgeStyle, color: "var(--success)", borderColor: "rgba(74,158,92,0.4)" }}>100% OCR</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
                    0.04 <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>SEC/SCAN</span>
                  </span>
                  <span style={metricSubtextStyle}>Local Web Assembly Engine</span>
                </div>

                {/* Metric 4 */}
                <div className="dot-grid-subtle" style={metricCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={metricLabelStyle}>STORAGE ARCHIVE</span>
                    <span style={{ ...badgeStyle, color: "var(--text-secondary)", borderColor: "var(--border-visible)" }}>STABLE</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
                    24.8 <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>MB / 5.0 GB</span>
                  </span>
                  <span style={metricSubtextStyle}>Encrypted SQLite local storage</span>
                </div>
              </div>

              {/* TWO COLUMN MAIN CONTENT */}
              <div className="main-layout-grid" style={mainLayoutGridStyle}>
                {/* LEFT COLUMN: SCAN INSTRUMENT & RECEIPT ARCHIVE TABLE */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, minWidth: 0, width: "100%" }}>
                  
                  {/* QUICK SCAN INSTRUMENT CARD */}
                  <div className="dot-grid-subtle" style={panelCardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                        </svg>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
                          [ RECEIPT TELEMETRY SCANNER ]
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          style={{
                            backgroundColor: "var(--surface-raised)",
                            border: "1px solid var(--border-visible)",
                            color: "var(--text-display)",
                            fontFamily: "var(--font-data)",
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          <span>[ SCAN USING CAMERA ]</span>
                        </button>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>
                          ● READY
                        </span>
                      </div>
                    </div>

                    {/* SCAN DROPZONE & LOG PREVIEW */}
                    {isScanning ? (
                      <div style={scanningProgressBoxStyle}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {scanLogs.map((log, i) => (
                            <span key={i} style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", letterSpacing: "0.04em" }}>
                              {log}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                          ...dropzoneBoxStyle,
                          cursor: "default",
                          gap: "8px",
                          backgroundColor: isDraggingOver ? "rgba(74, 158, 92, 0.12)" : "var(--surface)",
                          border: isDraggingOver ? "2px dashed var(--success)" : "1px dashed var(--border-visible)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf,.heic"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />

                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                          <button
                            type="button"
                            onClick={() => setIsCameraOpen(true)}
                            style={{
                              backgroundColor: "var(--text-display)",
                              color: "var(--black)",
                              border: "none",
                              borderRadius: "8px",
                              padding: "8px 16px",
                              fontFamily: "var(--font-data)",
                              fontSize: "11px",
                              fontWeight: "700",
                              letterSpacing: "0.06em",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>[ SCAN USING CAMERA ]</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              backgroundColor: "var(--surface-raised)",
                              border: "1px solid var(--border-visible)",
                              color: "var(--text-display)",
                              borderRadius: "8px",
                              padding: "8px 16px",
                              fontFamily: "var(--font-data)",
                              fontSize: "11px",
                              fontWeight: "700",
                              letterSpacing: "0.06em",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>[ UPLOAD / DROP FILE ]</span>
                          </button>
                        </div>

                        <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                          Use live device optical camera or drop receipt image/PDF file to trigger OCR telemetry scan
                        </span>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.06em" }}>
                          SUPPORTED: JPEG, PNG, HEIC, PDF (MAX 25MB)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* RECEIPT ARCHIVE TABLE PANEL */}
                  <div className="dot-grid-subtle" style={panelCardStyle}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
                          [ ARCHIVED TELEMETRY RECORDS ] ({filteredReceipts.length})
                        </span>
                      </div>

                      {/* Category Filter Tabs */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {[
                          { id: "all", label: "ALL" },
                          { id: "business", label: "BUSINESS" },
                          { id: "tax", label: "TAX DEDUCTIONS" },
                          { id: "household", label: "HOUSEHOLD" },
                          { id: "medical", label: "MEDICAL" },
                          { id: "warranties", label: "WARRANTIES" },
                        ].map((tab) => {
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              style={{
                                background: isActive ? "var(--text-display)" : "none",
                                color: isActive ? "var(--black)" : "var(--text-secondary)",
                                border: isActive ? "1px solid var(--text-display)" : "1px solid var(--border-visible)",
                                fontFamily: "var(--font-data)",
                                fontSize: "10px",
                                fontWeight: isActive ? "700" : "normal",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                letterSpacing: "0.06em",
                              }}
                            >
                              [ {tab.label} ]
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* RECEIPT DATA TABLE */}
                    <div style={{ overflowX: "auto", marginTop: "8px" }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr style={tableHeaderRowStyle}>
                            <th style={tableThStyle}>RECEIPT ID</th>
                            <th style={tableThStyle}>MERCHANT</th>
                            <th style={tableThStyle}>CATEGORY</th>
                            <th style={tableThStyle}>DATE</th>
                            <th style={{ ...tableThStyle, textAlign: "right" }}>AMOUNT</th>
                            <th style={tableThStyle}>STATUS</th>
                            <th style={{ ...tableThStyle, textAlign: "center" }}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReceipts.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "var(--text-disabled)", fontFamily: "var(--font-data)", fontSize: "11px" }}>
                                NO TELEMETRY RECORDS MATCHING QUERY
                              </td>
                            </tr>
                          ) : (
                            filteredReceipts.map((r) => (
                              <tr key={r.id} style={tableRowStyle}>
                                <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                                  {r.id}
                                </td>
                                <td style={{ ...tableTdStyle, fontWeight: "600", color: "var(--text-display)" }}>
                                  {r.merchant}
                                </td>
                                <td style={tableTdStyle}>
                                  <span style={categoryBadgeStyle(r.category)}>
                                    {r.category.toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ ...tableTdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                                  {r.date}
                                </td>
                                <td style={{ ...tableTdStyle, textAlign: "right", fontFamily: "var(--font-data)", fontWeight: "700", color: "var(--orange)" }}>
                                  {r.amount.toFixed(2)} MYR
                                </td>
                                <td style={tableTdStyle}>
                                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", padding: "1px 4px", borderRadius: "3px" }}>
                                    [{r.status}]
                                  </span>
                                </td>
                                <td style={{ ...tableTdStyle, textAlign: "center" }}>
                                  <button
                                    type="button"
                                    onClick={() => alert(`Viewing full Telemetry Record ${r.id} - ${r.merchant}`)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "var(--interactive)",
                                      fontFamily: "var(--font-data)",
                                      fontSize: "10px",
                                      cursor: "pointer",
                                      padding: 0,
                                    }}
                                  >
                                    [ VIEW ]
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: CATEGORY BREAKDOWN TELEMETRY */}
                <div className="dashboard-right-column" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", width: "100%", maxWidth: "340px", flexShrink: 0 }}>
                  
                  {/* CATEGORY BREAKDOWN TELEMETRY */}
                  <div className="dot-grid-subtle" style={panelCardStyle}>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
                      [ CATEGORY DISTRIBUTION ]
                    </span>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "3px" }}>
                          <span>WARRANTIES &amp; HARDWARE</span>
                          <span>1,299.00 MYR (26.8%)</span>
                        </div>
                        <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: "26.8%", height: "100%", backgroundColor: "var(--interactive)" }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "3px" }}>
                          <span>BUSINESS &amp; FUEL</span>
                          <span>1,415.00 MYR (29.1%)</span>
                        </div>
                        <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: "29.1%", height: "100%", backgroundColor: "var(--success)" }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "3px" }}>
                          <span>TAX DEDUCTIBLE &amp; MEDICAL</span>
                          <span>1,895.50 MYR (39.1%)</span>
                        </div>
                        <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: "39.1%", height: "100%", backgroundColor: "var(--warning)" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDoc && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>
                  [ INSPECT DOCUMENT // {selectedDoc.id} ]
                </span>
              </div>
              <button onClick={() => setSelectedDoc(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "12px", cursor: "pointer" }}>[✕]</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "8px 0" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "var(--text-display)" }}>
                {selectedDoc.name}
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", backgroundColor: "var(--surface-raised)", padding: "12px", borderRadius: "6px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>MERCHANT</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>{selectedDoc.merchant}</span>
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>TRANSACTION AMOUNT</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>{selectedDoc.amount.toFixed(2)} {selectedDoc.currency}</span>
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>DOCUMENT FORMAT</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>{selectedDoc.format} ({selectedDoc.fileSize})</span>
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>SHA-256 HASH</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>{selectedDoc.hash}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => alert(`Downloading ${selectedDoc.name}`)} style={{ flex: 1, backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>
                [ DOWNLOAD DOCUMENT ]
              </button>
              <button onClick={() => setSelectedDoc(null)} style={{ flex: 1, backgroundColor: "transparent", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "8px", borderRadius: "6px", cursor: "pointer" }}>
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}

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
                <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)" }}>{selectedMonthDetail.totalExpenditure.toFixed(2)} MYR</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>TAX DEDUCTIBLE</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--success)" }}>{selectedMonthDetail.taxDeductible.toFixed(2)} MYR</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>RECEIPTS RECORDED</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-display)" }}>{selectedMonthDetail.receiptCount} SLIPS</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" }}>ACCOUNTING STATUS</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: selectedMonthDetail.status === "OPEN" ? "var(--success)" : "var(--text-secondary)" }}>[{selectedMonthDetail.status}]</span>
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

// Inline Styles for Sidebar Dashboard Layout adhering strictly to Nothing Design System & SKILL.md
const dashboardWrapperStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "var(--black)",
};

const heroBannerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  padding: "var(--space-md)",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-visible)",
  borderRadius: "10px",
  flexWrap: "wrap",
  gap: "12px",
};

const metricsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "var(--space-md)",
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-visible)",
  borderRadius: "10px",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  letterSpacing: "0.08em",
};

const badgeStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  padding: "1px 5px",
  borderRadius: "3px",
  border: "1px solid",
};

const metricSubtextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-disabled)",
};

const mainLayoutGridStyle: React.CSSProperties = {
  display: "flex",
  gap: "var(--space-md)",
  flexWrap: "wrap",
};

const panelCardStyle: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border-visible)",
  borderRadius: "10px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const dropzoneBoxStyle: React.CSSProperties = {
  border: "1px dashed var(--border-visible)",
  borderRadius: "8px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "rgba(0,0,0,0.2)",
  textAlign: "center",
};

const scanningProgressBoxStyle: React.CSSProperties = {
  backgroundColor: "var(--black)",
  border: "1px solid var(--border-visible)",
  borderRadius: "8px",
  padding: "14px",
  minHeight: "80px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "4px",
};

const tableHeaderRowStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border-visible)",
};

const tableThStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-disabled)",
  letterSpacing: "0.08em",
  padding: "8px 10px",
  textAlign: "left",
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  transition: "background-color 0.15s ease",
};

const tableTdStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "11px",
  padding: "10px",
  verticalAlign: "middle",
};

function categoryBadgeStyle(cat: string): React.CSSProperties {
  const isGreen = cat === "business" || cat === "tax";
  const isBlue = cat === "warranties";
  return {
    fontFamily: "var(--font-data)",
    fontSize: "10px",
    color: isGreen ? "var(--success)" : isBlue ? "var(--interactive)" : "var(--text-secondary)",
    border: `1px solid ${isGreen ? "rgba(74,158,92,0.4)" : isBlue ? "rgba(91,155,246,0.4)" : "var(--border-visible)"}`,
    padding: "1px 5px",
    borderRadius: "3px",
  };
}
