// Published per-task success rates (%). Sources and trial counts are in
// scripts/benchmarks.py; these are the same arrays the page has always used.

export type Benchmark = {
  id: string;
  name: string;
  sub: string;
  pool: string;
  tasks: string[];
  models: Record<string, number[]>;
};

const ROBOTWIN_N = 50;

export const BENCHMARKS: Benchmark[] = [
  {
    id: "simpler",
    name: "SimplerEnv",
    sub: "Real-to-sim · 7 WidowX tasks",
    pool: "3 NVIDIA GR00T releases",
    tasks: ["Spoon on towel", "Carrot on plate", "Eggplant in basket", "Stack cube", "Eggplant in sink", "Close drawer", "Open drawer"],
    models: {
      "GR00T N1.5": [82, 72, 63, 54, 21, 65, 84],
      "GR00T N1.6": [55.4, 46, 89, 5, 33, 73, 95],
      "GR00T N1.7": [78, 58, 53, 48, 2, 97, 100],
    },
  },
  {
    id: "robocasa",
    name: "RoboCasa",
    sub: "MuJoCo kitchen · 24 tasks",
    pool: "GR00T N1.5, π0, π0-FAST",
    tasks: [
      "Close double door", "Close drawer", "Close single door", "Coffee press button",
      "Coffee serve mug", "Coffee setup mug", "Open double door", "Open drawer",
      "Open single door", "Cabinet → counter", "Counter → cabinet", "Counter → microwave",
      "Counter → sink", "Counter → stove", "Microwave → counter", "Sink → counter",
      "Stove → counter", "Turn off microwave", "Turn off sink faucet", "Turn off stove",
      "Turn on microwave", "Turn on sink faucet", "Turn on stove", "Turn sink spout",
    ],
    models: {
      "GR00T N1.5": [80, 96, 98, 90, 58, 24, 82, 74, 78, 54, 54, 32, 58, 66, 50, 60, 68, 94, 92, 28, 44, 86, 32, 78],
      "π0": [86, 96, 96, 88, 64, 38, 84, 62, 70, 18, 46, 18, 58, 60, 24, 66, 44, 96, 94, 22, 70, 86, 42, 72],
      "π0-FAST": [78, 94, 72, 90, 68, 38, 78, 68, 66, 30, 48, 20, 56, 64, 46, 62, 60, 96, 94, 22, 88, 74, 38, 76],
    },
  },
  {
    id: "robotwin",
    name: "RoboTwin 2.0",
    sub: "Two-arm, randomized scenes · 50 tasks",
    pool: "ACT, DP, DP3, RDT, π0",
    tasks: Array.from({ length: ROBOTWIN_N }, (_, i) => `Task ${String(i + 1).padStart(2, "0")}`),
    models: {
      RDT: [75,37,0,0,12,9,32,43,14,31,16,9,12,0,11,0,32,20,0,13,1,1,2,1,27,6,5,17,4,7,2,0,17,0,5,6,7,24,4,18,5,1,51,45,0,2,17,30,0,15],
      "π0": [56,21,5,1,11,3,24,80,8,13,3,36,21,1,22,2,46,50,6,12,1,6,4,1,4,5,2,45,0,11,10,1,2,0,11,7,6,29,13,18,15,1,51,60,0,1,24,41,4,23],
      ACT: [23,3,0,0,4,3,1,25,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,6,1,0,0,0,4,10,0,0,0,0,0,2],
      DP: [0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,8,0,0,0,0,0,1],
      DP3: [3,8,0,0,14,0,53,2,0,3,1,0,6,0,3,0,7,22,1,1,2,0,1,0,18,2,3,1,0,1,1,1,0,0,0,2,2,3,21,1,1,1,25,19,0,0,5,6,0,8],
    },
  },
];

export type Stats = {
  names: string[];
  best: string;
  single: number;
  routed: number;
  gain: number;
  rel: number;
  perTask: { task: string; single: number; routed: number; winner: string; scores: [string, number][] }[];
  otherWins: number;
  winsByModel: [string, number][];
};

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;

export function stats(b: Benchmark): Stats {
  const names = Object.keys(b.models);
  const best = names.reduce((x, y) => (mean(b.models[y]) > mean(b.models[x]) ? y : x));
  const single = mean(b.models[best]);
  const perTask = b.tasks.map((task, i) => {
    const scores = names.map((m) => [m, b.models[m][i]] as [string, number]);
    const top = Math.max(...scores.map(([, v]) => v));
    // On a tie, keep the best-overall model: routing only switches when another model is strictly better.
    const winner = b.models[best][i] === top ? best : scores.find(([, v]) => v === top)![0];
    return { task, single: b.models[best][i], routed: top, winner, scores };
  });
  const routed = mean(perTask.map((t) => t.routed));
  const otherWins = perTask.filter((t) => t.winner !== best).length;
  const winsByModel = names
    .map((m) => [m, perTask.filter((t) => t.winner === m).length] as [string, number])
    .sort((a, z) => z[1] - a[1]);
  return { names, best, single, routed, gain: routed - single, rel: ((routed - single) / single) * 100, perTask, otherWins, winsByModel };
}

export const f1 = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
