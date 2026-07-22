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
  const [isCapturing, setIsCapturing] = useState(false);

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

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
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
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      }
    }

    setTimeout(() => {
      setIsCapturing(false);
      stopCamera();
      onCapture(dataUrl);
    }, 600);
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

          {/* CAPTURE FLASH ANIMATION OVERLAY */}
          {isCapturing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#ffffff",
                opacity: 0.85,
                zIndex: 10,
                transition: "opacity 0.5s ease-out",
              }}
            />
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px",
            backgroundColor: "var(--surface-raised)",
            borderTop: "1px solid var(--border-visible)",
          }}
        >
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
            <span>{isCapturing ? "[ CAPTURING... ]" : "[ CAPTURE & OCR SCAN ]"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
