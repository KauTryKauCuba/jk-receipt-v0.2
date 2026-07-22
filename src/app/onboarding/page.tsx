"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PWAInstallButton from "../components/PWAInstallButton";
import FontToggleButton from "../components/FontToggleButton";
import MatrixText from "../components/MatrixText";
import OperatorPassCard from "../components/OperatorPassCard";

export default function Onboarding() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [step, setStep] = useState(1);
  // Onboarding settings state
  const [callSign, setCallSign] = useState("");
  const [callSignError, setCallSignError] = useState("");
  const [useCase, setUseCase] = useState("business"); // business, personal, job, accountant
  const [mainGoal, setMainGoal] = useState("warranties"); // receipts, tax, spending, warranties, medical
  const [trackedItems, setTrackedItems] = useState<string[]>(["household", "warranties"]);
  const [monthlyVolume, setMonthlyVolume] = useState("10-50"); // <10, 10-50, 50-200, 200+
  const [collaborators, setCollaborators] = useState<string[]>(["me"]); // me, spouse, family
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [onboardingLogs, setOnboardingLogs] = useState<string[]>([]);
  const [isSyncComplete, setIsSyncComplete] = useState(false);

  const toggleTrackedItem = (id: string) => {
    setTrackedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCollaborator = (id: string) => {
    setCollaborators((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    setProfileImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 160, 160);
        const dataUrl = canvas.toDataURL("image/png");
        setProfileImage(dataUrl);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Clean up stream if component unmounts or step changes
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step]);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    localStorage.setItem("theme", newMode ? "light" : "dark");
    if (newMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme === "light";
    if (isLight) {
      requestAnimationFrame(() => {
        setIsLightMode(true);
      });
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  // Step 6 progress simulation
  useEffect(() => {
    if (step !== 6) return;

    const logStatements = [
      "SYS: INITIALIZING SECURE UPLINK CHANNELS...",
      `SYS: REGISTERING CALL SIGN: ${callSign.toUpperCase() || "ANONYMOUS"}`,
      `SYS: PROFILE ALIGNMENT: [${useCase.toUpperCase()}]`,
      `SYS: MISSION OBJECTIVE: [${mainGoal.toUpperCase()}]`,
      `SYS: CATEGORY TRACKERS: [${trackedItems.map((t) => t.toUpperCase()).join(", ") || "ALL"}]`,
      `SYS: MONTHLY VOLUME: [${monthlyVolume.toUpperCase()}]`,
      `SYS: COLLABORATOR PROFILE: [${collaborators.map((c) => c.toUpperCase()).join(", ") || "SOLO"}]`,
      "SYS: SYNCHRONIZING WITH CENTRAL TELEMETRY GATEWAY...",
      "SYS: ALL CHANNELS SECURED. READY FOR CONSOLE UPLINK.",
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncComplete(true);
          return 100;
        }
        
        // Add log lines matching progress ticks
        if (prev % 10 === 0 && currentLogIndex < logStatements.length) {
          setOnboardingLogs((logs) => [...logs, logStatements[currentLogIndex]]);
          currentLogIndex++;
        }
        
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [step, callSign, useCase, mainGoal, trackedItems, monthlyVolume, collaborators]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!callSign.trim()) {
        setCallSignError("CALL SIGN IDENTIFIER IS REQUIRED");
        return;
      }
      if (callSign.length < 3) {
        setCallSignError("IDENTIFIER MUST BE >= 3 CHARACTERS");
        return;
      }
      setCallSignError("");
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div style={containerStyle}>
      {/* Header Status Bar */}
      <header className="header">
        <div className="header-left">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--text-display)" }}
          >
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </svg>
          <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--text-display)", marginRight: "var(--space-xs)" }}>
            JEJAKU <span style={{ fontWeight: "400", color: "var(--text-secondary)" }}>RECEIPT</span>
          </span>
        </div>
        <div className="header-right">
          <Link href="/" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span>HOME ]</span>
          </Link>
          <Link href="/dashboard" className="nav-link" style={{ display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
            <span>DASHBOARD ]</span>
          </Link>
          <span style={dividerPipeStyle}>|</span>
          <span className="nav-link" style={{ display: "inline-flex", alignItems: "center", color: "var(--success)" }}>
            <span>[</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            <span>ONBOARDING ]</span>
          </span>
          <span style={dividerPipeStyle}>|</span>
          <PWAInstallButton />
          <span style={dividerPipeStyle}>|</span>
          <FontToggleButton />
          <span style={dividerPipeStyle}>|</span>
          <button onClick={toggleTheme} style={{ ...themeToggleButtonStyle, display: "inline-flex", alignItems: "center" }}>
            <span>[</span>
            {isLightMode ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, margin: "0 4px" }}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            )}
            <span>]</span>
          </button>
        </div>
      </header>

      <div className="animate-slide-fade" style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-2xl)" }}>
        <div style={cardStyle} className="dot-grid-subtle">
          
          {/* Onboarding Header */}
          <div style={cardHeaderStyle}>
            <span style={labelMonoStyle}>SYSTEM PROVISIONING SEQUENCE</span>
            <span style={badgeStyle}>STEP {step} / 6</span>
          </div>

          <h2 style={titleStyle}>
            <MatrixText text="ONBOARDING" />
          </h2>
          <p style={subStyle}>CALIBRATE OPERATOR PARAMETERS</p>

          {/* STEP 1: Call Sign */}
          {step === 1 && (
            <div style={{ ...stepContainerStyle, minHeight: "280px" }}>
              {/* Profile Image Uploader with Camera support */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
                <label style={inputLabelStyle}>[ OPERATOR VISUAL IDENTIFIER ]</label>
                <div 
                  onClick={() => {
                    if (isCameraActive) {
                      capturePhoto();
                    } else if (!profileImage) {
                      document.getElementById("avatar-upload-input")?.click();
                    }
                  }}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "1px dashed var(--border-visible)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    transition: "border-color 0.2s ease"
                  }}
                >
                  {isCameraActive ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} 
                    />
                  ) : profileImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={profileImage} 
                      alt="Operator Avatar" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  )}
                </div>
                <input 
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImage(URL.createObjectURL(file));
                    }
                  }}
                  style={{ display: "none" }}
                />
                
                {/* Control Options */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {isCameraActive ? (
                    <>
                      <button 
                        type="button" 
                        onClick={capturePhoto} 
                        style={{ background: "none", border: "none", color: "var(--success)", fontFamily: "var(--font-data)", fontSize: "10px", letterSpacing: "0.06em", cursor: "pointer", padding: 0 }}
                      >
                        [ SNAP PHOTO ]
                      </button>
                      <span style={{ color: "var(--border-visible)" }}>|</span>
                      <button 
                        type="button" 
                        onClick={stopCamera} 
                        style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--font-data)", fontSize: "10px", letterSpacing: "0.06em", cursor: "pointer", padding: 0 }}
                      >
                        [ CANCEL ]
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={() => document.getElementById("avatar-upload-input")?.click()} 
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", letterSpacing: "0.06em", cursor: "pointer", padding: 0 }}
                      >
                        [ UPLOAD FILE ]
                      </button>
                      <span style={{ color: "var(--border-visible)" }}>|</span>
                      <button 
                        type="button" 
                        onClick={startCamera} 
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", fontFamily: "var(--font-data)", fontSize: "10px", letterSpacing: "0.06em", cursor: "pointer", padding: 0 }}
                      >
                        [ USE CAMERA ]
                      </button>
                      {profileImage && (
                        <>
                          <span style={{ color: "var(--border-visible)" }}>|</span>
                          <button 
                            type="button" 
                            onClick={() => setProfileImage(null)} 
                            style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--font-data)", fontSize: "10px", letterSpacing: "0.06em", cursor: "pointer", padding: 0 }}
                          >
                            [ DE-LINK ]
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={inputLabelStyle}>[ ASSIGN CALL SIGN / OPERATOR ALIAS ]</label>
                <input
                  type="text"
                  value={callSign}
                  onChange={(e) => setCallSign(e.target.value)}
                  style={{
                    ...inputStyle,
                    borderBottom: callSignError ? "1px solid var(--accent)" : "1px solid var(--border-visible)"
                  }}
                  placeholder="E.G. ALDRIN_02"
                />
                {callSignError && <span style={errorTextStyle}>* {callSignError}</span>}
              </div>
              <p style={descriptionTextStyle}>
                This identifier will label all telemetry scanning actions and receipt metadata records generated under this terminal profile.
              </p>
            </div>
          )}

          {/* STEP 2: Use Case Selection */}
          {step === 2 && (
            <div style={stepContainerStyle}>
              <label style={inputLabelStyle}>[ PROFILE PARAMETER ]</label>
              
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--body)", fontWeight: "600", color: "var(--text-display)", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
                WHAT BRINGS YOU TO JEJAKU RECEIPT?
              </h3>
              <p style={{ ...descriptionTextStyle, margin: "0 0 16px 0" }}>
                Select the operator profile alignment for receipt telemetry.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  {
                    id: "business",
                    title: "My business",
                    description: "Track expenses, manage invoices, stay tax-ready",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                        <path d="M9 22V12h6v10" />
                        <path d="M8 7h2" />
                        <path d="M14 7h2" />
                        <path d="M8 12h2" />
                        <path d="M14 12h2" />
                      </svg>
                    ),
                  },
                  {
                    id: "personal",
                    title: "Personal finances",
                    description: "Organize receipts, warranties, and household expenses",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                  },
                  {
                    id: "job",
                    title: "Job expenses",
                    description: "Track work expenses for reimbursement or tax deductions",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ),
                  },
                  {
                    id: "accountant",
                    title: "I'm an accountant",
                    description: "Manage documents for multiple clients",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    ),
                  },
                ].map((opt) => {
                  const isSelected = useCase === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setUseCase(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        border: isSelected ? "1px solid var(--success)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(74, 158, 92, 0.08)" : "transparent",
                        transition: "all 0.15s ease-out",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: "11px",
                            color: isSelected ? "var(--success)" : "var(--text-disabled)",
                            userSelect: "none",
                            marginTop: "1px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? "[●]" : "[ ]"}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--body-sm)", fontWeight: "600", color: isSelected ? "var(--success)" : "var(--text-primary)" }}>
                            {opt.title}
                          </span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--caption)", color: "var(--text-secondary)", lineHeight: "1.3" }}>
                            {opt.description}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? "var(--success)" : "var(--text-disabled)",
                          transition: "color 0.15s ease-out",
                          flexShrink: 0,
                        }}
                      >
                        {opt.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Main Goal Selection */}
          {step === 3 && (
            <div style={stepContainerStyle}>
              <label style={inputLabelStyle}>[ MISSION OBJECTIVE ]</label>
              
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--body)", fontWeight: "600", color: "var(--text-display)", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
                WHAT&apos;S YOUR MAIN GOAL?
              </h3>
              <p style={{ ...descriptionTextStyle, margin: "0 0 16px 0" }}>
                This helps us prioritize what to show you first.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  {
                    id: "receipts",
                    title: "Stop losing receipts",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                      </svg>
                    ),
                  },
                  {
                    id: "tax",
                    title: "Organize deductions for tax time",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="5" x2="5" y2="19" />
                        <circle cx="6.5" cy="6.5" r="2.5" />
                        <circle cx="17.5" cy="17.5" r="2.5" />
                      </svg>
                    ),
                  },
                  {
                    id: "spending",
                    title: "Track my household spending",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                  },
                  {
                    id: "warranties",
                    title: "Keep warranties and manuals in one place",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="9" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                      </svg>
                    ),
                  },
                  {
                    id: "medical",
                    title: "Manage medical and insurance receipts",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    ),
                  },
                ].map((opt) => {
                  const isSelected = mainGoal === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setMainGoal(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        border: isSelected ? "1px solid var(--success)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(74, 158, 92, 0.08)" : "transparent",
                        transition: "all 0.15s ease-out",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: "11px",
                            color: isSelected ? "var(--success)" : "var(--text-disabled)",
                            userSelect: "none",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? "[●]" : "[ ]"}
                        </span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--body-sm)", fontWeight: "600", color: isSelected ? "var(--success)" : "var(--text-primary)" }}>
                          {opt.title}
                        </span>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? "var(--success)" : "var(--text-disabled)",
                          transition: "color 0.15s ease-out",
                          flexShrink: 0,
                        }}
                      >
                        {opt.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Category Tracking Multi-Select */}
          {step === 4 && (
            <div style={stepContainerStyle}>
              <label style={inputLabelStyle}>[ ARCHIVE CATEGORY TARGETS ]</label>
              
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--body)", fontWeight: "600", color: "var(--text-display)", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
                WHAT WILL YOU TRACK?
              </h3>
              <p style={{ ...descriptionTextStyle, margin: "0 0 16px 0" }}>
                Select all categories you wish to record in your archive.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  {
                    id: "household",
                    title: "Household receipts",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                  },
                  {
                    id: "warranties",
                    title: "Warranties & guarantees",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="9" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                      </svg>
                    ),
                  },
                  {
                    id: "medical",
                    title: "Medical expenses",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    ),
                  },
                  {
                    id: "insurance",
                    title: "Insurance documents",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ),
                  },
                  {
                    id: "tax",
                    title: "Tax deductions",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="5" x2="5" y2="19" />
                        <circle cx="6.5" cy="6.5" r="2.5" />
                        <circle cx="17.5" cy="17.5" r="2.5" />
                      </svg>
                    ),
                  },
                ].map((opt) => {
                  const isSelected = trackedItems.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleTrackedItem(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        border: isSelected ? "1px solid var(--success)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(74, 158, 92, 0.08)" : "transparent",
                        transition: "all 0.15s ease-out",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-data)",
                            fontSize: "11px",
                            color: isSelected ? "var(--success)" : "var(--text-disabled)",
                            userSelect: "none",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? "[x]" : "[ ]"}
                        </span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--body-sm)", fontWeight: "600", color: isSelected ? "var(--success)" : "var(--text-primary)" }}>
                          {opt.title}
                        </span>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? "var(--success)" : "var(--text-disabled)",
                          transition: "color 0.15s ease-out",
                          flexShrink: 0,
                        }}
                      >
                        {opt.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Volume & Collaboration Profile */}
          {step === 5 && (
            <div style={stepContainerStyle}>
              <label style={inputLabelStyle}>[ VOLUME & COLLABORATION PROFILE ]</label>
              
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--body)", fontWeight: "600", color: "var(--text-display)", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
                HOW MANY DOCUMENTS DO YOU PROCESS MONTHLY?
              </h3>
              <p style={{ ...descriptionTextStyle, margin: "0 0 14px 0" }}>
                This helps us recommend the right plan for you.
              </p>

              {/* Volume Options (Radio Single-Select) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { id: "<10", title: "Less than 10" },
                  { id: "10-50", title: "10-50" },
                  { id: "50-200", title: "50-200" },
                  { id: "200+", title: "200+" },
                ].map((opt) => {
                  const isSelected = monthlyVolume === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setMonthlyVolume(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 14px",
                        border: isSelected ? "1px solid var(--success)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(74, 158, 92, 0.08)" : "transparent",
                        transition: "all 0.15s ease-out",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-data)",
                          fontSize: "11px",
                          color: isSelected ? "var(--success)" : "var(--text-disabled)",
                          userSelect: "none",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected ? "[●]" : "[ ]"}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--body-sm)", fontWeight: "600", color: isSelected ? "var(--success)" : "var(--text-primary)" }}>
                        {opt.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Collaborators Subheader & Multi-Select */}
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>
                  Who else will use Jejaku Receipt?
                </span>

                {[
                  { id: "me", title: "Just me" },
                  { id: "spouse", title: "My spouse/partner" },
                  { id: "family", title: "Family members" },
                ].map((opt) => {
                  const isSelected = collaborators.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleCollaborator(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 14px",
                        border: isSelected ? "1px solid var(--success)" : "1px solid var(--border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(74, 158, 92, 0.08)" : "transparent",
                        transition: "all 0.15s ease-out",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-data)",
                          fontSize: "11px",
                          color: isSelected ? "var(--success)" : "var(--text-disabled)",
                          userSelect: "none",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected ? "[x]" : "[ ]"}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--body-sm)", fontWeight: "600", color: isSelected ? "var(--success)" : "var(--text-primary)" }}>
                        {opt.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: System Integration Progress & 3D Mastercard Operator Pass */}
          {step === 6 && (
            <div style={{ ...stepContainerStyle, gap: "14px" }}>
              <label style={inputLabelStyle}>[ UPLINK CONFIGURATION & OPERATOR PASS ]</label>
              
              {/* Segmented Progress Bar */}
              <div style={progressContainerStyle}>
                <div style={progressHeaderStyle}>
                  <span style={progressLabelStyle}>{isSyncComplete ? "SECURE UPLINK STABLE" : "SYNCHRONIZING OPERATOR PARAMETERS..."}</span>
                  <span style={progressValueStyle}>{progress}%</span>
                </div>
                <div style={progressBarTrackStyle}>
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const threshold = (idx + 1) * 10;
                    const isFilled = progress >= threshold;
                    return (
                      <div
                        key={idx}
                        style={{
                          ...progressBarSegmentStyle,
                          backgroundColor: isFilled ? "var(--success)" : "var(--border)"
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 3D Spinning Mastercard Pass Component */}
              <OperatorPassCard
                callSign={callSign}
                useCase={useCase}
                mainGoal={mainGoal}
                monthlyVolume={monthlyVolume}
                trackedItems={trackedItems}
                collaborators={collaborators}
                profileImage={profileImage}
                autoSpin={step === 6}
              />

              {/* Telemetry Console Logs */}
              <div style={consoleLogBoxStyle}>
                {onboardingLogs.map((log, index) => (
                  <div key={index} style={consoleLogLineStyle}>
                    {log}
                  </div>
                ))}
                {!isSyncComplete && <div className="blink-cursor" style={consoleLogLineStyle}>_</div>}
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div style={actionButtonRowStyle}>
            {step > 1 && step < 6 && (
              <button onClick={handlePrevStep} style={secondaryButtonStyle}>
                [ PREV STEP ]
              </button>
            )}
            
            {step < 6 ? (
              <button onClick={handleNextStep} style={primaryButtonStyle}>
                [ CONTINUE ]
              </button>
            ) : (
              <Link
                href="/dashboard"
                style={{
                  ...primaryButtonStyle,
                  textAlign: "center",
                  textDecoration: "none",
                  display: isSyncComplete ? "block" : "none"
                }}
              >
                [ LAUNCH OPERATOR DASHBOARD -&gt; ]
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Styling classes following Nothing guidelines
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "var(--space-md)",
};

const dividerPipeStyle: React.CSSProperties = {
  color: "var(--border-visible)",
};

const themeToggleButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--text-display)",
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  cursor: "pointer",
  padding: 0,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--border-visible)",
  borderRadius: "12px",
  padding: "var(--space-lg)",
  backgroundColor: "var(--surface)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
  width: "100%",
  maxWidth: "500px",
  boxSizing: "border-box",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "var(--space-sm)",
};

const labelMonoStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  color: "var(--text-secondary)",
  textTransform: "uppercase",
};

const badgeStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-display)",
  border: "1px solid var(--border-visible)",
  padding: "var(--space-2xs) var(--space-xs)",
  borderRadius: "4px",
  letterSpacing: "0.08em",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--display-lg)",
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "var(--text-display)",
  margin: 0,
};

const subStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--subheading)",
  fontWeight: 300,
  lineHeight: 1.2,
  color: "var(--text-secondary)",
  marginTop: "var(--space-xs)",
};

const stepContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-md)",
  minHeight: "180px",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-xs)",
};

const inputLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.06em",
  color: "var(--text-secondary)",
  marginBottom: "var(--space-xs)",
};

const inputStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  outline: "none",
  color: "var(--text-primary)",
  fontFamily: "var(--font-data)",
  fontSize: "var(--body-sm)",
  padding: "var(--space-sm) 0",
  width: "100%",
  letterSpacing: "0.05em",
};

const errorTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--accent)",
  letterSpacing: "0.04em",
};

const descriptionTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--caption)",
  lineHeight: 1.5,
  color: "var(--text-disabled)",
};

// Step 4 Progress styles
const progressContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-sm)",
};

const progressHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  color: "var(--text-secondary)",
};

const progressLabelStyle: React.CSSProperties = {
  letterSpacing: "0.06em",
};

const progressValueStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "var(--success)",
};

const progressBarTrackStyle: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  width: "100%",
  height: "12px",
};

const progressBarSegmentStyle: React.CSSProperties = {
  flex: 1,
  height: "100%",
  transition: "background-color 0.2s ease",
};

const consoleLogBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  border: "1px solid var(--border-visible)",
  borderRadius: "8px",
  padding: "var(--space-md)",
  minHeight: "100px",
  fontFamily: "var(--font-data)",
  fontSize: "10px",
  color: "var(--text-secondary)",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  overflowY: "auto",
};

const consoleLogLineStyle: React.CSSProperties = {
  letterSpacing: "0.04em",
};

// Action button row
const actionButtonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "var(--space-md)",
  borderTop: "1px solid var(--border)",
  paddingTop: "var(--space-md)",
};

const primaryButtonStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: "var(--text-display)",
  border: "none",
  color: "var(--black)",
  fontFamily: "var(--font-data)",
  fontSize: "13px",
  fontWeight: "bold",
  letterSpacing: "0.06em",
  padding: "12px 24px",
  borderRadius: "999px",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "1px solid var(--border-visible)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-data)",
  fontSize: "13px",
  letterSpacing: "0.06em",
  padding: "12px 24px",
  borderRadius: "999px",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
};
