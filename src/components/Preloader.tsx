"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT = [
  "ECO-SENTRY AIR · FIRMWARE v3.1",
  "PAYLOAD BUS .......... ONLINE",
  "CAMERA LINK .......... LOCKED",
  "GPS FIX .............. 8 SATS",
  "AI MODEL .......... LOADED ✓",
  "WARNING ENGINE ....... ARMED",
];

export default function Preloader() {
  const [lines, setLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setLines(i);
      if (i >= BOOT.length) {
        clearInterval(t);
        setTimeout(() => {
          setDone(true);
          document.body.style.overflow = "";
        }, 500);
      }
    }, 210);
    return () => {
      clearInterval(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-abyss"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
        >
          <div className="w-[min(520px,86vw)] font-mono text-[11px] sm:text-xs">
            <div className="mb-6 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-lv-green opacity-60 animate-sonar" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lv-green" />
              </span>
              <span className="tracking-[0.35em] text-mute">SYSTEM BOOT</span>
            </div>
            {BOOT.slice(0, lines).map((l) => (
              <motion.p
                key={l}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="py-0.5 text-neon/90"
              >
                <span className="text-dim">&gt;&nbsp;</span>
                {l}
              </motion.p>
            ))}
            <div className="mt-6 h-px w-full bg-line">
              <motion.div
                className="h-px bg-neon"
                animate={{ width: `${(lines / BOOT.length) * 100}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
