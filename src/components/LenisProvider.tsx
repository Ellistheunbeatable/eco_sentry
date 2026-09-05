"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.4 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
