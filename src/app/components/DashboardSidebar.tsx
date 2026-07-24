"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FontToggleButton from "./FontToggleButton";
import SidebarPassPeekCard from "./SidebarPassPeekCard";

interface DashboardSidebarProps {
  activeNav: string;
  isScanning?: boolean;
  onTriggerScan?: () => void;
  onOpenTeamModal?: () => void;
}

export default function DashboardSidebar({
  activeNav,
  isScanning = false,
  onTriggerScan,
  onOpenTeamModal,
}: DashboardSidebarProps) {
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "light" || document.documentElement.classList.contains("light");
    }
    return false;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
    }
    return true;
  });

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    localStorage.setItem("theme", newMode ? "light" : "dark");
    if (newMode) {
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        setIsSidebarCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, [isLightMode]);

  return (
    <aside className="dashboard-sidebar dot-grid-subtle" style={{ ...sidebarStyle, width: isSidebarCollapsed ? "70px" : "250px" }}>
      {/* Sidebar Header */}
      <div className="dashboard-sidebar-header" style={sidebarHeaderStyle}>
        <Link href="/" className="logo-badge" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-display)", flexShrink: 0 }}
          >
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </svg>
          {!isSidebarCollapsed && (
            <span className="logo-text" style={{ fontFamily: "var(--font-data)", fontSize: "11px", letterSpacing: "0.08em", whiteSpace: "nowrap", color: "var(--text-display)", fontWeight: "700" }}>
              JEJAKU <span style={{ color: "var(--text-secondary)", fontWeight: "400" }}>RECEIPT</span>
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={sidebarCollapseBtnStyle}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Sidebar Nav Items */}
      <nav className="dashboard-sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 8px", flex: 1 }}>

        {/* WORKSPACE SELECTOR & ADD DOCUMENTS BUTTON */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 2px", marginBottom: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isSidebarCollapsed ? "center" : "space-between",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border-visible)",
              borderRadius: "8px",
              padding: "8px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: isSidebarCollapsed ? "center" : "flex-start", width: isSidebarCollapsed ? "100%" : "auto" }}>
              <svg className="sb-icon-workspace" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-secondary)" }}>
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
              </svg>
              {!isSidebarCollapsed && (
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", color: "var(--text-display)", letterSpacing: "0.06em" }}>
                  PERSONAL
                </span>
              )}
            </div>

            {!isSidebarCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74,158,92,0.4)", backgroundColor: "rgba(74,158,92,0.1)", padding: "1px 5px", borderRadius: "4px", letterSpacing: "0.06em", fontWeight: "700" }}>
                  FREE
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onTriggerScan}
            disabled={isScanning}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "100%",
              backgroundColor: "var(--text-display)",
              color: "var(--black)",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: isScanning ? "not-allowed" : "pointer",
            }}
          >
            <svg className="sb-icon-add-doc" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {!isSidebarCollapsed && (
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.06em" }}>
                {isScanning ? "[ SCANNING... ]" : "[ + ADD DOCUMENTS ]"}
              </span>
            )}
          </button>
        </div>

        {/* REUSABLE SIDEBAR OPERATOR PASS PEEK COMPONENT */}
        {!isSidebarCollapsed && <SidebarPassPeekCard />}

        {[
          {
            id: "overview",
            label: "OVERVIEW",
            href: "/dashboard",
            icon: (
              <svg className="sb-icon-overview" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            ),
          },
          {
            id: "documents",
            label: "DOCUMENTS",
            href: "/dashboard/documents",
            icon: (
              <svg className="sb-icon-documents" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            ),
          },
          {
            id: "months",
            label: "MONTHS",
            href: "/dashboard/months",
            icon: (
              <svg className="sb-icon-months" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
          },
          {
            id: "reports",
            label: "REPORTS",
            href: "/dashboard/reports",
            icon: (
              <svg className="sb-icon-reports" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line className="bar-3" x1="18" y1="20" x2="18" y2="10" />
                <line className="bar-2" x1="12" y1="20" x2="12" y2="4" />
                <line className="bar-1" x1="6" y1="20" x2="6" y2="14" />
              </svg>
            ),
          },
          {
            id: "mass_upload",
            label: "MASS UPLOAD",
            href: "#",
            icon: (
              <svg className="sb-icon-mass_upload" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path className="upload-arrow" d="M16 16l-4-4-4 4" />
                <path className="upload-arrow" d="M12 12v9" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            ),
          },
          {
            id: "team",
            label: "TEAM",
            href: "/dashboard/team",
            icon: (
              <svg className="sb-icon-team" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            id: "trash_bin",
            label: "TRASH BIN",
            href: "#",
            icon: (
              <svg className="sb-icon-trash_bin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            ),
          },
          {
            id: "audit_log",
            label: "AUDIT LOG",
            href: "/dashboard/audit-log",
            icon: (
              <svg className="sb-icon-audit_log" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            ),
          },
          {
            id: "account_settings",
            label: "ACCOUNT SETTINGS",
            href: "/dashboard/account-settings",
            icon: (
              <svg className="sb-icon-account_settings" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
          },
        ].map((item) => {
          const isActive = activeNav === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{
                ...sidebarNavItemStyle,
                backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                color: isActive ? "var(--success)" : "var(--text-secondary)",
                borderLeft: "3px solid transparent",
                justifyContent: isSidebarCollapsed ? "center" : "space-between",
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="sb-icon-wrapper" style={{ color: isActive ? "var(--success)" : "currentColor" }}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", letterSpacing: "0.06em", fontWeight: isActive ? "700" : "normal", color: isActive ? "var(--success)" : "inherit" }}>
                    [ {item.label} ]
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && "hasArrow" in item && (item as { hasArrow?: boolean }).hasArrow && (
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)" }}>
                  &gt;
                </span>
              )}
            </Link>
          );
        })}

        {/* UPGRADE NOW BUTTON */}
        <div style={{ padding: "8px 0", marginTop: "4px" }}>
          <Link
            href="/pricing"
            className="nav-link"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border-visible)",
              color: "var(--text-display)",
              borderRadius: "999px",
              padding: "8px 12px",
              textDecoration: "none",
            }}
          >
            {!isSidebarCollapsed && (
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)" }}>
                [ UPGRADE NOW ]
              </span>
            )}
          </Link>
        </div>

      </nav>

      {/* Sidebar Footer Controls */}
      <div className="dashboard-sidebar-footer" style={{ ...sidebarFooterStyle, flexDirection: isSidebarCollapsed ? "column" : "row" }}>
        {!isSidebarCollapsed ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={avatarDotStyle} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", color: "var(--text-display)" }}>
                ALDRIN_02
              </span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>
                ● ONLINE
              </span>
            </div>
          </div>
        ) : (
          <div style={avatarDotStyle} title="ALDRIN_02 (ONLINE)" />
        )}

        <div style={{ display: "flex", flexDirection: isSidebarCollapsed ? "column" : "row", gap: "8px", alignItems: "center" }}>
          <FontToggleButton />
          <button onClick={toggleTheme} style={themeToggleButtonStyle} title="Toggle Theme" suppressHydrationWarning>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <span>[</span>
              {isLightMode ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 3px" }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 3px" }}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              )}
              <span>]</span>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

const sidebarStyle: React.CSSProperties = { backgroundColor: "var(--surface)", borderRight: "1px solid var(--border-visible)", display: "flex", flexDirection: "column", transition: "width 0.2s ease", position: "sticky", top: 0, height: "100vh", zIndex: 10, flexShrink: 0 };
const sidebarHeaderStyle: React.CSSProperties = { padding: "14px 12px", borderBottom: "1px solid var(--border-visible)", display: "flex", alignItems: "center", justifyContent: "space-between" };
const sidebarCollapseBtnStyle: React.CSSProperties = { background: "none", border: "1px solid var(--border-visible)", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "11px", padding: "2px 6px", borderRadius: "4px", cursor: "pointer" };
const sidebarNavItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "6px", border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s ease" };
const sidebarFooterStyle: React.CSSProperties = { padding: "12px", borderTop: "1px solid var(--border-visible)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" };
const avatarDotStyle: React.CSSProperties = { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--success)", flexShrink: 0 };
const themeToggleButtonStyle: React.CSSProperties = { background: "none", border: "none", color: "var(--text-display)", fontFamily: "var(--font-data)", fontSize: "11px", cursor: "pointer" };
