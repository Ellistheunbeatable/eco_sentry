"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const hot = (e.target as HTMLElement).closest(
        "a, button, input, [data-cursor]"
      );
      if (ring.current) {
        ring.current.style.width = hot ? "56px" : "34px";
        ring.current.style.height = hot ? "56px" : "34px";
        ring.current.style.opacity = hot ? "0.95" : "0.6";
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      if (ring.current) {
        const w = ring.current.offsetWidth / 2;
        ring.current.style.transform = `translate(${rx - w}px, ${ry - w}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dot} aria-hidden />
      <div id="cursor-ring" ref={ring} aria-hidden />
    </>
  );
}
