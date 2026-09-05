"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export default function CountUp({
  value,
  decimals = 0,
  duration = 0.9,
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const [text, setText] = useState((0).toFixed(decimals));
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setText(v.toFixed(decimals)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, decimals, duration]);

  return <span className={className}>{text}</span>;
}
