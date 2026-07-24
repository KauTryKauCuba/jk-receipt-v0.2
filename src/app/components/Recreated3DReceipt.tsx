"use client";

import React, { useState, useEffect, useRef } from "react";

interface PaperReceipt3DProps {
  merchant: string;
  amount: number;
  date: string;
  items: { description: string; qty: number; price: number }[];
  tax: number;
  subtotal?: number;
  receiptId?: string;
  autoSpin?: boolean;
}

export default function Recreated3DReceipt({
  merchant,
  amount,
  date,
  items,
  tax,
  subtotal,
  receiptId = "JK-R-8910",
  autoSpin = true,
}: PaperReceipt3DProps) {
  const [isSpinning, setIsSpinning] = useState(autoSpin);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (autoSpin) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [autoSpin]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current || isSpinning) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -22;
    const rotateY = ((x - centerX) / centerX) * 22;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setTilt({ rotateX, rotateY, glareX, glareY });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const triggerSpin = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 2200);
  };

  const calcSubtotal = subtotal || items.reduce((acc, it) => acc + it.price * it.qty, 0);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", margin: "6px 0" }}>
      {/* 3D SCENE PERSPECTIVE CONTAINER (EXACT OPERATOR PASS CARD BEHAVIOR) */}
      <div
        ref={sceneRef}
        className="mastercard-3d-scene"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: "1000px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        <div
          ref={cardRef}
          className={`mastercard-3d-card ${isSpinning ? "spinning" : !isHovering ? "idle-sway" : ""}`}
          style={{
            width: "100%",
            maxWidth: "340px",
            height: "auto",
            transformStyle: "preserve-3d",
            transition: isHovering ? "transform 0.08s ease-out, box-shadow 0.08s ease-out" : "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.6s ease",
            transform: isSpinning
              ? undefined
              : !isHovering
              ? undefined
              : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(16px)`,
            boxShadow: isHovering
              ? `${-tilt.rotateY * 0.8}px ${tilt.rotateX * 0.8}px 32px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.15)`
              : "0 12px 28px rgba(0, 0, 0, 0.6)",
            cursor: "grab",
            borderRadius: "14px",
          }}
        >
          {/* RECREATED RECEIPT SLIP WITH BRUSHED SILVER METALLIC BACKGROUND */}
          <div
            className="silver-card-face dot-grid-subtle"
            style={{
              position: "relative",
              width: "100%",
              minHeight: "340px",
              padding: "18px 16px",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontFamily: "'Space Mono', 'Courier New', monospace",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* DYNAMIC METALLIC GLARE OVERLAY LIKE OPERATOR PASS CARD */}
            {isHovering && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  borderRadius: "14px",
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)`,
                  mixBlendMode: "overlay",
                  zIndex: 10,
                }}
              />
            )}
            {/* RECEIPT HEADER */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.06em", color: "#111111" }}>
                {merchant || "99 SPEED MART SDN. BHD."}
              </span>
              <span style={{ fontSize: "9px", color: "#444444", letterSpacing: "0.08em" }}>
                REG NO: 200001816930 (519537-X)
              </span>
              <span style={{ fontSize: "9px", color: "#444444", letterSpacing: "0.05em" }}>
                TELEMETRY ID: {receiptId}
              </span>
            </div>

            {/* METADATA BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#333333", borderTop: "1px dashed rgba(0,0,0,0.3)", borderBottom: "1px dashed rgba(0,0,0,0.3)", padding: "4px 0", marginTop: "2px" }}>
              <span>DATE: {date}</span>
              <span>MODE: CASH/POS</span>
            </div>

            {/* ITEMIZATION LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "2px 0", flex: 1, overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontWeight: "700", color: "#444444", borderBottom: "1px solid rgba(0,0,0,0.15)", paddingBottom: "3px" }}>
                <span>ITEM DESCRIPTION</span>
                <span>TOTAL (MYR)</span>
              </div>

              {items && items.length > 0 ? (
                items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontWeight: "700", color: "#111111" }}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "210px" }}>
                        {it.description}
                      </span>
                      <span style={{ color: "#FF5C00" }}>{it.price.toFixed(2)}</span>
                    </div>
                    {it.qty > 1 && (
                      <span style={{ fontSize: "8px", color: "#555555", paddingLeft: "6px" }}>
                        @{it.qty} X {(it.price / it.qty).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
                  <span>POS PURCHASE ITEM</span>
                  <span style={{ color: "#FF5C00" }}>{amount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* TOTALS CALCULATION LEDGER */}
            <div style={{ borderTop: "1px dashed rgba(0,0,0,0.3)", paddingTop: "6px", display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#444444" }}>
                <span>SUB TOTAL</span>
                <span>{calcSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#444444" }}>
                <span>SST / TAX (6%)</span>
                <span>{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", borderTop: "1.5px solid #111111", paddingTop: "4px", marginTop: "1px" }}>
                <span>NET TOTAL</span>
                <span style={{ color: "#FF5C00" }}>{amount.toFixed(2)} MYR</span>
              </div>
            </div>

            {/* RECEIPT FOOTER & BARCODE */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", marginTop: "4px", borderTop: "1px dashed rgba(0,0,0,0.25)", paddingTop: "6px" }}>
              {/* SIMULATED BARCODE LINES */}
              <div style={{ display: "flex", gap: "2px", height: "22px", alignItems: "center" }}>
                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1].map((w, i) => (
                  <div key={i} style={{ width: `${w}px`, height: "100%", backgroundColor: "#111111" }} />
                ))}
              </div>
              <span style={{ fontSize: "8px", color: "#555555", letterSpacing: "0.12em" }}>
                * {receiptId}-VERIFIED-TELEMETRY *
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D SPIN BUTTON */}
      <button
        type="button"
        onClick={triggerSpin}
        style={{
          background: "none",
          border: "1px solid var(--border-visible)",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          padding: "4px 10px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span>🔄</span> [ RE-SPIN SILVER 3D RECEIPT ]
      </button>
    </div>
  );
}
