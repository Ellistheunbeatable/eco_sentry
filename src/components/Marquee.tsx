"use client";

const ITEMS = [
  "WATCH FROM ABOVE",
  "WARN BEFORE THE DAMAGE",
  "EARLY WARNING — NEVER ACCUSATION",
  "HUMAN VERIFICATION ALWAYS",
  "0–100 ENVIRONMENTAL SCORE",
  "BEFORE THE RIVER TURNS BROWN",
];

export default function Marquee({ dark = false }: { dark?: boolean }) {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className={`relative z-10 overflow-hidden border-y py-4 sm:py-5 ${
        dark ? "border-line bg-abyss" : "border-neon/25 bg-moss/30"
      }`}
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={`display-tight text-2xl font-bold tracking-tight sm:text-4xl ${
                i % 3 === 2 ? "outline-text" : i % 3 === 1 ? "text-neon" : "text-ink"
              }`}
            >
              {t}
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-silt" aria-hidden>
              <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
