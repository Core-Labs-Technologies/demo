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
  useVideoConfig,
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

// Scene boundaries at 30 fps, cut to the score: build to the hit at 14.2 s, quiet 14.2 to 24 s, drive from 24 s, outro at 56 s.
const S = {
  open: [0, 150],
  many: [150, 285],
  questions: [285, 425],
  brand: [425, 545],
  stack: [545, 720],
  demo: [720, 1470],
  proof: [1470, 1605],
  close: [1605, 1740],
} as const;
export const TOTAL = 1740;

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

const Stack: React.FC = () => {
  const f = useCurrentFrame();
  const pillars = [
    { t: "Route", d: "pick the right model" },
    { t: "Enforce", d: "constrain every action" },
    { t: "Comply", d: "signed action trail" },
    { t: "Recover", d: "learn from failures" },
  ];
  const chip = (t: string) => <span key={t} style={{ fontSize: 26, fontWeight: 500, color: C.ink }}>{t}</span>;
  const X0 = 200, W = 1520;
  const lanes = [0.25, 0.5, 0.75].map((k) => X0 + W * k);
  const tier = (d: number): React.CSSProperties => ({ opacity: fade(f, d, d + 16), transform: `translateY(${(1 - fade(f, d, d + 16)) * 20}px)` });
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
        <div style={{ background: "#8E9BB3", color: C.white, fontSize: 22, fontWeight: 600, padding: "8px 24px", display: "flex", justifyContent: "space-between" }}><span>Factory operations</span><span style={{ opacity: 0.8 }}>Customer fleet</span></div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 86 }}>{["WMS", "Fleet management", "Supervisor", "MES / ERP"].map(chip)}</div>
      </div>
      <div style={{ position: "absolute", left: X0 - 10, top: 452, width: W + 20, height: 300, borderRadius: 20, background: "#EEF3FF", border: `3px solid ${C.cobalt}`, overflow: "hidden", boxShadow: "0 30px 80px rgba(31,79,214,0.18)", ...tier(16) }}>
        <div style={{ background: C.cobalt, color: C.white, fontSize: 26, fontWeight: 600, padding: "12px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Core Labs harness</span>
          <span style={{ fontSize: 18, border: "1.5px solid rgba(255,255,255,0.8)", borderRadius: 999, padding: "3px 14px", letterSpacing: "0.06em" }}>ON THE EDGE</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, padding: "26px 26px" }}>
          {pillars.map((p, i) => (
            <div key={p.t} style={{ background: C.white, borderRadius: 12, padding: "30px 24px", textAlign: "center", border: `1px solid ${C.line}`, ...tier(40 + i * 8) }}>
              <div style={{ fontSize: 34, fontWeight: 600, color: C.ink }}>{p.t}</div>
              <div style={{ fontSize: 22, color: C.ink2, marginTop: 6 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: X0, top: 812, width: W, height: 130, borderRadius: 16, background: C.soft, border: `1px solid ${C.line}`, overflow: "hidden", ...tier(26) }}>
        <div style={{ background: "#8E9BB3", color: C.white, fontSize: 22, fontWeight: 600, padding: "8px 24px", display: "flex", justifyContent: "space-between" }}><span>Policies and robots</span><span style={{ opacity: 0.8 }}>Labs and in-house</span></div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 86 }}>{["VLAs", "World models", "In-house policies", "Arms", "Humanoids", "Sensors", "Controllers"].map(chip)}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- the product demo: one work order through the harness ---------------- */

type Rect = { x: number; y: number; w: number; h: number; s: number };
const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080, s: 1 };
const FEED: Rect = { x: 100, y: 144, w: 1060, h: 626, s: 1.48 };
const camFor = (r: Rect) => ({ s: r.s, tx: 960 - r.s * (r.x + r.w / 2), ty: 540 - r.s * (r.y + r.h / 2) });
const KEYS: [number, Rect][] = [[0, FEED], [150, FEED], [176, FULL], [318, FULL], [336, FEED], [446, FEED], [464, FULL], [750, FULL]];
const camera = (f: number) => {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [a, ra] = KEYS[i], [b, rb] = KEYS[i + 1];
    if (f <= b) {
      const t = interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
      const A = camFor(ra), B = camFor(rb);
      return { s: A.s + (B.s - A.s) * t, tx: A.tx + (B.tx - A.tx) * t, ty: A.ty + (B.ty - A.ty) * t };
    }
  }
  return camFor(FULL);
};

const HALT = 120, TAKEOVER = 332, DONE = 438;

// Feature moments: a console panel lifts out, the console dims behind it.
const POP = {
  router: { a: 180, b: 318, rect: { x: 1180, y: 144, w: 640, h: 416 }, k: 1.6, cy: 640, title: "Model routing", sub: "The task goes to the model with the best record on it." },
  enforce: { a: 452, b: 558, rect: { x: 1180, y: 580, w: 640, h: 420 }, k: 1.6, cy: 640, title: "Safety enforcement", sub: "Every move is checked before it happens." },
  trail: { a: 562, b: 652, rect: { x: 100, y: 780, w: 1060, h: 220 }, k: 1.45, cy: 610, title: "Signed action trail", sub: "Every decision recorded, signed and chained." },
};
const popT = (f: number, a: number, b: number) => {
  const inn = interpolate(f, [a, a + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [b - 14, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return inn * (1 - out);
};

const Pill: React.FC<{ tone: "gray" | "blue" | "green" | "amber" | "red"; children: React.ReactNode; style?: React.CSSProperties }> = ({ tone, children, style }) => {
  const t = { gray: [C.soft, C.ink2], blue: [C.cobaltSoft, C.cobalt], green: [C.greenSoft, C.green], amber: [C.amberSoft, C.amber], red: [C.redSoft, C.red] }[tone];
  return <span style={{ background: t[0], color: t[1], fontSize: 16, fontWeight: 600, padding: "5px 11px", borderRadius: 999, whiteSpace: "nowrap", ...style }}>{children}</span>;
};

const BareCtx = React.createContext(false);
const PanelFrame: React.FC<{ w: number; h: number; title: string; right?: React.ReactNode; children: React.ReactNode }> = ({ w, h, title, right, children }) => {
  const bare = React.useContext(BareCtx);
  return (
  <div style={{ width: w, height: h, background: C.white, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", position: "relative" }}>
    <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: `1px solid ${C.line}` }}>
      <span style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>{bare ? "" : title}</span>
      {right}
    </div>
    {children}
  </div>
  );
};

/* Live feed with perception overlay */
const Bracket: React.FC<{ x: number; y: number; w: number; h: number; color: string; label: string; p: number }> = ({ x, y, w, h, color, label, p }) => {
  const L = 12, T = 2.5;
  const c = (s: React.CSSProperties) => <div style={{ position: "absolute", width: L, height: L, borderColor: color, borderStyle: "solid", ...s }} />;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: p, transform: `scale(${1.25 - 0.25 * p})` }}>
      {c({ left: 0, top: 0, borderWidth: `${T}px 0 0 ${T}px` })}
      {c({ right: 0, top: 0, borderWidth: `${T}px ${T}px 0 0` })}
      {c({ left: 0, bottom: 0, borderWidth: `0 0 ${T}px ${T}px` })}
      {c({ right: 0, bottom: 0, borderWidth: `0 ${T}px ${T}px 0` })}
      <div style={{ position: "absolute", left: -1, bottom: h + 6, background: color, color: C.white, fontSize: 13, fontWeight: 600, padding: "3px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

const Toast: React.FC<{ dot: string; strong: string; rest?: string; p: number }> = ({ dot, strong, rest, p }) => (
  <div style={{ position: "absolute", left: "50%", top: 16, transform: `translate(-50%, ${(1 - p) * -10}px)`, opacity: p, display: "flex", alignItems: "center", gap: 10, background: "rgba(16,18,24,0.82)", color: C.white, fontSize: 17, padding: "8px 16px", borderRadius: 999, backdropFilter: "blur(6px)", whiteSpace: "nowrap" }}>
    <span style={{ width: 8, height: 8, borderRadius: 4, background: dot }} />
    <b style={{ fontWeight: 600 }}>{strong}</b>
    {rest && <span style={{ opacity: 0.8 }}>{rest}</span>}
  </div>
);

const Feed: React.FC = () => {
  const f = useCurrentFrame();
  const halted = f >= HALT && f < TAKEOVER;
  const secs = 7 + Math.floor(f / 30);
  const vid = { width: "100%", height: "100%", objectFit: "cover" as const };
  return (
    <div style={{ position: "absolute", left: 120, top: 194, width: 1020, height: 574, borderRadius: 10, overflow: "hidden", background: "#000" }}>
      <Sequence durationInFrames={HALT}>
        <OffthreadVideo muted src={staticFile("arena/feed_pi05.mp4")} trimBefore={90} style={vid} />
      </Sequence>
      <Sequence from={HALT} durationInFrames={TAKEOVER - HALT}>
        <Freeze frame={HALT - 1}>
          <OffthreadVideo muted src={staticFile("arena/feed_pi05.mp4")} trimBefore={90} style={{ ...vid, filter: "saturate(0.7) brightness(0.85)" }} />
        </Freeze>
      </Sequence>
      <Sequence from={TAKEOVER}>
        <OffthreadVideo muted src={staticFile("arena/feed_pi0fast.mp4")} trimBefore={90} playbackRate={1.6} style={vid} />
      </Sequence>
      {f < TAKEOVER && <Bracket x={684} y={318} w={64} h={70} color={C.cobalt} label="Target · wooden block" p={fade(f, 20, 32)} />}
      {halted && <Bracket x={584} y={298} w={68} h={56} color={C.red} label="Grasping · red block" p={fade(f, HALT + 4, HALT + 14)} />}
      {halted && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${C.red}`, opacity: fade(f, HALT, HALT + 8) }} />}
      <div style={{ position: "absolute", left: 16, top: 16, display: "flex", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 600, color: C.white, background: "rgba(16,18,24,0.7)", padding: "5px 10px", borderRadius: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: halted ? "#9AA1AE" : "#FF4D3D" }} />{halted ? "Paused" : "Live"}
        </span>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.white, background: "rgba(16,18,24,0.7)", padding: "5px 10px", borderRadius: 6 }}>{f < TAKEOVER ? "π0.5" : "π0-FAST"}</span>
      </div>
      <div style={{ position: "absolute", right: 16, top: 16, fontSize: 15, fontWeight: 600, color: C.white, background: "rgba(16,18,24,0.7)", padding: "5px 10px", borderRadius: 6, fontVariantNumeric: "tabular-nums" }}>14:02:{String(secs).padStart(2, "0")}</div>
      {halted && <Toast dot={C.red} strong="Policy halted" rest="Wrong part" p={fade(f, HALT + 6, HALT + 16)} />}
      {f >= DONE && <Toast dot="#22C55E" strong="Task complete" p={fade(f, DONE, DONE + 10)} />}
    </div>
  );
};

/* Router */
const MODELS = [
  { id: "π0.5", cx: 130, cy: 46, score: 0.19, bad: true },
  { id: "GR00T N1.6", cx: 330, cy: 38, score: 0.41 },
  { id: "π0-FAST", cx: 530, cy: 52, score: 0.87, best: true },
  { id: "OpenVLA", cx: 240, cy: 96, score: 0.33 },
];
const RouterBody: React.FC = () => {
  const f = useCurrentFrame();
  const scoring = f >= 196, routed = f >= 272;
  const star = fade(f, 198, 210);
  const pts = (seed: number, n: number) => Array.from({ length: n }, (_, i) => {
    const a = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453, b = Math.sin(seed * 39.3468 + i * 11.135) * 24634.6345;
    return [((a - Math.floor(a)) - 0.5) * 74, ((b - Math.floor(b)) - 0.5) * 34];
  });
  return (
    <PanelFrame w={640} h={416} title="Model router" right={routed ? <Pill tone="blue">Routed</Pill> : scoring ? <Pill tone="amber">Scoring</Pill> : <Pill tone="gray">Idle</Pill>}>
      <svg width={640} height={140} style={{ display: "block", background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
        {MODELS.map((m, mi) => {
          const col = routed && m.best ? C.cobalt : routed && m.bad ? C.red : "#B3BAC6";
          return (
            <g key={m.id}>
              {scoring && <line x1={450} y1={92} x2={m.cx} y2={m.cy + 10} stroke={routed && m.best ? C.cobalt : "#D3D8E0"} strokeWidth={routed && m.best ? 2.5 : 1.2} opacity={star} />}
              {pts(mi + 1, 26).map(([dx, dy], k) => <circle key={k} cx={m.cx + dx} cy={m.cy + 10 + dy} r={2.8} fill={col} />)}
              <text x={m.cx} y={m.cy - 16} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={14} fill={C.ink2}>{m.id}</text>
            </g>
          );
        })}
        <g opacity={star}>
          <circle cx={450} cy={92} r={9} fill={C.white} stroke={C.ink} strokeWidth={2.5} />
          <circle cx={450} cy={92} r={3} fill={C.ink} />
          <text x={450} y={124} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={14} fill={C.ink}>Live frame</text>
        </g>
      </svg>
      <div style={{ padding: "8px 18px" }}>
        {MODELS.map((m, i) => {
          const p = scoring ? interpolate(f, [206 + i * 7, 240 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) : 0;
          const hl = routed && m.best;
          return (
            <div key={m.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr 60px 96px", alignItems: "center", gap: 14, height: 38, fontSize: 18, color: C.ink, background: hl ? C.cobaltSoft : undefined, margin: "0 -18px", padding: "0 18px" }}>
              <span style={{ fontWeight: 600, color: hl ? C.cobalt : C.ink }}>{m.id}</span>
              <div style={{ height: 6, background: C.soft, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${m.score * 100 * p}%`, height: "100%", background: m.best ? C.cobalt : m.bad ? C.red : "#8C94A3" }} />
              </div>
              <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{p > 0 ? (m.score * p).toFixed(2) : ""}</span>
              <span style={{ textAlign: "right", opacity: fade(f, 252, 260) }}>{m.best ? <Pill tone="blue">{routed ? "Routed" : "Best match"}</Pill> : m.bad ? <Pill tone="red">Failed</Pill> : null}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 14, background: C.cobalt, color: C.white, fontSize: 18, fontWeight: 600, padding: "11px 16px", borderRadius: 10, opacity: fade(f, 272, 282), transform: `translateY(${(1 - fade(f, 272, 282)) * 8}px)` }}>
        Rerouted from π0.5 to π0-FAST
      </div>
    </PanelFrame>
  );
};

/* Safety enforcement */
const LOG = [
  { a: "Move arm to the cup", v: "410 mm/s", r: "Allowed", tone: "green" as const },
  { a: "Grip force on the block", v: "52 N → 38 N", r: "Clamped", tone: "amber" as const },
  { a: "Path through Zone B", v: "", r: "Blocked", tone: "red" as const },
  { a: "Person enters Zone B", v: "Slow to 250 mm/s", r: "Slowed", tone: "amber" as const },
  { a: "Supervisor holds all robots", v: "8 robots", r: "Held", tone: "red" as const },
];
const EnforceBody: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <PanelFrame w={640} h={420} title="Safety enforcement" right={<Pill tone="gray">3 site rules</Pill>}>
      {LOG.map((l, i) => {
        const at = i < 2 ? 352 + i * 40 : 478 + (i - 2) * 16;
        const p = fade(f, at, at + 10);
        const stamp = spring({ frame: f - at - 6, fps: 30, config: { damping: 12, stiffness: 220, mass: 0.5 } });
        return (
          <div key={l.a} style={{ display: "grid", gridTemplateColumns: "1fr auto 100px", alignItems: "center", gap: 14, height: 70, padding: "0 18px", borderBottom: `1px solid ${C.line}`, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
            <span style={{ fontSize: 19, fontWeight: 500, color: C.ink }}>{l.a}</span>
            <span style={{ fontSize: 17, color: C.ink2, fontVariantNumeric: "tabular-nums" }}>{l.v}</span>
            <span style={{ textAlign: "right", display: "inline-block", transform: `scale(${0.6 + 0.4 * stamp})` }}><Pill tone={l.tone}>{l.r}</Pill></span>
          </div>
        );
      })}
    </PanelFrame>
  );
};

/* Signed action trail */
const TRAIL = [
  { k: "Route", tone: "blue" as const, t: "Assigned π0.5", at: 30 },
  { k: "Halt", tone: "red" as const, t: "Wrong part, halted", at: HALT + 6 },
  { k: "Route", tone: "blue" as const, t: "Rerouted to π0-FAST", at: 276 },
  { k: "Done", tone: "green" as const, t: "Block in the cup", at: DONE + 6 },
];
const Seal: React.FC<{ p: number }> = ({ p }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.green, fontSize: 15, fontWeight: 600, opacity: Math.min(1, p * 1.4), transform: `scale(${0.5 + 0.5 * p})`, transformOrigin: "left center" }}>
    <svg width={16} height={16} viewBox="0 0 16 16"><circle cx="8" cy="8" r="7.2" fill={C.green} /><path d="M4.6 8.3l2.2 2.2 4.6-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    Signed
  </span>
);
const TrailBody: React.FC = () => {
  const f = useCurrentFrame();
  const replay = f >= POP.trail.a; // during the feature moment the chain is redrawn link by link
  const base = POP.trail.a + 14;
  const verified = fade(f, base + 64, base + 74);
  return (
    <PanelFrame w={1060} h={220} title="Signed action trail" right={replay ? <span style={{ opacity: verified }}><Pill tone="green">Chain verified</Pill></span> : undefined}>
      <div style={{ display: "flex", alignItems: "center", padding: "26px 18px" }}>
        {TRAIL.map((c, i) => {
          const at = replay ? base + i * 14 : c.at;
          const p = f >= c.at ? (replay ? 1 : fade(f, c.at, c.at + 10)) : 0;
          const seal = replay ? spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 200, mass: 0.6 } }) : (f > c.at + 12 ? 1 : 0);
          const link = replay ? fade(f, at - 8, at) : (f > c.at ? 1 : 0);
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={{ width: 26, height: 3, background: C.line, position: "relative", opacity: p }}>
                  <div style={{ position: "absolute", inset: 0, width: `${link * 100}%`, background: C.cobalt }} />
                </div>
              )}
              <div style={{ width: 232, border: `1px solid ${replay && seal > 0.5 ? "#C9D6F8" : C.line}`, borderRadius: 12, padding: "14px 16px", opacity: p, background: C.white, display: "grid", gap: 10, boxShadow: replay && seal > 0.5 ? "0 6px 18px rgba(31,79,214,0.10)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Pill tone={c.tone} style={{ fontSize: 14, padding: "3px 9px" }}>{c.k}</Pill>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink2, fontVariantNumeric: "tabular-nums" }}>#{4414 + i}</span>
                </div>
                <div style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>{c.t}</div>
                <Seal p={seal} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </PanelFrame>
  );
};

/* The whole fleet learns */
const FLEET = [["Cell 14", "6-axis arm"], ["Cell 12", "6-axis arm"], ["Cell 11", "Humanoid"], ["Cell 9", "7-axis cobot"], ["Cell 7", "Mobile manipulator"], ["Cell 5", "Humanoid"], ["Cell 3", "6-axis arm"], ["Cell 1", "Gantry"]];
const FleetMoment: React.FC = () => {
  const f = useCurrentFrame();
  const A = 656;
  const t = popT(f, A, 800);
  if (f < A) return null;
  const updatedAt = (i: number) => A + 44 + i * 5;
  const n = FLEET.filter((_, i) => f >= updatedAt(i)).length;
  return (
    <>
      <PopTitle title="The whole fleet learns" sub="One failure becomes a rule every robot inherits." t={t} top={208} />
      <div style={{ position: "absolute", left: 160, top: 340, width: 1600, display: "grid", gridTemplateColumns: "560px 1fr", gap: 28, opacity: t, transform: `translateY(${(1 - t) * 80}px) scale(${0.96 + 0.04 * t})` }}>
        <div style={{ background: C.white, borderRadius: 18, padding: "28px 30px", boxShadow: "0 40px 100px rgba(0,0,0,0.35)", display: "grid", gap: 18, alignContent: "start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>New rule</span>
            <Pill tone="blue">From work order 88412</Pill>
          </div>
          {[["When", "A small wooden part sits next to a red one"], ["Use", "π0-FAST"], ["Skip", "π0.5"]].map(([k, v], i) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 12, alignItems: "baseline", borderTop: `1px solid ${C.line}`, paddingTop: 16, opacity: fade(f, A + 14 + i * 6, A + 24 + i * 6) }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: C.cobalt }}>{k}</span>
              <span style={{ fontSize: 24, fontWeight: 500, color: C.ink, lineHeight: 1.3 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.white, borderRadius: 18, padding: "28px 30px", boxShadow: "0 40px 100px rgba(0,0,0,0.35)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>Fleet</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: n === FLEET.length ? C.cobalt : C.ink, fontVariantNumeric: "tabular-nums" }}>{n} of {FLEET.length} robots updated</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            {FLEET.map(([id, kind], i) => {
              const ok = f >= updatedAt(i);
              const pop = spring({ frame: f - updatedAt(i), fps: 30, config: { damping: 12, stiffness: 220, mass: 0.5 } });
              return (
                <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${ok ? "#C9D6F8" : C.line}`, background: ok ? "#F5F8FF" : C.white, borderRadius: 12, padding: "14px 18px" }}>
                  <span style={{ fontSize: 21, fontWeight: 600, color: C.ink }}>{id} <span style={{ fontWeight: 500, color: C.ink2 }}>· {kind}</span></span>
                  {ok ? (
                    <span style={{ display: "inline-grid", placeItems: "center", width: 28, height: 28, borderRadius: 14, background: C.cobalt, transform: `scale(${pop})` }}>
                      <svg width={14} height={14} viewBox="0 0 14 14"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  ) : <span style={{ width: 28, height: 28, borderRadius: 14, border: `2px solid ${C.line}` }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const PopTitle: React.FC<{ title: string; sub: string; t: number; top: number }> = ({ title, sub, t, top }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
    <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.03em", color: C.white }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.86)", marginTop: 6 }}>{sub}</div>
  </div>
);

const PopOut: React.FC<{ cfg: (typeof POP)[keyof typeof POP]; children: React.ReactNode }> = ({ cfg, children }) => {
  const f = useCurrentFrame();
  const t = popT(f, cfg.a, cfg.b);
  if (t <= 0.001) return null;
  const { x, y, w, h } = cfg.rect;
  const left = x + (960 - (cfg.k * w) / 2 - x) * t;
  const top = y + (cfg.cy - (cfg.k * h) / 2 - y) * t;
  const s = 1 + (cfg.k - 1) * t;
  return (
    <>
      <PopTitle title={cfg.title} sub={cfg.sub} t={t} top={cfg.cy - (cfg.k * h) / 2 - 140} />
      <div style={{ position: "absolute", left, top, transform: `scale(${s})`, transformOrigin: "0 0", borderRadius: 14, boxShadow: `0 ${50 * t}px ${120 * t}px rgba(0,0,0,${0.4 * t})` }}><BareCtx.Provider value={t > 0.5}>{children}</BareCtx.Provider></div>
    </>
  );
};

const CAPTIONS: [number, number, string][] = [
  [8, 112, "The cell’s default model takes the job."],
  [124, 172, "It reaches for the wrong part, so the harness stops it."],
  [340, 444, "π0-FAST takes over and finishes the job."],
];
const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPTIONS.find(([a, b]) => f >= a && f <= b);
  if (!c) return null;
  const [a, b, t] = c;
  const o = Math.min(fade(f, a, a + 8), 1 - fade(f, b - 8, b));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(16,18,24,0.86)", color: C.white, fontSize: 32, fontWeight: 500, padding: "14px 28px", borderRadius: 12 }}>{t}</div>
    </div>
  );
};

const Demo: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f);
  const tR = popT(f, POP.router.a, POP.router.b), tE = popT(f, POP.enforce.a, POP.enforce.b), tT = popT(f, POP.trail.a, POP.trail.b), tF = popT(f, 656, 800);
  const dim = Math.max(tR, tE, tT, tF);
  const status =
    f < HALT ? <Pill tone="green">π0.5 running</Pill>
    : f < 272 ? <Pill tone="red">π0.5 halted</Pill>
    : f < DONE ? <Pill tone="blue">π0-FAST running</Pill>
    : <Pill tone="green">Complete</Pill>;
  const hide = (t: number): React.CSSProperties => ({ opacity: t > 0.001 ? 0 : 1 });
  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      <AbsoluteFill style={{ filter: dim > 0 ? `blur(${7 * dim}px)` : undefined, opacity: fade(f, 0, 14) }}>
        <AbsoluteFill style={{ transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 80, top: 60, width: 1760, height: 960, background: "#F7F8FA", borderRadius: 18, boxShadow: "0 40px 120px rgba(11,13,18,0.18)", border: `1px solid ${C.line}` }}>
            <div style={{ height: 64, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", borderBottom: `1px solid ${C.line}`, background: C.white, borderRadius: "18px 18px 0 0" }}>
              <Wordmark size={18} />
              <span style={{ width: 1, height: 22, background: C.line }} />
              <span style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>Cell 14</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: C.ink2, background: C.soft, padding: "6px 12px", borderRadius: 8 }}>Work order 88412 · Wooden block into the cup</span>
              <span style={{ marginLeft: "auto" }}>{status}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 100, top: 144 }}><PanelFrame w={1060} h={626} title="Live view" right={<Pill tone="gray">6-axis arm</Pill>}><div /></PanelFrame></div>
          <Feed />
          <div style={{ position: "absolute", left: 1180, top: 144, ...hide(tR) }}><RouterBody /></div>
          <div style={{ position: "absolute", left: 1180, top: 580, ...hide(tE) }}><EnforceBody /></div>
          <div style={{ position: "absolute", left: 100, top: 780, ...hide(tT) }}><TrailBody /></div>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(10,12,17,${0.62 * dim})` }} />
      <PopOut cfg={POP.router}><RouterBody /></PopOut>
      <PopOut cfg={POP.enforce}><EnforceBody /></PopOut>
      <PopOut cfg={POP.trail}><TrailBody /></PopOut>
      <FleetMoment />
      <Caption />
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
      <Line delay={2} style={{ position: "absolute", left: 120, top: 170, fontSize: 62, fontWeight: 600, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>
        On public benchmarks, routing beats the best single model.
      </Line>
      <div style={{ position: "absolute", left: 120, top: 380, width: 1680, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `2px solid ${C.ink}` }}>
        {cols.map((c, i) => (
          <Line key={c.n} delay={14 + i * 6} style={{ padding: "34px 40px 0 0", borderLeft: i ? `1px solid ${C.line}` : undefined, paddingLeft: i ? 40 : 0 }}>
            <div style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>{c.n}</div>
            <div style={{ fontSize: 120, fontWeight: 600, letterSpacing: "-0.04em", color: C.cobalt, lineHeight: 1.05, marginTop: 10 }}>+{(c.b - c.a).toFixed(1)}</div>
            <div style={{ fontSize: 30, color: C.ink2, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{c.a.toFixed(1)}% → {c.b.toFixed(1)}% success</div>
          </Line>
        ))}
      </div>
      <Line delay={40} style={{ position: "absolute", left: 120, top: 900, fontSize: 24, color: C.gray }}>
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
            <Line delay={12} style={{ fontSize: 36, color: C.ink2 }}>Research lab accelerating robot adoption</Line>
            <Line delay={20} style={{ marginTop: 24 }}>
              <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>Tejas Anand · Hitarth Khurana · Vansh Wahi</div>
              <div style={{ fontSize: 24, color: C.gray, marginTop: 6 }}>Researchers from NVIDIA, Google Gemini and Amazon</div>
            </Line>
          </div>
          <div style={{ position: "absolute", bottom: 40, left: 120, right: 120, textAlign: "center", fontSize: 17, color: C.gray, lineHeight: 1.5 }}>
            Footage: DROID dataset teleoperated demonstrations (CC BY 4.0) and RoboArena autonomous policy evaluations (MIT). Console screens are product illustrations. Benchmark figures from published per-task results.
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

export const Launch: React.FC<{ music?: boolean }> = ({ music = true }) => (
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
      <Audio src={staticFile("audio/score.m4a")} volume={(f) => interpolate(f, [0, 8, TOTAL - 40, TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    )}
  </AbsoluteFill>
);
