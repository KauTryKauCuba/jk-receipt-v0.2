"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface MatrixTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";
const TRAIL_LENGTH = 4; // number of trailing "rain" characters per column

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

interface CharState {
  resolved: boolean;
  char: string;
  // Trail: array of { char, opacity } falling above
  trail: { char: string; opacity: number }[];
}

export default function MatrixText({
  text,
  delay = 100,
  duration = 1200,
  className,
  style,
}: MatrixTextProps) {
  const [chars, setChars] = useState<CharState[]>(() =>
    text.split("").map((finalChar) => ({
      resolved: true,
      char: finalChar,
      trail: Array.from({ length: TRAIL_LENGTH }, () => ({
        char: "",
        opacity: 0,
      })),
    }))
  );

  const animationRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const animateRef = useRef<(timestamp: number) => void>(() => {});

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const perCharDuration = duration / text.length;

      const nextChars: CharState[] = text.split("").map((finalChar, i) => {
        const charStart = i * (perCharDuration * 0.6);
        const charProgress = Math.max(0, Math.min(1, (elapsed - charStart) / (perCharDuration * 1.5)));

        if (charProgress >= 1) {
          return {
            resolved: true,
            char: finalChar,
            trail: Array.from({ length: TRAIL_LENGTH }, () => ({
              char: randomGlyph(),
              opacity: 0,
            })),
          };
        }

        const trail = Array.from({ length: TRAIL_LENGTH }, (_, trailIdx) => {
          const trailProgress = charProgress * 2 + trailIdx * 0.15;
          const baseOpacity = Math.max(0, 1 - trailIdx * 0.25);
          const fadeIn = Math.min(1, trailProgress);
          return {
            char: randomGlyph(),
            opacity: fadeIn * baseOpacity * (1 - charProgress * 0.5),
          };
        });

        return {
          resolved: false,
          char: randomGlyph(),
          trail,
        };
      });

      setChars(nextChars);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame((ts) => animateRef.current(ts));
      } else {
        setChars(
          text.split("").map((finalChar) => ({
            resolved: true,
            char: finalChar,
            trail: Array.from({ length: TRAIL_LENGTH }, () => ({
              char: randomGlyph(),
              opacity: 0,
            })),
          }))
        );
      }
    },
    [text, duration]
  );

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const triggerAnimation = useCallback(
    (immediate = false) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startRef.current = null;
      setChars(
        text.split("").map(() => ({
          resolved: false,
          char: randomGlyph(),
          trail: Array.from({ length: TRAIL_LENGTH }, () => ({
            char: randomGlyph(),
            opacity: 0,
          })),
        }))
      );

      if (immediate) {
        animationRef.current = requestAnimationFrame((ts) => animateRef.current(ts));
      }
    },
    [text]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startRef.current = null;
      animationRef.current = requestAnimationFrame((ts) => animateRef.current(ts));
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, delay]);

  return (
    <span
      className={className}
      style={{ ...style, display: "inline-block", cursor: "default" }}
    >
      {chars.map((charState, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            position: "relative",
            width: "auto",
            minWidth: charState.char === " " ? "0.3em" : "auto",
            whiteSpace: "pre",
          }}
        >
          {/* Trailing rain characters above */}
          {!charState.resolved && (
            <span
              style={{
                position: "absolute",
                bottom: "100%",
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {charState.trail.map((t, tIdx) => (
                <span
                  key={tIdx}
                  style={{
                    fontSize: "0.35em",
                    lineHeight: 1.1,
                    color: "var(--success)",
                    opacity: t.opacity,
                  }}
                >
                  {t.char}
                </span>
              ))}
            </span>
          )}

          {/* Main character */}
          <span
            style={{
              color: charState.resolved ? "inherit" : "var(--success)",
              textShadow: charState.resolved
                ? "none"
                : "0 0 8px var(--success), 0 0 16px rgba(74, 158, 92, 0.4)",
              transition: "color 0.5s ease-out, text-shadow 0.5s ease-out",
            }}
          >
            {charState.char}
          </span>

          {/* Trailing rain characters below */}
          {!charState.resolved && (
            <span
              style={{
                position: "absolute",
                top: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {charState.trail.map((t, tIdx) => (
                <span
                  key={tIdx}
                  style={{
                    fontSize: "0.35em",
                    lineHeight: 1.1,
                    color: "var(--success)",
                    opacity: t.opacity * 0.6,
                  }}
                >
                  {t.char}
                </span>
              ))}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
