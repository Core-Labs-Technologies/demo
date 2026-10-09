import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { Icon, Mark, SectionHead, Wrap } from "./ui";

/* ---------- Launch film ----------
   The old page hid its play overlay with the `hidden` attribute, which its own
   `display: grid` overrode, so the overlay stayed on top of the video and ate
   every click. Here the overlay is removed from the tree once playback starts. */

export function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);

  const play = useCallback(() => {
    const v = video.current;
    if (!v) return;
    setStarted(true);
    setEnded(false);
    if (v.ended) v.currentTime = 0;
    v.play().catch(() => {});
  }, []);

  return (
    <section id="film" aria-label="Launch film" className="pt-2">
      <Wrap>
        <div className="relative overflow-hidden rounded-2xl bg-ink shadow-[0_40px_100px_-30px_rgba(10,20,40,0.45)] ring-1 ring-black/5">
          <video
            ref={video}
            className="block aspect-video w-full bg-black"
            src="/clips/launch-film.mp4"
            poster="/clips/launch-film.jpg"
            playsInline
            preload="metadata"
            controls={started}
            onEnded={() => setEnded(true)}
          />
          <AnimatePresence>
            {(!started || ended) && (
              <motion.button
                type="button"
                onClick={play}
                aria-label={ended ? "Replay the launch film" : "Play the launch film"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                className="group absolute inset-0 grid cursor-pointer place-items-center bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10"
              >
                <span className="grid justify-items-center gap-5">
                  <span className="relative grid size-20 place-items-center rounded-full bg-white text-blue shadow-2xl transition-transform duration-300 group-hover:scale-105 sm:size-24">
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-duration:2.2s]" />
                    {ended ? Icon.replay("size-8") : Icon.play("relative ml-1 size-8")}
                  </span>
                  <span className="text-[15px] font-medium text-white">{ended ? "Watch again" : "Watch the launch film"}</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-3 font-mono text-[12px] text-ink-3">58 seconds · sound on</p>
      </Wrap>
    </section>
  );
}

/* ---------- Real-robot matchups (RoboArena sessions 73836e70, eeabf0f3, 78f5c453) ---------- */

type Side = { name: string; by: string; clip: string };
const MATCHES: { tab: string; note: string; fail: Side; win: Side }[] = [
  {
    tab: "Close the book",
    note: "“Close the book.” π0.5 never closes it.",
    fail: { name: "π0.5", by: "Physical Intelligence · strongest on average", clip: "book_pi05" },
    win: { name: "PaliGemma FAST-specialist", by: "Open-source baseline", clip: "book_pgfast" },
  },
  {
    tab: "Wooden block into the cup",
    note: "“Put the wooden block into the cup.” π0.5 goes for the red block.",
    fail: { name: "π0.5", by: "Physical Intelligence · strongest on average", clip: "block_pi05" },
    win: { name: "π0-FAST", by: "Physical Intelligence · earlier model", clip: "block_pi0fast" },
  },
  {
    tab: "Banana into the bowl",
    note: "“Put the banana into the bowl.” π0.5 pushes it aside.",
    fail: { name: "π0.5", by: "Physical Intelligence · strongest on average", clip: "banana_pi05" },
    win: { name: "π0-FAST", by: "Physical Intelligence · earlier model", clip: "banana_pi0fast" },
  },
];

function Clip({ side, won, done, vref, onEnded }: { side: Side; won: boolean; done: boolean; vref: (el: HTMLVideoElement | null) => void; onEnded: () => void }) {
  return (
    <figure className="grid min-w-0 gap-3">
      <div
        className={`relative aspect-video overflow-hidden rounded-xl bg-black transition-shadow duration-500 ${
          done && won ? "shadow-[0_0_0_3px_var(--color-win)]" : "ring-1 ring-line"
        }`}
      >
        <video
          ref={vref}
          muted
          playsInline
          preload="auto"
          poster={`/clips/${side.clip}.jpg`}
          src={`/clips/${side.clip}.mp4`}
          onEnded={onEnded}
          aria-label={`${side.name} attempting the task`}
          className={`block size-full object-cover transition-[filter] duration-700 ${done && !won ? "brightness-[0.6] grayscale-[0.8]" : ""}`}
        />
        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold text-white sm:left-3 sm:top-3 sm:text-[13px] ${
                won ? "bg-win" : "bg-fail"
              }`}
            >
              {won ? Icon.check() : Icon.cross()} {won ? "Succeeded" : "Failed"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="grid">
          <b className="text-[15px] font-semibold sm:text-[16px]">{side.name}</b>
          <small className="text-[12px] text-ink-3 sm:text-[13px]">{side.by}</small>
        </span>
        <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${won ? "text-win" : "text-fail"}`}>
          {won ? Icon.check() : Icon.cross()} {won ? "Succeeded" : "Failed"}
        </span>
      </figcaption>
    </figure>
  );
}

export function Evidence() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.35 });
  const [cur, setCur] = useState(0);
  const [ended, setEnded] = useState<[boolean, boolean]>([false, false]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const progress = useMotionValue(0);
  const done = reduce || (ended[0] && ended[1]);
  const m = MATCHES[cur];

  const select = (i: number) => {
    setEnded([false, false]);
    progress.set(0);
    setCur(i);
  };

  // Play while the matchup is on screen; pause when it scrolls away.
  useEffect(() => {
    if (reduce) return;
    const vs = vids.current.filter(Boolean) as HTMLVideoElement[];
    if (inView) vs.forEach((v) => !v.ended && v.play().catch(() => {}));
    else vs.forEach((v) => v.pause());
  }, [inView, cur, reduce]);

  // Drive the tab's progress line from the first clip.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = vids.current[0];
      if (v && v.duration) progress.set(Math.min(1, v.currentTime / v.duration));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cur, progress]);

  // Both clips finished: hold the verdict, then move on.
  useEffect(() => {
    if (!done || reduce || !inView) return;
    const t = setTimeout(() => select((cur + 1) % MATCHES.length), 2800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, inView, cur, reduce]);

  const replay = () => {
    setEnded([false, false]);
    vids.current.forEach((v) => {
      if (!v) return;
      v.currentTime = 0;
      v.play().catch(() => {});
    });
  };

  return (
    <section id="evidence" aria-labelledby="ev-title" className="pt-24 sm:pt-32">
      <Wrap>
        <SectionHead
          kicker="Evidence · Real robots"
          id="ev-title"
          title="The best model changes from task to task."
          lead={
            <>
              We analyzed <Mark>3,883 blind evaluation sessions</Mark> on real robot arms. The strongest model, π0.5 from Physical Intelligence,{" "}
              <Mark>still loses 1 in 3</Mark>. Below, the same robot gets the same instruction: π0.5 fails and a different model succeeds.
            </>
          }
        />

        <div className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-line bg-soft p-1 sm:rounded-full" role="tablist" aria-label="Matchups">
          {MATCHES.map((mm, i) => (
            <button
              key={mm.tab}
              type="button"
              role="tab"
              aria-selected={i === cur}
              onClick={() => select(i)}
              className={`relative overflow-hidden rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                i === cur ? "text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              {i === cur && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative">{mm.tab}</span>
              {i === cur && (
                <motion.span className="absolute bottom-0 left-3 right-3 h-[2px] origin-left rounded-full bg-[#8fb0ff]" style={{ scaleX: progress }} />
              )}
            </button>
          ))}
        </div>

        <div ref={box} role="tabpanel" className="grid grid-cols-2 gap-3 sm:gap-5">
          <Clip
            key={`f-${cur}`}
            side={m.fail}
            won={false}
            done={done}
            vref={(el) => (vids.current[0] = el)}
            onEnded={() => setEnded((e) => [true, e[1]])}
          />
          <Clip
            key={`w-${cur}`}
            side={m.win}
            won
            done={done}
            vref={(el) => (vids.current[1] = el)}
            onEnded={() => setEnded((e) => [e[0], true])}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-[14px]">
          <span className="text-ink-2">{m.note}</span>
          <span className="flex items-center gap-4">
            <span className="font-mono text-[11.5px] text-ink-3">Real robots, scored blind · sped up 2×</span>
            <button type="button" onClick={replay} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13px] font-medium hover:border-ink-3">
              {Icon.replay("size-3.5")} Replay
            </button>
          </span>
        </div>
      </Wrap>
    </section>
  );
}
