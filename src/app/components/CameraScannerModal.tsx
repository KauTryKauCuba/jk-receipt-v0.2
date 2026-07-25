"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl?: string) => void;
}

export default function CameraScannerModal({
  isOpen,
  onClose,
  onCapture,
}: CameraScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"ENHANCED" | "THERMAL" | "ORIGINAL">("ENHANCED");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const toggleTorch = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = track.getCapabilities() as { torch?: boolean };
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: !isTorchOn } as unknown as MediaTrackConstraintSet],
            });
            setIsTorchOn(!isTorchOn);
          }
        } catch (e) {
          console.warn("Torch toggle not supported on this device lens:", e);
        }
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsTorchOn(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function startCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("MediaDevices API not supported on this browser context.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasPermission(true);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.warn("Camera access failed or unavailable, engaging simulation mode:", err);
        setHasPermission(false);
        const errMsg = err instanceof Error ? err.message : "Camera access denied or unavailable";
        setCameraError(errMsg);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  const handleCapture = () => {
    setIsCapturing(true);

    let dataUrl: string | undefined;
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const MAX_DIM = 1200;
      let width = videoRef.current.videoWidth;
      let height = videoRef.current.videoHeight;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // High-precision OCR Pre-Processing filter
        if (filterMode === "THERMAL") {
          ctx.filter = "grayscale(100%) contrast(180%) brightness(110%)";
        } else if (filterMode === "ENHANCED") {
          ctx.filter = "contrast(130%) brightness(105%) saturate(105%)";
        } else {
          ctx.filter = "none";
        }
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      }
    } else {
      // Fallback generator for simulation mode
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 900;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 600, 900);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 24px monospace";
        ctx.fillText("JEJAKU SUPERMARKET KLCC", 120, 80);
        ctx.font = "16px monospace";
        ctx.fillText("DATE: 2026-07-25   TIME: 14:30", 120, 120);
        ctx.fillText("---------------------------------", 120, 150);
        ctx.fillText("ORGANIC MILK 2L      x1  RM 14.50", 120, 190);
        ctx.fillText("WHOLE WHEAT BREAD    x2  RM 11.00", 120, 230);
        ctx.fillText("FRESH AVOCADO 3PK    x1  RM 18.90", 120, 270);
        ctx.fillText("PREMIUM COFFEE BEANS x1  RM 38.00", 120, 310);
        ctx.fillText("---------------------------------", 120, 350);
        ctx.fillText("SUBTOTAL:                RM 82.40", 120, 390);
        ctx.fillText("SST 6%:                  RM  4.94", 120, 430);
        ctx.font = "bold 20px monospace";
        ctx.fillText("TOTAL PAID:              RM 87.34", 120, 480);
        ctx.font = "14px monospace";
        ctx.fillText("THANK YOU FOR SHOPPING WITH US!", 120, 540);
        dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      }
    }

    setTimeout(() => {
      setIsCapturing(false);
      stopCamera();
      onCapture(dataUrl);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="camera-modal-backdrop">
      <div className="camera-modal-container dot-grid-subtle">
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-visible)",
            backgroundColor: "var(--surface-raised)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className="dot-pulse"
              style={{ backgroundColor: "var(--success)", width: "8px", height: "8px" }}
            />
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-display)",
                letterSpacing: "0.08em",
              }}
            >
              [ OPTICAL RECEIPT SCANNER // LIVE VIEW ]
            </span>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-data)",
              fontSize: "12px",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            [ ✕ CANCEL ]
          </button>
        </div>

        {/* VIEWFINDER SCREEN CONTAINER */}
        <div className="camera-modal-viewfinder">
          {hasPermission !== false ? (
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            /* SIMULATION VIEWFINDER FEED (IF CAMERA DENIED OR NO WEBCAM) */
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#080808",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px dashed var(--warning)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--warning)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "var(--warning)",
                  letterSpacing: "0.06em",
                }}
              >
                OPTICS FEED: VIRTUAL SIMULATION MODE
              </span>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: "10px",
                  color: "var(--text-disabled)",
                  maxWidth: "320px",
                  lineHeight: "1.4",
                }}
              >
                {cameraError || "Hardware optical feed simulated. Position paper receipt within frame bounds."}
              </span>
            </div>
          )}

          {/* HUD SCANNER OVERLAY BOUNDS */}
          <div
            style={{
              position: "absolute",
              inset: "24px",
              border: "1px solid rgba(74, 158, 92, 0.4)",
              borderRadius: "8px",
              pointerEvents: "none",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
            }}
          >
            {/* Top-Left Corner Bracket */}
            <div
              style={{
                position: "absolute",
                top: "-2px",
                left: "-2px",
                width: "20px",
                height: "20px",
                borderTop: "3px solid var(--success)",
                borderLeft: "3px solid var(--success)",
              }}
            />
            {/* Top-Right Corner Bracket */}
            <div
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "20px",
                height: "20px",
                borderTop: "3px solid var(--success)",
                borderRight: "3px solid var(--success)",
              }}
            />
            {/* Bottom-Left Corner Bracket */}
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                left: "-2px",
                width: "20px",
                height: "20px",
                borderBottom: "3px solid var(--success)",
                borderLeft: "3px solid var(--success)",
              }}
            />
            {/* Bottom-Right Corner Bracket */}
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "20px",
                height: "20px",
                borderBottom: "3px solid var(--success)",
                borderRight: "3px solid var(--success)",
              }}
            />

            {/* LASER SWEEP ANIMATED LINE */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "2px",
                backgroundColor: "var(--success)",
                boxShadow: "0 0 10px var(--success), 0 0 20px var(--success)",
                animation: "camera-laser-sweep 2.2s linear infinite",
              }}
            />

            {/* TARGET RETICLE CROSSHAIR */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40px",
                height: "40px",
                border: "1px dashed rgba(74,158,92,0.6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "var(--success)",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* TELEMETRY FEED LABEL */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "12px",
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                color: "var(--success)",
                letterSpacing: "0.08em",
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              [ AUTO-FOCUS: LOCK // TELEMETRY OK ]
            </div>
          </div>

          {/* CAPTURE FLASH & SHUTTER ANIMATION OVERLAY */}
          {isCapturing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(2px)",
                zIndex: 10,
                animation: "camera-shutter-flash 0.3s ease-out forwards",
              }}
            />
          )}
        </div>
        {/* FOOTER ACTIONS & OPTICAL CONTROLS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "14px 18px",
            backgroundColor: "var(--surface-raised)",
            borderTop: "1px solid var(--border-visible)",
          }}
        >
          {/* OPTICAL PRE-PROCESSING FILTER TOGGLES */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "var(--text-disabled)", letterSpacing: "0.06em" }}>
                AI OPTICAL PRESET:
              </span>
              <button
                type="button"
                onClick={() => setFilterMode("ENHANCED")}
                style={{
                  backgroundColor: filterMode === "ENHANCED" ? "var(--text-display)" : "var(--surface)",
                  color: filterMode === "ENHANCED" ? "var(--black)" : "var(--text-primary)",
                  border: "1px solid var(--border-visible)",
                  fontFamily: "var(--font-data)",
                  fontSize: "9px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                [ AUTO ENHANCE ]
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("THERMAL")}
                style={{
                  backgroundColor: filterMode === "THERMAL" ? "var(--orange)" : "var(--surface)",
                  color: filterMode === "THERMAL" ? "var(--black)" : "var(--text-primary)",
                  border: "1px solid var(--border-visible)",
                  fontFamily: "var(--font-data)",
                  fontSize: "9px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                [ THERMAL B&amp;W ]
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("ORIGINAL")}
                style={{
                  backgroundColor: filterMode === "ORIGINAL" ? "var(--surface)" : "transparent",
                  color: filterMode === "ORIGINAL" ? "var(--text-display)" : "var(--text-disabled)",
                  border: "1px solid var(--border-visible)",
                  fontFamily: "var(--font-data)",
                  fontSize: "9px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                [ ORIGINAL ]
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTorch}
              style={{
                backgroundColor: isTorchOn ? "var(--warning)" : "var(--surface)",
                color: isTorchOn ? "var(--black)" : "var(--text-primary)",
                border: "1px solid var(--border-visible)",
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              [ 🔦 TORCH {isTorchOn ? "ON" : "OFF"} ]
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "10px",
                color: "var(--text-secondary)",
              }}
            >
              ALIGN RECEIPT BOUNDS WITHIN GREEN RETICLE
            </span>

            <button
              type="button"
              onClick={handleCapture}
              disabled={isCapturing}
              style={{
                backgroundColor: "var(--text-display)",
                color: "var(--black)",
                border: "none",
                borderRadius: "8px",
                padding: "8px 20px",
                fontFamily: "var(--font-data)",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                cursor: isCapturing ? "wait" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                opacity: isCapturing ? 0.7 : 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>{isCapturing ? "[ ANALYZING OCR... ]" : "[ CAPTURE SNAPSHOT ]"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
