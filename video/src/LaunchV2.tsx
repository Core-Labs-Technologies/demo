// Launch film, version 2: same story and score as Launch.tsx, rewritten for a non-robotics audience.
// The product demo is told in plain beats (the job, the mistake, the stop, the switch, the result),
// jargon is replaced with plain words, small text is enlarged for screen sharing, and the end card holds longer.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/HankenGrotesk";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });
const FONT = `${fontFamily}, "Helvetica Neue", Helvetica, Arial, sans-serif`;

const C = {
  ink: "#0B0D12",
  ink2: "#4A5160",
  gray: "#8A909B",
  line: "#E4E7EC",
  soft: "#F4F6F9",
  canvas: "#E9EDF3",
  white: "#FFFFFF",
  cobalt: "#1F4FD6",
  cobaltSoft: "#E3EAFC",
  cobaltLight: "#86A6FF",
  green: "#13915A",
  greenSoft: "#E3F5EC",
  amber: "#B26A00",
  amberSoft: "#FDF1DC",
  red: "#D64232",
  redSoft: "#FBE7E4",
};

// Scene boundaries at 30 fps, cut to the score as in Launch.tsx. The score ends at 1740; the end card holds past it in silence.
const S = {
  open: [0, 150],
  many: [150, 285],
  questions: [285, 425],
  brand: [425, 545],
  stack: [545, 720],
  demo: [720, 1470],
  proof: [1470, 1605],
  close: [1605, 1815],
} as const;
export const TOTAL = 1815;
const SCORE_END = 1740;

/* ---------------- building blocks ---------------- */

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// A whole line rises and fades in. No per-word bounce.
const Line: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number; dur?: number }> = ({ delay = 0, children, style, dist = 18, dur = 14 }) => {
  const f = useCurrentFrame();
  const p = fade(f, delay, delay + dur);
  return <div style={{ ...style, opacity: p, transform: `translateY(${(1 - p) * dist}px)` }}>{children}</div>;
};

const Footage: React.FC<{ src: string; start: number; dur: number; zoom?: [number, number]; dim?: number; blur?: number; origin?: string }> = ({
  src, start, dur, zoom = [1.03, 1.1], dim = 0, blur = 0, origin = "50% 50%",
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom, { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin, filter: blur ? `blur(${blur}px)` : undefined }}>
        <OffthreadVideo muted src={staticFile(`footage/${src}.mp4`)} trimBefore={Math.round(start * 30)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(6,8,12,${dim})` }} />}
    </AbsoluteFill>
  );
};

const Cinematic: React.FC<{ vignette?: number; grain?: number }> = ({ vignette = 0.55, grain = 0.06 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)` }} />
      <AbsoluteFill style={{ opacity: grain, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id={`g${f % 6}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 6} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#g${f % 6})`} />
        </svg>
      </AbsoluteFill>
    </>
  );
};

const Wordmark: React.FC<{ color?: string; size?: number }> = ({ color = C.cobalt, size = 26 }) => (
  <span style={{ fontWeight: 700, fontSize: size, letterSpacing: "0.22em", color }}>CORE LABS</span>
);
const Check: React.FC<{ color: string; size?: number }> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Cross: React.FC<{ color: string; size?: number }> = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" /></svg>
);

const Pill: React.FC<{ tone: "gray" | "blue" | "green" | "amber" | "red"; children: React.ReactNode; style?: React.CSSProperties }> = ({ tone, children, style }) => {
  const t = { gray: [C.soft, C.ink2], blue: [C.cobaltSoft, C.cobalt], green: [C.greenSoft, C.green], amber: [C.amberSoft, C.amber], red: [C.redSoft, C.red] }[tone];
  return <span style={{ background: t[0], color: t[1], fontSize: 16, fontWeight: 600, padding: "5px 11px", borderRadius: 999, whiteSpace: "nowrap", ...style }}>{children}</span>;
};

/* ---------------- opening ---------------- */

const Open: React.FC = () => {
  const shots = [
    { src: "003_wrist", start: 1.0, from: 0, dur: 54 },
    { src: "010_ext1", start: 2.2, from: 54, dur: 32 },
    { src: "015_wrist", start: 13.0, from: 86, dur: 32 },
    { src: "126_ext1", start: 22, from: 118, dur: 32 },
  ];
  return (
    <AbsoluteFill>
      {shots.map((s) => (
        <Sequence key={s.src} from={s.from} durationInFrames={s.dur}>
          <Footage src={s.src} start={s.start} dur={s.dur} zoom={[1.04, 1.1]} />
        </Sequence>
      ))}
      <Cinematic />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(5,7,10,0.8) 0%, rgba(5,7,10,0.3) 40%, rgba(5,7,10,0) 65%)" }} />
      <Line delay={4} style={{ position: "absolute", left: 120, top: 72 }}><Wordmark color="rgba(255,255,255,0.92)" /></Line>
      <div style={{ position: "absolute", left: 120, bottom: 120, color: C.white, fontSize: 120, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.0 }}>
        <Line delay={16} dur={16}>Robots are getting</Line>
        <Line delay={28} dur={16}>smarter every month.</Line>
      </div>
    </AbsoluteFill>
  );
};

const Many: React.FC = () => {
  const f = useCurrentFrame();
  const tiles = [
    { src: "114_ext1", start: 12 },
    { src: "051_ext1", start: 5 },
    { src: "120_ext1", start: 3 },
    { src: "117_ext1", start: 27 },
    { src: "025_ext2", start: 5.5 },
    { src: "111_ext2", start: 3 },
  ];
  const chips = [
    { t: "π0.5", x: 560, y: 470, d: 40 },
    { t: "GR00T N1.6", x: 1150, y: 420, d: 46 },
    { t: "OpenVLA", x: 1620, y: 520, d: 52 },
    { t: "In-house policy", x: 300, y: 760, d: 58 },
    { t: "World model", x: 880, y: 820, d: 64 },
    { t: "Vendor stack", x: 1450, y: 760, d: 70 },
    { t: "π0-FAST", x: 1240, y: 980, d: 76 },
    { t: "Diffusion policy", x: 520, y: 1000, d: 82 },
  ];
  const zoom = interpolate(f, [0, 135], [1.04, 1.0], { easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Line delay={2} style={{ position: "absolute", left: 120, top: 100, color: C.white, fontSize: 62, fontWeight: 600, letterSpacing: "-0.03em", width: 1700, whiteSpace: "nowrap" }}>
        But a factory floor isn’t one robot running one model.
      </Line>
      <Line delay={62} style={{ position: "absolute", left: 120, top: 196, fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", color: C.cobaltLight }}>
        Closed. Open. Multi-brand.
      </Line>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 70%" }}>
        {tiles.map((t, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const x = 126 + col * (540 + 24), y = 330 + row * (304 + 22);
          const p = fade(f, 6 + i * 4, 22 + i * 4);
          return (
            <div key={t.src} style={{ position: "absolute", left: x, top: y, width: 540, height: 304, borderRadius: 12, overflow: "hidden", opacity: p }}>
              <Footage src={t.src} start={t.start} dur={135} zoom={[1.0, 1.05]} />
            </div>
          );
        })}
        {chips.map((c) => {
          const p = fade(f, c.d, c.d + 10);
          return (
            <div key={c.t} style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%,-50%) translateY(${(1 - p) * 10}px)`, opacity: p, background: C.white, color: C.ink, fontSize: 28, fontWeight: 600, padding: "10px 20px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
              {c.t}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Questions: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    { t: "Which model should run this task?", d: 6 },
    { t: "Who enforces the factory’s rules?", d: 36 },
    { t: "Who signs for what just happened?", d: 66 },
  ];
  return (
    <AbsoluteFill>
      <Footage src="104_ext1" start={3} dur={140} dim={0.66} blur={4} zoom={[1.08, 1.14]} />
      <Cinematic vignette={0.7} />
      <div style={{ position: "absolute", left: 160, top: 250, display: "grid", gap: 26 }}>
        {lines.map((l, i) => {
          const next = lines[i + 1];
          const dimAt = next ? next.d : 98;
          const o = interpolate(f, [dimAt + 2, dimAt + 14], [1, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={l.t} style={{ opacity: o }}>
              <Line delay={l.d} style={{ color: C.white, fontSize: 84, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{l.t}</Line>
            </div>
          );
        })}
        <Line delay={100} style={{ marginTop: 34, fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em", color: C.cobaltLight }}>
          Today, nobody owns that layer.
        </Line>
      </div>
    </AbsoluteFill>
  );
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  const settle = interpolate(f, [0, 16], [1.04, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill style={{ background: C.white, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${settle})`, display: "grid", justifyItems: "center", gap: 28, textAlign: "center" }}>
        <Line delay={0} dist={6}><Wordmark size={38} /></Line>
        <Line delay={6} dur={16} style={{ fontSize: 150, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 0.98, color: C.ink }}>
          Deployment Harness<br />for Robotics
        </Line>
        <Line delay={40} style={{ fontSize: 44, fontWeight: 500, color: C.ink2 }}>From the lab to the production line.</Line>
      </div>
    </AbsoluteFill>
  );
};

// Plain-language tiers and larger type than Launch.tsx, so it survives a screen share.
const Stack: React.FC = () => {
  const f = useCurrentFrame();
  const pillars = [
    { t: "Route", d: "pick the right model" },
    { t: "Enforce", d: "constrain every action" },
    { t: "Comply", d: "signed action trail" },
    { t: "Recover", d: "learn from failures" },
  ];
  const chip = (t: string) => <span key={t} style={{ fontSize: 32, fontWeight: 500, color: C.ink }}>{t}</span>;
  const X0 = 200, W = 1520;
  const lanes = [0.25, 0.5, 0.75].map((k) => X0 + W * k);
  const tier = (d: number): React.CSSProperties => ({ opacity: fade(f, d, d + 16), transform: `translateY(${(1 - fade(f, d, d + 16)) * 20}px)` });
  const band: React.CSSProperties = { background: "#8E9BB3", color: C.white, fontSize: 26, fontWeight: 600, padding: "8px 24px", display: "flex", justifyContent: "space-between" };
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Line delay={0} style={{ position: "absolute", left: 120, top: 84, fontSize: 60, fontWeight: 600, letterSpacing: "-0.03em", color: C.ink }}>
        It sits between the factory and every model.
      </Line>
      {lanes.map((x, i) => (
        <React.Fragment key={x}>
          {[[392, 452], [752, 812]].map(([y1, y2], j) => {
            const a = fade(f, 30, 46);
            const t = ((f - 40 + i * 11 + j * 15) % 36) / 36;
            return (
              <React.Fragment key={j}>
                <div style={{ position: "absolute", left: x, top: y1, width: 2, height: (y2 - y1) * a, background: "#C9D2E3" }} />
                {f > 46 && <div style={{ position: "absolute", left: x - 4, top: y1 + (y2 - y1) * t - 4, width: 10, height: 10, borderRadius: 5, background: C.cobalt }} />}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: X0, top: 262, width: W, height: 130, borderRadius: 16, background: C.soft, border: `1px solid ${C.line}`, overflow: "hidden", ...tier(6) }}>
        <div style={band}><span>Factory software</span><span style={{ opacity: 0.85 }}>Your operations</span></div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 82 }}>{["Inventory", "Scheduling", "Fleet management", "Supervisors"].map(chip)}</div>
      </div>
      <div style={{ position: "absolute", left: X0 - 10, top: 452, width: W + 20, height: 300, borderRadius: 20, background: "#EEF3FF", border: `3px solid ${C.cobalt}`, overflow: "hidden", boxShadow: "0 30px 80px rgba(31,79,214,0.18)", ...tier(16) }}>
        <div style={{ background: C.cobalt, color: C.white, fontSize: 28, fontWeight: 600, padding: "12px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Core Labs harness</span>
          <span style={{ fontSize: 20, border: "1.5px solid rgba(255,255,255,0.8)", borderRadius: 999, padding: "3px 14px", letterSpacing: "0.06em" }}>RUNS ON SITE</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, padding: "24px 26px" }}>
          {pillars.map((p, i) => (
            <div key={p.t} style={{ background: C.white, borderRadius: 12, padding: "26px 20px", textAlign: "center", border: `1px solid ${C.line}`, ...tier(40 + i * 8) }}>
              <div style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>{p.t}</div>
              <div style={{ fontSize: 27, color: C.ink2, marginTop: 6 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: X0, top: 812, width: W, height: 130, borderRadius: 16, background: C.soft, border: `1px solid ${C.line}`, overflow: "hidden", ...tier(26) }}>
        <div style={band}><span>Robot AIs and robots</span><span style={{ opacity: 0.85 }}>Any vendor</span></div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 82 }}>{["Robot AI models", "In-house AI", "Arms", "Humanoids", "Sensors"].map(chip)}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- the product demo: one job, told in plain beats ---------------- */

// Demo-local frames. The job, the mistake (freeze + zoom), the stop, picking a better AI, the side-by-side,
// then three short cards: safety, the record, the fleet.
const D = { halt: 96, stop: 176, pick: 226, swap: 336, done: 440, safety: 466, record: 561, fleet: 656 };
const PI05_FROM = 30; // 1.0 s into the π0.5 clip; at D.halt it is closing on the red block (4.2 s)
const FAST_FROM = 146; // 4.9 s into the π0-FAST clip, as it lifts the wooden block
const FAST_RATE = 1.6; // lets go of the block over the cup at about 10.4 s of the clip, which lands on D.done

// Object positions in 1920x1080 frame space (the arena clips are 16:9 and the camera is fixed).
const SPOT = { cup: { x: 988, y: 500 }, wood: { x: 1350, y: 648 }, red: { x: 1162, y: 622 } };
type View = { s: number; cx: number; cy: number };
const FULL_VIEW: View = { s: 1, cx: 960, cy: 540 };
const MISTAKE_VIEW: View = { s: 2, cx: 1255, cy: 600 };
const toScreen = (v: View, p: { x: number; y: number }) => ({ x: 960 + v.s * (p.x - v.cx), y: 540 + v.s * (p.y - v.cy) });
const viewStyle = (v: View): React.CSSProperties => ({ transform: `translate(${960 - v.s * v.cx}px, ${540 - v.s * v.cy}px) scale(${v.s})`, transformOrigin: "0 0" });
const mix = (a: View, b: View, t: number): View => ({ s: a.s + (b.s - a.s) * t, cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t });

const fill = { width: "100%", height: "100%" };
const Pi05Live: React.FC = () => <OffthreadVideo muted src={staticFile("arena/feed_pi05.mp4")} trimBefore={PI05_FROM} style={fill} />;
const Pi05Stopped: React.FC = () => <Freeze frame={D.halt - 1}><Pi05Live /></Freeze>;

// An outline around an object, with an optional label tag underneath.
const Ring: React.FC<{ x: number; y: number; w: number; h: number; color: string; p: number; stroke?: number; label?: React.ReactNode }> = ({ x, y, w, h, color, p, stroke = 6, label }) => (
  <>
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", border: `${stroke}px solid ${color}`, boxShadow: "0 0 0 2px rgba(0,0,0,0.25), inset 0 0 0 2px rgba(0,0,0,0.2)", opacity: p, transform: `scale(${1.3 - 0.3 * p})` }} />
    {label && (
      <div style={{ position: "absolute", left: x, top: y + h / 2 + 16, transform: `translate(-50%, ${(1 - p) * 10}px)`, opacity: p, background: color, color: C.white, fontSize: 34, fontWeight: 600, padding: "10px 22px", borderRadius: 999, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
        {label}
      </div>
    )}
  </>
);

// Big lower-third caption, one message at a time.
const Lower: React.FC<{ a: number; b: number; kicker?: string; children: React.ReactNode }> = ({ a, b, kicker, children }) => {
  const f = useCurrentFrame();
  if (f < a || f > b) return null;
  const o = Math.min(fade(f, a, a + 10), 1 - fade(f, b - 8, b));
  return (
    <div style={{ position: "absolute", left: 120, bottom: 96, opacity: o, transform: `translateY(${(1 - fade(f, a, a + 10)) * 14}px)` }}>
      {kicker && <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.cobaltLight, marginBottom: 10 }}>{kicker}</div>}
      <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em", color: C.white, lineHeight: 1.05 }}>{children}</div>
    </div>
  );
};

const ModelTag: React.FC<{ name: string; note: string; style?: React.CSSProperties }> = ({ name, note, style }) => (
  <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14, background: "rgba(12,14,19,0.8)", color: C.white, padding: "14px 22px", borderRadius: 14, fontSize: 32, whiteSpace: "nowrap", ...style }}>
    <span style={{ fontWeight: 700 }}>{name}</span>
    <span style={{ fontWeight: 500, opacity: 0.78 }}>{note}</span>
  </div>
);

/* The job and the mistake, on the live robot camera */
const Robot: React.FC = () => {
  const f = useCurrentFrame();
  const zt = interpolate(f, [D.halt + 4, D.halt + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const view = mix(FULL_VIEW, MISTAKE_VIEW, zt);
  const blur = 14 * fade(f, D.pick - 8, D.pick + 6);
  const jobP = Math.min(fade(f, 14, 26), 1 - fade(f, D.halt - 10, D.halt));
  const cup = toScreen(view, SPOT.cup), wood = toScreen(view, SPOT.wood), red = toScreen(view, SPOT.red);
  const wrongP = fade(f, D.halt + 30, D.halt + 40) * (1 - fade(f, D.stop - 6, D.stop));
  const rightP = fade(f, D.halt + 40, D.halt + 50) * (1 - fade(f, D.stop - 6, D.stop));
  const tagP = fade(f, 6, 18) * (1 - fade(f, D.stop - 6, D.stop));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
        <div style={{ position: "absolute", width: 1920, height: 1080, ...viewStyle(view) }}>{f < D.halt ? <Pi05Live /> : <Pi05Stopped />}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(5,7,10,0.82) 0%, rgba(5,7,10,0.35) 32%, rgba(5,7,10,0) 50%)", opacity: 1 - fade(f, D.stop - 6, D.stop) }} />

      {/* The job: what success looks like */}
      <Ring x={cup.x} y={cup.y} w={150} h={200} color={C.cobaltLight} p={jobP} label="Cup" />
      <Ring x={wood.x} y={wood.y} w={120} h={100} color={C.cobaltLight} p={jobP} label="Wooden block" />
      <Lower a={8} b={D.halt + 2} kicker="The job">Put the wooden block in the cup.</Lower>

      {/* The mistake, frozen and up close */}
      <Ring x={red.x} y={red.y} w={220} h={170} color={C.red} p={wrongP} stroke={8} label={<><Cross color={C.white} size={26} />Wrong block</>} />
      <Ring x={wood.x} y={wood.y} w={220} h={190} color={C.green} p={rightP} stroke={8} label={<><Check color={C.white} size={26} />Right block</>} />
      <Lower a={D.halt + 30} b={D.stop}>It grabs the wrong block.</Lower>

      <div style={{ position: "absolute", left: 120, top: 80, opacity: tagP }}>
        <ModelTag name="π0.5" note="today’s top-rated robot AI" />
      </div>
    </AbsoluteFill>
  );
};

/* Core Labs stops it */
const Stop: React.FC = () => {
  const f = useCurrentFrame();
  if (f < D.stop || f >= D.pick) return null;
  const p = fade(f, D.stop, D.stop + 10) * (1 - fade(f, D.pick - 8, D.pick));
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <AbsoluteFill style={{ background: "rgba(10,12,17,0.62)" }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 0 12px ${C.red}` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", gap: 34 }}>
        <svg width={128} height={128} viewBox="0 0 64 64" style={{ transform: `scale(${0.7 + 0.3 * spring({ frame: f - D.stop, fps: 30, config: { damping: 12, stiffness: 200, mass: 0.6 } })})` }}>
          <path d="M21 3h22l18 18v22L43 61H21L3 43V21z" fill={C.red} />
          <rect x={17} y={28} width={30} height={8} rx={2} fill={C.white} />
        </svg>
        <div style={{ color: C.white, fontSize: 100, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.04 }}>
          <Line delay={D.stop + 4}>Core Labs catches it</Line>
          <Line delay={D.stop + 12} style={{ color: "rgba(255,255,255,0.82)" }}>and stops the robot.</Line>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Which AI is best at this job? Illustrative track records. */
const CANDIDATES = [
  { id: "π0.5", note: "top-rated overall", v: 0.19, bad: true },
  { id: "GR00T N1.6", note: "by NVIDIA", v: 0.41 },
  { id: "OpenVLA", note: "open source", v: 0.33 },
  { id: "π0-FAST", note: "better at this job", v: 0.87, best: true },
];
const Pick: React.FC = () => {
  const f = useCurrentFrame();
  if (f < D.pick || f >= D.swap) return null;
  const t = fade(f, D.pick, D.pick + 14) * (1 - fade(f, D.swap - 8, D.swap));
  const hl = fade(f, D.pick + 62, D.pick + 72);
  const go = fade(f, D.pick + 74, D.pick + 84);
  return (
    <AbsoluteFill style={{ opacity: t }}>
      <AbsoluteFill style={{ background: "rgba(10,12,17,0.72)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", transform: `translateY(${(1 - t) * 16}px)` }}>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em", color: C.white }}>Which AI is best at this job?</div>
        <div style={{ fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginTop: 10 }}>Core Labs checks each AI’s track record on jobs like this one.</div>
      </div>
      <div style={{ position: "absolute", left: 340, top: 330, width: 1240, background: C.white, borderRadius: 22, padding: "26px 44px 32px", boxShadow: "0 40px 100px rgba(0,0,0,0.4)", transform: `translateY(${(1 - t) * 40}px)` }}>
        {CANDIDATES.map((m, i) => {
          const p = fade(f, D.pick + 12 + i * 6, D.pick + 44 + i * 6);
          const on = m.best ? hl : 0;
          return (
            <div key={m.id} style={{ display: "grid", gridTemplateColumns: "400px 1fr", alignItems: "center", gap: 36, height: 104, margin: "0 -44px", padding: "0 44px", background: on ? `rgba(227,234,252,${on})` : undefined, borderTop: i ? `1px solid ${C.line}` : undefined }}>
              <div>
                <span style={{ fontSize: 42, fontWeight: 600, color: m.best && on > 0.5 ? C.cobalt : C.ink }}>{m.id}</span>
                <span style={{ fontSize: 28, fontWeight: 500, color: C.gray, marginLeft: 14 }}>{m.note}</span>
              </div>
              <div style={{ height: 24, background: C.soft, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ width: `${m.v * 100 * p}%`, height: "100%", borderRadius: 12, background: m.best ? C.cobalt : m.bad ? C.red : "#A9B0BC" }} />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16, background: C.cobalt, color: C.white, fontSize: 38, fontWeight: 600, padding: "18px 26px", borderRadius: 14, opacity: go, transform: `translateY(${(1 - go) * 10}px)` }}>
          <svg width={34} height={34} viewBox="0 0 16 16"><path d="M3 8h9M9 4.5L12.5 8 9 11.5" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
          Switching to π0-FAST
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Same robot, same job, different AI */
const Shot: React.FC<{ w: number; h: number; view: View; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, view, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 16, overflow: "hidden", background: "#000", ...style }}>
    <div style={{ position: "absolute", width: 1920, height: 1080, transform: `scale(${w / 1920})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", width: 1920, height: 1080, ...viewStyle(view) }}>{children}</div>
    </div>
  </div>
);
const Badge: React.FC<{ color: string; children: React.ReactNode; p?: number }> = ({ color, children, p = 1 }) => (
  <div style={{ position: "absolute", left: 20, top: 20, display: "flex", alignItems: "center", gap: 10, background: color, color: C.white, fontSize: 32, fontWeight: 600, padding: "10px 20px", borderRadius: 999, opacity: p, transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: "left center", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
    {children}
  </div>
);
const Swap: React.FC = () => {
  const f = useCurrentFrame();
  if (f < D.swap || f >= D.safety) return null;
  const t = fade(f, D.swap, D.swap + 14);
  const done = spring({ frame: f - D.done, fps: 30, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const W = 870, H = 489;
  const leftView: View = { s: 1.5, cx: 1200, cy: 560 };
  const rightView = FULL_VIEW;
  const red = toScreen(leftView, SPOT.red);
  const cup = toScreen(rightView, SPOT.cup);
  const label = (name: string, note: string, color: string) => (
    <div style={{ marginTop: 22, fontSize: 40, fontWeight: 600, color }}>{name}<span style={{ fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginLeft: 14 }}>{note}</span></div>
  );
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Line delay={D.swap + 2} style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em", color: C.white }}>
        Same robot. Same job. Different AI.
      </Line>
      <div style={{ position: "absolute", left: 70, top: 270, opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}>
        <Shot w={W} h={H} view={leftView} style={{ filter: "saturate(0.6) brightness(0.8)" }}>
          <Pi05Stopped />
        </Shot>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
          <div style={{ position: "absolute", left: (red.x * W) / 1920 - 70, top: (red.y * H) / 1080 - 55, width: 140, height: 110, borderRadius: "50%", border: `6px solid ${C.red}` }} />
          <Badge color={C.red}><Cross color={C.white} size={24} />Wrong block</Badge>
        </div>
        {label("π0.5", "top-rated overall", C.white)}
      </div>
      <div style={{ position: "absolute", left: 980, top: 270, opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}>
        <Shot w={W} h={H} view={rightView} style={{ boxShadow: done > 0.01 ? `0 0 0 ${6 * done}px ${C.green}` : undefined }}>
          <Sequence from={D.swap}>
            <OffthreadVideo muted src={staticFile("arena/feed_pi0fast.mp4")} trimBefore={FAST_FROM} playbackRate={FAST_RATE} style={fill} />
          </Sequence>
        </Shot>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
          {f >= D.done && <div style={{ position: "absolute", left: (cup.x * W) / 1920 - 50, top: (cup.y * H) / 1080 - 62, width: 100, height: 124, borderRadius: "50%", border: `6px solid ${C.green}`, opacity: done, transform: `scale(${1.3 - 0.3 * Math.min(1, done)})` }} />}
          {f < D.done ? <Badge color={C.cobalt}>Picked by Core Labs</Badge> : <Badge color={C.green} p={done}><Check color={C.white} size={26} />Done</Badge>}
        </div>
        {label("π0-FAST", "better at this job", C.cobaltLight)}
      </div>
    </AbsoluteFill>
  );
};

/* Three short cards: safety, the record, the fleet */
const Card: React.FC<{ a: number; b: number; title: string; sub: string; exit?: boolean; children: React.ReactNode }> = ({ a, b, title, sub, exit = true, children }) => {
  const f = useCurrentFrame();
  if (f < a || f >= b) return null;
  const t = fade(f, a, a + 14) * (exit ? 1 - fade(f, b - 10, b) : 1);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em", color: C.white }}>{title}</div>
        <div style={{ fontSize: 36, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginTop: 12 }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>{children}</div>
    </AbsoluteFill>
  );
};
const panel: React.CSSProperties = { background: C.white, borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,0.4)" };
const stamp = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 12, stiffness: 220, mass: 0.5 } });

const RULES = [
  { a: "Moving too fast near a person", r: "Slowed down", tone: "amber" as const },
  { a: "Gripping too hard", r: "Eased off", tone: "amber" as const },
  { a: "Heading into a no-go zone", r: "Blocked", tone: "red" as const },
];
const Safety: React.FC = () => {
  const f = useCurrentFrame();
  const a = D.safety;
  return (
    <Card a={a} b={D.record} title="Safety rules on every move" sub="Checked before the robot acts.">
      <div style={{ ...panel, width: 1180, padding: "8px 44px" }}>
        {RULES.map((r, i) => {
          const at = a + 12 + i * 10;
          const p = fade(f, at, at + 10);
          return (
            <div key={r.a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 118, borderTop: i ? `1px solid ${C.line}` : undefined, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
              <span style={{ fontSize: 42, fontWeight: 500, color: C.ink }}>{r.a}</span>
              <span style={{ display: "inline-block", transform: `scale(${0.6 + 0.4 * stamp(f, at + 4)})` }}><Pill tone={r.tone} style={{ fontSize: 34, padding: "10px 24px" }}>{r.r}</Pill></span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const RECORD = [
  { k: "Assigned", tone: "blue" as const, t: "Job given to π0.5" },
  { k: "Stopped", tone: "red" as const, t: "Wrong block" },
  { k: "Switched", tone: "blue" as const, t: "Moved to π0-FAST" },
  { k: "Done", tone: "green" as const, t: "Block in the cup" },
];
const Record: React.FC = () => {
  const f = useCurrentFrame();
  const a = D.record;
  return (
    <Card a={a} b={D.fleet} title="A record of every decision" sub="Can’t be changed after the fact. Ready for audits and insurance.">
      <div style={{ ...panel, padding: "36px 36px", display: "flex", alignItems: "center" }}>
        {RECORD.map((c, i) => {
          const at = a + 12 + i * 9;
          const p = fade(f, at, at + 10);
          const s = stamp(f, at + 6);
          return (
            <React.Fragment key={c.k}>
              {i > 0 && <div style={{ width: 34, height: 4, background: C.line, position: "relative" }}><div style={{ position: "absolute", inset: 0, width: `${p * 100}%`, background: C.cobalt }} /></div>}
              <div style={{ width: 360, border: `1px solid ${C.line}`, borderRadius: 16, padding: "22px 24px", display: "grid", gap: 14, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
                <span><Pill tone={c.tone} style={{ fontSize: 26, padding: "6px 16px" }}>{c.k}</Pill></span>
                <div style={{ fontSize: 34, fontWeight: 600, color: C.ink, lineHeight: 1.15, whiteSpace: "nowrap" }}>{c.t}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.green, fontSize: 26, fontWeight: 600, opacity: s, transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: "left center" }}>
                  <svg width={26} height={26} viewBox="0 0 16 16"><circle cx="8" cy="8" r="7.2" fill={C.green} /><path d="M4.6 8.3l2.2 2.2 4.6-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Recorded
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

const FLEET = [["Robot arm", "Line 1"], ["Robot arm", "Line 2"], ["Humanoid", "Line 3"], ["Mobile robot", "Line 4"], ["Robot arm", "Line 5"], ["Humanoid", "Line 6"], ["Mobile robot", "Line 7"], ["Robot arm", "Line 8"]];
const Fleet: React.FC = () => {
  const f = useCurrentFrame();
  const a = D.fleet;
  const updatedAt = (i: number) => a + 26 + i * 5;
  const n = FLEET.filter((_, i) => f >= updatedAt(i)).length;
  return (
    <Card a={a} b={S.demo[1] - S.demo[0]} exit={false} title="The whole fleet learns" sub="One mistake becomes a lesson every robot gets.">
      <div style={{ display: "flex", gap: 28, alignItems: "stretch" }}>
        <div style={{ ...panel, width: 560, padding: "30px 34px", display: "grid", gap: 18, alignContent: "start" }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: C.ink }}>Lesson learned</span>
          {[["Job", "Wooden block into the cup"], ["Use", "π0-FAST"], ["Not", "π0.5"]].map(([k, v], i) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 14, alignItems: "baseline", borderTop: `1px solid ${C.line}`, paddingTop: 18, opacity: fade(f, a + 12 + i * 6, a + 22 + i * 6) }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: C.cobalt }}>{k}</span>
              <span style={{ fontSize: 34, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ ...panel, width: 920, padding: "30px 34px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 36, fontWeight: 600, color: C.ink }}>Fleet</span>
            <span style={{ fontSize: 32, fontWeight: 600, color: n === FLEET.length ? C.cobalt : C.ink, fontVariantNumeric: "tabular-nums" }}>{n} of {FLEET.length} robots updated</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
            {FLEET.map(([kind, where], i) => {
              const ok = f >= updatedAt(i);
              const pop = stamp(f, updatedAt(i));
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${ok ? "#C9D6F8" : C.line}`, background: ok ? "#F5F8FF" : C.white, borderRadius: 12, padding: "14px 18px" }}>
                  <span style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{kind} <span style={{ fontWeight: 500, color: C.ink2 }}>· {where}</span></span>
                  {ok ? (
                    <span style={{ display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: 17, background: C.cobalt, transform: `scale(${pop})` }}>
                      <svg width={17} height={17} viewBox="0 0 14 14"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  ) : <span style={{ width: 34, height: 34, borderRadius: 17, border: `2px solid ${C.line}` }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

const Demo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {f < D.swap && <Robot />}
      <Stop />
      <Pick />
      <Swap />
      <Safety />
      <Record />
      <Fleet />
    </AbsoluteFill>
  );
};

/* ---------------- proof and close ---------------- */

const Proof: React.FC = () => {
  const cols = [
    { n: "SimplerEnv", a: 63.0, b: 75.3 },
    { n: "RoboCasa", a: 65.7, b: 69.7 },
    { n: "RoboTwin 2.0", a: 16.3, b: 19.7 },
  ];
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Line delay={2} style={{ position: "absolute", left: 120, top: 150, fontSize: 62, fontWeight: 600, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>
        On public benchmarks, routing beats the best single model.
      </Line>
      <Line delay={10} style={{ position: "absolute", left: 120, top: 270, fontSize: 32, fontWeight: 500, color: C.ink2 }}>
        Success rate: best single AI → with Core Labs routing
      </Line>
      <div style={{ position: "absolute", left: 120, top: 360, width: 1680, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `2px solid ${C.ink}` }}>
        {cols.map((c, i) => (
          <Line key={c.n} delay={14 + i * 6} style={{ padding: "34px 40px 0 0", borderLeft: i ? `1px solid ${C.line}` : undefined, paddingLeft: i ? 40 : 0 }}>
            <div style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>{c.n}</div>
            <div style={{ fontSize: 100, fontWeight: 600, letterSpacing: "-0.04em", color: C.cobalt, lineHeight: 1.05, marginTop: 14, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: C.gray }}>{Math.round(c.a)}%</span>
              <span style={{ color: C.gray, fontWeight: 500, margin: "0 14px" }}>→</span>
              {Math.round(c.b)}%
            </div>
            <div style={{ fontSize: 32, color: C.ink2, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>+{(c.b - c.a).toFixed(1)} points</div>
          </Line>
        ))}
      </div>
      <Line delay={40} style={{ position: "absolute", left: 120, top: 900, fontSize: 30, color: C.gray }}>
        Task-level routing applied to published per-task results.
      </Line>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const shots = [
    { src: "145_wrist", start: 38, from: 0 },
    { src: "120_ext2", start: 4, from: 15 },
    { src: "053_ext1", start: 3, from: 30 },
    { src: "126_ext2", start: 32, from: 45 },
  ];
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={60}>
        <AbsoluteFill>
          {shots.map((s) => (
            <Sequence key={s.src} from={s.from} durationInFrames={15}>
              <Footage src={s.src} start={s.start} dur={15} dim={0.5} zoom={[1.04, 1.08]} />
            </Sequence>
          ))}
          <Cinematic vignette={0.6} />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.white, fontSize: 120, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
            <Line delay={2}>Any robot. Any model.</Line>
            <Line delay={24} style={{ color: C.cobaltLight }}>One harness.</Line>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={60}>
        <AbsoluteFill style={{ background: C.white, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "grid", justifyItems: "center", gap: 22, textAlign: "center" }}>
            <Line delay={0} dist={8}><Wordmark size={42} /></Line>
            <Line delay={4} style={{ fontSize: 96, fontWeight: 600, letterSpacing: "-0.04em", color: C.ink, lineHeight: 1 }}>Deployment Harness for Robotics</Line>
            <Line delay={12} style={{ fontSize: 38, color: C.ink2 }}>Research lab accelerating robot adoption</Line>
            <Line delay={20} style={{ marginTop: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 600, color: C.ink }}>Tejas Anand · Hitarth Khurana · Vansh Wahi</div>
              <div style={{ fontSize: 28, color: C.ink2, marginTop: 8 }}>Researchers from NVIDIA, Google Gemini and Amazon</div>
            </Line>
          </div>
          <div style={{ position: "absolute", bottom: 40, left: 120, right: 120, textAlign: "center", fontSize: 22, color: C.gray, lineHeight: 1.5 }}>
            Footage: DROID dataset teleoperated demonstrations (CC BY 4.0) and RoboArena autonomous policy evaluations (MIT). Product screens are illustrations. Benchmark figures from published per-task results.
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

/* ---------------- composition ---------------- */

const seq = (k: keyof typeof S, el: React.ReactNode) => (
  <Sequence key={k} from={S[k][0]} durationInFrames={S[k][1] - S[k][0]} name={k}>{el}</Sequence>
);

export const LaunchV2: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <AbsoluteFill style={{ fontFamily: FONT, background: C.white, WebkitFontSmoothing: "antialiased" }}>
    {seq("open", <Open />)}
    {seq("many", <Many />)}
    {seq("questions", <Questions />)}
    {seq("brand", <Brand />)}
    {seq("stack", <Stack />)}
    {seq("demo", <Demo />)}
    {seq("proof", <Proof />)}
    {seq("close", <Close />)}
    {music && (
      <Audio src={staticFile("audio/score.m4a")} volume={(f) => interpolate(f, [0, 8, SCORE_END - 40, SCORE_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    )}
  </AbsoluteFill>
);
