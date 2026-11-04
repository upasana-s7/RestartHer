export default function Masthead() {
  return (
    <header className="px-5 pt-10 [container-type:inline-size] sm:px-8 lg:px-12">
      <div className="animate-rise flex flex-wrap items-center justify-between gap-3 font-label text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">
        <span>Vol. 01 — The Comeback Issue</span>
        <span>Women’s Career &amp; Comeback Journal</span>
      </div>
      <div className="editorial-rule mt-4 h-[2px]" />
      <h1 className="animate-rise mt-6 text-center font-display text-[clamp(2.25rem,13cqi,12rem)] font-extrabold leading-[0.9] tracking-tight text-ink [animation-delay:120ms]">
        RESTARTHER
      </h1>
      <p className="animate-rise mt-5 text-center font-label text-xs font-semibold uppercase tracking-[0.22em] text-burgundy [animation-delay:240ms] sm:text-sm">
        The HER Edition · Women’s Career &amp; Comeback Journal
      </p>
      <div className="editorial-rule mt-8 h-[2px]" />
      <div className="editorial-rule mt-1 h-px opacity-60" />
    </header>
  );
}
