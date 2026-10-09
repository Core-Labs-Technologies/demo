import type { ReactNode } from "react";

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-4 sm:px-8 ${className}`}>{children}</div>;
}

/** Section label in the lab-notebook style. */
export function Kicker({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-blue">{children}</span>;
}

export function SectionHead({ kicker, title, lead, id }: { kicker: string; title: ReactNode; lead?: ReactNode; id: string }) {
  return (
    <div className="mb-10 grid gap-4 sm:mb-12">
      <Kicker>{kicker}</Kicker>
      <h2 id={id} className="max-w-[22ch] text-[clamp(1.9rem,3.6vw,2.85rem)] font-semibold leading-[1.06]">
        {title}
      </h2>
      {lead && <p className="max-w-[40em] text-[1.08rem] leading-relaxed text-ink-2">{lead}</p>}
    </div>
  );
}

/** Highlighted figure inside running text, for the numbers a reader should take away. */
export function Mark({ children }: { children: ReactNode }) {
  return <b className="rounded-[4px] bg-blue-soft px-1 py-0.5 font-semibold text-blue-deep">{children}</b>;
}

export const Icon = {
  play: (c = "size-4") => (
    <svg viewBox="0 0 16 16" className={c} aria-hidden="true"><path d="M4.5 2.8l8.5 5.2-8.5 5.2z" fill="currentColor" /></svg>
  ),
  check: (c = "size-3.5") => (
    <svg viewBox="0 0 14 14" className={c} aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  cross: (c = "size-3.5") => (
    <svg viewBox="0 0 14 14" className={c} aria-hidden="true"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
  ),
  arrow: (c = "size-4") => (
    <svg viewBox="0 0 16 16" className={c} aria-hidden="true"><path d="M3 8h9.5M9 4.5L12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  down: (c = "size-4") => (
    <svg viewBox="0 0 16 16" className={c} aria-hidden="true"><path d="M8 3v9.5M4.5 9L8 12.5 11.5 9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  replay: (c = "size-4") => (
    <svg viewBox="0 0 16 16" className={c} aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  // Pillar and step icons: drawn on a 24px grid, 1.6px stroke.
  route: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2.2" /><circle cx="19" cy="5" r="2.2" /><circle cx="19" cy="12" r="2.2" /><circle cx="19" cy="19" r="2.2" /><path d="M7.2 12h9.6M7 11l9.9-5.2M7 13l9.9 5.2" /></svg>
  ),
  shield: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" /><path d="M8.8 12.2l2.2 2.2 4.3-4.6" /></svg>
  ),
  ledger: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2.5" /><path d="M8 8h8M8 12h8M8 16h4.5" /></svg>
  ),
  loop: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19.5 9M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4.5 15" /><path d="M19.5 4.5V9H15M4.5 19.5V15H9" /></svg>
  ),
  match: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5M8 10.5h5M10.5 8v5" /></svg>
  ),
  chart: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16" /><rect x="6" y="11" width="3" height="6" rx="1" /><rect x="11" y="6" width="3" height="11" rx="1" /><rect x="16" y="9" width="3" height="8" rx="1" /></svg>
  ),
  gauge: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16l4-5" /><circle cx="12" cy="16" r="1.4" fill="currentColor" /></svg>
  ),
  human: (c = "size-5") => (
    <svg viewBox="0 0 24 24" className={c} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></svg>
  ),
};
