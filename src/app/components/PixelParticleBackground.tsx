"use client";

import { useEffect, useRef } from "react";

export default function PixelParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Mouse interactive target with smooth easing
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Smoothstep utility for ultra-soft radial blob falloff
    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    const render = () => {
      time += 0.005;

      // Smooth mouse interpolation (inertia delay)
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      const width = canvas.width;
      const height = canvas.height;

      // Check if light mode is active
      const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");

      if (isLight) {
        ctx.fillStyle = "#FAFAFA";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "#030303";
        ctx.fillRect(0, 0, width, height);
      }

      // Grid sizing
      const cols = Math.floor(width / 13);
      const rows = Math.floor(height / 13);
      const gridSpacingX = width / cols;
      const gridSpacingY = height / rows;
      const pixelSize = 3.5;

      // Dynamic organic blob center coordinates (morphing liquid metaball centers)
      const blob1X = 0.62 + Math.sin(time * 0.9) * 0.14 + mouseX * 0.05;
      const blob1Y = 0.38 + Math.cos(time * 0.7) * 0.16 + mouseY * 0.05;
      const blob1Radius = 0.42 + Math.sin(time * 1.3) * 0.06;

      const blob2X = 0.35 + Math.cos(time * 0.8) * 0.16 + mouseX * 0.04;
      const blob2Y = 0.60 + Math.sin(time * 1.1) * 0.14 + mouseY * 0.04;
      const blob2Radius = 0.38 + Math.cos(time * 1.0) * 0.05;

      const blob3X = 0.78 + Math.sin(time * 0.6) * 0.10 + mouseX * 0.03;
      const blob3Y = 0.72 + Math.cos(time * 0.9) * 0.12 + mouseY * 0.03;
      const blob3Radius = 0.32 + Math.sin(time * 0.8) * 0.04;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const nx = i / cols;
          const ny = j / rows;

          // Aspect-corrected radial distances to blob centers
          const aspect = width / height;
          const dx1 = (nx - blob1X) * aspect;
          const dy1 = ny - blob1Y;
          const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

          const dx2 = (nx - blob2X) * aspect;
          const dy2 = ny - blob2Y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          const dx3 = (nx - blob3X) * aspect;
          const dy3 = ny - blob3Y;
          const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

          // Organic 3D wave noise distortion over the blob surfaces
          const wave1 = Math.sin(nx * 5.2 + ny * 4.1 + time * 1.4) * 0.06;
          const wave2 = Math.cos(nx * 3.8 - ny * 5.2 + time * 1.1) * 0.05;
          const distortion = wave1 + wave2;

          // Soft Gaussian/smoothstep radial blob densities
          const d1 = smoothstep(blob1Radius + distortion, 0.0, dist1);
          const d2 = smoothstep(blob2Radius + distortion, 0.0, dist2);
          const d3 = smoothstep(blob3Radius + distortion, 0.0, dist3);

          // Metaball blend formula for smooth amorphous blob merging
          const blobDensity = Math.min(1.0, d1 * d1 + d2 * d2 + d3 * d3);

          if (blobDensity > 0.03) {
            // Smooth 3D surface elevation displacement
            const surfaceWave = Math.sin(nx * 4.5 + ny * 3.5 + time * 1.2) * 0.35 + Math.cos(nx * 2.8 - ny * 3.2 + time * 0.9) * 0.25;
            const heightNorm = (surfaceWave + 1) / 2;

            const offsetX = Math.sin(ny * 7.0 + time * 1.0) * 3.5 * mouseX;
            const offsetY = surfaceWave * 16.0 + mouseY * 12.0;

            const posX = i * gridSpacingX + offsetX;
            const posY = j * gridSpacingY + offsetY;

            // Continuous color blending across the amorphous blob
            const greenPulse = Math.sin(nx * 5.0 + ny * 3.5 + time * 1.6) * 0.5 + 0.5;
            const whitePulse = Math.cos(nx * 8.0 - ny * 6.0 + time * 2.0) * 0.5 + 0.5;

            if (isLight) {
              // Light Mode Crisp Emerald Palette
              let r = 20 + heightNorm * 20;
              let g = 110 + heightNorm * 50;
              let b = 60 + heightNorm * 30;

              const greenWeight = smoothstep(0.15, 0.75, greenPulse) * (0.35 + heightNorm * 0.65) * blobDensity;
              r = r * (1 - greenWeight) + 30 * greenWeight;
              g = g * (1 - greenWeight) + 150 * greenWeight;
              b = b * (1 - greenWeight) + 70 * greenWeight;

              const opacity = blobDensity * (0.15 + heightNorm * 0.6) * 0.65;
              ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${opacity})`;
              ctx.fillRect(posX, posY, pixelSize, pixelSize);
            } else {
              // Dark Mode Palette
              let r = 30 + heightNorm * 35;
              let g = 75 + heightNorm * 55;
              let b = 50 + heightNorm * 40;

              const greenWeight = smoothstep(0.15, 0.75, greenPulse) * (0.35 + heightNorm * 0.65) * blobDensity;
              r = r * (1 - greenWeight) + 34 * greenWeight;
              g = g * (1 - greenWeight) + 197 * greenWeight;
              b = b * (1 - greenWeight) + 94 * greenWeight;

              if (whitePulse > 0.80 && heightNorm > 0.5) {
                const whiteWeight = smoothstep(0.80, 1.0, whitePulse) * 0.6;
                r = r * (1 - whiteWeight) + 240 * whiteWeight;
                g = g * (1 - whiteWeight) + 255 * whiteWeight;
                b = b * (1 - whiteWeight) + 245 * whiteWeight;
              }

              const opacity = blobDensity * (0.12 + heightNorm * 0.68) * 0.8;
              ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${opacity})`;
              ctx.fillRect(posX, posY, pixelSize, pixelSize);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
