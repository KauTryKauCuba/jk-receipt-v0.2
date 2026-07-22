"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PWAInstallButton from "../components/PWAInstallButton";
import FontToggleButton from "../components/FontToggleButton";
import MatrixText from "../components/MatrixText";

export default function Register() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!email) {
      setEmailError("EMAIL IDENTIFIER IS REQUIRED");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("INVALID EMAIL PROTOCOL");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("SECURITY KEY IS REQUIRED");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("SECURITY KEY MUST BE >= 6 CHARACTERS");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("CONFIRMATION KEY IS REQUIRED");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("SECURITY KEYS DO NOT MATCH");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) {
      setStatusMessage("[ REGISTRATION FAILED ]");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("[ COMPILING NEW OPERATOR PROFILE... ]");

    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage("[ PROFILE PROVISIONED. INITIALIZING ONBOARDING SEQUENCE... ]");
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1000);
    }, 1500);
  };

  const handleGoogleSignUp = () => {
    setIsSubmitting(true);
    setStatusMessage("[ RETRIEVING GOOGLE SECURE TOKEN... ]");
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage("[ PROFILE PROVISIONED. INITIALIZING ONBOARDING SEQUENCE... ]");
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1000);
    }, 1500);
  };

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
          <Link href="/pricing" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            <span>PRICING ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <Link href="/login" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            <span>LOGIN ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <Link href="/register" className="nav-link" style={{ display: "inline-flex", alignItems: "center", color: "var(--success)" }}>
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

      <div className="animate-slide-fade" style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
        <div style={cardStyle} className="dot-grid-subtle">
          <div style={cardHeaderStyle}>
            <span style={labelMonoStyle}>OPERATOR REGISTRY SYSTEM</span>
            <span style={badgeStyle}>PROVISION</span>
          </div>

          <h2 style={titleStyle}>
            <MatrixText text="REGISTER" />
          </h2>
          <p style={subStyle}>CREATE NEW TELEMETRY PROFILE</p>

          <form onSubmit={handleSubmit} style={formStyle} noValidate>
            <div style={inputGroupStyle}>
              <label style={inputLabelStyle}>[ EMAIL IDENTIFIER ]</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...inputStyle,
                  borderBottom: emailError ? "1px solid var(--accent)" : "1px solid var(--border-visible)"
                }}
                placeholder="USER@DOMAIN.SYS"
                disabled={isSubmitting}
              />
              {emailError && <span style={errorTextStyle}>* {emailError}</span>}
            </div>

            <div style={inputGroupStyle}>
              <label style={inputLabelStyle}>[ SECURITY KEY ]</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  borderBottom: passwordError ? "1px solid var(--accent)" : "1px solid var(--border-visible)"
                }}
                placeholder="••••••••••••"
                disabled={isSubmitting}
              />
              {passwordError && <span style={errorTextStyle}>* {passwordError}</span>}
            </div>

            <div style={inputGroupStyle}>
              <label style={inputLabelStyle}>[ CONFIRM SECURITY KEY ]</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  borderBottom: confirmPasswordError ? "1px solid var(--accent)" : "1px solid var(--border-visible)"
                }}
                placeholder="••••••••••••"
                disabled={isSubmitting}
              />
              {confirmPasswordError && <span style={errorTextStyle}>* {confirmPasswordError}</span>}
            </div>

            {statusMessage && (
              <div style={{
                ...statusMessageStyle,
                color: statusMessage.includes("PROVISIONED") || statusMessage.includes("RESOLVED") ? "var(--success)" : statusMessage.includes("FAILED") ? "var(--accent)" : "var(--text-primary)"
              }}>
                {statusMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...actionButtonStyle,
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "[ PROVISIONING... ]" : "INITIALIZE OPERATOR PROFILE"}
            </button>
          </form>

          <div style={googleDividerContainerStyle}>
            <div style={googleDividerLineStyle} />
            <span style={googleDividerTextStyle}>OR</span>
            <div style={googleDividerLineStyle} />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            style={{
              ...googleButtonStyle,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
            disabled={isSubmitting}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "8px", flexShrink: 0 }}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></svg>
            <span>[ CONNECT WITH GOOGLE ]</span>
          </button>

          <div style={footerLinkContainerStyle}>
            <span style={footerLinkTextStyle}>EXISTING OPERATOR?</span>
            <Link href="/login" style={footerLinkStyle}>
              [ SECURE LOGIN ]
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--border-visible)",
  borderRadius: "12px",
  padding: "var(--space-lg)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
  width: "100%",
  maxWidth: "440px",
  boxSizing: "border-box",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "var(--space-sm)",
};

const labelMonoStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  color: "var(--text-secondary)",
  textTransform: "uppercase",
};

const badgeStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-display)",
  border: "1px solid var(--border-visible)",
  padding: "var(--space-2xs) var(--space-xs)",
  borderRadius: "4px",
  letterSpacing: "0.08em",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--display-lg)",
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "var(--text-display)",
  margin: 0,
};

const subStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--subheading)",
  fontWeight: 300,
  lineHeight: 1.2,
  color: "var(--text-secondary)",
  marginTop: "var(--space-xs)",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-xs)",
};

const inputLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.06em",
  color: "var(--text-secondary)",
};

const inputStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  outline: "none",
  color: "var(--text-primary)",
  fontFamily: "var(--font-data)",
  fontSize: "var(--body-sm)",
  padding: "var(--space-sm) 0",
  width: "100%",
  letterSpacing: "0.05em",
};

const errorTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--accent)",
  letterSpacing: "0.04em",
  marginTop: "2px",
};

const statusMessageStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--caption)",
  letterSpacing: "0.05em",
  textAlign: "center",
  padding: "var(--space-xs)",
};

const actionButtonStyle: React.CSSProperties = {
  backgroundColor: "var(--text-display)",
  border: "none",
  color: "var(--black)",
  fontFamily: "var(--font-data)",
  fontSize: "13px",
  fontWeight: "bold",
  letterSpacing: "0.06em",
  padding: "12px 24px",
  borderRadius: "999px",
  width: "100%",
  transition: "opacity 0.2s ease",
};

const footerLinkContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "1px solid var(--border)",
  paddingTop: "var(--space-md)",
  flexWrap: "wrap",
  gap: "var(--space-xs)",
};

const footerLinkTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-disabled)",
};

const footerLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-display)",
  textDecoration: "none",
};

const googleDividerContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

const googleDividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: "1px",
  backgroundColor: "var(--border)",
};

const googleDividerTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-disabled)",
  margin: "0 10px",
};

const googleButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  border: "1px solid var(--border-visible)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-data)",
  fontSize: "13px",
  letterSpacing: "0.06em",
  padding: "12px 24px",
  borderRadius: "999px",
  width: "100%",
  transition: "all 0.2s ease",
};
