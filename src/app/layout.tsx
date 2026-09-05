import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sg",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ECO-SENTRY — Smart Early-warning Network for Threat Recognition",
  description:
    "AI-assisted aerial environmental monitoring. A Ghana student-built drone payload that watches for environmental warning signs before the damage is done — a screening and learning tool, never an accusation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-abyss text-ink antialiased">{children}</body>
    </html>
  );
}
