"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import TeamWorkspaceModal from "../../components/TeamWorkspaceModal";

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

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newDoc: DocumentRecord = {
        id: `DOC-${Math.floor(8850 + Math.random() * 100)}`,
        name: `SCAN_DOCUMENT_${Math.floor(Math.random() * 1000)}.pdf`,
        type: "RECEIPT",
        merchant: "NEW SCANNED MERCHANT",
        date: new Date().toISOString().split("T")[0],
        amount: 150.00,
        currency: "MYR",
        fileSize: "1.1 MB",
        format: "PDF",
        status: "VERIFIED",
        hash: `a${Math.floor(Math.random() * 1000000)}...`,
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setIsScanning(false);
    }, 1500);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesTab = activeTab === "ALL" || doc.type === activeTab;
    const matchesQuery =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "var(--black)" }}>
      {/* REUSABLE SIDEBAR */}
      <DashboardSidebar
        activeNav="documents"
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

        {/* DASHBOARD DOCUMENTS BODY CONTENT */}
        <div className="animate-slide-left" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* HERO BANNER */}
          <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                SYS // ARCHIVAL TELEMETRY DOCUMENTS
              </span>
              <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
                <MatrixText text="DOCUMENT TELEMETRY ARCHIVE" />
              </h1>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                &gt; CENTRAL ENCRYPTED REPOSITORY // RECEIPTS, INVOICES &amp; WARRANTEES
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setViewMode(viewMode === "GRID" ? "TABLE" : "GRID")}
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
                [ VIEW MODE: {viewMode} ]
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

          {/* DOCUMENT CONTENT VIEW */}
          {viewMode === "GRID" ? (
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

                    <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: "700", color: "var(--orange)" }}>
                      {doc.amount.toFixed(2)} <span style={{ fontSize: "9px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>{doc.currency}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-visible)" }}>
                    <th style={thStyle}>DOC ID</th>
                    <th style={thStyle}>FILE NAME</th>
                    <th style={thStyle}>TYPE</th>
                    <th style={thStyle}>MERCHANT</th>
                    <th style={thStyle}>DATE</th>
                    <th style={thStyle}>SIZE</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>AMOUNT</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} onClick={() => setSelectedDoc(doc)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                      <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{doc.id}</td>
                      <td style={{ ...tdStyle, fontWeight: "600", color: "var(--text-display)" }}>{doc.name}</td>
                      <td style={tdStyle}><span style={badgeStyle}>{doc.type}</span></td>
                      <td style={tdStyle}>{doc.merchant}</td>
                      <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{doc.date}</td>
                      <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>{doc.fileSize}</td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-data)", fontWeight: "700", color: "var(--orange)" }}>{doc.amount.toFixed(2)} {doc.currency}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>[{doc.status}]</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDoc && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>
                [ INSPECT DOCUMENT // {selectedDoc.id} ]
              </span>
              <button onClick={() => setSelectedDoc(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "12px", cursor: "pointer" }}>[✕]</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "8px 0" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "var(--text-display)" }}>
                {selectedDoc.name}
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", backgroundColor: "var(--surface-raised)", padding: "12px", borderRadius: "6px" }}>
                <div>
                  <span style={metaLabelStyle}>MERCHANT</span>
                  <span style={metaValStyle}>{selectedDoc.merchant}</span>
                </div>
                <div>
                  <span style={metaLabelStyle}>TRANSACTION AMOUNT</span>
                  <span style={{ ...metaValStyle, color: "var(--orange)", fontWeight: "700" }}>{selectedDoc.amount.toFixed(2)} {selectedDoc.currency}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => alert(`Downloading ${selectedDoc.name}`)} style={primaryBtnStyle}>
                [ DOWNLOAD DOCUMENT ]
              </button>
              <button onClick={() => setSelectedDoc(null)} style={secondaryBtnStyle}>
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
const thStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em", padding: "8px 10px", textAlign: "left" };
const tdStyle: React.CSSProperties = { fontFamily: "var(--font-body)", fontSize: "11px", padding: "10px", verticalAlign: "middle" };
const badgeStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--interactive)", border: "1px solid rgba(91,155,246,0.4)", padding: "1px 5px", borderRadius: "3px" };
const metaLabelStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" };
const metaValStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" };
const primaryBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "8px", borderRadius: "6px", cursor: "pointer" };
const secondaryBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: "transparent", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "8px", borderRadius: "6px", cursor: "pointer" };
