"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ShieldCheck, XCircle, CheckCircle2, Eye, AlertTriangle } from "lucide-react";
import SectionHeading from "./SectionHeading";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

const QUOTE =
  "A sentry is a guard that watches over something valuable. Ghana's rivers, forests and land are valuable resources. ECO-SENTRY is our environmental guard in the sky — it watches for the warning signs, identifies changes and alerts us early enough to act responsibly.";

const NOT_IT = ["Detects gold underground", "Proves a crime occurred", "Declares “galamsey confirmed”", "Replaces environmental authorities"];
const IT_IS = [
  "Flags combinations of warning signs",
  "Scores environmental change 0–100",
  "Says “human verification required”",
  "Gives authorities evidence to inspect",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Mission() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.42"] });
  const words = QUOTE.split(" ");

  return (
    <section id="mission" className="relative border-b border-line">
      <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          index="01"
          tag="THE MISSION"
          title={
            <>
              We don&apos;t want technology to tell us the damage{" "}
              <span className="outline-text">has already</span> happened.
            </>
          }
          right="ECO-SENTRY is a screening and learning tool — built by students, for science, with one honest rule: muddy water is a warning sign, not a verdict."
        />

        <p ref={ref} className="display-tight max-w-5xl text-2xl font-medium leading-snug text-ink sm:text-4xl">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2.5) / words.length)]}>
              {w}
            </Word>
          ))}
        </p>

        {/* honesty duality */}
        <div className="mt-24 grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="group relative bg-panel p-8 sm:p-12"
          >
            <div className="mb-8 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center border border-lv-red/40 bg-lv-red/10">
                <XCircle className="h-5 w-5 text-lv-red" />
              </span>
              <p className="font-mono text-[11px] tracking-[0.3em] text-mute">
                WHAT IT <span className="text-lv-red">NEVER</span> CLAIMS
              </p>
            </div>
            <ul className="space-y-5">
              {NOT_IT.map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: EASE }}
                  className="flex items-start gap-4 text-mute transition-colors group-hover:text-ink/80"
                >
                  <span className="mt-1 font-mono text-[10px] text-lv-red">✕</span>
                  <span className="text-lg sm:text-xl">{t}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="group relative bg-panel2 p-8 sm:p-12"
          >
            <div className="pointer-events-none absolute right-6 top-6 opacity-40">
              <ShieldCheck className="h-8 w-8 text-neon" />
            </div>
            <div className="mb-8 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center border border-neon/40 bg-neon/10">
                <CheckCircle2 className="h-5 w-5 text-neon" />
              </span>
              <p className="font-mono text-[11px] tracking-[0.3em] text-mute">
                WHAT IT <span className="text-neon">ACTUALLY</span> DOES
              </p>
            </div>
            <ul className="space-y-5">
              {IT_IS.map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: EASE }}
                  className="flex items-start gap-4 text-mute transition-colors group-hover:text-ink"
                >
                  <span className="mt-1 font-mono text-[10px] text-neon">✓</span>
                  <span className="text-lg sm:text-xl">{t}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-px grid gap-px border border-t-0 border-line bg-line sm:grid-cols-3"
        >
          {[
            { icon: Eye, t: "Muddy river after heavy rain?", d: "Same visual signature as excavation runoff. That is why every flag ends with a human." },
            { icon: AlertTriangle, t: "Thresholds are prototype values", d: "Every number is calibrated against control samples in Accra — never claimed as universal science." },
            { icon: ShieldCheck, t: "Safe by design", d: "We never touch flight control. The drone flies itself; our payload only observes." },
          ].map((c) => (
            <div key={c.t} className="bg-panel p-7 transition-colors hover:bg-panel2">
              <c.icon className="mb-4 h-5 w-5 text-silt" />
              <p className="mb-2 font-semibold text-ink">{c.t}</p>
              <p className="font-mono text-[11px] leading-relaxed text-mute">{c.d}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
