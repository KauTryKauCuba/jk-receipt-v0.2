"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import MatrixText from "../../components/MatrixText";
import OperatorPassCard from "../../components/OperatorPassCard";
import TeamWorkspaceModal from "../../components/TeamWorkspaceModal";
import CustomDropdown from "../../components/CustomDropdown";

export default function AccountSettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Form State
  const [callSign, setCallSign] = useState("ALDRIN_02");
  const [email, setEmail] = useState("aldrin.operator@jejaku.io");
  const [currency, setCurrency] = useState("MYR");
  const [autoTaxTag, setAutoTaxTag] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("[SCAN COMPLETE] Receipt ingested into telemetry archive.");
    }, 1500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "var(--black)" }}>
      {/* REUSABLE SIDEBAR */}
      <DashboardSidebar
        activeNav="account_settings"
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

        {/* DASHBOARD ACCOUNT SETTINGS BODY CONTENT */}
        <div className="animate-slide-left" style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* HERO BANNER */}
          <div className="hero-banner-responsive dot-grid-subtle" style={heroBannerStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "100%", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                SYS // ACCOUNT &amp; TELEMETRY CONFIGURATION
              </span>
              <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-md)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
                <MatrixText text="ACCOUNT SETTINGS" />
              </h1>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>
                &gt; OPERATOR CREDENTIALS, SECURITY &amp; PREFERENCES
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "4px 10px", borderRadius: "6px", fontWeight: "700" }}>
                [ TIER: FREE COMMUNITY ]
              </span>
            </div>
          </div>

          {/* SUCCESS NOTIFICATION TOAST */}
          {savedNotification && (
            <div style={{ backgroundColor: "rgba(74,158,92,0.15)", border: "1px solid var(--success)", borderRadius: "8px", padding: "10px 16px", color: "var(--success)", fontFamily: "var(--font-data)", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>[ SUCCESS ] Account telemetry settings saved and synced across all nodes.</span>
              <span style={{ cursor: "pointer" }} onClick={() => setSavedNotification(false)}>[✕]</span>
            </div>
          )}

          {/* MAIN SETTINGS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-md)" }}>
            
            {/* OPERATOR PASS & PROFILE CARD */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ borderBottom: "1px solid var(--border-visible)", paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.08em" }}>
                  [ OPERATOR PASS CREDENTIALS ]
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)" }}>● ACTIVE</span>
              </div>

              <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                <OperatorPassCard
                  callSign={callSign}
                  useCase="BUSINESS"
                  mainGoal="TAX OPTIMIZATION"
                  monthlyVolume="50-200"
                  trackedItems={["household", "warranties", "tax"]}
                  collaborators={["me", "spouse"]}
                  profileImage={null}
                  autoSpin={false}
                />
              </div>

              <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>CALL SIGN / OPERATOR NAME</label>
                  <input
                    type="text"
                    value={callSign}
                    onChange={(e) => setCallSign(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>PRIMARY TELEMETRY EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <button type="submit" style={primaryBtnStyle}>
                  [ SAVE PROFILE CHANGES ]
                </button>
              </form>
            </div>

            {/* PREFERENCES & SYSTEM CONFIGURATION */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ borderBottom: "1px solid var(--border-visible)", paddingBottom: "10px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.08em" }}>
                  [ SYSTEM &amp; INGESTION PREFERENCES ]
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <CustomDropdown
                  label="DEFAULT BASE CURRENCY"
                  value={currency}
                  onChange={(val) => setCurrency(val)}
                  options={[
                    { value: "MYR", label: "MYR - MALAYSIAN RINGGIT (RM)" },
                    { value: "USD", label: "USD - UNITED STATES DOLLAR ($)" },
                    { value: "SGD", label: "SGD - SINGAPORE DOLLAR (S$)" },
                    { value: "EUR", label: "EUR - EURO (€)" },
                    { value: "GBP", label: "GBP - BRITISH POUND (£)" },
                  ]}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", padding: "12px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)" }}>
                      AUTOMATIC TAX DEDUCTION TAGGING
                    </span>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-secondary)" }}>
                      Auto-analyze ingested receipts for LHDN tax deductibility
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoTaxTag(!autoTaxTag)}
                    style={{
                      backgroundColor: autoTaxTag ? "var(--success)" : "var(--surface)",
                      color: autoTaxTag ? "var(--black)" : "var(--text-secondary)",
                      border: "1px solid var(--border-visible)",
                      fontFamily: "var(--font-data)",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    [{autoTaxTag ? "ENABLED" : "DISABLED"}]
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", padding: "12px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", color: "var(--text-display)" }}>
                      2-FACTOR TELEMETRY AUTHENTICATION
                    </span>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-secondary)" }}>
                      Require secondary authenticator token on sign-in
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    style={{
                      backgroundColor: twoFactorAuth ? "var(--success)" : "var(--surface)",
                      color: twoFactorAuth ? "var(--black)" : "var(--text-secondary)",
                      border: "1px solid var(--border-visible)",
                      fontFamily: "var(--font-data)",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    [{twoFactorAuth ? "PROTECTED" : "DISABLED"}]
                  </button>
                </div>

                <div style={{ backgroundColor: "var(--surface-raised)", border: "1px dashed var(--border-visible)", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>SHA-256 ENCRYPTION KEY PAIR</span>
                  <code style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)", wordBreak: "break-all" }}>
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </code>
                </div>
              </div>
            </div>

            {/* SUBSCRIPTION & BILLING PLAN */}
            <div className="dot-grid-subtle" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", gridColumn: "1 / -1" }}>
              <div style={{ borderBottom: "1px solid var(--border-visible)", paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.08em" }}>
                  [ SUBSCRIPTION &amp; BILLING PLAN ]
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                  CURRENT PERIOD: JULY 2026
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>CURRENT PLAN</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "var(--text-display)" }}>
                    COMMUNITY FREE TIER
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                    50 Receipts / Month • Basic OCR Ingestion • Single Workspace
                  </span>
                </div>

                <div style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>[ UPGRADE AVAILABLE ]</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "var(--text-display)" }}>
                      BUSINESS PRO TELEMETRY
                    </span>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                      Unlimited Receipts • Automated Tax Audits • Multi-User Workspace
                    </span>
                  </div>

                  <Link
                    href="/pricing"
                    style={{
                      backgroundColor: "var(--text-display)",
                      color: "var(--black)",
                      fontFamily: "var(--font-data)",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    [ UPGRADE TO BUSINESS PRO ]
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <TeamWorkspaceModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}

const heroBannerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "var(--space-md)", backgroundColor: "var(--surface)", border: "1px solid var(--border-visible)", borderRadius: "10px", flexWrap: "wrap", gap: "12px" };
const labelStyle: React.CSSProperties = { fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", display: "block", marginBottom: "4px", letterSpacing: "0.06em" };
const inputStyle: React.CSSProperties = { width: "100%", backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "6px", padding: "8px 12px", color: "var(--text-display)", fontFamily: "var(--font-data)", fontSize: "11px", outline: "none" };
const primaryBtnStyle: React.CSSProperties = { backgroundColor: "var(--text-display)", color: "var(--black)", border: "none", fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: "700", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", marginTop: "8px" };
