"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import TeamWorkspaceModal from "../../components/TeamWorkspaceModal";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: "SECURITY" | "INGESTION" | "EXPORTS" | "USER ACTIONS";
  action: string;
  operator: string;
  ipAddress: string;
  hash: string;
  status: "VERIFIED" | "FLAGGED" | "SYSTEM";
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "LOG-9921", timestamp: "2026-07-22 05:40:12", category: "SECURITY", action: "TELEMETRY AUTHENTICATION SUCCESSFUL", operator: "ALDRIN_02", ipAddress: "192.168.1.104", hash: "a8f3b294c...", status: "VERIFIED" },
  { id: "LOG-9920", timestamp: "2026-07-22 04:15:30", category: "INGESTION", action: "RECEIPT INGESTED // APPLE STORE KLCC", operator: "ALDRIN_02", ipAddress: "192.168.1.104", hash: "c4e19d28a...", status: "VERIFIED" },
  { id: "LOG-9919", timestamp: "2026-07-21 21:10:05", category: "EXPORTS", action: "TAX SUMMARY REPORT GENERATED (PDF)", operator: "ALDRIN_02", ipAddress: "192.168.1.104", hash: "f902b113d...", status: "VERIFIED" },
  { id: "LOG-9918", timestamp: "2026-07-21 18:45:22", category: "USER ACTIONS", action: "UPDATED BASE CURRENCY PREFERENCE (MYR)", operator: "ALDRIN_02", ipAddress: "192.168.1.104", hash: "b3711e92c...", status: "VERIFIED" },
  { id: "LOG-9917", timestamp: "2026-07-21 14:02:18", category: "SECURITY", action: "2FA TOKEN VALIDATION SUCCESSFUL", operator: "ALDRIN_02", ipAddress: "192.168.1.104", hash: "d7812c49e...", status: "VERIFIED" },
  { id: "LOG-9916", timestamp: "2026-07-20 22:30:00", category: "INGESTION", action: "MASS UPLOAD // 5 RECEIPTS INGESTED", operator: "ALDRIN_02", ipAddress: "192.168.1.104", hash: "e2908f51a...", status: "VERIFIED" },
];

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [logs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("[SCAN COMPLETE] Receipt ingested into telemetry archive.");
    }, 1500);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = activeCategory === "ALL" || log.category === activeCategory;
    const matchesQuery =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "var(--black)" }}>
      {/* REUSABLE SIDEBAR */}
      <DashboardSidebar
        activeNav="audit_log"
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

        {/* DASHBOARD AUDIT LOG BODY CONTENT */}
        <div className="animate-slide-left" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* HERO BANNER */}
          <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                SECURITY &amp; SYSTEM AUDIT TRAIL // IMMUTABLE TELEMETRY
              </span>
              <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
                <MatrixText text="AUDIT LOG TELEMETRY" />
              </h1>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                &gt; SHA-256 CRYPTOGRAPHIC SIGNATURES &amp; REAL-TIME AUDIT STREAM
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "4px 10px", borderRadius: "6px", fontWeight: "700" }}>
                [ TELEMETRY STATUS: NOMINAL ]
              </span>
            </div>
          </div>

          {/* METRIC SUMMARY CARDS */}
          <div className="metrics-grid" style={metricsGridStyle}>
            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>TOTAL AUDIT EVENTS RECORDED</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
                1,482 <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>EVENTS</span>
              </span>
              <span style={metricSubtextStyle}>100% Immutable SHA-256 logged</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>VERIFIED CRYPTOGRAPHIC LOGS</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--success)", marginTop: "4px" }}>
                100.0% <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>VALID</span>
              </span>
              <span style={metricSubtextStyle}>No integrity anomalies detected</span>
            </div>

            <div className="dot-grid-subtle" style={metricCardStyle}>
              <span style={metricLabelStyle}>CRITICAL SECURITY ALERTS</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "700", color: "var(--text-display)", marginTop: "4px" }}>
                0 <span style={{ fontSize: "11px", fontFamily: "var(--font-data)", color: "var(--text-secondary)" }}>ALERTS</span>
              </span>
              <span style={metricSubtextStyle}>Zero security breaches</span>
            </div>
          </div>

          {/* FILTER TABS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: "ALL EVENTS" },
                { id: "SECURITY", label: "SECURITY" },
                { id: "INGESTION", label: "INGESTION" },
                { id: "EXPORTS", label: "EXPORTS" },
                { id: "USER ACTIONS", label: "USER ACTIONS" },
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
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
              SHOWING {filteredLogs.length} LOG ENTRIES
            </span>
          </div>

          {/* AUDIT LOG TABLE STREAM */}
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", padding: "16px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-visible)" }}>
                  <th style={thStyle}>EVENT ID</th>
                  <th style={thStyle}>TIMESTAMP</th>
                  <th style={thStyle}>CATEGORY</th>
                  <th style={thStyle}>ACTION DESCRIPTION</th>
                  <th style={thStyle}>OPERATOR</th>
                  <th style={thStyle}>NODE IP</th>
                  <th style={thStyle}>SHA-256 HASH</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} onClick={() => setSelectedLog(log)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>{log.id}</td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>{log.timestamp}</td>
                    <td style={tdStyle}><span style={categoryBadgeStyle}>{log.category}</span></td>
                    <td style={{ ...tdStyle, fontWeight: "600", color: "var(--text-display)" }}>{log.action}</td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-display)" }}>{log.operator}</td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>{log.ipAddress}</td>
                    <td style={{ ...tdStyle, fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}><code>{log.hash}</code></td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", padding: "1px 6px", borderRadius: "3px" }}>
                        [{log.status}]
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* LOG ENTRY INSPECTION MODAL */}
      {selectedLog && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "16px" }}>
          <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" }}>
                [ INSPECT AUDIT ENTRY // {selectedLog.id} ]
              </span>
              <button onClick={() => setSelectedLog(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "12px", cursor: "pointer" }}>[✕]</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", padding: "12px", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={metaLabelStyle}>ACTION DESCRIPTION</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "var(--text-display)" }}>{selectedLog.action}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", backgroundColor: "var(--surface-raised)", padding: "12px", borderRadius: "6px" }}>
                <div>
                  <span style={metaLabelStyle}>TIMESTAMP</span>
                  <span style={metaValStyle}>{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span style={metaLabelStyle}>OPERATOR CALL SIGN</span>
                  <span style={metaValStyle}>{selectedLog.operator}</span>
                </div>
                <div>
                  <span style={metaLabelStyle}>NODE IP ADDRESS</span>
                  <span style={metaValStyle}>{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span style={metaLabelStyle}>SECURITY CATEGORY</span>
                  <span style={metaValStyle}>{selectedLog.category}</span>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--surface-raised)", border: "1px dashed var(--border-visible)", padding: "10px", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={metaLabelStyle}>SHA-256 LOG SIGNATURE</span>
                <code style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", wordBreak: "break-all" }}>
                  {selectedLog.hash}940a238f47c8d9e2b1
                </code>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={() => alert(`Exported raw audit cryptographic proof for ${selectedLog.id}`)} style={primaryBtnStyle}>
                [ EXPORT CRYPTO PROOF ]
              </button>
              <button onClick={() => setSelectedLog(null)} style={secondaryBtnStyle}>
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
const thStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.08em", padding: "8px 10px", textAlign: "left" };
const tdStyle: React.CSSProperties = { fontFamily: "var(--font-body)", fontSize: "11px", padding: "10px", verticalAlign: "middle" };
const categoryBadgeStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--interactive)", border: "1px solid rgba(91,155,246,0.4)", padding: "1px 5px", borderRadius: "3px" };
const metaLabelStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block" };
const metaValStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)" };
const primaryBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", padding: "8px", borderRadius: "6px", cursor: "pointer" };
const secondaryBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: "transparent", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", padding: "8px", borderRadius: "6px", cursor: "pointer" };
