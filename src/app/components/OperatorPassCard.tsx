"use client";

import React, { useState, useEffect, useRef } from "react";

interface OperatorPassCardProps {
  callSign: string;
  useCase: string;
  mainGoal: string;
  monthlyVolume: string;
  trackedItems: string[];
  collaborators: string[];
  profileImage: string | null;
  autoSpin?: boolean;
}

export default function OperatorPassCard({
  callSign,
  useCase,
  mainGoal,
  monthlyVolume,
  trackedItems,
  collaborators,
  profileImage,
  autoSpin = true,
}: OperatorPassCardProps) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSpinning, setIsSpinning] = useState(autoSpin);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (autoSpin) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, 2200);
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
    setTimeout(() => setIsSpinning(false), 2200);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", margin: "6px 0" }}>
      <div className="mastercard-3d-scene">
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
          {/* FRONT FACE */}
          <div className="mastercard-face dot-grid-subtle">
            {/* Top row: Brand & Wireless indicator */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                </svg>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", color: "#FFFFFF" }}>
                  JEJAKU <span style={{ opacity: 0.6, fontWeight: 400 }}>PASS</span>
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                </svg>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)", border: "1px solid rgba(74, 158, 92, 0.4)", padding: "1px 5px", borderRadius: "4px" }}>
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Middle row: User Avatar + Call Sign */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "6px 0" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: "#111115",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                {profileImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={profileImage} alt="Operator" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "15px", fontWeight: "700", color: "#FFFFFF" }}>
                    {(callSign || "JK").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
                  OPERATOR CALL SIGN
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {callSign.toUpperCase() || "CALL_SIGN_UNASSIGNED"}
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginTop: "1px" }}>
                  JK-8849-{(callSign.length * 1337 + 4200).toString(16).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Bottom row: Profile, Goal & Volume */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>PROFILE:</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", color: "#FFFFFF" }}>{useCase.toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>GOAL:</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>{mainGoal.toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>VOLUME:</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--warning)" }}>{monthlyVolume} DOCS/MO</span>
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="mastercard-face mastercard-face-back dot-grid-subtle" style={{ padding: "0 0 14px 0" }}>
            {/* Magnetic Stripe */}
            <div style={{ width: "100%", height: "32px", backgroundColor: "#000000", marginTop: "14px" }} />

            <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1, justifyContent: "space-between", marginTop: "6px" }}>
              {/* Signature Strip */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
                  AUTHORIZED OPERATOR SIGNATURE
                </span>
                <div style={{ width: "100%", height: "26px", backgroundColor: "#FFFFFF", borderRadius: "4px", display: "flex", alignItems: "center", padding: "0 8px", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: "700", color: "#000000", fontStyle: "italic", letterSpacing: "0.08em" }}>
                    {callSign || "OPERATOR SIGNATURE"}
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "#666666" }}>CVC: 849</span>
                </div>
              </div>

              {/* Onboarding Config Summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>TRACKED:</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "#FFFFFF" }}>{trackedItems.slice(0, 3).join(", ").toUpperCase() || "ALL"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>COLLABORATORS:</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "#FFFFFF" }}>{collaborators.join(", ").toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>ENCRYPTION HASH:</span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--success)" }}>0x8F4A...7B2</span>
                </div>
              </div>

              {/* Back Card Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                  JEJAKU TELEMETRY INSTRUMENT
                </span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-display)" }}>
                  [ FLIP ]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Control Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button
          type="button"
          onClick={triggerSpin}
          style={{
            background: "none",
            border: "1px solid var(--border-visible)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-data)",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>🔄</span> [ RE-SPIN 3D CARD ]
        </button>

        <button
          type="button"
          onClick={() => setIsCardFlipped((prev) => !prev)}
          style={{
            background: "none",
            border: "1px solid var(--border-visible)",
            color: "var(--text-display)",
            fontFamily: "var(--font-data)",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>⇄</span> [ FLIP CARD ]
        </button>
      </div>
    </div>
  );
}
