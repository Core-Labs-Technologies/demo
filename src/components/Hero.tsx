import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { BENCHMARKS, f1, stats } from "../data/bench";
import { Icon, Kicker, SectionHead, Wrap } from "./ui";

/* ---------- Live routing card: real examples from the evidence below ---------- */

const EXAMPLES = [
  { task: "Turn on the microwave", source: "RoboCasa kitchen", models: ["π0-FAST", "π0", "GR00T N1.5"], pick: 0, avg: 2 },
  { task: "Close the book", source: "RoboArena · real robot", models: ["π0.5", "PaliGemma FAST-specialist", "π0-FAST"], pick: 1, avg: 0 },
  { task: "Put the wooden block into the cup", source: "RoboArena · real robot", models: ["π0.5", "π0-FAST", "PaliGemma FAST-specialist"], pick: 1, avg: 0 },
  { task: "Put the banana into the bowl", source: "RoboArena · real robot", models: ["π0.5", "π0-FAST", "PaliGemma FAST-specialist"], pick: 1, avg: 0 },
];
const STAGES = ["Match task", "Route", "Enforce rules", "Log decision"];

function RouterCard() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [stage, setStage] = useState(reduce ? 3 : 0);
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      if (stage < 3) setStage(stage + 1);
      else {
        setI((i + 1) % EXAMPLES.length);
        setStage(0);
      }
    }, stage === 3 ? 2200 : 900);
    return () => clearTimeout(t);
  }, [stage, i, reduce]);
  const ex = EXAMPLES[i];
  const routed = stage >= 1;

  return (
    <div className="relative rounded-2xl border border-line bg-white p-5 shadow-[0_24px_70px_-20px_rgba(19,48,143,0.25)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue/60" />
            <span className="relative inline-flex size-2 rounded-full bg-blue" />
          </span>
          Routing decision
        </span>
        <span className="font-mono text-[11px] text-ink-3">{ex.source}</span>
      </div>

      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">Work order</div>
      <div className="mb-5 h-[3.4rem] sm:h-[2.2rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={ex.task}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-[1.3rem] font-semibold leading-tight tracking-tight"
          >
            “{ex.task}”
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">Candidate models</div>
      <ul className="mb-5 grid gap-2">
        {ex.models.map((m, j) => {
          const picked = routed && j === ex.pick;
          return (
            <li key={`${i}-${m}`} className="relative flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-[14px]">
              {picked && (
                <motion.span
                  layoutId="pick"
                  className="absolute inset-0 rounded-lg border-2 border-blue bg-blue-mist"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className={`relative font-medium ${picked ? "text-blue-deep" : "text-ink"}`}>{m}</span>
              <span className="relative font-mono text-[11px] text-ink-3">
                {picked ? (
                  <span className="inline-flex items-center gap-1 font-medium text-blue">{Icon.arrow("size-3.5")} Routed here</span>
                ) : j === ex.avg ? (
                  "Best on average"
                ) : (
                  ""
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <ol className="grid grid-cols-4 gap-1.5">
        {STAGES.map((s, j) => {
          const on = j <= stage;
          return (
            <li key={s} className="grid gap-1.5">
              <span className="h-1 overflow-hidden rounded-full bg-soft">
                <motion.span
                  className="block h-full rounded-full bg-blue"
                  initial={false}
                  animate={{ width: on ? "100%" : "0%" }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
                />
              </span>
              <span className={`text-[11px] leading-tight transition-colors sm:text-[12px] ${on ? "text-ink" : "text-ink-3"}`}>{s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Hero ---------- */

const up = {
  hidden: { opacity: 0, y: 14 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="blueprint pointer-events-none absolute inset-0" aria-hidden="true" />
      <Wrap className="relative pt-8">
        <span className="text-[15px] font-semibold tracking-[0.14em]">CORE LABS</span>
      </Wrap>
      <Wrap className="relative grid items-center gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-20">
        <div className="grid gap-6">
          <motion.div variants={up} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue-mist px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-blue">
              <span className="size-1.5 rounded-full bg-blue" />
              Deployment harness for robotics
            </span>
          </motion.div>
          <motion.h1
            variants={up}
            initial="hidden"
            animate="show"
            custom={0.06}
            className="max-w-[15ch] text-[clamp(2.5rem,5.2vw,4.3rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
          >
            Taking Robots from the Lab to <span className="text-blue">Production Line</span>
          </motion.h1>
          <motion.div variants={up} initial="hidden" animate="show" custom={0.12} className="grid max-w-[34em] gap-3">
            <p className="border-l-[3px] border-blue pl-4 text-[clamp(1.2rem,1.9vw,1.45rem)] font-medium leading-snug tracking-[-0.01em] text-ink">
              No single robot model wins every task. Core Labs runs each task on the one that does.
            </p>
            <p className="pl-[19px] text-[1.02rem] leading-relaxed text-ink-2">Inside the site’s rules, with a record of every decision.</p>
          </motion.div>
        </div>
        <motion.div variants={up} initial="hidden" animate="show" custom={0.2}>
          <RouterCard />
          <p className="mt-3 text-center font-mono text-[11px] text-ink-3">Real examples from the results below</p>
        </motion.div>
      </Wrap>
      <HeroStats />
    </section>
  );
}

/* ---------- Key numbers: the four things to remember ---------- */

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const fmt = (v: number) => prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  useEffect(() => {
    if (!seen || !ref.current) return;
    if (reduce) {
      ref.current.textContent = fmt(to);
      return;
    }
    const c = animate(0, to, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => ref.current && (ref.current.textContent = fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);
  return (
    <span ref={ref} className="tabular">
      {fmt(to)}
    </span>
  );
}

/* The four numbers to remember, as the hero's closing row. */
function HeroStats() {
  const all = BENCHMARKS.map(stats);
  const simpler = all[0];
  const wins = all.filter((s) => s.routed > s.single).length;
  const items = [
    { big: <CountUp to={3883} />, label: "blind real-robot evaluations analyzed" },
    { big: <>1 in 3</>, label: "tasks the strongest model, π0.5, still loses" },
    { big: <CountUp to={Math.round(simpler.rel)} prefix="+" suffix="%" />, label: `success rate on SimplerEnv over the best single model (${f1(simpler.single)}% → ${f1(simpler.routed)}%)` },
    { big: <>{wins} of {all.length}</>, label: "standard benchmarks where routing beats the best single model" },
  ];
  return (
    <Wrap className="relative pb-16 sm:pb-20">
      <motion.div
        variants={up}
        initial="hidden"
        animate="show"
        custom={0.28}
        className="grid grid-cols-2 border-t border-ink/10 lg:grid-cols-4"
        aria-label="Key results"
      >
        {items.map((it, i) => (
          <div
            key={i}
            className={`grid content-start gap-2 border-ink/10 pt-6 pr-4 sm:pr-6 ${i % 2 ? "border-l pl-4 sm:pl-6" : ""} ${i === 2 ? "lg:border-l lg:pl-6" : ""} ${
              i >= 2 ? "mt-6 lg:mt-0" : ""
            }`}
          >
            <span className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold leading-none tracking-[-0.035em] text-blue">{it.big}</span>
            <span className="max-w-[22em] text-[14px] leading-snug text-ink-2">{it.label}</span>
          </div>
        ))}
      </motion.div>
    </Wrap>
  );
}

/* ---------- The product: four stages every task loops through ---------- */

const PILLARS = [
  {
    icon: Icon.route,
    name: "Route",
    line: "Every task goes to the model that does it best.",
    text: "Send each task to the model with the best measured record on it, not the one that is best on average.",
  },
  {
    icon: Icon.shield,
    name: "Enforce",
    line: "Nothing moves until it passes the site’s rules.",
    text: "Check every action against the site’s rules before the robot moves.",
  },
  {
    icon: Icon.ledger,
    name: "Comply",
    line: "Every decision is on the record.",
    text: "A signed trail of which model ran, what it proposed and what was allowed.",
  },
  {
    icon: Icon.loop,
    name: "Recover",
    line: "One robot’s failure makes the whole fleet better.",
    text: "Turn every failure into a rule the whole fleet inherits, then route the next task with it.",
  },
];
const PERIOD = 14; // seconds for one full loop
const R = 38; // ring radius, % of the square

function Loop({ active, onSelect, t }: { active: number; onSelect: (i: number) => void; t: ReturnType<typeof useMotionValue<number>> }) {
  // Travelling dot, and a trail from the active stage to the dot.
  const dx = useTransform(t, (v) => 50 + R * Math.sin(v * 2 * Math.PI));
  const dy = useTransform(t, (v) => 50 - R * Math.cos(v * 2 * Math.PI));
  const trail = useTransform(t, (v) => Math.max(0.001, v - Math.floor(v * 4) / 4));
  const trailRot = useTransform(t, (v) => Math.floor(v * 4) * 90 - 90);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-line)" strokeWidth="0.6" />
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-blue)" strokeWidth="0.35" strokeDasharray="0.6 1.6" opacity="0.35" />
        <motion.circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ pathLength: trail, rotate: trailRot, originX: "50%", originY: "50%" }}
        />
        <motion.circle r="1.6" fill="var(--color-blue)" cx={dx} cy={dy} />
        <motion.circle r="3.4" fill="var(--color-blue)" opacity="0.15" cx={dx} cy={dy} />
      </svg>

      <div className="absolute inset-[24%] grid place-items-center rounded-full bg-blue-mist text-center">
        <div className="grid gap-1 px-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Every task</span>
          <span className="text-[clamp(0.95rem,2.2vw,1.2rem)] font-semibold leading-tight">runs the loop</span>
        </div>
      </div>

      {PILLARS.map((p, i) => {
        const a = (i / 4) * 2 * Math.PI;
        const on = i === active;
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={on}
            className="absolute grid -translate-x-1/2 -translate-y-1/2 justify-items-center gap-1.5"
            style={{ left: `${50 + R * Math.sin(a)}%`, top: `${50 - R * Math.cos(a)}%` }}
          >
            <span
              className={`grid size-14 place-items-center rounded-2xl border transition-all duration-300 sm:size-16 ${
                on ? "scale-110 border-blue bg-blue text-white shadow-[0_10px_30px_-8px_rgba(36,83,232,0.8)]" : "border-line bg-white text-blue"
              }`}
            >
              {p.icon("size-6 sm:size-7")}
            </span>
            <span className={`rounded-full bg-white px-1.5 text-[13px] font-semibold transition-colors ${on ? "text-ink" : "text-ink-3"}`}>{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Product() {
  const reduce = useReducedMotion();
  const t = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);

  useAnimationFrame((_, delta) => {
    if (reduce || hold) return;
    t.set((t.get() + delta / 1000 / PERIOD) % 1);
  });
  useMotionValueEvent(t, "change", (v) => {
    const i = Math.floor(v * 4) % 4;
    if (i !== active) setActive(i);
  });
  // A click pauses the loop on that stage for a few seconds, then it carries on.
  useEffect(() => {
    if (!hold) return;
    const h = setTimeout(() => setHold(false), 8000);
    return () => clearTimeout(h);
  }, [hold, active]);
  const select = (i: number) => {
    t.set(i / 4 + 0.001);
    setActive(i);
    setHold(true);
  };
  const p = PILLARS[active];

  return (
    <section id="product" aria-labelledby="p-title" className="pt-24 sm:pt-32">
      <Wrap>
        <SectionHead
          kicker="The product"
          id="p-title"
          title="One layer between a site’s work and every robot model."
          lead="Robot models are improving fast, but no single model, vendor or release runs a whole site. Core Labs is the deployment harness that sits between the work and the models that drive the robots."
        />
        <div className="grid items-center gap-10 rounded-3xl border border-line bg-gradient-to-br from-white to-blue-mist/60 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <Loop active={active} onSelect={select} t={t} />
          <div className="grid gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <Kicker>{p.name}</Kicker>
                <h3 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.08]">{p.line}</h3>
                <p className="max-w-[32em] text-[1.08rem] leading-relaxed text-ink-2">{p.text}</p>
              </motion.div>
            </AnimatePresence>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PILLARS.map((q, i) => (
                <li key={q.name}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${
                      i === active ? "border-blue bg-white text-blue-deep" : "border-line bg-white/70 text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span className={i === active ? "text-blue" : "text-ink-3"}>{q.icon("size-4")}</span>
                    {q.name}
                    {i < 3 && <span className="ml-auto hidden text-ink-3 sm:inline">{Icon.arrow("size-3.5")}</span>}
                    {i === 3 && <span className="ml-auto hidden text-ink-3 sm:inline">{Icon.replay("size-3.5")}</span>}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
