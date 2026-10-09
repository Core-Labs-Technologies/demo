import { motion } from "motion/react";
import { siGooglegemini, siNvidia, siSnowflake } from "simple-icons";
import tejas from "../assets/team/tejas.webp";
import hitarth from "../assets/team/hitarth.webp";
import vansh from "../assets/team/vansh.webp";
import { AWS_PATH } from "../data/aws";
import { Icon, SectionHead, Wrap } from "./ui";

const grow = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

/* ---------- Method ---------- */

const STEPS = [
  { icon: Icon.match, name: "Match the task", text: "Compare each work order with what every model has been trained and tested on: scenes, objects and skills." },
  { icon: Icon.chart, name: "Read the record", text: "Pull each model’s measured success on this task, on this robot, at this site." },
  {
    icon: Icon.gauge,
    name: "Decide with confidence",
    text: "Switch models only when the lead is statistically real. If no model is confident, hand the task to a human operator.",
  },
];

const CANDS = [
  { name: "π0-FAST", note: "Best on this task", v: 88, pick: true },
  { name: "π0", v: 70 },
  { name: "GR00T N1.5", note: "Best on average", v: 44 },
];

export function Method() {
  return (
    <section id="method" aria-labelledby="m-title" className="pt-24 sm:pt-32">
      <Wrap className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <SectionHead kicker="How the router decides" id="m-title" title="Measured, not claimed." />
          <ol className="relative grid gap-7">
            <span className="absolute bottom-5 left-5 top-5 w-px bg-line" aria-hidden="true" />
            {STEPS.map((s) => (
              <li key={s.name} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4">
                <span className="grid size-10 place-items-center rounded-full border border-blue/20 bg-white text-blue shadow-sm">{s.icon("size-[18px]")}</span>
                <div className="grid gap-1 pt-1.5">
                  <b className="text-[1.08rem] font-semibold">{s.name}</b>
                  <span className="text-[15px] leading-relaxed text-ink-2">{s.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_24px_70px_-24px_rgba(19,48,143,0.28)] sm:p-6" aria-label="Example routing decision">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">Routing decision · RoboCasa kitchen</span>
            <span className="rounded-full bg-blue px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white">Switch</span>
          </div>
          <div className="mb-5 text-[1.45rem] font-semibold leading-tight tracking-tight">Turn on the microwave</div>
          <div className="grid gap-3">
            {CANDS.map((c, i) => (
              <div key={c.name} className="grid grid-cols-[118px_minmax(0,1fr)_44px] items-center gap-3 text-[14px]">
                <div className="leading-tight">
                  <span className={c.pick ? "font-semibold text-blue-deep" : ""}>{c.name}</span>
                  {c.note && <small className="block text-[11.5px] text-ink-3">{c.note}</small>}
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-soft">
                  <motion.div
                    className={`h-full rounded-full ${c.pick ? "bg-blue" : "bg-bar"}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.v}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ ...grow, delay: i * 0.08 }}
                  />
                </div>
                <span className="tabular text-right font-semibold">{c.v}%</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line text-[12px] text-ink-3">
            {[
              ["50 runs", "per model"],
              ["2×", "the default’s success"],
              ["p < 0.001", "lead is real"],
            ].map(([a, b]) => (
              <div key={a} className="grid gap-0.5 bg-white p-3">
                <b className="text-[15px] font-semibold text-ink">{a}</b>
                {b}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-blue-mist px-3.5 py-3 text-[14px]">
            <span className="text-blue">{Icon.arrow("size-4")}</span>
            <span>
              Routed to <b className="text-blue-deep">π0-FAST</b>: twice the success rate of the best-on-average model on this task.
            </span>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/* ---------- Team ---------- */

type Org = { name: string; path: string; wide?: boolean };
const PREVIOUSLY: Org[] = [
  { name: "NVIDIA", path: siNvidia.path },
  { name: "Google Gemini", path: siGooglegemini.path },
  { name: "AWS", path: AWS_PATH, wide: true },
  { name: "Snowflake", path: siSnowflake.path },
];

const TEAM = [
  {
    name: "Tejas Anand",
    photo: tejas,
    focus: "Computer vision · VLMs",
    points: ["Applied research at NVIDIA", "Multiple patents in computer vision and vision-language models"],
  },
  {
    name: "Hitarth Khurana",
    photo: hitarth,
    focus: "Robotics in production",
    points: ["Robotics at Boxbot", "Robotics at Amazon", "Raised $500K+ as part of Waterloo Blockchain"],
  },
  {
    name: "Vansh Wahi",
    photo: vansh,
    focus: "Foundation models",
    points: ["Applied research at Google Gemini", "Founding engineer at TensorStax, acquired by Snowflake"],
  },
];

export function Team() {
  return (
    <section id="team" aria-labelledby="t-title" className="pt-24 sm:pt-32">
      <Wrap>
        <SectionHead
          kicker="Team"
          id="t-title"
          title={
            <>
              Researchers from <span className="text-blue">NVIDIA, Google Gemini and Amazon.</span>
            </>
          }
        />
        <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-line bg-soft/70 px-5 py-4 text-ink-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">Previously at</span>
          {PREVIOUSLY.map((o) => (
            <span key={o.name} className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink/80" aria-label={o.wide ? "Amazon Web Services" : undefined}>
              <svg viewBox="0 0 24 24" className={o.wide ? "h-7 w-7" : "size-[18px]"} aria-hidden="true">
                <path d={o.path} fill="currentColor" />
              </svg>
              {!o.wide && o.name}
            </span>
          ))}
          <span className="text-[15px] font-semibold tracking-tight text-ink/80">Boxbot</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TEAM.map((p) => (
            <motion.article
              key={p.name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="group grid content-start gap-5 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_20px_50px_-24px_rgba(19,48,143,0.35)] sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img src={p.photo} alt={p.name} width={104} height={104} className="size-[104px] rounded-full object-cover ring-4 ring-blue-soft transition-[box-shadow] group-hover:ring-blue/30" />
                </div>
                <div className="grid gap-1">
                  <h3 className="text-[1.25rem] font-semibold leading-tight">{p.name}</h3>
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-blue">{p.focus}</span>
                </div>
              </div>
              <ul className="grid gap-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-[14.5px] leading-snug text-ink-2">
                    <span className="mt-[3px] text-blue">{Icon.check("size-3.5")}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

/* ---------- Footer ---------- */

const CONTACT = "mailto:hitarth2004@gmail.com,anandtejas455@gmail.com,vanshwahi786@gmail.com";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line">
      <Wrap className="flex flex-wrap items-center justify-between gap-4 py-8">
        <span className="text-[14px] font-semibold tracking-[0.14em]">CORE LABS™</span>
        <a href={CONTACT} className="text-[14px] font-medium text-ink-2 underline-offset-4 transition-colors hover:text-blue hover:underline">
          Contact us
        </a>
      </Wrap>
    </footer>
  );
}
