import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono, Doto, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RECEIPT SCANNER // RECEIPT ARCHIVE INSTRUMENT",
  description: "Monochromatic precision receipt archival and telemetry platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JK Receipt",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-512x512.png",
  },
};

import FluidCursorEffect from "./components/SmokeyCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable} ${doto.variable} ${inter.variable} ${plusJakartaSans.variable}`}>
      <body>
        <FluidCursorEffect />
        {children}
      </body>
    </html>
  );
}

