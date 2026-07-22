"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PWAInstallButton from "./components/PWAInstallButton";
import FontToggleButton from "./components/FontToggleButton";
import MatrixText from "./components/MatrixText";
import HowItWorksFlow from "./components/HowItWorksFlow";
import PixelParticleBackground from "./components/PixelParticleBackground";

export default function Home() {
  const [isLightMode, setIsLightMode] = useState(false);

  // Handle Theme Toggle
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
    <div className="pixel-bg-pattern" style={{ minHeight: "100vh", width: "100%", position: "relative" }}>
      <PixelParticleBackground />
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
          <Link href="/" className="nav-link" style={{ display: "inline-flex", alignItems: "center", color: "var(--success)" }}>
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
      <main className="main-grid" style={{ marginBottom: "var(--space-xl)", alignItems: "center" }}>
        {/* Asymmetric Hero section */}
        <section style={heroSectionStyle}>
          <div style={heroLabelContainerStyle}>
            <span style={labelMonoStyle}>TELEMETRY INSTRUMENT</span>
          </div>
          <h1 style={heroTitleStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25em" }}>
              <MatrixText text="RECEIPT" />
              <MatrixText text="SCANNER" delay={250} />
            </div>
          </h1>
          <p style={heroSubStyle}>RECEIPT ARCHIVE</p>

          <div style={heroMetricsContainerStyle}>
            <div style={metricItemStyle}>
              <span style={metricLabelStyle}>SCAN ACCURACY</span>
              <span style={metricValueStyle}>99.8<span style={metricUnitStyle}>%</span></span>
            </div>
            <div style={metricItemStyle}>
              <span style={metricLabelStyle}>OCR PROCESSING</span>
              <span style={metricValueStyle}>0.4<span style={metricUnitStyle}>S</span></span>
            </div>
            <div style={metricItemStyle}>
              <span style={metricLabelStyle}>UPLINK STATE</span>
              <span style={{ ...metricValueStyle, color: "var(--success)" }}>OK</span>
            </div>
          </div>
        </section>

        {/* Phone Scanning Mockup Section */}
        <section style={phoneSectionStyle}>
          <div style={phoneFrameStyle} className="dot-grid-subtle scrolling-grid">
            {/* Dynamic Island (iPhone 17 style) */}
            <div style={dynamicIslandStyle}>
              <div style={dynamicIslandCameraDotStyle} />
            </div>

            {/* Glass reflection overlay */}
            <div style={glassReflectionStyle} />

            {/* Viewfinder Parameters */}
            <span style={phoneLabelTopLeftStyle}>[ TELEMETRY: ACTIVE ]</span>
            <span style={phoneLabelTopRightStyle}>LATENCY: 40MS</span>
            
            {/* Mockup Receipt container */}
            <div style={receiptContainerStyle}>
              {/* Refined gradient laser beam */}
              <div className="scanner-laser" style={laserBeamStyle} />

              <div style={receiptHeaderStyle}>
                <div style={barcodeMockStyle} />
                <span style={receiptLabelStyle}>REC_2026_0982</span>
              </div>
              
              <div style={receiptItemsContainerStyle}>
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "85%", animationDelay: "0s" }} />
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "60%", animationDelay: "0.5s" }} />
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "75%", animationDelay: "1.0s" }} />
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "40%", animationDelay: "1.5s" }} />
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "80%", animationDelay: "2.0s" }} />
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "55%", animationDelay: "2.5s" }} />
              </div>

              <div style={receiptFooterStyle}>
                <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "90%", height: "4px", backgroundColor: "var(--text-display)", animationDelay: "3.0s" }} />
              </div>
            </div>

            {/* Running Telemetry Stream Logs */}
            <div style={telemetryBoxStyle}>
              <span className="telemetry-line" style={{ ...telemetryLineStyle, animationDelay: "0s" }}>&gt; PARSING MERCHANT... OK</span>
              <span className="telemetry-line" style={{ ...telemetryLineStyle, animationDelay: "0.8s" }}>&gt; EXTRACTION ACCURACY: 99.8%</span>
              <span className="telemetry-line" style={{ ...telemetryLineStyle, animationDelay: "1.6s" }}>&gt; HASH: SHA256_0x5F19</span>
            </div>

            {/* Status Overlay */}
            <div style={statusOverlayStyle}>
              <span style={statusTextStyle}>[ COMPILING LEDGER BLOCK ]</span>
              <div className="ocr-pulse" style={blinkingDotStyle} />
            </div>
          </div>
        </section>
      </main>

      {/* How It Works Interactive Flow Section */}
      <HowItWorksFlow />

      {/* System Capabilities Section */}
      <section style={{ marginTop: "var(--space-3xl)", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
        <div style={{ borderBottom: "1px solid var(--border-visible)", paddingBottom: "var(--space-xs)" }}>
          <span style={labelMonoStyle}>SYSTEM CAPABILITIES & ARCHITECTURE</span>
        </div>
        <div className="stack-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={capabilityCardStyle} className="dot-grid-subtle">
            <span style={capabilityNumberStyle}>01 // PRE-ACCOUNTING</span>
            <h3 style={capabilityTitleStyle}>AI RECEIPT EXTRACTION</h3>
            <p style={capabilityDescStyle}>
              Automated OCR & multi-item extraction for merchant identities, tax breakdowns, email forwarding intake, and multi-currency exchange conversion.
            </p>
          </div>
          <div style={capabilityCardStyle} className="dot-grid-subtle">
            <span style={capabilityNumberStyle}>02 // TAX OPTIMIZATION</span>
            <h3 style={capabilityTitleStyle}>TAX DEDUCTION ENGINE</h3>
            <p style={capabilityDescStyle}>
              Instant tax-ready P&L reports, auto-categorization for Schedule C claims, and direct synchronization with QuickBooks, Xero, or CSV exports.
            </p>
          </div>
          <div style={capabilityCardStyle} className="dot-grid-subtle">
            <span style={capabilityNumberStyle}>03 // AUDIT TRAIL LOGS</span>
            <h3 style={capabilityTitleStyle}>IMMUTABLE SECURITY LOGS</h3>
            <p style={capabilityDescStyle}>
              Cryptographic SHA-256 telemetry logging for every receipt scan, expense category override, and export operation across your organization.
            </p>
          </div>
          <div style={capabilityCardStyle} className="dot-grid-subtle">
            <span style={capabilityNumberStyle}>04 // TEAM COLLABORATION</span>
            <h3 style={capabilityTitleStyle}>ACCOUNTANT PERMISSIONS</h3>
            <p style={capabilityDescStyle}>
              Multi-user workspace management with role-based access control (RBAC), team expense submission approvals, and accountant read-only access.
            </p>
          </div>
        </div>
      </section>

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
            <Link href="/pricing" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
              <span>[</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              <span>PRICING ]</span>
            </Link>
          </div>
          <span style={labelMonoStyle}>© {new Date().getFullYear()} JK ARCHIVAL. DESIGN INSPIRED BY NOTHING.</span>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}

// Inline CSS Styles (Technical, layout-driven, no Tailwind config)
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "var(--space-md)",
  position: "relative",
  zIndex: 1,
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

const labelMonoStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  color: "var(--text-secondary)",
  textTransform: "uppercase",
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

const metricUnitStyle: React.CSSProperties = {
  fontSize: "var(--label)",
  color: "var(--text-secondary)",
  verticalAlign: "super",
  marginLeft: "2px",
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

const capabilityCardStyle: React.CSSProperties = {
  border: "1px solid var(--border-visible)",
  borderRadius: "12px",
  padding: "var(--space-lg)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-sm)",
  textAlign: "left",
};

const capabilityNumberStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--accent)",
  letterSpacing: "0.08em",
};

const capabilityTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--subheading)",
  fontWeight: "bold",
  color: "var(--text-display)",
  margin: 0,
};

const capabilityDescStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--body-sm)",
  color: "var(--text-primary)",
  lineHeight: 1.6,
  margin: 0,
};

const phoneSectionStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "var(--space-xl)",
  width: "100%",
};

const phoneFrameStyle: React.CSSProperties = {
  position: "relative",
  width: "270px",
  height: "480px",
  borderRadius: "36px",
  border: "10px solid var(--surface-raised)",
  outline: "1px solid var(--border-visible)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const glassReflectionStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)",
  pointerEvents: "none",
  zIndex: 10,
};

const dynamicIslandStyle: React.CSSProperties = {
  position: "absolute",
  top: "14px",
  width: "75px",
  height: "18px",
  backgroundColor: "var(--text-display)",
  borderRadius: "10px",
  border: "1px solid var(--border-visible)",
  zIndex: 11,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "6px",
  boxSizing: "border-box",
};

const dynamicIslandCameraDotStyle: React.CSSProperties = {
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  backgroundColor: "var(--success)",
};



const phoneLabelTopLeftStyle: React.CSSProperties = {
  position: "absolute",
  top: "52px",
  left: "40px",
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const phoneLabelTopRightStyle: React.CSSProperties = {
  position: "absolute",
  top: "52px",
  right: "40px",
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const receiptContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "150px",
  height: "230px",
  backgroundColor: "var(--surface-raised)",
  border: "1px solid var(--border-visible)",
  borderRadius: "8px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  zIndex: 5,
};

const laserBeamStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  width: "100%",
  height: "2px",
  background: "linear-gradient(to right, transparent, var(--success) 15%, var(--success) 85%, transparent)",
  boxShadow: "0 0 10px var(--success)",
  zIndex: 6,
  pointerEvents: "none",
};

const barcodeMockStyle: React.CSSProperties = {
  width: "60px",
  height: "8px",
  borderBottom: "1px dashed var(--text-secondary)",
  marginBottom: "4px",
};

const receiptHeaderStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "8px",
};

const receiptLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const receiptItemsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
};

const receiptLineStyle: React.CSSProperties = {
  height: "3px",
  borderRadius: "2px",
  border: "1px solid var(--border)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

const receiptFooterStyle: React.CSSProperties = {
  borderTop: "1px solid var(--border)",
  paddingTop: "6px",
};

const telemetryBoxStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  width: "150px",
  marginTop: "12px",
  zIndex: 5,
};

const telemetryLineStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const statusOverlayStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "32px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "var(--black)",
  border: "1px solid var(--border-visible)",
  borderRadius: "6px",
  padding: "6px 12px",
  zIndex: 5,
};

const statusTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-primary)",
  letterSpacing: "0.06em",
};

const blinkingDotStyle: React.CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: "var(--success)",
};
