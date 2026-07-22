"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PWAInstallButton from "../components/PWAInstallButton";
import FontToggleButton from "../components/FontToggleButton";
import MatrixText from "../components/MatrixText";

export default function Pricing() {
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    localStorage.setItem("theme", newMode ? "light" : "dark");
    if (newMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme === "light";
    if (isLight) {
      requestAnimationFrame(() => {
        setIsLightMode(true);
      });
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  return (
    <div style={containerStyle}>
      {/* Header Status Bar */}
      <header className="header">
        <div className="header-left">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-display)" }}
          >
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </svg>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)", marginRight: "var(--space-xs)" }}>
            JEJAKU <span style={{ fontWeight: "400", color: "var(--text-secondary)" }}>RECEIPT</span>
          </span>
        </div>
        <div className="header-right">
          <Link href="/" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span>HOME ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <Link href="/dashboard" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
            <span>DASHBOARD ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <Link href="/onboarding" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            <span>ONBOARDING ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <Link href="/login" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            <span>LOGIN ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <Link href="/register" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
            <span>REGISTER ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <PWAInstallButton />
          <span style={dividerPipeStyle}>|</span>
          <FontToggleButton />
          <span style={dividerPipeStyle}>|</span>
          <button onClick={toggleTheme} style={{ ...themeToggleButtonStyle, display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            {isLightMode ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            )}
            <span>]</span>
          </button>
        </div>
      </header>

      <div className="animate-slide-fade" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Main Content Grid */}
        <main className="main-grid">
          {/* Left Column - Asymmetric Hero */}
          <section style={heroSectionStyle}>
            <div style={heroLabelContainerStyle}>
              <span style={labelMonoStyle}>ACQUISITION MODEL</span>
            </div>
            <h1 style={heroTitleStyle}>
              <MatrixText text="PRICING" />
            </h1>
            <p style={heroSubStyle}>COMMUNITY INDEX</p>

            <div style={heroMetricsContainerStyle}>
              <div style={metricItemStyle}>
                <span style={metricLabelStyle}>PLAN</span>
                <span style={metricValueStyle}>FREE</span>
              </div>
              <div style={metricItemStyle}>
                <span style={metricLabelStyle}>COST</span>
                <span style={metricValueStyle}>0.00</span>
              </div>
              <div style={metricItemStyle}>
                <span style={metricLabelStyle}>SUPPORT</span>
                <span style={{ ...metricValueStyle, color: "var(--success)" }}>PUBLIC</span>
              </div>
            </div>
          </section>

          {/* Right Column - Pricing Card */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)", alignItems: "center", width: "100%" }}>
            {/* COMMUNITY PLAN */}
            <div style={pricingCardStyle} className="dot-grid-subtle">
              <div style={pricingHeaderStyle}>
                <span style={pricingPlanNameStyle}>COMMUNITY PLAN</span>
                <span style={freeTagStyle}>FREE FOR ALL</span>
              </div>

              <div style={priceContainerStyle}>
                <span style={priceSymbolStyle}>$</span>
                <span style={priceValueStyle}>0.00</span>
                <span style={pricePeriodStyle}>LIFETIME</span>
              </div>

              <p style={pricingDescriptionStyle}>
                Our core scanning, parsing, and archival intelligence pipeline is self-hosted, open-source, and free for everyone. Deploy locally on your own hardware or private VPS nodes.
              </p>

              <div style={featuresDividerStyle}></div>

              <div style={featuresListStyle}>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>LOCAL AI VISION OCR (MOONDREAM-2)</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>LOCAL AI SPELLING ENGINE (LLAMA 1B)</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>POSTGRESQL ARCHIVE STORAGE</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>DRIZZLE KIT SCHEMA MIGRATIONS</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>SELF-HOSTED LINUX VPS COMPATIBILITY</span>
                </div>
              </div>

              <div style={featuresDividerStyle}></div>

              <button
                onClick={() => alert("COMMUNITY EDITION CONFIG: READY TO DEPLOY via 'npm run dev'")}
                style={actionButtonStyle}
              >
                DEPLOY INSTANCE
              </button>
            </div>

            {/* TEAM PLAN */}
            <div style={pricingCardStyle} className="dot-grid-subtle">
              <div style={pricingHeaderStyle}>
                <span style={pricingPlanNameStyle}>TEAM PLAN</span>
                <span style={freeTagStyle}>FREE FOR TEAMS</span>
              </div>

              <div style={priceContainerStyle}>
                <span style={priceSymbolStyle}>$</span>
                <span style={priceValueStyle}>0.00</span>
                <span style={pricePeriodStyle}>LIFETIME</span>
              </div>

              <p style={pricingDescriptionStyle}>
                Tailored for collaborative financial engineering teams. Coordinate multiple ledger nodes, run shared schemas, and centralize transaction archiving at scale.
              </p>

              <div style={featuresDividerStyle}></div>

              <div style={featuresListStyle}>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>SHARED DATABASE & MULTI-USER ACCESS</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>MULTI-NODE TELEMETRY SYNCHRONIZATION</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>ALL COMMUNITY PLAN CAPABILITIES</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>CENTRAL LEDGER EXPORTS</span>
                </div>
                <div style={featureItemStyle}>
                  <span style={featureCheckStyle}>[x]</span>
                  <span style={featureTextStyle}>UNLIMITED SEATS & AGENT UPLINKS</span>
                </div>
              </div>

              <div style={featuresDividerStyle}></div>

              <button
                onClick={() => alert("TEAM EDITION CONFIG: INITIALIZING DEPLOYMENT BUILD")}
                style={actionButtonStyle}
              >
                DEPLOY TEAM INSTANCE
              </button>
            </div>
          </section>
        </main>

        {/* Specifications list (using clean divider style) */}
        <footer style={footerSpecsSectionStyle}>
          <div style={specsGridStyle}>
            <div style={specItemStyle}>
              <span style={specLabelStyle}>OPTICS</span>
              <p style={specValueTextStyle}>1200 DPI monochromatic contact image sensor array.</p>
            </div>
            <div style={specItemStyle}>
              <span style={specLabelStyle}>INTEGRATION</span>
              <p style={specValueTextStyle}>Direct ledger exports, automatic OCR categorizations, custom metadata rules.</p>
            </div>
            <div style={specItemStyle}>
              <span style={specLabelStyle}>SPEED</span>
              <p style={specValueTextStyle}>Sub-second character localization and OCR field extraction pipeline.</p>
            </div>
          </div>
          <div style={bottomCopyrightStyle}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
              <Link href="/tech-stack" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
                <span>[</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                <span>TECH STACK ]</span>
              </Link>
              <span style={dividerPipeStyle}>|</span>
              <Link href="/pricing" className="nav-link" style={{ display: "inline-flex", alignItems: "center", color: "var(--success)" }}>
                <span>[</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                <span>PRICING ]</span>
              </Link>
            </div>
            <span style={labelMonoStyle}>© {new Date().getFullYear()} JK ARCHIVAL. COMMUNITY LICENSE telemetry.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Inline CSS Styles (consistent with other pages)
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "var(--space-md)",
};


const dividerPipeStyle: React.CSSProperties = {
  color: "var(--border-visible)",
};

const themeToggleButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--text-display)",
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  cursor: "pointer",
  padding: 0,
};

const labelMonoStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  color: "var(--text-secondary)",
  textTransform: "uppercase",
};

const heroSectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingTop: "var(--space-xl)",
};

const heroLabelContainerStyle: React.CSSProperties = {
  border: "1px solid var(--border-visible)",
  padding: "var(--space-xs) var(--space-sm)",
  borderRadius: "4px",
  marginBottom: "var(--space-md)",
};

const heroTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--display-xl)",
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  color: "var(--text-display)",
  margin: 0,
};

const heroSubStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--display-md)",
  fontWeight: 300,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  color: "var(--text-primary)",
  marginBottom: "var(--space-2xl)",
};

const heroMetricsContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "var(--space-xl)",
  marginTop: "auto",
  flexWrap: "wrap",
};

const metricItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--caption)",
  letterSpacing: "0.04em",
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  marginBottom: "var(--space-xs)",
};

const metricValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--heading)",
  fontWeight: 700,
  color: "var(--text-display)",
};

const pricingCardStyle: React.CSSProperties = {
  border: "1px solid var(--border-visible)",
  borderRadius: "12px",
  padding: "var(--space-lg)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
  width: "100%",
  maxWidth: "480px",
  boxSizing: "border-box",
  textAlign: "left",
};

const pricingHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "var(--space-sm)",
};

const pricingPlanNameStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--subheading)",
  fontWeight: "bold",
  color: "var(--text-display)",
};

const freeTagStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--accent)",
  border: "1px solid var(--accent)",
  padding: "var(--space-2xs) var(--space-xs)",
  borderRadius: "4px",
  letterSpacing: "0.08em",
};

const priceContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--space-2xs)",
};

const priceSymbolStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--heading)",
  color: "var(--orange)",
  fontWeight: "bold",
};

const priceValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--display-xl)",
  color: "var(--orange)",
  fontWeight: 700,
  lineHeight: 1,
};

const pricePeriodStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-secondary)",
  letterSpacing: "0.08em",
  marginLeft: "var(--space-xs)",
};

const pricingDescriptionStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--body-sm)",
  color: "var(--text-primary)",
  lineHeight: 1.6,
};

const featuresDividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "var(--border)",
  width: "100%",
};

const featuresListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
};

const featureItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-md)",
};

const featureCheckStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--caption)",
  color: "var(--success)",
  fontWeight: "bold",
};

const featureTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--caption)",
  color: "var(--text-primary)",
  letterSpacing: "0.04em",
};

const actionButtonStyle: React.CSSProperties = {
  backgroundColor: "var(--text-display)",
  border: "none",
  color: "var(--black)",
  fontFamily: "var(--font-data)",
  fontSize: "13px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "14px 24px",
  borderRadius: "999px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
  transition: "opacity 0.2s ease",
};

const footerSpecsSectionStyle: React.CSSProperties = {
  marginTop: "var(--space-3xl)",
  borderTop: "1px solid var(--border-visible)",
  paddingTop: "var(--space-2xl)",
};

const specsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "var(--space-2xl)",
  marginBottom: "var(--space-3xl)",
};

const specItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "var(--space-sm)",
};

const specLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  color: "var(--text-secondary)",
  borderBottom: "1px solid var(--accent)",
  paddingBottom: "2px",
};

const specValueTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--body-sm)",
  color: "var(--text-primary)",
  lineHeight: 1.6,
};

const bottomCopyrightStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderTop: "1px solid var(--border)",
  paddingTop: "var(--space-lg)",
  color: "var(--text-disabled)",
};
