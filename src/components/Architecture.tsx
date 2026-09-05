"use client";

import { motion } from "framer-motion";
import {
  Plane, Camera, BrainCircuit, Cpu, LayoutDashboard, Siren,
  Lock, Wrench, ArrowDown,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NODES = [
  { icon: Plane, tag: "AIRFRAME", title: "Commercial Drone", body: "Ready-made GPS camera drone. Its factory flight computer flies — we never modify it.", accent: false },
  { icon: Camera, tag: "EYES", title: "Aerial Camera", body: "Looks straight down over the demonstration grid. The single most important sensor on the aircraft.", accent: false },
  { icon: BrainCircuit, tag: "MIND", title: "AI Analysis", body: "Classifies each frame: vegetation, bare soil, muddy water, pit-like features, machinery.", accent: false },
  { icon: Cpu, tag: "BRAIN", title: "ESP32 Engine", body: "Cleans sensor readings, fuses AI output with ground data, computes the 0–100 score.", accent: true },
  { icon: LayoutDashboard, tag: "FACE", title: "Dashboard", body: "Wi-Fi feed to the ECO-SENTRY dashboard: score, zone, evidence chain, live status.", accent: false },
  { icon: Siren, tag: "VOICE", title: "Warning Level", body: "Green → yellow → orange → red. LEDs, buzzer, OLED — and the words “human verification”.", accent: false },
];

export default function Architecture() {
  return (
    <section id="system" className="relative border-b border-line bg-panel/30">
      <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          index="02"
          tag="SYSTEM ARCHITECTURE"
          title={
            <>
              Six systems. <span className="text-neon">One signal chain.</span>
            </>
          }
          right="Every stage hands clean data to the next. No stage controls the aircraft. The intelligence lives in the payload, never in the flight controller."
        />

        {/* chain */}
        <div className="relative">
          {/* desktop connector line */}
          <div className="pointer-events-none absolute left-8 right-8 top-[52px] hidden h-px bg-line xl:block" aria-hidden>
            <div className="flow-track absolute inset-0">
              <div className="flow-bits" />
            </div>
          </div>
          {/* mobile connector */}
          <div className="pointer-events-none absolute bottom-8 left-[27px] top-8 w-px bg-line xl:hidden" aria-hidden />

          <div className="grid gap-y-10 sm:grid-cols-2 xl:grid-cols-6 xl:gap-x-6">
            {NODES.map((n, i) => (
              <motion.div
                key={n.title}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.85, ease: EASE, delay: i * 0.1 }}
                className="group relative pl-16 sm:pl-0"
                data-cursor
              >
                <div
                  className={`relative z-10 mb-6 grid h-14 w-14 place-items-center border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(56,242,160,0.25)] ${
                    n.accent
                      ? "border-neon bg-neon/15"
                      : "border-line bg-panel group-hover:border-neon/50"
                  }`}
                >
                  <n.icon className="h-6 w-6 text-neon" />
                  <span className="absolute -right-2 -top-2 bg-abyss px-1.5 font-mono text-[9px] text-dim">
                    0{i + 1}
                  </span>
                </div>
                <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-silt">{n.tag}</p>
                <h3 className="display-tight mb-2 text-xl font-bold text-ink">{n.title}</h3>
                <p className="text-sm leading-relaxed text-mute">{n.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* separation callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-24 grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2"
        >
          <div className="tick-corners bg-panel p-8 sm:p-12">
            <div className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-mute">
              <Lock className="h-4 w-4 text-lv-red" />
              FLIGHT CONTROL — LOCKED, FACTORY-SEALED
            </div>
            <h3 className="display-tight mb-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              The drone flies itself.
              <br />
              <span className="outline-text">We never rewrite it.</span>
            </h3>
            <p className="max-w-md leading-relaxed text-mute">
              No homemade flight controller. No motor rewiring. No dangling pH probes. The aircraft
              stays exactly as its manufacturer certified it — which is precisely what makes this
              project safe enough to fly at a school science fair.
            </p>
          </div>
          <div className="tick-corners bg-panel2 p-8 sm:p-12">
            <div className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-mute">
              <Wrench className="h-4 w-4 text-neon" />
              OUR INNOVATION — THE PAYLOAD LAYER
            </div>
            <div className="flex flex-col gap-4">
              {[
                "Visual warning signs from the camera feed",
                "Ground-station turbidity, pH, temperature & humidity",
                "GPS position + labelled demonstration zones",
                "Fused into one transparent, auditable warning score",
              ].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease: EASE }}
                  className="flex items-center gap-4 border border-line bg-panel px-5 py-4 transition-colors hover:border-neon/40"
                >
                  <ArrowDown className="h-4 w-4 shrink-0 rotate-[-90deg] text-neon" />
                  <span className="font-mono text-xs tracking-wide text-ink/90">{t}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
