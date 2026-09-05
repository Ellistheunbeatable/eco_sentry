"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";

const LINKS = [
  { label: "MISSION", href: "#mission" },
  { label: "SYSTEM", href: "#system" },
  { label: "SCAN", href: "#scan" },
  { label: "ENGINE", href: "#engine" },
  { label: "HARDWARE", href: "#hardware" },
  { label: "CODE", href: "#code" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${
        scrolled ? "bg-abyss/80 backdrop-blur-md border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3" data-cursor>
          <span className="grid h-9 w-9 place-items-center border border-line bg-panel transition-colors group-hover:border-neon/50">
            <Radar className="h-4 w-4 text-neon" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-[0.28em] text-ink">
            ECO—SENTRY
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor
              className="font-mono text-[11px] tracking-[0.22em] text-mute transition-colors hover:text-neon"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 border border-line bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-sm sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-lv-green animate-pulse-dot" />
            <span className="text-mute">SYS</span>
            <span className="text-neon">ONLINE</span>
          </span>
          <a
            href="#engine"
            data-cursor
            className="border border-neon/40 bg-neon/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.22em] text-neon transition-all hover:bg-neon hover:text-abyss"
          >
            RUN ENGINE
          </a>
        </div>
      </div>
    </motion.header>
  );
}
