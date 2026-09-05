"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Volume2, MapPin, FileWarning, CircleDot } from "lucide-react";
import SectionHeading from "./SectionHeading";
import CountUp from "./CountUp";
import { LEVELS, levelFor, LED_COLORS, LED_NAMES } from "@/lib/eco";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FACTORS = [
  { key: "water", label: "VISUAL WATER DISTURBANCE", max: 25, hint: "Muddy-looking river in frame" },
  { key: "land", label: "BARE / DISTURBED LAND", max: 25, hint: "Vegetation stripped, soil exposed" },
  { key: "pit", label: "EXCAVATION / PIT-LIKE FEATURE", max: 20, hint: "Dug-out pits or trenches visible" },
  { key: "other", label: "OTHER ENVIRONMENTAL INDICATOR", max: 15, hint: "Ground turbidity / pH anomalies" },
  { key: "zone", label: "SENSITIVE ZONE", max: 15, hint: "Protected riverbank or forest reserve" },
] as const;

const PRESETS: { name: string; values: number[] }[] = [
  { name: "ZONE A · NORMAL", values: [20, 10, 0, 15, 0] },
  { name: "ZONE B · CAUTION", values: [85, 80, 10, 25, 0] },
  { name: "ZONE C · PRIORITY", values: [80, 90, 85, 75, 80] },
];

/* polar helper for the gauge */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
}
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export default function ScoreEngine() {
  const [vals, setVals] = useState<number[]>([80, 90, 85, 75, 80]);
  const [zone, setZone] = useState("B-03");
  const audioCtx = useRef<AudioContext | null>(null);

  const points = FACTORS.map((f, i) => Math.round((vals[i] / 100) * f.max));
  const score = Math.min(100, points.reduce((a, b) => a + b, 0));
  const level = levelFor(score);

  const [buzzing, setBuzzing] = useState(false);

  const playTone = () => {
    try {
      if (!audioCtx.current) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx.current = new Ctx();
      }
      const ctx = audioCtx.current;
      void ctx.resume();
      setBuzzing(true);
      const t0 = ctx.currentTime + 0.05;
      const { freq, dur, reps, gap = 0.18 } = level.tone;
      for (let i = 0; i < reps; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        const s = t0 + i * (dur + gap);
        gain.gain.setValueAtTime(0.0001, s);
        gain.gain.exponentialRampToValueAtTime(0.16, s + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, s + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(s);
        osc.stop(s + dur + 0.02);
      }
      const total = reps * (dur + (level.tone.gap ?? 0.18)) * 1000;
      setTimeout(() => setBuzzing(false), total);
    } catch {
      setBuzzing(false);
    }
  };

  const needle = (score / 100) * 240 - 120;
  const dash = useMemo(() => (score / 100) * 100, [score]);

  return (
    <section id="engine" className="relative overflow-hidden border-b border-line bg-panel/30">
      {/* level-colored ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]"
        animate={{ backgroundColor: level.color }}
        transition={{ duration: 0.8 }}
        style={{ opacity: 0.07 }}
      />

      <div className="relative mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          index="04"
          tag="THE WARNING ENGINE"
          title={
            <>
              Turn signs into <span style={{ color: level.color }}>a 0–100 verdict.</span>
            </>
          }
          right="Drag the indicators. This is the exact logic running on the ESP32: five weighted factors fused into one transparent score — capped at 100, never hidden."
        />

        {/* presets */}
        <div className="mb-12 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-dim">LOAD A SCENARIO →</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setVals([...p.values])}
              data-cursor
              className="border border-line bg-panel px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-mute transition-all hover:border-neon/50 hover:text-ink"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-12">
          {/* -------- inputs -------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="hud-panel tick-corners p-6 sm:p-8 xl:col-span-5"
          >
            <p className="mb-8 border-b border-line pb-4 font-mono text-[11px] tracking-[0.3em] text-mute">
              INPUT MATRIX <span className="text-dim">/ SENSOR FUSION</span>
            </p>
            <div className="space-y-8">
              {FACTORS.map((f, i) => (
                <div key={f.key}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <label htmlFor={`f-${f.key}`} className="font-mono text-[11px] tracking-[0.15em] text-ink">
                      {f.label}
                    </label>
                    <span className="font-mono text-[11px] text-dim">
                      <span style={{ color: level.color }} className="font-semibold">+{points[i]}</span>
                      <span> / {f.max}</span>
                    </span>
                  </div>
                  <p className="mb-2 font-mono text-[10px] text-dim">{f.hint}</p>
                  <input
                    id={`f-${f.key}`}
                    type="range"
                    min={0}
                    max={100}
                    value={vals[i]}
                    onChange={(e) => {
                      const n = [...vals];
                      n[i] = Number(e.target.value);
                      setVals(n);
                    }}
                    className="eco-range"
                    style={{ "--fill": `${vals[i]}%`, "--track-color": level.color } as CSSProperties}
                    aria-label={f.label}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-line pt-5 font-mono text-[10px] leading-relaxed tracking-wider text-dim">
              FUSION: {points.join(" + ")} = <span style={{ color: level.color }}>{score}</span> · min(total, 100)
            </div>
          </motion.div>

          {/* -------- gauge -------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="hud-panel tick-corners flex flex-col items-center justify-center p-8 xl:col-span-3"
          >
            <div className="relative">
              <svg viewBox="0 0 200 175" className="w-64 sm:w-72">
                <path d={arcPath(100, 108, 84, -120, 120)} fill="none" stroke="#16232a" strokeWidth="10" strokeLinecap="round" />
                {Array.from({ length: 21 }).map((_, i) => {
                  const a = -120 + i * 12;
                  const [x0, y0] = polar(100, 108, 70, a);
                  const [x1, y1] = polar(100, 108, i % 5 === 0 ? 62 : 66, a);
                  return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#2a3a38" strokeWidth={i % 5 === 0 ? 2 : 1} />;
                })}
                <motion.path
                  d={arcPath(100, 108, 84, -120, 120)}
                  fill="none"
                  stroke={level.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  initial={false}
                  animate={{ strokeDashoffset: 100 - dash, stroke: level.color }}
                  transition={{ duration: 0.7, ease: EASE }}
                  style={{ filter: `drop-shadow(0 0 10px ${level.color})` }}
                />
                <motion.g
                  initial={false}
                  animate={{ rotate: needle }}
                  transition={{ type: "spring", stiffness: 60, damping: 12 }}
                  style={{ transformOrigin: "100px 108px" }}
                >
                  <line x1="100" y1="108" x2="100" y2="38" stroke="#eaf5ee" strokeWidth="2.5" />
                  <circle cx="100" cy="38" r="3.5" fill={level.color} />
                </motion.g>
                <circle cx="100" cy="108" r="7" fill="#0a1216" stroke={level.color} strokeWidth="2" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center">
                <div className="display-tight text-6xl font-bold" style={{ color: level.color }}>
                  <CountUp value={score} duration={0.5} />
                </div>
                <div className="font-mono text-[10px] tracking-[0.4em] text-dim">/ 100</div>
              </div>
            </div>
            <AnimatePresenceGuard label={level.label} color={level.color} range={level.range} />
          </motion.div>

          {/* -------- outputs -------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="flex flex-col gap-6 xl:col-span-4"
          >
            {/* OLED */}
            <div className="oled relative h-44 rounded-md p-5 font-mono text-[13px] text-neon">
              <div className="oled-scan pointer-events-none absolute inset-0 rounded-md" />
              <p className="tracking-[0.3em]">ECO-SENTRY AIR</p>
              <p className="mt-2 tracking-widest">
                SCORE: <CountUp value={score} duration={0.5} className="font-semibold" />
                <span className="text-neon/50">/100</span>
              </p>
              <div className="mt-2 flex gap-[3px]" aria-hidden>
                {Array.from({ length: 20 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2"
                    style={{
                      background: i < Math.round(score / 5) ? level.color : "rgba(56,242,160,0.12)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 tracking-widest">
                STATUS: {level.label}
                <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-neon" />
              </p>
              <p className="absolute bottom-3 right-4 font-mono text-[9px] tracking-[0.25em] text-neon/40">SSD1306 · I2C 0x3C</p>
            </div>

            {/* LEDs */}
            <div className="hud-panel grid grid-cols-4 gap-3 p-5">
              {LED_COLORS.map((c, i) => {
                const on = level.leds[i];
                return (
                  <div key={c} className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{
                        backgroundColor: on ? c : "#101a1d",
                        boxShadow: on ? `0 0 18px ${c}, 0 0 42px ${c}55` : "0 0 0 rgba(0,0,0,0)",
                      }}
                      transition={{ duration: 0.4 }}
                      className={`h-8 w-8 rounded-full border ${on ? "border-transparent" : "border-line"}`}
                    />
                    <span className={`font-mono text-[8px] tracking-[0.2em] ${on ? "text-ink" : "text-dim"}`}>
                      {LED_NAMES[i]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* buzzer */}
            <button
              onClick={playTone}
              data-cursor
              className="group flex items-center justify-between border border-line bg-panel p-5 text-left transition-colors hover:border-neon/40"
            >
              <div>
                <p className="font-mono text-[11px] tracking-[0.3em] text-mute">PIEZO BUZZER · GPIO 13</p>
                <p className="mt-1 font-mono text-[10px] text-dim">
                  {level.tone.freq}Hz × {level.tone.reps} pulse{level.tone.reps > 1 ? "s" : ""} — fires as score crosses tiers
                </p>
              </div>
              <span
                className={`grid h-11 w-11 place-items-center border transition-all ${
                  buzzing ? "border-neon bg-neon/15" : "border-line group-hover:border-neon/40"
                }`}
              >
                <Volume2 className={`h-5 w-5 text-neon ${buzzing ? "animate-buzz" : ""}`} />
              </span>
            </button>
          </motion.div>
        </div>

        {/* -------- dashboard -------- */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-10 overflow-hidden border border-line"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-panel px-6 py-4">
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-ink">
              <CircleDot className="h-4 w-4 text-neon" /> ECO-SENTRY — LIVE DASHBOARD FEED
            </p>
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-mute">
              <MapPin className="h-3.5 w-3.5 text-silt" />
              OBSERVATION ZONE
              <div className="flex border border-line">
                {["A-01", "B-03", "C-02"].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    data-cursor
                    className={`px-3 py-1.5 transition-colors ${
                      zone === z ? "bg-neon text-abyss" : "text-mute hover:text-ink"
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-line md:grid-cols-3">
            <div className="bg-panel2 p-6">
              <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-dim">STATUS</p>
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ backgroundColor: level.color, boxShadow: `0 0 16px ${level.color}` }}
                  className="h-3.5 w-3.5 rounded-full"
                />
                <span className="display-tight text-2xl font-bold" style={{ color: level.color }}>
                  {level.label}
                </span>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-wider text-mute">{level.short} · TIER {LEVELS.indexOf(level) + 1}/4</p>
            </div>

            <div className="bg-panel2 p-6">
              <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-dim">ACTIVE INDICATORS</p>
              <div className="flex flex-wrap gap-2">
                {FACTORS.map((f, i) =>
                  points[i] > 0 ? (
                    <span
                      key={f.key}
                      className="border px-2.5 py-1 font-mono text-[9px] tracking-[0.15em]"
                      style={{ borderColor: `${level.color}66`, color: level.color }}
                    >
                      {f.label.split(" ").slice(0, 2).join(" ")} +{points[i]}
                    </span>
                  ) : null
                )}
                {points.every((p) => p === 0) && (
                  <span className="font-mono text-[10px] text-dim">No indicators above threshold</span>
                )}
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-wider text-mute">ZONE {zone} · LOGGED TO MICROSD</p>
            </div>

            <div className="flex flex-col justify-between bg-panel2 p-6">
              <div>
                <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-dim">RECOMMENDED ACTION</p>
                <p className="flex items-start gap-2 font-mono text-[11px] leading-relaxed tracking-wider text-ink">
                  <FileWarning className="mt-0.5 h-4 w-4 shrink-0" style={{ color: level.color }} />
                  {level.action}
                </p>
              </div>
              <p className="mt-4 border border-dashed px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-mute" style={{ borderColor: `${level.color}55` }}>
                HUMAN VERIFICATION REQUIRED — NOT AN ACCUSATION
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* status pill under gauge */
function AnimatePresenceGuard({ label, color, range }: { label: string; color: string; range: string }) {
  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 flex flex-col items-center gap-2"
    >
      <span
        className="px-5 py-2 font-mono text-xs font-semibold tracking-[0.3em]"
        style={{ background: color, color: "#04100a", boxShadow: `0 0 26px ${color}66` }}
      >
        {label}
      </span>
      <span className="font-mono text-[10px] tracking-[0.28em] text-dim">SCORE BAND {range}</span>
    </motion.div>
  );
}
