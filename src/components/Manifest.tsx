"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, CircuitBoard, PlaneTakeoff, Info } from "lucide-react";
import SectionHeading from "./SectionHeading";
import CountUp from "./CountUp";
import { PARTS, type Part } from "@/lib/eco";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CATS = ["ALL", "AIRCRAFT", "BRAIN", "SENSING", "OUTPUT & LOGGING"] as const;

const partsAmount = (p: Part, premiumDrone: boolean) =>
  p.cat === "AIRCRAFT" ? (premiumDrone ? 4500 : 2500) : Math.round((p.low + p.high) / 2);

export default function Manifest() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("ALL");
  const [premium, setPremium] = useState(false);

  const electronics = useMemo(
    () =>
      PARTS.filter((p) => p.cat !== "AIRCRAFT").reduce(
        (s, p) => s + Math.round((p.low + p.high) / 2) * p.qty,
        0
      ),
    []
  );
  const aircraft = premium ? 4500 : 2500;
  const total = electronics + aircraft;

  const rows = PARTS.filter((p) => cat === "ALL" || p.cat === cat);

  return (
    <section id="hardware" className="relative border-b border-line">
      <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          index="05"
          tag="HARDWARE MANIFEST"
          title={
            <>
              Every part. Every cedi. <span className="outline-text">Fully auditable.</span>
            </>
          }
          right="Planning estimates from current Greater Accra listings — GPS camera drones run roughly GH₵2,500–4,500. The full electronics payload costs less than a pair of sneakers."
        />

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* -------- parts table -------- */}
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  data-cursor
                  className={`border px-4 py-2 font-mono text-[10px] tracking-[0.2em] transition-all ${
                    cat === c
                      ? "border-neon bg-neon/10 text-neon"
                      : "border-line text-mute hover:border-neon/40 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="border border-line">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line bg-panel px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-dim sm:grid-cols-[2.2fr_1fr_auto]">
                <span>COMPONENT</span>
                <span className="hidden sm:block">RANGE (GH₵)</span>
                <span className="text-right">EST.</span>
              </div>
              <AnimatePresence mode="popLayout">
                {rows.map((p, i) => {
                  const amt = partsAmount(p, premium);
                  const w = Math.sqrt(p.high / 4500) * 100;
                  return (
                    <motion.div
                      layout
                      key={p.name}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.03 }}
                      className="group relative grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line/60 bg-panel/50 px-5 py-4 transition-colors last:border-0 hover:bg-panel2 sm:grid-cols-[2.2fr_1fr_auto]"
                    >
                      <div
                        aria-hidden
                        className="absolute bottom-0 left-0 h-px bg-neon/25 transition-all"
                        style={{ width: `${w}%` }}
                      />
                      <div>
                        <p className="text-[15px] font-medium text-ink transition-colors group-hover:text-neon">
                          {p.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-dim">
                          {p.cat} · QTY {p.qty} — {p.note}
                        </p>
                      </div>
                      <span className="hidden font-mono text-[11px] text-mute sm:block">
                        {p.low === p.high ? `GH₵${p.low}` : `GH₵${p.low}–${p.high}`}
                      </span>
                      <span className="text-right font-mono text-[12px] font-semibold text-ink">
                        <CountUp value={amt * p.qty} duration={0.5} />
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <p className="mt-4 flex items-start gap-2 font-mono text-[10px] leading-relaxed tracking-wider text-dim">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silt" />
              PRICES VARY BY SELLER AND WEEK — TREAT AS PLANNING ESTIMATES, NOT SHOP QUOTATIONS.
            </p>
          </div>

          {/* -------- totals card -------- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className="hud-panel tick-corners p-7 sm:p-9"
            >
              <p className="mb-6 flex items-center gap-3 border-b border-line pb-4 font-mono text-[11px] tracking-[0.3em] text-mute">
                <Coins className="h-4 w-4 text-neon" /> BUILD COST CALCULATOR
              </p>

              <div className="mb-8 grid grid-cols-2 gap-px border border-line bg-line">
                {[
                  { label: "BUDGET BUILD", sub: "GH₵2,500 AIRCRAFT", active: !premium, onClick: () => setPremium(false) },
                  { label: "PRESENTATION", sub: "GH₵4,500 AIRCRAFT", active: premium, onClick: () => setPremium(true) },
                ].map((b) => (
                  <button
                    key={b.label}
                    onClick={b.onClick}
                    data-cursor
                    className={`p-4 text-left transition-colors ${b.active ? "bg-neon/10" : "bg-panel hover:bg-panel2"}`}
                  >
                    <p className={`font-mono text-[10px] tracking-[0.18em] ${b.active ? "text-neon" : "text-mute"}`}>
                      {b.label}
                    </p>
                    <p className="mt-1 font-mono text-[9px] text-dim">{b.sub}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4 font-mono text-[12px] tracking-wider">
                <div className="flex items-center justify-between text-mute">
                  <span className="flex items-center gap-2">
                    <CircuitBoard className="h-3.5 w-3.5 text-neon" /> ELECTRONICS PAYLOAD
                  </span>
                  <span className="text-ink">
                    GH₵<CountUp value={electronics} duration={0.6} />
                  </span>
                </div>
                <div className="h-px bg-line" />
                <div className="flex items-center justify-between text-mute">
                  <span className="flex items-center gap-2">
                    <PlaneTakeoff className="h-3.5 w-3.5 text-silt" /> AIRCRAFT
                  </span>
                  <span className="text-ink">
                    GH₵<CountUp value={aircraft} duration={0.6} />
                  </span>
                </div>
              </div>

              <div className="mt-8 border border-neon/30 bg-neon/5 p-5">
                <p className="font-mono text-[10px] tracking-[0.3em] text-mute">TOTAL SYSTEM</p>
                <p className="display-tight mt-1 text-5xl font-bold text-neon">
                  <CountUp value={total} duration={0.7} />
                  <span className="ml-1 text-base font-normal text-mute">GH₵</span>
                </p>
                <p className="mt-2 font-mono text-[10px] tracking-wider text-dim">
                  ≈ GH₵{premium ? "5,200" : "3,200"} TARGET BUDGET · {premium ? "JUDGE-READY PRESENTATION" : "MINIMUM VIABLE SENTRY"}
                </p>
              </div>

              <div className="mt-6 space-y-2 font-mono text-[10px] leading-relaxed tracking-wider text-mute">
                <p>▸ WITHOUT DRONE THE PAYLOAD COSTS UNDER GH₵800</p>
                <p>▸ EVERY CEDI TRACES TO A LINE IN THE MANIFEST</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
