"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, FileCode2, FlaskConical } from "lucide-react";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FILES: { name: string; label: string; code: string }[] = [
  {
    name: "eco_sentry_air.ino",
    label: "MAIN SKETCH",
    code: `// ECO-SENTRY AIR — payload firmware
// Environmental monitoring ONLY. Never touches flight control.

#include <WiFi.h>
#include <DHT.h>

#define DHTPIN        4
#define DHTTYPE       DHT22
#define TURBIDITY_PIN 34

#define GREEN_LED  25
#define YELLOW_LED 26
#define ORANGE_LED 27
#define RED_LED    14
#define BUZZER     13

DHT dht(DHTPIN, DHTTYPE);

float temperature;
float humidity;
int   turbidityRaw;
int   score = 0;

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(GREEN_LED,  OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(ORANGE_LED, OUTPUT);
  pinMode(RED_LED,    OUTPUT);
  pinMode(BUZZER,     OUTPUT);

  analogReadResolution(12);          // ESP32 12-bit ADC

  Serial.println("ECO-SENTRY AIR");
  Serial.println("Payload online...");
}

void loop() {
  temperature  = dht.readTemperature();
  humidity     = dht.readHumidity();
  turbidityRaw = analogRead(TURBIDITY_PIN);

  score = calculateScore(turbidityRaw);
  showStatus(score);

  Serial.println("-------------------------");
  Serial.print("Temperature: ");  Serial.println(temperature);
  Serial.print("Humidity: ");     Serial.println(humidity);
  Serial.print("Turbidity raw: "); Serial.println(turbidityRaw);
  Serial.print("Warning score: "); Serial.println(score);

  delay(2000);
}`,
  },
  {
    name: "scoring.ino",
    label: "FUSION ENGINE",
    code: `// PROTOTYPE THRESHOLDS — calibrate with control samples.

// Ground-station turbidity signal -> points
int calculateScore(int turbidity) {
  int points = 0;

  if (turbidity > 2500)      points += 25;
  else if (turbidity > 1800) points += 15;
  else if (turbidity > 1200) points += 5;

  return points;
}

// AI visual classifications (confidence 0.0 - 1.0) -> points
int visualScore(float bareSoil, float muddyWater, float pit) {
  int score = 0;

  if (bareSoil   > 0.70) score += 25;
  if (muddyWater > 0.70) score += 25;
  if (pit        > 0.70) score += 20;

  return score;   // max 70 — visual is evidence, not proof
}

// Fuse every signal source into one 0-100 verdict
int finalScore(int environmental, int visual, int location) {
  int total = environmental + visual + location;
  if (total > 100) total = 100;
  return total;
}`,
  },
  {
    name: "alerts.ino",
    label: "WARNING OUTPUT",
    code: `// Four-tier alert ladder: silent greens to urgent reds.
// 0-24 GREEN / 25-49 YELLOW / 50-74 ORANGE / 75-100 RED

void showStatus(int score) {
  digitalWrite(GREEN_LED,  LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(ORANGE_LED, LOW);
  digitalWrite(RED_LED,    LOW);
  noTone(BUZZER);

  if (score < 25) {
    digitalWrite(GREEN_LED, HIGH);          // normal — stay silent
  }
  else if (score < 50) {
    digitalWrite(YELLOW_LED, HIGH);
    tone(BUZZER, 1000, 150);                 // caution — short beep
  }
  else if (score < 75) {
    digitalWrite(ORANGE_LED, HIGH);
    tone(BUZZER, 1200, 400);                 // high concern
  }
  else {
    digitalWrite(RED_LED, HIGH);
    tone(BUZZER, 1500, 800);                 // priority — long tone
  }
}`,
  },
];

/* ------- tiny C++ highlighter ------- */
function highlight(code: string) {
  const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(
    /(\/\/[^\n]*)|(#\w+[^\n]*)|(&quot;|")([^"\n]*)(")|\b(void|int|float|if|else|return|const|include|define|bool|true|false)\b|\b(\d+\.?\d*)\b|\b([A-Z_]{3,})\b|\b([A-Za-z_]\w*)(?=\()/g,
    (m, com, pre, _q, str, _q2, kw, num, upper, fn) => {
      if (com) return `<span class="tok-com">${m}</span>`;
      if (pre) {
        const [head, ...rest] = m.split(" ");
        return `<span class="tok-pre">${head}</span> ${rest.join(" ").replace(/(&quot;[^]*)/, '<span class="tok-str">$1</span>')}`;
      }
      if (str !== undefined) return `<span class="tok-str">${m}</span>`;
      if (kw) return `<span class="tok-kw">${m}</span>`;
      if (num) return `<span class="tok-num">${m}</span>`;
      if (upper) return `<span class="tok-type">${m}</span>`;
      if (fn) return `<span class="tok-fn">${m}</span>`;
      return m;
    }
  );
}

export default function CodeDeck() {
  const [fi, setFi] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FILES[fi].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="code" className="relative border-b border-line bg-panel/30">
      <div className="mx-auto max-w-[1500px] px-6 py-28 sm:px-10 sm:py-40">
        <SectionHeading
          index="06"
          tag="PAYLOAD FIRMWARE"
          title={
            <>
              Real Arduino C++. <span className="outline-green">Form 3 readable.</span>
            </>
          }
          right="The entire payload brain fits in three small files a Form 3 student can read top to bottom — and explain line by line to a judge."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="hud-panel overflow-hidden"
        >
          {/* tab bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-2.5">
            <div className="flex flex-wrap gap-1">
              {FILES.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setFi(i)}
                  data-cursor
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-[11px] tracking-wider transition-colors ${
                    fi === i ? "bg-panel2 text-neon" : "text-mute hover:text-ink"
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  {f.name}
                </button>
              ))}
            </div>
            <button
              onClick={copy}
              data-cursor
              className="flex items-center gap-2 border border-line px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] text-mute transition-colors hover:border-neon/40 hover:text-neon"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-neon" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>

          {/* code body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={fi}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="code-scroll overflow-x-auto bg-[#050b0d] p-6 sm:p-8"
            >
              <pre className="min-w-max font-mono text-[12.5px] leading-[1.75] text-ink/85">
                {FILES[fi].code.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-10 shrink-0 select-none pr-4 text-right text-dim/60">{i + 1}</span>
                    <code dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }} />
                  </div>
                ))}
              </pre>
            </motion.div>
          </AnimatePresence>

          {/* status bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-panel px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-dim">
            <span>{FILES[fi].label} · TARGET: ESP32 DEVKIT V1</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lv-green animate-pulse-dot" />
              COMPILES CLEAN · {FILES[fi].code.split("\n").length} LINES
            </span>
          </div>
        </motion.div>

        {/* calibration note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mt-6 flex flex-col gap-3 border border-silt/30 bg-silt/5 p-6 sm:flex-row sm:items-center sm:gap-5"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center border border-silt/40">
            <FlaskConical className="h-5 w-5 text-silt" />
          </span>
          <p className="font-mono text-[11px] leading-relaxed tracking-wider text-mute">
            <span className="text-silt">CALIBRATION PROTOCOL — </span>
            The numbers 2500 / 1800 / 1200 are prototype thresholds, not universal science. Before the
            competition we calibrate against clear water and prepared cloudy samples, then document the
            measured values. That honesty is part of the engineering.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
