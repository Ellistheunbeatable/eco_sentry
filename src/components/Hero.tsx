"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Crosshair, Satellite, Camera, ChevronDown } from "lucide-react";

/* -------------------------------------------------------------
   Flow-field canvas: a monitored river rendered as living data.
   Green particles = land signals, silt-brown band = the river.
-------------------------------------------------------------- */
function RiverCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, t = 0;

    type P = { x: number; y: number; s: number; river: boolean; hue: number };
    let parts: P[] = [];

    const riverX = (y: number) =>
      w * 0.5 + Math.sin(y * 0.0024 + t * 0.00022) * w * 0.09 + Math.sin(y * 0.0007) * w * 0.05;

    const spawn = (p?: P): P => {
      const river = Math.random() < 0.3;
      return {
        x: river ? riverX(Math.random() * h) + (Math.random() - 0.5) * w * 0.14 : Math.random() * w,
        y: Math.random() * h,
        s: river ? 1.4 + Math.random() * 2.4 : 0.4 + Math.random() * 1.1,
        river,
        hue: Math.random(),
        ...(p ?? {}),
      };
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: Math.min(320, Math.floor((w * h) / 5200)) }, () => spawn());
      ctx.fillStyle = "#04080a";
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      t += 16;
      ctx.fillStyle = "rgba(4, 8, 10, 0.085)";
      ctx.fillRect(0, 0, w, h);

      for (const p of parts) {
        const px = p.x, py = p.y;
        if (p.river) {
          p.y += p.s * 1.7;
          const drift = riverX(p.y) - riverX(py);
          p.x += drift * 0.5 + (Math.random() - 0.5) * 0.4;
          const rx = riverX(p.y);
          if (Math.abs(p.x - rx) > w * 0.085) p.x += (rx - p.x) * 0.03;
          ctx.strokeStyle = p.hue < 0.6 ? "rgba(179,118,60,0.5)" : p.hue < 0.85 ? "rgba(124,79,42,0.55)" : "rgba(214,164,110,0.4)";
        } else {
          const a =
            Math.sin(p.x * 0.0022 + t * 0.00018) +
            Math.cos(p.y * 0.0024 - t * 0.00013);
          p.x += Math.cos(a * Math.PI) * p.s * 0.7;
          p.y += Math.sin(a * Math.PI) * p.s * 0.7 + 0.18;
          ctx.strokeStyle = p.hue < 0.5 ? "rgba(56,242,160,0.30)" : p.hue < 0.8 ? "rgba(31,140,96,0.32)" : "rgba(120,190,150,0.22)";
        }
        ctx.lineWidth = p.river ? 1.1 : 0.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.y > h + 10 || p.y < -10 || p.x > w + 10 || p.x < -10 || Math.random() < 0.0025) {
          Object.assign(p, spawn());
          p.y = p.river ? -8 : p.y;
        }
      }

      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduced) {
      for (let i = 0; i < 90; i++) step();
      cancelAnimationFrame(raf);
    } else {
      step();
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* ------------------------- radar ------------------------- */
function RadarHud() {
  return (
    <div className="relative h-28 w-28 sm:h-36 sm:w-36" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-neon/25" />
      <div className="absolute inset-[18%] rounded-full border border-neon/18" />
      <div className="absolute inset-[36%] rounded-full border border-neon/12" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neon/10" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-neon/10" />
      <div
        className="absolute inset-0 rounded-full animate-radar"
        style={{
          background: "conic-gradient(from 0deg, rgba(56,242,160,0.5), transparent 18%, transparent)",
          maskImage: "radial-gradient(circle, black, black)",
        }}
      />
      <span className="absolute left-[62%] top-[30%] h-1.5 w-1.5 rounded-full bg-lv-red animate-pulse-dot" />
      <span className="absolute left-[30%] top-[64%] h-1.5 w-1.5 rounded-full bg-lv-yellow animate-pulse-dot [animation-delay:0.6s]" />
      <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon" />
    </div>
  );
}

/* ------------------------- ticker coords ------------------------- */
function Coords() {
  const [v, setV] = useState({ lat: 5.60371, lng: -0.18704, alt: 120 });
  useEffect(() => {
    const i = setInterval(() => {
      setV((p) => ({
        lat: 5.60371 + Math.sin(Date.now() / 4000) * 0.00042,
        lng: -0.18704 + Math.cos(Date.now() / 5000) * 0.00042,
        alt: 120 + Math.sin(Date.now() / 3000) * 6,
      }));
    }, 120);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="font-mono text-[10px] leading-relaxed text-mute">
      <p>
        LAT <span className="text-neon">{v.lat.toFixed(5)}</span> · LNG{" "}
        <span className="text-neon">{v.lng.toFixed(5)}</span>
      </p>
      <p>
        ALT <span className="text-neon">{v.alt.toFixed(0)}m</span> · ACCRA SECTOR GRID ·{" "}
        <span className="text-dim">GHANA</span>
      </p>
    </div>
  );
}

/* ------------------------- hero ------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const letters = "ECO—SENTRY".split("");

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      <RiverCanvas />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-transparent to-abyss" />
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(75%_65%_at_50%_45%,black,transparent)]" />

      {/* HUD frame corners */}
      <div className="pointer-events-none absolute inset-4 z-20 sm:inset-6" aria-hidden>
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-neon/40 ${c}`} />
        ))}
      </div>

      {/* side vertical label */}
      <div className="pointer-events-none absolute right-7 top-1/2 z-20 hidden -translate-y-1/2 rotate-90 sm:block">
        <p className="font-mono text-[10px] tracking-[0.6em] text-dim">
          SMART EARLY-WARNING NETWORK — FOR THREAT RECOGNITION
        </p>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-6 pt-28 pb-20 sm:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.35, duration: 0.9, ease: EASE }}
          className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-mute"
        >
          <span className="flex items-center gap-2 border border-line bg-panel/70 px-3 py-1.5">
            <Satellite className="h-3 w-3 text-neon" /> COMMERCIAL DRONE · FACTORY FLIGHT SYSTEM
          </span>
          <span className="flex items-center gap-2 border border-line bg-panel/70 px-3 py-1.5">
            <Camera className="h-3 w-3 text-neon" /> AI VISION PAYLOAD
          </span>
          <span className="flex items-center gap-2 border border-neon/30 bg-neon/5 px-3 py-1.5 text-neon">
            <Crosshair className="h-3 w-3" /> SCREENING TOOL — NEVER ACCUSATION
          </span>
        </motion.div>

        <h1 className="display-tight select-none font-bold leading-[0.86]">
          <span className="sr-only">ECO-SENTRY</span>
          <span aria-hidden className="flex flex-wrap text-[15.5vw] sm:text-[13vw] lg:text-[11.2vw]">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: "115%", rotate: 6, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ delay: 2.15 + i * 0.045, duration: 1.05, ease: EASE }}
                className={i < 4 ? "outline-green" : "text-ink"}
              >
                {l}
              </motion.span>
            ))}
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.75, duration: 1, ease: EASE }}
            className="max-w-xl"
          >
            <p className="font-mono text-[11px] tracking-[0.28em] text-neon">
              ENVIRONMENTAL &amp; CONSERVATION OBSERVATION
            </p>
            <p className="mt-3 text-lg leading-relaxed text-mute sm:text-xl">
              An AI-assisted aerial sentinel that watches Ghana&apos;s rivers from above and raises a{" "}
              <span className="text-ink">0–100 environmental warning score</span> — early enough for
              humans to verify, never to accuse.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#engine"
                data-cursor
                className="group relative overflow-hidden border border-neon bg-neon px-7 py-3.5 font-mono text-[11px] font-semibold tracking-[0.24em] text-abyss transition-transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">RUN THE WARNING ENGINE</span>
                <span className="absolute inset-0 -translate-x-full bg-ink transition-transform duration-500 ease-out group-hover:translate-x-0" />
              </a>
              <a
                href="#system"
                data-cursor
                className="border border-line px-7 py-3.5 font-mono text-[11px] tracking-[0.24em] text-mute transition-all hover:border-neon/50 hover:text-ink"
              >
                HOW IT WORKS ↓
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.95, duration: 1.1, ease: EASE }}
            className="hidden lg:block"
          >
            <RadarHud />
          </motion.div>
        </div>
      </motion.div>

      {/* bottom HUD strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.1, duration: 1 }}
        className="relative z-10 mx-auto flex w-full max-w-[1500px] items-end justify-between gap-6 px-6 pb-8 sm:px-10"
      >
        <Coords />
        <div className="flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.35em] text-dim">
          <span>SCROLL</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-neon" />
        </div>
        <p className="hidden font-mono text-[10px] leading-relaxed text-mute sm:block">
          SCORE ENGINE <span className="text-neon">ARMED</span>
          <br />
          HUMAN VERIFICATION <span className="text-neon">ALWAYS</span>
        </p>
      </motion.div>
    </section>
  );
}
