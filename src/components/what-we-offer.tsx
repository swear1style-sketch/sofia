import { useEffect, useRef, useState, useCallback } from "react";
import "./what-we-offer.css";
import whatWeDoVideo from "../assets/what-we-do.mp4";

/* ── Step data ── */
const STEPS = [
  {
    index: "01",
    kicker: "Benefit\u00a0·\u00a0Design",
    heading: "Design your",
    headingEm: "campaign",
    description:
      "Compose high-impact creatives in minutes using AI-assisted layouts and variants. Iterate quickly, launch faster, keep your brand consistent across every format.",
  },
  {
    index: "02",
    kicker: "Benefit\u00a0·\u00a0Upload",
    heading: "Upload your",
    headingEm: "assets",
    description:
      "Drop in your logos, videos and copy — SofiaPulse auto-resizes, formats and packages them for every placement. No more manual export loops.",
  },
  {
    index: "03",
    kicker: "Benefit\u00a0·\u00a0Distribute",
    heading: "Push to your",
    headingEm: "DSP",
    description:
      "One-click distribution to any DSP or ad server. Sofia handles the trafficking specs so your campaigns go live across Display, OLV, Native and CTV — instantly.",
  },
  {
    index: "04",
    kicker: "Benefit\u00a0·\u00a0Optimize",
    heading: "Track &",
    headingEm: "optimize",
    description:
      "Real-time performance signals feed straight back into the studio so every next campaign starts smarter. Measurable outcomes, full transparency, zero guesswork.",
  },
] as const;

const STEP_LABELS = [
  "Design your campaign",
  "Upload your assets",
  "Push to your DSP",
  "Track & optimize",
];

export function WhatWeOffer() {
  const [activeStep, setActiveStep] = useState(-1);
  const [hudPercent, setHudPercent] = useState(0);
  const [segFills, setSegFills] = useState([0, 0, 0, 0]);
  const [isFlipping, setIsFlipping] = useState(false);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const prevStepRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  /* ── Scroll-driven step activation — pick the step closest to viewport center ── */
  useEffect(() => {
    const computeActiveStep = () => {
      const viewportCenter = window.innerHeight * 0.42; // slightly above true center feels more natural
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      // If we're near the very bottom of the page, force last step
      if (docHeight - scrollBottom < 100) {
        setActiveStep(STEPS.length - 1);
        return;
      }

      // Check if the section is even in view
      const section = sectionRef.current;
      if (section) {
        const sectionRect = section.getBoundingClientRect();
        if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) {
          return; // section not visible, don't change anything
        }
      }

      let bestIdx = -1;
      let bestDist = Infinity;

      for (let i = 0; i < stepRefs.current.length; i++) {
        const el = stepRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Distance from the step's vertical center to our "sweet spot" in the viewport
        const stepCenter = rect.top + rect.height / 2;
        const dist = Math.abs(stepCenter - viewportCenter);

        // Only consider steps that are at least partially in the viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
      }

      if (bestIdx !== -1) {
        setActiveStep(bestIdx);
      }
    };

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(computeActiveStep);
    };

    // Initial computation
    computeActiveStep();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Flip animation trigger ── */
  useEffect(() => {
    if (activeStep !== prevStepRef.current) {
      setIsFlipping(true);
      const t = setTimeout(() => setIsFlipping(false), 560);
      prevStepRef.current = activeStep;
      return () => clearTimeout(t);
    }
  }, [activeStep]);

  /* ── Progress simulation: fills the active segment over ~3 s ── */
  useEffect(() => {
    const fills = [...segFills];
    /* Mark all previous segments as fully filled */
    for (let i = 0; i < activeStep; i++) fills[i] = 100;
    /* Reset current and future */
    fills[activeStep] = 0;
    for (let i = activeStep + 1; i < 4; i++) fills[i] = 0;
    setSegFills(fills);
    setHudPercent(Math.round((activeStep / 4) * 100));

    let frame: number;
    let start: number | null = null;
    const duration = 3000; // ms

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / duration) * 100, 100);

      setSegFills((prev) => {
        const next = [...prev];
        next[activeStep] = pct;
        return next;
      });

      const basePercent = (activeStep / 4) * 100;
      const segWeight = 25; // each segment = 25% of total
      setHudPercent(Math.round(basePercent + (pct / 100) * segWeight));

      if (pct < 100) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  /* ── Scrubber position (px offset across the full track) ── */
  const trackRef = useRef<HTMLDivElement>(null);
  const getScrubberX = useCallback(() => {
    if (!trackRef.current) return 0;
    const trackW = trackRef.current.offsetWidth;
    const segW = (trackW - 6 * 3) / 4; // 4 segments, 3 gaps of 6px
    const gapW = 6;
    const baseX = activeStep * (segW + gapW);
    const fillPx = (segFills[activeStep] / 100) * segW;
    return baseX + fillPx;
  }, [activeStep, segFills]);

  const scrubberX = getScrubberX();

  return (
    <section id="features" className="features-section">
      {/* ── Header ── */}
      <div className="features-header">
        <div className="features-header-top">
          <span className="section-eyebrow">
            <span className="eyebrow-dot" />
            What we offer
          </span>
          <span className="section-index">01&nbsp;/&nbsp;04</span>
        </div>
        <h2 className="features-title">
          An <em>intelligent</em> platform,
          <br />
          engineered for <span className="title-accent">flexible</span>{" "}
          outcomes.
        </h2>
        <p className="features-sub">
          Pick from a wide range of engagement features based on your goals and
          start engaging instantly on top premium publishers.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="process-container">
        {/* Steps (right column) */}
        <div className="process-steps">
          {STEPS.map((step, i) => (
            <div
              key={step.index}
              ref={(el) => { stepRefs.current[i] = el; }}
              className={`process-step${i === activeStep ? " active" : ""}`}
              data-step={i + 1}
            >
              <div className="step-meta">
                <span className="step-index">{step.index}</span>
                <span className="step-kicker">{step.kicker}</span>
              </div>
              <h3>
                {step.heading} <em>{step.headingEm}</em>
              </h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Sticky video card (left column) */}
        <div className="process-video-sticky">
          <div className="video-preview-wrapper">
            <video
              id="process-video"
              src={whatWeDoVideo}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />

            {/* Top corner chip */}
            <div className="video-corner-chip" aria-hidden="true">
              <span className="chip-dot" />
              <span className="chip-text">LIVE PREVIEW</span>
            </div>

            {/* Bottom HUD */}
            <div className="video-hud" aria-hidden="true">
              <div className="hud-top">
                <div className="hud-step">
                  <div
                    className={`hud-step-index${isFlipping ? " flipping" : ""}`}
                    id="hud-step-index"
                  >
                    <span className="digit-a">
                      {String(prevStepRef.current + 1).padStart(2, "0")}
                    </span>
                    <span className="digit-b">
                      {String(activeStep + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="hud-step-info">
                    <span
                      className={`hud-label${isFlipping ? " flipping" : ""}`}
                      id="hud-step-label"
                    >
                      {STEP_LABELS[activeStep]}
                    </span>
                    <span className="hud-sub">
                      Step&nbsp;
                      <span id="hud-step-current">
                        {String(activeStep + 1).padStart(2, "0")}
                      </span>
                      &nbsp;of&nbsp;04
                    </span>
                  </div>
                </div>
                <div className="hud-percent">
                  <span id="hud-percent">{hudPercent}</span>
                  <span className="hud-percent-mark">%</span>
                </div>
              </div>

              <div className="hud-track" role="progressbar" ref={trackRef}>
                <div className="hud-segments">
                  {segFills.map((fill, i) => (
                    <div
                      key={i}
                      className={`hud-segment${i === activeStep ? " current" : ""}`}
                      data-step={i + 1}
                    >
                      <span
                        className="seg-fill"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div
                  className="hud-scrubber"
                  aria-hidden="true"
                  style={{ transform: `translateX(${scrubberX}px)` }}
                >
                  <span className="scrubber-line" />
                  <span className="scrubber-head" />
                  <span className="scrubber-halo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
