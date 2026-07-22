"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "SELECT OPTION",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", width: "100%", position: "relative" }}>
      {label && <label style={labelStyle}>{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          backgroundColor: "var(--surface-raised)",
          border: isOpen ? "1px solid var(--success)" : "1px solid var(--border-visible)",
          borderRadius: isOpen ? "6px 6px 0 0" : "6px",
          padding: "9px 12px",
          color: "var(--text-display)",
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all 0.15s ease-out",
          boxShadow: isOpen ? "0 0 8px rgba(74,158,92,0.15)" : "none",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span style={{ color: "var(--success)" }}>[●]</span>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: "10px",
            color: isOpen ? "var(--success)" : "var(--text-secondary)",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            marginLeft: "8px",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </button>

      {/* Expanded Accordion Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "var(--surface)",
            border: "1px solid var(--success)",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            zIndex: 100,
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: "9px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: isSelected ? "rgba(74, 158, 92, 0.12)" : "transparent",
                  color: isSelected ? "var(--success)" : "var(--text-primary)",
                  fontFamily: "var(--font-data)",
                  fontSize: "11px",
                  fontWeight: isSelected ? "700" : "500",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "var(--surface-raised)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: isSelected ? "var(--success)" : "var(--text-disabled)", fontSize: "10px" }}>
                    {isSelected ? "[✓]" : "[ ]"}
                  </span>
                  {opt.label}
                </span>
                {isSelected && (
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)" }}>
                    ACTIVE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "9px",
  color: "var(--text-disabled)",
  display: "block",
  marginBottom: "4px",
  letterSpacing: "0.06em",
};
