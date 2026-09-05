"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function KillerLine() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/images/hero-aerial.jpg"
          alt="Aerial drone view of a Ghanaian river at dusk, green forest flanking brown turbid water"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-abyss/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-transparent to-abyss" />
      </motion.div>

      <div className="relative mx-auto max-w-[1500px] px-6 py-36 sm:px-10 sm:py-56">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-10 font-mono text-[11px] tracking-[0.35em] text-neon"
        >
          07 — THE LINE THAT WINS THE ROOM
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          className="max-w-5xl"
        >
          <Quote className="mb-8 h-10 w-10 text-silt" />
          <p className="display-tight text-3xl font-medium leading-snug text-ink sm:text-5xl">
            “The system has <span className="text-lv-red/90">not declared</span> that galamsey has
            occurred. It has identified{" "}
            <span className="text-neon">multiple environmental warning signs</span> that should be
            verified by responsible authorities.”
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center gap-5 font-mono text-[10px] tracking-[0.3em] text-mute"
        >
          <span className="h-px w-16 bg-line" />
          <span>DELIVERED TO THE JUDGES · STEP 6 OF THE DEMONSTRATION</span>
        </motion.div>
      </div>
    </section>
  );
}
