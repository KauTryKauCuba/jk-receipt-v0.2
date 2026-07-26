"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PixelParticleBackground from "../components/PixelParticleBackground";
import MatrixText from "../components/MatrixText";
import FontToggleButton from "../components/FontToggleButton";
import PWAInstallButton from "../components/PWAInstallButton";

export default function ReleaseNotesPage() {
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "light";
    }
    return false;
  });

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
    if (isLightMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [isLightMode]);

  const releases = [
    {
      version: "v0.2.0",
      date: "JULY 2026",
      status: "CURRENT PRODUCTION",
      badgeColor: "var(--success)",
      summary: "Major release introducing 3D Silver metallic receipt physics, interactive OCR demo sandbox, tax deduction estimator, inline telemetry review ledger, and mobile responsive optimization.",
      changes: [
        {
          category: "NEW FEATURE",
          text: "Interactive 3D Silver Metallic Receipt Slip featuring Operator Pass Card perspective tilt physics and real-time cursor specular glare reflection.",
        },
        {
          category: "NEW FEATURE",
          text: "Live OCR Demo Sandbox on landing page with sample merchant presets (Starbucks, Petronas, Apple Store, Teck Kee) and simulated optical scan logs.",
        },
        {
          category: "NEW FEATURE",
          text: "Interactive Tax Savings & Time Recovery Estimator with real-time sliders and preset shortcuts (Freelancer, SME, Enterprise).",
        },
        {
          category: "NEW FEATURE",
          text: "System Capability Benchmark Matrix evaluating Traditional Accounting vs. JEJAKU ARCHIVE v0.2 architecture.",
        },
        {
          category: "NEW FEATURE",
          text: "Dedicated Release Notes page (/release-notes) with footer navigation across Landing, Pricing, and Tech Stack pages.",
        },
        {
          category: "IMPROVEMENT",
          text: "Live Device Optical Camera Scanner & Dropzone powering sub-second AI OCR data extraction via Groq Qwen Vision reasoning engine.",
        },
        {
          category: "IMPROVEMENT",
          text: "Full-page side-by-side telemetry review layout replacing modal popups for seamless merchant, date, amount, and product line-item editing.",
        },
        {
          category: "MOBILE OPTIMIZATION",
          text: "Instant mobile sidebar collapse with zero layout flash, 100% hydration compliance, and responsive single-column telemetry card grid for phone viewports.",
        },
        {
          category: "DOCKER & VPS",
          text: "Standalone Docker deployment configuration with env file mapping for automated VPS hosting.",
        },
      ],
    },
    {
      version: "v0.1.5",
      date: "JUNE 2026",
      status: "STABLE",
      badgeColor: "var(--text-secondary)",
      summary: "Tax deduction engine enhancements, Schedule C claims categorizations, and CSV/JSON export tools.",
      changes: [
        {
          category: "NEW FEATURE",
          text: "Schedule C Tax Deduction categorization (Business, Tax Deductible, Household, Medical, Warranties).",
        },
        {
          category: "IMPROVEMENT",
          text: "P&L tax claim report generator with monthly breakdowns and expenditure ceiling metrics.",
        },
        {
          category: "SECURITY",
          text: "SHA-256 cryptographic hash logging for every telemetry archival transaction.",
        },
      ],
    },
    {
      version: "v0.1.0",
      date: "MAY 2026",
      status: "INITIAL RELEASE",
      badgeColor: "var(--text-disabled)",
      summary: "Initial public launch of JEJAKU Archival Telemetry Console built with Nothing Design System principles.",
      changes: [
        {
          category: "INITIAL LAUNCH",
          text: "Architected modern monochromatic UI system with ND Dot fonts, dot grid overlays, and dark/light theme toggle.",
        },
        {
          category: "CORE ENGINE",
          text: "Local SQLite encrypted storage repository and REST API endpoints for receipt indexing.",
        },
      ],
    },
  ];

  return (
    <div className="pixel-bg-pattern" style={{ minHeight: "100vh", width: "100%", position: "relative" }}>
      <PixelParticleBackground />
      
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--space-md)", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header Status Bar */}
        <header className="header" style={{ marginBottom: "var(--space-xl)" }}>
          <div className="header-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-display)" }}>
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
              <path d="M8 8h8" />
              <path d="M8 12h8" />
              <path d="M8 16h5" />
            </svg>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
              JEJAKU <span style={{ fontWeight: "400", color: "var(--text-secondary)" }}>RECEIPT</span>
            </span>
          </div>

          <div className="header-right">
            <Link href="/" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
              <span>[ ← RETURN HOME ]</span>
            </Link>
            <span style={{ color: "var(--border-visible)" }}>|</span>
            <Link href="/dashboard" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
              <span>[ DASHBOARD ]</span>
            </Link>
            <span style={{ color: "var(--border-visible)" }}>|</span>
            <PWAInstallButton />
            <span style={{ color: "var(--border-visible)" }}>|</span>
            <FontToggleButton />
            <span style={{ color: "var(--border-visible)" }}>|</span>
            <button onClick={toggleTheme} style={{ background: "none", border: "none", color: "var(--text-display)", fontFamily: "var(--font-data)", fontSize: "11px", cursor: "pointer" }}>
              <span>[ {isLightMode ? "DARK" : "LIGHT"} ]</span>
            </button>
          </div>
        </header>

        {/* PAGE HERO BANNER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "var(--space-xl)", borderBottom: "1px solid var(--border-visible)", paddingBottom: "var(--space-md)" }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--orange)", letterSpacing: "0.1em" }}>
            SYS // SYSTEM CHANGELOG &amp; RELEASE NOTES
          </span>
          <h1 style={{ fontFamily: "var(--font-body)", fontSize: "var(--display-lg)", fontWeight: "700", color: "var(--text-display)", margin: 0, letterSpacing: "-0.02em" }}>
            <MatrixText text="RELEASE NOTES" />
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--body-md)", color: "var(--text-secondary)", margin: 0 }}>
            Comprehensive version history, feature enhancements, and system architecture updates for JEJAKU Archival Console.
          </p>
        </div>

        {/* RELEASES LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1, marginBottom: "var(--space-2xl)" }}>
          {releases.map((rel, idx) => (
            <div
              key={idx}
              className="dot-grid-subtle"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-visible)",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {/* RELEASE CARD HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid var(--border-visible)", paddingBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "var(--text-display)" }}>
                    {rel.version}
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)" }}>
                    {"// "}RELEASED {rel.date}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: "10px",
                    fontWeight: "700",
                    color: rel.badgeColor,
                    border: `1px solid ${rel.badgeColor}`,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {rel.status}
                </span>
              </div>

              {/* SUMMARY */}
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-primary)", margin: 0, lineHeight: "1.5" }}>
                {rel.summary}
              </p>

              {/* CHANGES LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", borderRadius: "8px", padding: "14px" }}>
                {rel.changes.map((chg, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: "9px",
                        fontWeight: "700",
                        color: "var(--black)",
                        backgroundColor: "var(--text-display)",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        letterSpacing: "0.04em",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {chg.category}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)", lineHeight: "1.4" }}>
                      {chg.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid var(--border-visible)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "11px" }}>
          <span>© {new Date().getFullYear()} JEJAKU ARCHIVAL TELEMETRY CONSOLE</span>
          <Link href="/" style={{ color: "var(--success)", textDecoration: "none" }}>
            [ ← BACK TO HOME ]
          </Link>
        </footer>
      </div>
    </div>
  );
}
