export type Level = {
  key: "normal" | "caution" | "high" | "priority";
  label: string;
  short: string;
  action: string;
  color: string;
  dim: string;
  range: string;
  leds: [boolean, boolean, boolean, boolean];
  tone: { freq: number; dur: number; gap?: number; reps: number };
};

export const LEVELS: Level[] = [
  {
    key: "normal",
    label: "NORMAL",
    short: "AREA HEALTHY",
    action: "Log observation. Continue patrol.",
    color: "#2ef09b",
    dim: "rgba(46,240,155,0.14)",
    range: "0 – 24",
    leds: [true, false, false, false],
    tone: { freq: 620, dur: 0.09, reps: 1 },
  },
  {
    key: "caution",
    label: "CAUTION",
    short: "EARLY SIGNS",
    action: "Flag zone. Schedule a second pass.",
    color: "#ffd23f",
    dim: "rgba(255,210,63,0.14)",
    range: "25 – 49",
    leds: [false, true, false, false],
    tone: { freq: 1000, dur: 0.15, reps: 2, gap: 0.22 },
  },
  {
    key: "high",
    label: "HIGH CONCERN",
    short: "MULTIPLE SIGNS",
    action: "Capture full imagery set. Notify supervisor.",
    color: "#ff8a1f",
    dim: "rgba(255,138,31,0.16)",
    range: "50 – 74",
    leds: [false, false, true, false],
    tone: { freq: 1200, dur: 0.2, reps: 3, gap: 0.16 },
  },
  {
    key: "priority",
    label: "PRIORITY",
    short: "HUMAN INVESTIGATION",
    action: "Human verification required immediately.",
    color: "#ff4444",
    dim: "rgba(255,68,68,0.16)",
    range: "75 – 100",
    leds: [false, false, false, true],
    tone: { freq: 1500, dur: 0.26, reps: 4, gap: 0.13 },
  },
];

export function levelFor(score: number): Level {
  if (score < 25) return LEVELS[0];
  if (score < 50) return LEVELS[1];
  if (score < 75) return LEVELS[2];
  return LEVELS[3];
}

/* ------------------------------------------------ */
/* Zone presets for the competition demonstration    */
/* ------------------------------------------------ */
export type ZoneAi = {
  vegetation: number;
  bareSoil: number;
  muddyWater: number;
  pit: number;
  machinery: number;
};

export type Zone = {
  id: string;
  name: string;
  airfieldCode: string;
  image: string;
  desc: string;
  signs: string[];
  ai: ZoneAi;
  visualScore: number;
  envScore: number;
  locScore: number;
  expected: number;
};

export const ZONES: Zone[] = [
  {
    id: "A",
    name: "CONTROL ZONE",
    airfieldCode: "ZN-A · 5.6037°N 0.1870°W",
    image: "/images/zone-a.jpg",
    desc: "Intact canopy, clear water, undisturbed ground. The baseline every healthy riverbank should match.",
    signs: ["Healthy vegetation", "Clear water", "Undisturbed land"],
    ai: { vegetation: 0.96, bareSoil: 0.06, muddyWater: 0.04, pit: 0.02, machinery: 0.01 },
    visualScore: 0,
    envScore: 8,
    locScore: 0,
    expected: 8,
  },
  {
    id: "B",
    name: "DISTURBED ZONE",
    airfieldCode: "ZN-B · 5.6102°N 0.1941°W",
    image: "/images/zone-b.jpg",
    desc: "Vegetation stripped back, earth laid bare, water carrying visible sediment. Early signs worth a second look.",
    signs: ["Bare / disturbed soil", "Muddy-looking water", "Vegetation removal"],
    ai: { vegetation: 0.22, bareSoil: 0.81, muddyWater: 0.87, pit: 0.18, machinery: 0.05 },
    visualScore: 50,
    envScore: 15,
    locScore: 0,
    expected: 45,
  },
  {
    id: "C",
    name: "MULTIPLE WARNING SIGNS",
    airfieldCode: "ZN-C · 5.6188°N 0.2013°W",
    image: "/images/zone-c.jpg",
    desc: "Excavation-like pits, scorched earth, turbid pools and machinery in one frame. Verify on the ground — never accuse from the air.",
    signs: ["Excavation / pit-like features", "Bare soil", "Turbid pools", "Machinery present"],
    ai: { vegetation: 0.08, bareSoil: 0.91, muddyWater: 0.84, pit: 0.79, machinery: 0.88 },
    visualScore: 70,
    envScore: 20,
    locScore: 12,
    expected: 82,
  },
];

/* ------------------------------------------------ */
/* Hardware manifest (planning estimates, GH₵)       */
/* ------------------------------------------------ */
export type Part = {
  name: string;
  qty: number;
  low: number;
  high: number;
  cat: "AIRCRAFT" | "BRAIN" | "SENSING" | "OUTPUT & LOGGING";
  note: string;
};

export const PARTS: Part[] = [
  { name: "GPS camera drone (ready-made)", qty: 1, low: 2500, high: 4500, cat: "AIRCRAFT", note: "Factory flight system — never modified" },
  { name: "ESP32 dev board", qty: 1, low: 120, high: 120, cat: "BRAIN", note: "Wi-Fi · Bluetooth · ADC · the payload brain" },
  { name: "NEO-6M GPS module", qty: 1, low: 60, high: 100, cat: "SENSING", note: "Lat / long for every observation" },
  { name: "DHT22 temp / humidity", qty: 1, low: 25, high: 50, cat: "SENSING", note: "Environmental context sensor" },
  { name: "Turbidity sensor", qty: 1, low: 50, high: 100, cat: "SENSING", note: "Ground validation station only" },
  { name: "pH module + probe", qty: 1, low: 100, high: 150, cat: "SENSING", note: "Acid / neutral / alkaline — ground station" },
  { name: "OLED 0.96\" display", qty: 1, low: 30, high: 60, cat: "OUTPUT & LOGGING", note: "Live score readout on the payload" },
  { name: "Status LEDs ×4 + resistors", qty: 1, low: 5, high: 10, cat: "OUTPUT & LOGGING", note: "Green · Yellow · Orange · Red" },
  { name: "Active buzzer", qty: 1, low: 5, high: 5, cat: "OUTPUT & LOGGING", note: "Escalating alert tones" },
  { name: "MicroSD module + card", qty: 1, low: 60, high: 110, cat: "OUTPUT & LOGGING", note: "Evidence log: time, zone, score, sensors" },
  { name: "Breadboard + jumper wires", qty: 1, low: 40, high: 70, cat: "OUTPUT & LOGGING", note: "Prototyping backbone" },
  { name: "Push buttons, resistors & misc.", qty: 1, low: 55, high: 105, cat: "OUTPUT & LOGGING", note: "Calibration button, spare parts, tape" },
  { name: "Ground-station enclosure", qty: 1, low: 30, high: 50, cat: "OUTPUT & LOGGING", note: "Houses the validation electronics" },
];

export const BUDGET_TOTAL = 3200;
export const PRESENTATION_TOTAL = 5200;

export const LED_COLORS = ["#2ef09b", "#ffd23f", "#ff8a1f", "#ff4444"];
export const LED_NAMES = ["NORMAL", "CAUTION", "HIGH", "PRIORITY"];
