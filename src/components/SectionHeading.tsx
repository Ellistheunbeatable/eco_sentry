"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SectionHeading({
  index,
  tag,
  title,
  right,
}: {
  index: string;
  tag: string;
  title: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-14 sm:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-6 flex items-center gap-4 font-mono text-[11px] tracking-[0.3em] text-mute"
      >
        <span className="text-neon">{index}</span>
        <span className="h-px w-10 bg-line" />
        <span>{tag}</span>
      </motion.div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.08 }}
          className="display-tight max-w-4xl text-4xl font-bold leading-[1.02] sm:text-6xl"
        >
          {title}
        </motion.h2>
        {right && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.18 }}
            className="max-w-sm font-mono text-[11px] leading-relaxed tracking-wider text-mute"
          >
            {right}
          </motion.div>
        )}
      </div>
    </div>
  );
}
