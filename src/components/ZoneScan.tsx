"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, RotateCw, UserCheck, Gauge } from "lucide-react";
import SectionHeading from "./SectionHeading";
import CountUp from "./CountUp";
import { ZONES, levelFor } from "@/lib/eco";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CLASSES: { key: keyof (typeof ZONES)[0]["ai"]; label: string }[] = [
  { key: "vegetation", label: "HEALTHY VEGETATION" },
  { key: "bareSoil", label: "BARE / DISTURBED SOIL" },
  { key: "muddyWater", label: "MUDDY-LOOKING WATER" },
  { key: "pit", label: "EXCAVATION / PIT-LIKE" },
  { key: "machinery", label: "MACHINERY-LIKE OBJECT" },
];

export default function ZoneScan() {
  const [zi, setZi] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [scanKey, setScanKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const zone = ZONES[zi];
  const level = levelFor(zone.expected);

  const runScan = useCallback((idx: number) => {
    setZi(idx);
    setScanning(true);
    setScanKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!scanning) return;
    timer.current = setTimeout(() => setScanning(false), 1900);
    return () => clearTimeout(timer.current);
  }, [scanning, scanKey]);

  const top = CLASSES.reduce((a, b) => (zone.ai[b.key] > zone.ai[a.key] ? b : a));

  return (
    <section id="scan" className="relative border-b border-line">
      <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          index="03"
          tag="COMPETITION DEMONSTRATION"
          title={
            <>
              Three zones. <span className="outline-text">One honest verdict.</span>
            </>
          }
          right="A labelled indoor grid — exactly as the judging protocol allows. Fly the drone, scan each zone, watch the AI build a case that a human must still confirm."
        />

        {/* zone tabs */}
        <div className="mb-10 grid gap-px border border-line bg-line sm:grid-cols-3">
          {ZONES.map((z, i) => {
            const lv = levelFor(z.expected);
            const active = i === zi;
            return (
              <button
                key={z.id}
                onClick={() => runScan(i)}
                data-cursor
                className={`group relative p-5 text-left transition-colors ${
                  active ? "bg-panel2" : "bg-panel hover:bg-panel2/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-dim">ZONE {z.id}</span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: lv.color, boxShadow: `0 0 10px ${lv.color}` }}
                  />
                </div>
                <p className={`display-tight mt-2 text-lg font-bold transition-colors ${active ? "text-ink" : "text-mute group-hover:text-ink"}`}>
                  {z.name}
                </p>
                <p className="mt-1 font-mono text-[10px] text-dim">{z.airfieldCode}</p>
                {active && (
                  <motion.span layoutId="zone-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-neon" />
                )}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          {/* ------------- image / viewport ------------- */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="hud-panel tick-corners scanlines relative overflow-hidden"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                key={zone.image}
                src={zone.image}
                alt={`Aerial view of zone ${zone.id} — ${zone.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              {/* tint + vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-transparent to-abyss/40" />
              <div className="absolute inset-0 grid-bg opacity-60 mix-blend-screen" />

              {/* scan sweep */}
              {scanning && (
                <div key={scanKey} className="absolute inset-x-0 animate-scan-y" style={{ height: 60 }}>
                  <div className="h-full w-full bg-gradient-to-b from-transparent via-neon/25 to-neon/60 blur-[1px]" />
                  <div className="absolute bottom-0 h-0.5 w-full bg-neon shadow-[0_0_18px_rgba(56,242,160,0.9)]" />
                </div>
              )}

              {/* reticle */}
              <motion.div
                animate={scanning ? { scale: [1, 1.08, 1], rotate: 90 } : { scale: 1, rotate: 90 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-hidden
              >
                <div className="relative h-36 w-36 sm:h-48 sm:w-48">
                  {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
                    <span key={c} className={`absolute h-6 w-6 border-neon ${c}`} />
                  ))}
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon" />
                  <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-neon/50 animate-spin-slow" />
                </div>
              </motion.div>

              {/* HUD labels */}
              <div className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.25em]">
                <p className="flex items-center gap-2 text-neon">
                  <span className="h-1.5 w-1.5 rounded-full bg-lv-red animate-pulse-dot" /> REC · CAM-A
                </p>
                <p className="mt-1 text-ink/70">{zone.airfieldCode}</p>
              </div>
              <div className="absolute right-4 top-4 border border-line bg-abyss/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-mute">
                {scanning ? (
                  <span className="flex items-center gap-2 text-neon">
                    <ScanLine className="h-3 w-3" /> SCANNING…
                  </span>
                ) : (
                  <span className="text-neon">ANALYSIS COMPLETE</span>
                )}
              </div>

              {/* bottom info bar */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                <p className="max-w-md font-mono text-[11px] leading-relaxed text-ink/80">
                  {zone.desc}
                </p>
                <button
                  onClick={() => runScan(zi)}
                  data-cursor
                  className="flex shrink-0 items-center gap-2 border border-neon/50 bg-abyss/70 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-neon transition-colors hover:bg-neon hover:text-abyss"
                >
                  <RotateCw className="h-3 w-3" /> RE-SCAN
                </button>
              </div>
            </div>
          </motion.div>

          {/* ------------- AI analysis panel ------------- */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
            className="hud-panel tick-corners flex flex-col p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <p className="font-mono text-[11px] tracking-[0.3em] text-mute">
                AI IMAGE CLASSIFIER <span className="text-dim">v1.3</span>
              </p>
              <span className="font-mono text-[10px] text-dim">ZONE {zone.id}</span>
            </div>

            <div className="flex-1 space-y-5" key={`bars-${zi}-${scanKey}`}>
              {CLASSES.map((c, i) => {
                const v = zone.ai[c.key];
                const hot = v > 0.7 && c.key !== "vegetation";
                return (
                  <div key={c.key}>
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-[0.18em]">
                      <span className={hot ? "text-ink" : "text-mute"}>{c.label}</span>
                      <span className={hot ? "text-neon" : "text-dim"}>
                        {scanning ? "---%" : <CountUp value={v * 100} duration={0.7} />}{!scanning && "%"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden bg-line/60">
                      {scanning ? (
                        <motion.div
                          className="h-full w-1/3 bg-neon/50"
                          animate={{ x: ["-100%", "320%"] }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
                        />
                      ) : (
                        <motion.div
                          className="h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${v * 100}%` }}
                          transition={{ duration: 0.9, ease: EASE, delay: i * 0.07 }}
                          style={{ background: hot ? "#ff8a1f" : c.key === "vegetation" ? "#2ef09b" : "#8fb8a5" }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* verdict */}
            <AnimatePresence mode="wait">
              {!scanning && (
                <motion.div
                  key={`verdict-${zi}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="mt-7"
                >
                  <div className="flex items-center justify-between border border-line bg-panel px-4 py-3">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-mute">TOP PATTERN</span>
                    <span className="font-mono text-[11px] tracking-[0.15em] text-neon">
                      {top.label} — {(zone.ai[top.key] * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div
                    className="mt-3 flex items-center justify-between border px-4 py-4"
                    style={{ borderColor: `${level.color}55`, background: level.dim }}
                  >
                    <div>
                      <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-mute">
                        <Gauge className="h-3.5 w-3.5" style={{ color: level.color }} /> FIELD SCORE
                      </p>
                      <p className="display-tight mt-1 text-4xl font-bold" style={{ color: level.color }}>
                        ≈{zone.expected}<span className="text-lg text-mute">/100</span>
                      </p>
                    </div>
                    <span
                      className="px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.2em]"
                      style={{ background: level.color, color: "#04100a" }}
                    >
                      {level.label}
                    </span>
                  </div>
                  <p className="mt-4 flex items-start gap-2 font-mono text-[10px] leading-relaxed tracking-wider text-mute">
                    <UserCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silt" />
                    AI OUTPUT IS A SUGGESTION ONLY — A HUMAN REVIEWS EVERY FRAME BEFORE ANY ACTION.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* detected signs chips */}
        <motion.div
          key={`chips-${zi}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-dim">DETECTED SIGNS →</span>
          {zone.signs.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
              className="border border-line bg-panel px-4 py-2 font-mono text-[11px] tracking-wider text-ink/90"
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
