"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl?: string, selectedEngine?: string) => void;
  defaultEngine?: string;
}

export default function CameraScannerModal({
  isOpen,
  onClose,
  onCapture,
  defaultEngine = "standard",
}: CameraScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(defaultEngine);
  const [prevDefaultEngine, setPrevDefaultEngine] = useState(defaultEngine);

  if (defaultEngine !== prevDefaultEngine) {
    setPrevDefaultEngine(defaultEngine);
    setSelectedEngine(defaultEngine);
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
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

        let stream: MediaStream;
        try {
          // Request maximum camera resolution (4K / 1080p full HD hardware camera quality)
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 3840, min: 1920 },
              height: { ideal: 2160, min: 1080 },
              frameRate: { ideal: 30 },
            },
            audio: false,
          });
        } catch {
          // Fallback to high quality HD stream
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 },
            },
            audio: false,
          });
        }

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack && typeof videoTrack.applyConstraints === "function") {
          try {
            const capabilities = videoTrack.getCapabilities?.() as Record<string, unknown> | undefined;
            const advancedConstraints: Record<string, unknown>[] = [];
            if (capabilities && Array.isArray(capabilities.focusMode) && capabilities.focusMode.includes("continuous")) {
              advancedConstraints.push({ focusMode: "continuous" });
            }
            if (advancedConstraints.length > 0) {
              await videoTrack.applyConstraints({ advanced: advancedConstraints } as MediaTrackConstraints);
            }
          } catch {
            // Optional advanced hardware constraints
          }
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
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.98);
      }
    } else {
      // Fallback generator for simulation mode (e.g. desktop environment without physical camera attached)
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
        ctx.fillText("DATE: 2026-07-24   TIME: 14:30", 120, 120);
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
        dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      }
    }

    setTimeout(() => {
      setIsCapturing(false);
      stopCamera();
      onCapture(dataUrl, selectedEngine);
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

        {/* FOOTER ACTIONS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            backgroundColor: "var(--surface-raised)",
            borderTop: "1px solid var(--border-visible)",
          }}
        >
          {/* ENGINE SELECTOR */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                fontWeight: "700",
                color: "var(--text-secondary)",
                letterSpacing: "0.08em",
              }}
            >
              ENGINE:
            </span>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              style={{
                backgroundColor: "var(--surface-sunken)",
                color: "var(--text-display)",
                border: "1px solid var(--border-visible)",
                borderRadius: "6px",
                padding: "5px 10px",
                fontFamily: "var(--font-data)",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                WebkitAppearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                paddingRight: "26px",
              }}
            >
              <option value="groq">⚡ GROQ AI VISION (CLOUD)</option>
              <option value="paddle">🐼 PADDLEOCR (LOCAL PYTHON)</option>
              <option value="ollama">🧠 OLLAMA (MOONDREAM 1.7B)</option>
              <option value="llama32">🦙 OLLAMA (LLAMA 3.2 VISION 7.8B)</option>
              <option value="tesseract">🔠 TESSERACT + OLLAMA</option>
              <option value="standard">⟐ AUTO (GROQ → PADDLE → OLLAMA → TESS)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleCapture}
            disabled={isCapturing}
            style={{
              backgroundColor: "var(--text-display)",
              color: "var(--black)",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontFamily: "var(--font-data)",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              cursor: isCapturing ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>{isCapturing ? "[ CAPTURING... ]" : `[ CAPTURE & ${selectedEngine === "groq" ? "GROQ AI" : selectedEngine === "paddle" ? "PADDLE OCR" : selectedEngine === "llama32" ? "LLAMA 3.2" : selectedEngine === "ollama" ? "OLLAMA AI" : selectedEngine === "tesseract" ? "TESS+AI" : "AUTO"} SCAN ]`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
