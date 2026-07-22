"use client";

import Link from "next/link";
import PWAInstallButton from "./PWAInstallButton";

interface DashboardNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isScanning?: boolean;
  onTriggerScan?: () => void;
  onOpenCamera?: () => void;
}

export default function DashboardNavbar({
  searchQuery,
  onSearchChange,
  isScanning = false,
  onTriggerScan,
  onOpenCamera,
}: DashboardNavbarProps) {
  return (
    <header style={topBarStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-visible)", borderRadius: "6px", padding: "6px 12px", backgroundColor: "var(--surface)", flex: "0 1 340px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="2" style={{ marginRight: "8px" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search receipts, merchants, ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-display)",
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              width: "100%",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <Link href="/" className="nav-link" style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          <span>[</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 3px" }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          <span>HOME ]</span>
        </Link>
        <Link href="/onboarding" className="nav-link" style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          <span>[</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 3px" }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          <span>ONBOARDING ]</span>
        </Link>
        <span style={dividerPipeStyle}>|</span>
        <PWAInstallButton />
        <span style={dividerPipeStyle}>|</span>
        <button
          type="button"
          onClick={onOpenCamera}
          disabled={isScanning}
          style={{
            backgroundColor: "var(--surface-raised)",
            color: "var(--text-display)",
            border: "1px solid var(--border-visible)",
            borderRadius: "999px",
            fontFamily: "var(--font-data)",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.06em",
            padding: "8px 14px",
            cursor: isScanning ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>[ CAMERA SCAN ]</span>
        </button>
        <button
          type="button"
          onClick={onTriggerScan}
          disabled={isScanning}
          style={{
            backgroundColor: "var(--text-display)",
            color: "var(--black)",
            border: "none",
            borderRadius: "999px",
            fontFamily: "var(--font-data)",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.06em",
            padding: "8px 18px",
            cursor: isScanning ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isScanning ? (
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          <span>{isScanning ? "[ SCANNING... ]" : "[ + UPLOAD FILE ]"}</span>
        </button>
      </div>
    </header>
  );
}

const topBarStyle: React.CSSProperties = { padding: "12px 16px", borderBottom: "1px solid var(--border-visible)", backgroundColor: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", position: "sticky", top: 0, zIndex: 5 };
const dividerPipeStyle: React.CSSProperties = { color: "var(--border-visible)", fontSize: "10px", userSelect: "none" };
