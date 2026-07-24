"use client";

import React, { useState, useEffect, useRef } from "react";

interface Receipt3DPassCardProps {
  receiptId: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  items: { description: string; qty: number; price: number }[];
  tax: number;
  fileName: string;
  previewUrl?: string;
  autoSpin?: boolean;
}

export default function Receipt3DPassCard({
  receiptId,
  merchant,
  amount,
  date,
  category,
  items,
  tax,
  fileName,
  previewUrl,
  autoSpin = true,
}: Receipt3DPassCardProps) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSpinning, setIsSpinning] = useState(autoSpin);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (autoSpin) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoSpin]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isSpinning) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -18;
    const rotateY = ((x - centerX) / centerX) * 18;
    setTilt({ rotateX, rotateY });
    setIsHovering(true);
  };

  const handleCardMouseLeave = () => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const triggerSpin = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 2000);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div className="mastercard-3d-scene" style={{ padding: "4px 0" }}>
        <div
          ref={cardRef}
          className={`mastercard-3d-card ${isSpinning ? "spinning" : !isHovering ? "idle-sway" : ""} ${isCardFlipped ? "is-flipped" : ""}`}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          onClick={() => setIsCardFlipped((prev) => !prev)}
          style={
            isSpinning || !isHovering
              ? undefined
              : {
                  transform: isCardFlipped
                    ? `rotateY(180deg) rotateX(${tilt.rotateX}deg) rotateY(${-tilt.rotateY}deg)`
                    : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: "transform 0.1s ease-out",
                }
          }
        >
          {/* FRONT FACE: DIGITAL TELEMETRY PASS */}
          <div className="mastercard-face dot-grid-subtle" style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--orange)" }}>
            {/* Top row: Brand & Encryption verification */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                </svg>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", color: "var(--orange)" }}>
                  TELEMETRY RECEIPT // {receiptId}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--success)", border: "1px solid rgba(74, 158, 92, 0.4)", padding: "1px 5px", borderRadius: "3px" }}>
                  ● OPTICAL VERIFIED
                </span>
              </div>
            </div>

            {/* Middle row: Receipt Photo + Merchant Name + Total Amount */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-visible)",
                  backgroundColor: "var(--black)",
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                }}
              >
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={previewUrl} alt="Receipt Slip" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", color: "var(--text-disabled)" }}>
                    SLIP
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", letterSpacing: "0.08em" }}>
                  MERCHANT TELEMETRY
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: "700", color: "var(--text-display)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {merchant || "MERCHANT STORE"}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: "700", color: "var(--orange)" }}>
                    {amount.toFixed(2)}
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-secondary)" }}>MYR</span>
                </div>
              </div>
            </div>

            {/* Bottom row: Date, Category & Items count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px dashed var(--border)", paddingTop: "4px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "var(--text-disabled)" }}>DATE</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-primary)" }}>{date}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "var(--text-disabled)" }}>CATEGORY</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--interactive)" }}>{category.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>
                  {items.length} ITEMS DETECTED
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-display)", border: "1px solid var(--border-visible)", padding: "1px 4px", borderRadius: "3px" }}>
                  [ FLIP 3D ]
                </span>
              </div>
            </div>
          </div>

          {/* BACK FACE: ITEMIZATION LEDGER & SST READOUT */}
          <div className="mastercard-face mastercard-face-back dot-grid-subtle" style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--border-visible)", padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-visible)", paddingBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: "700", color: "var(--success)", letterSpacing: "0.08em" }}>
                [ PARSED LINE ITEMS LEDGER ]
              </span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "var(--text-disabled)" }}>
                ORIGIN: {fileName}
              </span>
            </div>

            {/* Extracted Product Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", margin: "6px 0", flex: 1, overflowY: "auto", maxHeight: "100px" }}>
              {items.length > 0 ? (
                items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-primary)" }}>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
                      • {it.description} <span style={{ color: "var(--text-disabled)" }}>x{it.qty}</span>
                    </span>
                    <span style={{ color: "var(--orange)", fontWeight: "700" }}>{it.price.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)" }}>NO LINE ITEMS RECORDED</span>
              )}
            </div>

            {/* Back Card Footer: SST Tax & Flip Hint */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border-visible)", paddingTop: "4px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "8px", color: "var(--text-disabled)" }}>
                TAX / SST (6%): <span style={{ color: "var(--text-primary)" }}>{tax.toFixed(2)} MYR</span>
              </span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-display)" }}>
                [ FLIP FRONT ]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Interactive Control Pill Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button
          type="button"
          onClick={triggerSpin}
          style={{
            background: "none",
            border: "1px solid var(--border-visible)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            padding: "3px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>🔄</span> [ SPIN 3D CARD ]
        </button>

        <button
          type="button"
          onClick={() => setIsCardFlipped((prev) => !prev)}
          style={{
            background: "none",
            border: "1px solid var(--border-visible)",
            color: "var(--text-display)",
            fontFamily: "var(--font-data)",
            fontSize: "9px",
            padding: "3px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>⇄</span> [ FLIP LEDGER ]
        </button>
      </div>
    </div>
  );
}
