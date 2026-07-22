"use client";

import React, { useState, useEffect } from "react";
import MatrixText from "./MatrixText";

interface PhoneStage {
  num: string;
  code: string;
  title: string;
  telemetry: string;
  statusPill: string;
}

const phoneStages: PhoneStage[] = [
  {
    num: "01",
    code: "CAPTURE",
    title: "DOCUMENT CAPTURE",
    telemetry: "SCANNING RECEIPT... OK",
    statusPill: "[ 1200 DPI SCANNER ACTIVE ]",
  },
  {
    num: "02",
    code: "PARSE",
    title: "LOCAL AI PARSING",
    telemetry: "PARSING MERCHANT... OK",
    statusPill: "[ VLM CONFIDENCE: 99.8% ]",
  },
  {
    num: "03",
    code: "CATEGORIZE",
    title: "AUTO CATEGORIZE",
    telemetry: "APPLYING TAX RULES... OK",
    statusPill: "[ RULES: 3 MATCHED ]",
  },
  {
    num: "04",
    code: "EXPORT",
    title: "SECURE EXPORT",
    telemetry: "SEALING LEDGER BLOCK... OK",
    statusPill: "[ SHA-256 BLOCK SEALED ]",
  },
];

export default function HowItWorksFlow() {
  const [activeStage, setActiveStage] = useState(0);
  const [hashTick, setHashTick] = useState("0x5F19");

  // Continuous animation loop travelling smoothly from Stage 0 -> 1 -> 2 -> 3
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % phoneStages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Shuffling hash text animation for stage 4
  useEffect(() => {
    if (activeStage !== 3) return;
    const hexChars = "0123456789ABCDEF";
    const hashInterval = setInterval(() => {
      let result = "0x";
      for (let i = 0; i < 4; i++) {
        result += hexChars[Math.floor(Math.random() * hexChars.length)];
      }
      setHashTick(result);
    }, 180);
    return () => clearInterval(hashInterval);
  }, [activeStage]);

  return (
    <section style={{ marginTop: "var(--space-3xl)", display: "flex", flexDirection: "column", gap: "var(--space-xl)", width: "100%" }}>
      {/* Section Header */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--border-visible)", paddingBottom: "var(--space-xs)" }}>
        <div>
          <span style={labelMonoStyle}>PIPELINE WORKFLOW DIAGRAM</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--display-md)", color: "var(--text-display)", margin: "4px 0 0 0", letterSpacing: "-0.02em" }}>
            <MatrixText text="HOW IT WORKS" />
          </h2>
        </div>
        <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--label)", color: "var(--text-disabled)", letterSpacing: "0.08em" }}>
          [ STAGE 0{activeStage + 1} / 04 : {phoneStages[activeStage].code} ]
        </span>
      </div>

      {/* Main Container: Fine Straight Dotted Lines Connecting 4 Phones */}
      <div style={canvasContainerStyle} className="dot-grid-subtle">
        
        {/* SVG Fine Straight Dotted Connecting Lines Layer */}
        <svg style={svgLayerStyle} viewBox="0 0 1000 360" preserveAspectRatio="none">
          {/* Line 1: Phone 1 -> Phone 2 */}
          <path
            d="M 210 210 L 370 210"
            fill="none"
            stroke={activeStage === 0 ? "var(--text-display)" : "rgba(255, 255, 255, 0.12)"}
            strokeWidth={activeStage === 0 ? "1.5" : "1"}
            strokeDasharray="2 3"
            style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
          />

          {/* Line 2: Phone 2 -> Phone 3 */}
          <path
            d="M 460 210 L 620 210"
            fill="none"
            stroke={activeStage === 1 ? "var(--text-display)" : "rgba(255, 255, 255, 0.12)"}
            strokeWidth={activeStage === 1 ? "1.5" : "1"}
            strokeDasharray="2 3"
            style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
          />

          {/* Line 3: Phone 3 -> Phone 4 */}
          <path
            d="M 710 210 L 870 210"
            fill="none"
            stroke={activeStage === 2 ? "var(--text-display)" : "rgba(255, 255, 255, 0.12)"}
            strokeWidth={activeStage === 2 ? "1.5" : "1"}
            strokeDasharray="2 3"
            style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
          />
        </svg>

        {/* 4 Phones Grid Row */}
        <div style={phoneGridRowStyle}>
          {phoneStages.map((stage, idx) => {
            const isActive = activeStage === idx;
            const isPassed = activeStage > idx;

            return (
              <div key={stage.num} style={phoneColumnWrapperStyle}>
                
                {/* Stage Header Badge */}
                <div style={phoneHeaderBadgeStyle}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: isActive ? "var(--accent)" : isPassed ? "var(--text-display)" : "var(--text-disabled)", fontWeight: "700" }}>
                    STAGE {stage.num} {"//"} {stage.code}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: "600", color: isActive ? "var(--text-display)" : "var(--text-primary)", textAlign: "center" }}>
                    {stage.title}
                  </span>
                </div>

                {/* Phone Frame */}
                <div style={phoneFrameStyle} className="dot-grid-subtle">
                  {/* Glass Reflection */}
                  <div style={glassReflectionStyle} />

                  {/* Dynamic Island Notch */}
                  <div style={dynamicIslandStyle}>
                    <div style={dynamicIslandCameraDotStyle} />
                  </div>

                  {/* Header Labels */}
                  <div style={phoneLabelTopLeftStyle}>[ TELEMETRY ]</div>
                  <div style={phoneLabelTopRightStyle}>40MS</div>

                  {/* Inner Receipt Viewport */}
                  <div style={receiptContainerStyle}>
                    
                    {/* PHONE 1: CAPTURE */}
                    {idx === 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", height: "100%", position: "relative" }}>
                        <div className="ocr-scan-line" style={laserBeamStyle} />
                        <div style={receiptHeaderStyle}>
                          <div style={barcodeMockStyle} />
                          <span style={receiptLabelStyle}>REC_2026</span>
                        </div>
                        <div style={receiptItemsContainerStyle}>
                          <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "70%", animationDelay: "0.2s" }} />
                          <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "50%", animationDelay: "0.6s" }} />
                          <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "60%", animationDelay: "1.0s" }} />
                          <div className="ocr-line-highlight" style={{ ...receiptLineStyle, width: "35%", animationDelay: "1.4s" }} />
                        </div>
                      </div>
                    )}

                    {/* PHONE 2: PARSE */}
                    {idx === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "2px" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--accent)" }}>[VENDOR]</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "7px", fontWeight: "700", color: "var(--text-display)" }}>JEJAKU</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", padding: "2px 3px", borderRadius: "2px" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "6px", color: "var(--text-primary)" }}>EXPRESSO</span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--text-display)" }}>$8.00</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.05)", padding: "2px 3px", borderRadius: "2px" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "6px", color: "var(--text-primary)" }}>PASTRY</span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--text-display)" }}>$4.50</span>
                        </div>
                        <div style={{ marginTop: "auto", borderTop: "1px solid var(--text-display)", paddingTop: "2px", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--text-secondary)" }}>TOTAL</span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "7px", fontWeight: "700", color: "var(--text-display)" }}>$12.50</span>
                        </div>
                      </div>
                    )}

                    {/* PHONE 3: CATEGORIZE */}
                    {idx === 2 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", height: "100%", justifyContent: "center" }}>
                        <div style={tagRowStyle}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--text-display)" }}>[01]</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "6.5px", fontWeight: "600", color: "var(--text-display)" }}>MEALS & EXPENSES</span>
                        </div>
                        <div style={{ ...tagRowStyle, borderColor: "var(--accent)" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--accent)" }}>[TAX]</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "6.5px", fontWeight: "600", color: "var(--text-primary)" }}>DEDUCTIBLE (100%)</span>
                        </div>
                        <div style={{ ...tagRowStyle, borderColor: "var(--success)" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--success)" }}>[WAR]</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "6.5px", fontWeight: "600", color: "var(--text-primary)" }}>WARRANTY: 24M</span>
                        </div>
                      </div>
                    )}

                    {/* PHONE 4: EXPORT */}
                    {idx === 3 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", height: "100%", justifyContent: "center" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--text-secondary)" }}>SHA-256</span>
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "6px", color: "var(--success)" }}>● SEALED</span>
                        </div>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: "7px", fontWeight: "700", color: "var(--accent)", letterSpacing: "0.05em", wordBreak: "break-all" }}>
                          {hashTick}
                        </span>
                        <div style={{ borderTop: "1px dashed var(--border)", paddingTop: "4px", display: "flex", justifyContent: "space-between", gap: "2px" }}>
                          <span style={fileTagStyle}>.CSV</span>
                          <span style={fileTagStyle}>.JSON</span>
                          <span style={{ ...fileTagStyle, borderColor: "var(--success)", color: "var(--success)" }}>SYNC</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Telemetry Stream */}
                  <div style={telemetryBoxStyle}>
                    <span className="telemetry-line" style={telemetryLineStyle}>
                      &gt; {stage.telemetry}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div style={statusOverlayStyle}>
                    <span style={statusTextStyle}>{stage.statusPill}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-visible)", paddingTop: "var(--space-sm)", width: "100%" }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "0.06em" }}>
            [ STRAIGHT DOTTED PIPELINE DATAFLOW ACTIVE ]
          </span>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.06em" }}>
            JEJAKU ARCHITECTURE
          </span>
        </div>

      </div>
    </section>
  );
}

// Styles
const labelMonoStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-secondary)",
  letterSpacing: "0.08em",
};

const canvasContainerStyle: React.CSSProperties = {
  position: "relative",
  border: "1px solid var(--border-visible)",
  borderRadius: "16px",
  padding: "var(--space-lg)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
  width: "100%",
  overflowX: "auto",
};

const svgLayerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
};

const phoneGridRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(160px, 1fr))",
  alignItems: "center",
  width: "100%",
  minWidth: "720px",
  gap: "var(--space-md)",
  zIndex: 2,
};

const phoneColumnWrapperStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-xs)",
  width: "100%",
};

const phoneHeaderBadgeStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1px",
};

// Scaled Phone Frame Styles
const phoneFrameStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "185px",
  height: "330px",
  marginTop: "10px",
  borderRadius: "24px",
  border: "6px solid var(--surface-raised)",
  outline: "1px solid var(--border-visible)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  transition: "all 0.3s ease-out",
  flexShrink: 0,
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
  top: "8px",
  width: "50px",
  height: "12px",
  backgroundColor: "var(--text-display)",
  borderRadius: "8px",
  border: "1px solid var(--border-visible)",
  zIndex: 11,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "4px",
  boxSizing: "border-box",
};

const dynamicIslandCameraDotStyle: React.CSSProperties = {
  width: "2px",
  height: "2px",
  borderRadius: "50%",
  backgroundColor: "var(--success)",
};

const phoneLabelTopLeftStyle: React.CSSProperties = {
  position: "absolute",
  top: "34px",
  left: "20px",
  fontFamily: "var(--font-data)",
  fontSize: "6px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const phoneLabelTopRightStyle: React.CSSProperties = {
  position: "absolute",
  top: "34px",
  right: "20px",
  fontFamily: "var(--font-data)",
  fontSize: "6px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const receiptContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "110px",
  height: "155px",
  backgroundColor: "var(--surface-raised)",
  border: "1px solid var(--border-visible)",
  borderRadius: "6px",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  overflow: "hidden",
  zIndex: 4,
};

const laserBeamStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "2px",
  background: "linear-gradient(to right, transparent, var(--success) 15%, var(--success) 85%, transparent)",
  boxShadow: "0 0 8px var(--success)",
  zIndex: 6,
  pointerEvents: "none",
};

const barcodeMockStyle: React.CSSProperties = {
  width: "40px",
  height: "5px",
  borderBottom: "1px dashed var(--text-secondary)",
  marginBottom: "2px",
};

const receiptHeaderStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "4px",
};

const receiptLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "5px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const receiptItemsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  flex: 1,
};

const receiptLineStyle: React.CSSProperties = {
  height: "2px",
  borderRadius: "1px",
  border: "1px solid var(--border)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

const telemetryBoxStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "48px",
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  alignItems: "flex-start",
  zIndex: 4,
};

const telemetryLineStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "6px",
  color: "var(--text-secondary)",
  letterSpacing: "0.05em",
};

const statusOverlayStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "18px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backgroundColor: "var(--surface-raised)",
  border: "1px solid var(--border-visible)",
  borderRadius: "6px",
  padding: "4px 8px",
  zIndex: 4,
};

const statusTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "6px",
  color: "var(--text-display)",
  letterSpacing: "0.05em",
};

const tagRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "3px 4px",
  border: "1px solid var(--border)",
  borderRadius: "3px",
  backgroundColor: "rgba(255,255,255,0.02)",
};

const fileTagStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "6px",
  padding: "1px 4px",
  border: "1px solid var(--border)",
  borderRadius: "2px",
  color: "var(--text-primary)",
};
