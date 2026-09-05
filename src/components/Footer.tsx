"use client";

import { motion } from "framer-motion";
import { Radar, ArrowUp } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACRONYM: { letter: string; word: string; desc: string }[] = [
  { letter: "E", word: "ENVIRONMENTAL", desc: "Protecting Ghana's natural world" },
  { letter: "C", word: "CONSERVATION", desc: "Rivers, vegetation and land" },
  { letter: "O", word: "OBSERVATION", desc: "Watching from above" },
  { letter: "S", word: "SMART", desc: "AI + sensors analyse every frame" },
  { letter: "E", word: "EARLY-WARNING", desc: "Before destruction becomes severe" },
  { letter: "N", word: "NETWORK", desc: "Camera · GPS · sensors · AI · dashboard" },
  { letter: "T", word: "THREAT", desc: "Combinations of warning signs" },
  { letter: "R", word: "RECOGNITION", desc: "Flagged for human verification" },
  { letter: "Y", word: "YOUR MOVE", desc: "You decide what happens next" },
];

export default function Footer() {
  return (
    <footer className="relative">
      {/* acronym grid */}
      <div className="mx-auto max-w-[1500px] px-6 pt-28 sm:px-10 sm:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 font-mono text-[11px] tracking-[0.35em] text-mute"
        >
          ECO—SENTRY · DECODED
        </motion.p>

        <div className="grid grid-cols-3 border border-line sm:grid-cols-9">
          {ACRONYM.map((a, i) => (
            <motion.div
              key={a.word + i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
              data-cursor
              className={`group relative border-line p-4 transition-colors duration-300 hover:bg-neon sm:p-5 ${
                i % 3 !== 2 ? "border-r" : "sm:border-r"
              } ${i < 6 ? "border-b sm:border-b-0" : ""} ${i < 3 ? "max-sm:border-b" : ""} ${
                i === 8 ? "sm:border-r-0" : ""
              } ${i === 2 || i === 5 ? "max-sm:border-r-0" : ""}`}
            >
              <p className="display-tight text-5xl font-bold text-neon transition-colors duration-300 group-hover:text-abyss sm:text-6xl">
                {a.letter}
              </p>
              <p className="mt-3 font-mono text-[9px] tracking-[0.14em] text-ink/85 transition-colors duration-300 group-hover:text-abyss sm:text-[10px]">
                {a.word}
              </p>
              <p className="mt-1 hidden font-mono text-[8px] leading-relaxed text-dim transition-colors duration-300 group-hover:text-abyss/70 lg:block">
                {a.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* giant tagline */}
      <div className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="display-tight text-[9.5vw] font-bold leading-[0.95] sm:text-[7vw]"
        >
          <span className="outline-green block">BEFORE THE RIVER</span>
          <span className="block text-ink">
            TURNS BROWN, <span className="text-silt">ECO-SENTRY</span>
          </span>
          <span className="outline-text block">WATCHES.</span>
        </motion.h2>
      </div>

      {/* bottom bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-line bg-panel">
              <Radar className="h-4 w-4 text-neon" />
            </span>
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-ink">ECO—SENTRY</p>
              <p className="font-mono text-[9px] tracking-[0.2em] text-dim">
                ENVIRONMENTAL &amp; CONSERVATION OBSERVATION
              </p>
            </div>
          </div>

          <p className="max-w-md font-mono text-[10px] leading-relaxed tracking-wider text-mute">
            A SCREENING &amp; LEARNING TOOL — NEVER AN ENFORCEMENT DEVICE. BUILT WITH A COMMERCIAL
            DRONE, AN ESP32, AND A COMMITMENT TO HONEST SCIENCE.
          </p>

          <a
            href="#top"
            data-cursor
            className="group flex items-center gap-3 border border-line px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-mute transition-colors hover:border-neon/50 hover:text-neon"
          >
            RETURN TO ALTITUDE
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
