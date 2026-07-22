"use client";

import { useState, useEffect } from "react";

export type FontMode = "default" | "inter" | "jakarta";

export default function FontToggleButton() {
  const [fontMode, setFontMode] = useState<FontMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("font") as FontMode) || "default";
    }
    return "default";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-font", fontMode);
  }, [fontMode]);

  const cycleFont = () => {
    let nextFont: FontMode = "default";
    if (fontMode === "default") nextFont = "inter";
    else if (fontMode === "inter") nextFont = "jakarta";
    else if (fontMode === "jakarta") nextFont = "default";

    setFontMode(nextFont);
    localStorage.setItem("font", nextFont);
    document.documentElement.setAttribute("data-font", nextFont);
  };

  const fontTitle = {
    default: "Font: Space Grotesk (Default)",
    inter: "Font: Inter",
    jakarta: "Font: Plus Jakarta Sans",
  }[fontMode];

  return (
    <button
      onClick={cycleFont}
      title={`Active ${fontTitle}. Click to switch.`}
      suppressHydrationWarning
      className="nav-link"
      style={{
        background: "none",
        border: "none",
        color: "var(--text-display)",
        fontFamily: "var(--font-data)",
        fontSize: "var(--label)",
        letterSpacing: "0.08em",
        cursor: "pointer",
        padding: 0,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <span>[</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, margin: "0 4px" }}
      >
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
      <span>]</span>
    </button>
  );
}
