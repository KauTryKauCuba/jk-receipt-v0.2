"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PWAInstallButton from "../components/PWAInstallButton";
import FontToggleButton from "../components/FontToggleButton";
import MatrixText from "../components/MatrixText";

interface StackItem {
  name: string;
  version: string;
  role: string;
  description: string;
  logo: React.ReactNode;
}

export default function TechStack() {
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

  const frontendStack: StackItem[] = [
    {
      name: "NEXT.JS",
      version: "16.2.10",
      role: "FRAMEWORK & ARCHITECTURE",
      description: "App Router, server-side pre-rendering (SSR), and Turbopack for compilation speed.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 180 180" fill="none">
          <mask id="next-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
            <circle cx="90" cy="90" r="90" fill="#FFFFFF" />
          </mask>
          <g mask="url(#next-mask)">
            <circle cx="90" cy="90" r="90" fill="var(--black)" stroke="var(--border-visible)" strokeWidth="4" />
            <path
              d="M149.508 157.52L69.142 54H54v72h14.4V72.936l66.902 85.836c4.686-3.882 8.974-8.243 12.825-13.018z"
              fill="url(#next-gradient)"
            />
            <rect x="115" y="54" width="14" height="72" fill="var(--text-display)" />
          </g>
          <defs>
            <linearGradient id="next-gradient" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--text-display)" />
              <stop offset="1" stopColor="var(--text-display)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      name: "REACT",
      version: "19.0.0",
      role: "COMPONENT ENGINE",
      description: "State synchronization, dynamic layout updates, and interactive live consoles.",
      logo: (
        <svg width="40" height="40" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="var(--text-display)" />
          <g stroke="var(--text-display)" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      ),
    },
    {
      name: "TYPESCRIPT",
      version: "5.7.3",
      role: "STATIC TYPE SECURITY",
      description: "Strict parameter validation, interface declarations, and static compiler assertions.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="8" fill="var(--black)" stroke="var(--border-visible)" strokeWidth="4" />
          <text
            x="85"
            y="85"
            fontFamily="var(--font-data)"
            fontSize="38"
            fontWeight="bold"
            fill="var(--text-display)"
            textAnchor="end"
          >
            TS
          </text>
        </svg>
      ),
    },
    {
      name: "VANILLA CSS & NOTHING",
      version: "3.0",
      role: "STYLING & IDENTITY",
      description: "Monochromatic palette, space typography, and dot-matrix visual elements for industrial premium layout.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
          <polygon points="50,10 90,25 80,85 50,95 20,85 10,25" stroke="var(--text-display)" strokeWidth="4" fill="none" />
          <circle cx="50" cy="50" r="4" fill="var(--accent)" />
        </svg>
      ),
    },
  ];

  const backendStack: StackItem[] = [
    {
      name: "POSTGRESQL",
      version: "16.0",
      role: "RELATIONAL STORAGE",
      description: "Enterprise relational database storing receipt transaction logs, OCR fields, and analytical metadata.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-display)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      ),
    },
    {
      name: "DRIZZLE KIT",
      version: "0.30.0",
      role: "DATABASE ORM / TOOLS",
      description: "Type-safe SQL schema declaration, migration generation, and direct database queries.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-display)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
        </svg>
      ),
    },
    {
      name: "VPS LINUX",
      version: "UBUNTU 24.04 LTS",
      role: "SELF HOSTED CLOUD",
      description: "Dedicated self-hosted container node managing OCR computation, API gateways, and web traffic.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-display)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
          <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
        </svg>
      ),
    },
  ];

  const intelligenceStack: StackItem[] = [
    {
      name: "OLLAMA",
      version: "0.1.48",
      role: "LOCAL INFERENCE RUNTIME",
      description: "Optimized LLM environment serving models directly on our secure hardware infrastructure.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-display)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      name: "LLAMA 1B",
      version: "META-LLAMA-3.2",
      role: "TEXT POST-PROCESSING LLM",
      description: "Highly efficient 1-Billion parameter language model executing OCR spelling correction and formatting.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-display)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6M9 13h6M9 17h3" />
        </svg>
      ),
    },
    {
      name: "MOONDREAM",
      version: "MOONDREAM-2",
      role: "VISION-LANGUAGE MODEL",
      description: "Tiny yet powerful VLM extracting structured key-value pairs directly from raw image inputs.",
      logo: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-display)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          <circle cx="12" cy="12" r="1" fill="var(--accent)" />
        </svg>
      ),
    },
  ];

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
              <span style={labelMonoStyle}>SYSTEM COMPONENTS</span>
            </div>
            <h1 style={heroTitleStyle}>
               <MatrixText text="STACK" />
             </h1>
            <p style={heroSubStyle}>TECHNOLOGY TELEMETRY</p>

            <div style={heroMetricsContainerStyle}>
              <div style={metricItemStyle}>
                <span style={metricLabelStyle}>TOTAL COMP.</span>
                <span style={metricValueStyle}>10</span>
              </div>
              <div style={metricItemStyle}>
                <span style={metricLabelStyle}>STABILITY</span>
                <span style={metricValueStyle}>99.9<span style={metricUnitStyle}>%</span></span>
              </div>
              <div style={metricItemStyle}>
                <span style={metricLabelStyle}>LICENSE</span>
                <span style={{ ...metricValueStyle, color: "var(--success)" }}>FREE</span>
              </div>
            </div>
          </section>

          {/* Right Column - Stack List */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)", width: "100%" }}>
            {/* FRONTEND */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <span style={labelMonoStyle}>01 / FRONTEND & DESIGN</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {frontendStack.map((item) => (
                  <div key={item.name} style={cardStyle} className="dot-grid-subtle">
                    <div style={cardHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                        {item.logo}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={cardTitleStyle}>{item.name}</span>
                          <span style={cardRoleStyle}>{item.role}</span>
                        </div>
                      </div>
                      <span style={cardVersionStyle}>{item.version}</span>
                    </div>
                    <p style={cardDescriptionStyle}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* BACKEND */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <span style={labelMonoStyle}>02 / DATA & INFRASTRUCTURE</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {backendStack.map((item) => (
                  <div key={item.name} style={cardStyle} className="dot-grid-subtle">
                    <div style={cardHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                        {item.logo}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={cardTitleStyle}>{item.name}</span>
                          <span style={cardRoleStyle}>{item.role}</span>
                        </div>
                      </div>
                      <span style={cardVersionStyle}>{item.version}</span>
                    </div>
                    <p style={cardDescriptionStyle}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* INTELLIGENCE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <span style={labelMonoStyle}>03 / MACHINE INTELLIGENCE</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {intelligenceStack.map((item) => (
                  <div key={item.name} style={cardStyle} className="dot-grid-subtle">
                    <div style={cardHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                        {item.logo}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={cardTitleStyle}>{item.name}</span>
                          <span style={cardRoleStyle}>{item.role}</span>
                        </div>
                      </div>
                      <span style={cardVersionStyle}>{item.version}</span>
                    </div>
                    <p style={cardDescriptionStyle}>{item.description}</p>
                  </div>
                ))}
              </div>
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
              <Link href="/tech-stack" className="nav-link" style={{ display: "inline-flex", alignItems: "center", color: "var(--success)" }}>
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
            <span style={labelMonoStyle}>© {new Date().getFullYear()} JK ARCHIVAL. TECHNOLOGY TELEMETRY VIEW.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Inline CSS Styles (consistent with home page)
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

const metricUnitStyle: React.CSSProperties = {
  fontSize: "var(--label)",
  color: "var(--text-secondary)",
  verticalAlign: "super",
  marginLeft: "2px",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--border-visible)",
  borderRadius: "12px",
  padding: "var(--space-lg)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
  backgroundColor: "var(--surface)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "var(--space-sm)",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--subheading)",
  fontWeight: "bold",
  color: "var(--text-display)",
};

const cardRoleStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const cardVersionStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--caption)",
  color: "var(--accent)",
  border: "1px solid var(--accent)",
  padding: "var(--space-2xs) var(--space-xs)",
  borderRadius: "4px",
};

const cardDescriptionStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--body-sm)",
  color: "var(--text-primary)",
  lineHeight: 1.6,
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
