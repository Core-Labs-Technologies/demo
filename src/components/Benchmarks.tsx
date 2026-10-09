import { motion } from "motion/react";
import { BENCHMARKS, f1, stats } from "../data/bench";
import { Mark, SectionHead, Wrap } from "./ui";

const ALL = BENCHMARKS.map((b) => ({ b, s: stats(b) }));
const grow = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };
const pct = (v: number) => `+${Math.round(v)}%`;

/* One bar on the shared 0–100% scale, with its label inside and value at the end. */
function Bar({ label, value, routed, delay }: { label: string; value: number; routed?: boolean; delay: number }) {
  const inside = value > 40;
  return (
    <div className="relative flex h-9 items-center">
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-r-md ${routed ? "bg-blue" : "bg-bar"}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ ...grow, delay }}
      />
      <motion.span
        className="relative flex items-baseline gap-2 whitespace-nowrap pl-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.4, delay: delay + 0.5 }}
        style={{ marginLeft: inside ? 0 : `${value}%` }}
      >
        <span className={`text-[13px] font-medium ${routed && inside ? "text-white" : "text-ink"}`}>{label}</span>
        <b className={`tabular text-[15px] font-semibold ${routed && inside ? "text-white" : "text-ink"}`}>{f1(value)}%</b>
      </motion.span>
    </div>
  );
}

function Comparison() {
  return (
    <div className="rounded-2xl border border-line bg-white">
      {/* How to read it */}
      <div className="grid gap-3 border-b border-line p-5 sm:grid-cols-2 sm:gap-6 sm:px-7">
        <div className="flex gap-3">
          <i className="mt-1 size-3.5 shrink-0 rounded-[3px] bg-bar" />
          <p className="text-[14px] leading-snug text-ink-2">
            <b className="font-semibold text-ink">Best single model.</b> The strongest model on average, running every task.
          </p>
        </div>
        <div className="flex gap-3">
          <i className="mt-1 size-3.5 shrink-0 rounded-[3px] bg-blue" />
          <p className="text-[14px] leading-snug text-ink-2">
            <b className="font-semibold text-ink">Core Labs routing.</b> Each task sent to whichever model scores best on it.
          </p>
        </div>
      </div>

      <div className="divide-y divide-line">
        {ALL.map(({ b, s }, i) => (
          <div key={b.id} className="grid items-center gap-4 p-5 sm:px-7 sm:py-6 lg:grid-cols-[200px_minmax(0,1fr)_150px] lg:gap-8">
            <div>
              <h3 className="text-[1.15rem] font-semibold">{b.name}</h3>
              <p className="text-[13px] text-ink-3">{b.sub}</p>
            </div>
            <div className="relative grid gap-2">
              <div className="pointer-events-none absolute inset-0 flex justify-between" aria-hidden="true">
                {[0, 25, 50, 75, 100].map((g) => (
                  <span key={g} className={`w-px ${g === 0 ? "bg-ink-3/40" : "bg-line"}`} />
                ))}
              </div>
              <Bar label={s.best} value={s.single} delay={i * 0.1} />
              <Bar label="Core Labs routing" value={s.routed} routed delay={i * 0.1 + 0.15} />
            </div>
            <div className="flex items-baseline gap-2 lg:grid lg:gap-0.5 lg:text-right">
              <span className="tabular text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-blue">{pct(s.rel)}</span>
              <span className="text-[13px] text-ink-2">higher success rate</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden px-7 pb-4 lg:grid lg:grid-cols-[200px_minmax(0,1fr)_150px] lg:gap-8">
        <span />
        <div className="flex justify-between font-mono text-[10.5px] text-ink-3">
          {[0, 25, 50, 75, 100].map((g) => (
            <span key={g} className="flex w-px justify-center whitespace-nowrap">
              {g}%
            </span>
          ))}
        </div>
        <span className="text-right font-mono text-[10.5px] text-ink-3">Average success rate</span>
      </div>
    </div>
  );
}

function SummaryTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="bg-soft/80 text-[12.5px] text-ink-2">
            <tr>
              <th className="px-5 py-3 font-medium sm:px-7">Benchmark</th>
              <th className="px-3 py-3 font-medium">Tasks</th>
              <th className="px-3 py-3 font-medium">Best single model</th>
              <th className="px-3 py-3 text-right font-medium">Its success</th>
              <th className="px-3 py-3 text-right font-medium">With routing</th>
              <th className="px-3 py-3 text-right font-medium">Improvement</th>
              <th className="px-5 py-3 text-right font-medium sm:px-7">Tasks won by another model</th>
            </tr>
          </thead>
          <tbody className="tabular divide-y divide-line">
            {ALL.map(({ b, s }) => (
              <tr key={b.id}>
                <td className="px-5 py-3.5 font-semibold sm:px-7">{b.name}</td>
                <td className="px-3 py-3.5 text-ink-2">{b.tasks.length}</td>
                <td className="px-3 py-3.5 text-ink-2">{s.best}</td>
                <td className="px-3 py-3.5 text-right text-ink-2">{f1(s.single)}%</td>
                <td className="px-3 py-3.5 text-right font-semibold text-blue-deep">{f1(s.routed)}%</td>
                <td className="px-3 py-3.5 text-right">
                  <span className="rounded-full bg-blue-soft px-2 py-0.5 font-semibold text-blue-deep">{pct(s.rel)}</span>
                </td>
                <td className="px-5 py-3.5 text-right text-ink-2 sm:px-7">
                  {s.otherWins} of {b.tasks.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="group border-t border-line">
        <summary className="cursor-pointer list-none px-5 py-3.5 text-[13.5px] font-medium text-blue hover:text-blue-deep sm:px-7">
          <span className="group-open:hidden">Show per-task results</span>
          <span className="hidden group-open:inline">Hide per-task results</span>
        </summary>
        <div className="grid gap-8 overflow-x-auto px-5 pb-6 sm:px-7">
          {ALL.map(({ b, s }) => (
            <div key={b.id} className="min-w-[560px]">
              <h4 className="mb-2 text-[14px] font-semibold">
                {b.name} <span className="font-normal text-ink-3">· success rate per task, %</span>
              </h4>
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-line text-ink-3">
                    <th className="py-2 pr-4 font-medium">Task</th>
                    {s.names.map((n) => (
                      <th key={n} className="py-2 pr-4 text-right font-medium">
                        {n}
                      </th>
                    ))}
                    <th className="py-2 text-right font-medium">Routed to</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {s.perTask.map((t) => (
                    <tr key={t.task} className="border-b border-line/60">
                      <td className="py-1.5 pr-4">{t.task}</td>
                      {t.scores.map(([n, v]) => (
                        <td key={n} className={`py-1.5 pr-4 text-right ${n === t.winner ? "font-semibold text-blue-deep" : "text-ink-2"}`}>
                          {f1(v)}
                        </td>
                      ))}
                      <td className={`py-1.5 text-right ${t.winner === s.best ? "text-ink-3" : "font-medium"}`}>{t.winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export function Benchmarks() {
  return (
    <section id="benchmarks" aria-labelledby="b-title" className="pt-24 sm:pt-32">
      <Wrap>
        <SectionHead
          kicker="Benchmarks"
          id="b-title"
          title="Routing beats the best single model on standard benchmarks."
          lead={
            <>
              We applied task-level routing to the published per-task results of three widely used robot benchmarks. On <Mark>every one</Mark>,
              sending each task to its best model outscores the strongest individual model.
            </>
          }
        />
        <div className="grid gap-4">
          <Comparison />
          <SummaryTable />
        </div>
        <p className="mt-5 max-w-[70em] text-[12px] leading-relaxed text-ink-3">
          Sources. Real-robot footage and head-to-head results: RoboArena (MIT license), judged without knowing which model ran. Benchmark results as
          published: SimplerEnv by NVIDIA (Isaac-GR00T); RoboCasa by Kim et al., ICML 2026; RoboTwin 2.0 by its authors (randomized-scene setting).
          Routed scores use the published per-task results with the best model chosen for each task. Improvement is relative: (routed − best single) ÷
          best single.
        </p>
      </Wrap>
    </section>
  );
}
