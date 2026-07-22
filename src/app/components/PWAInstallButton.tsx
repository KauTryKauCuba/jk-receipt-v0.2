"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallButton() {
  const [hasMounted, setHasMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(display-mode: standalone)").matches;
    }
    return false;
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setHasMounted(true);
    });

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("SW registration failed:", err));
    }

    // If already installed, skip event listeners
    if (isInstalled) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [isInstalled]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  // Prevent hydration mismatch by rendering static fallback until mounted
  if (!hasMounted) {
    return (
      <button style={buttonStyle}>
        [ INSTALL APP ]
      </button>
    );
  }

  // If already installed, show installed state
  if (isInstalled) {
    return (
      <button style={{ ...buttonStyle, color: "var(--text-disabled)", cursor: "default" }} disabled>
        [ INSTALLED ]
      </button>
    );
  }

  // If install prompt is available, show install button
  if (deferredPrompt) {
    return (
      <button style={buttonStyle} onClick={handleInstall}>
        [ INSTALL APP ]
      </button>
    );
  }

  // Default: show install button that opens instructions for non-Chromium browsers
  return (
    <button
      style={buttonStyle}
      onClick={() => {
        alert(
          "To install this app:\n\n" +
          "• Chrome/Edge: Click the install icon in the address bar\n" +
          "• Safari: Tap Share → Add to Home Screen\n" +
          "• Firefox: Not supported for PWA install"
        );
      }}
    >
      [ INSTALL APP ]
    </button>
  );
}

const buttonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--accent)",
  fontFamily: "var(--font-data)",
  fontSize: "var(--label)",
  letterSpacing: "0.08em",
  cursor: "pointer",
  padding: 0,
  whiteSpace: "nowrap",
  transition: "opacity 0.2s ease",
};

