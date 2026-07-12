import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

  /* ── Track scroll progress for the notch indicator ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const notchTop = useTransform(scrollYProgress, [0, 1], ["10%", "90%"]);

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const SEGMENT_DURATION = 13.30125; // 53.205s total / 4 steps

  /* ── Sync video with active step & auto-scroll ── */
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    isAutoScrolling.current = false;
    
    if (videoRef.current && activeStep >= 0) {
      const targetTime = activeStep * SEGMENT_DURATION;
      const currentTime = videoRef.current.currentTime;
      // If user scrolled manually, snap the video to the correct segment
      if (currentTime < targetTime || currentTime > targetTime + SEGMENT_DURATION) {
        videoRef.current.currentTime = targetTime;
      }
    }
  }, [activeStep]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      
      // Boundary check: if video exceeds the current segment
      if (activeStep >= 0 && time >= (activeStep + 1) * SEGMENT_DURATION) {
        if (activeStep < 3) {
          // Auto-scroll to the next step!
          if (!isAutoScrolling.current) {
            isAutoScrolling.current = true;
            const nextStepEl = stepRefs.current[activeStep + 1];
            if (nextStepEl) {
              const top = nextStepEl.getBoundingClientRect().top + window.scrollY;
              // Center the step in the viewport (using the same 0.42 offset from scroll logic)
              const offset = top - (window.innerHeight * 0.42) + (nextStepEl.clientHeight / 2);
              window.scrollTo({ top: offset, behavior: 'smooth' });
            }
          }
        } else {
          // Last step finished: loop the last segment
          video.currentTime = activeStep * SEGMENT_DURATION;
        }
      }

      // Update HUD progress visually synced to the video
      if (activeStep >= 0) {
        const segmentStart = activeStep * SEGMENT_DURATION;
        const elapsedInSegment = time - segmentStart;
        const pct = Math.max(0, Math.min((elapsedInSegment / SEGMENT_DURATION) * 100, 100));

        setSegFills((prev) => {
          const next = [...prev];
          for (let i = 0; i < activeStep; i++) next[i] = 100;
          for (let i = activeStep + 1; i < 4; i++) next[i] = 0;
          next[activeStep] = pct;
          return next;
        });

        const basePercent = (activeStep / 4) * 100;
        const segWeight = 25;
        setHudPercent(Math.round(basePercent + (pct / 100) * segWeight));
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
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
    <section id="features" className="features-section" ref={sectionRef}>
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
            <div className="tablet-screen">
              <div className="video-clip-wrapper">
                <video
                  id="process-video"
                  ref={videoRef}
                  src={whatWeDoVideo}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                />
              </div>

              {/* Scroll-Driven Minimal Line Progress Indicator */}
              <div className="vertical-glow-track" aria-hidden="true">
                <motion.div 
                  className="video-scroll-notch" 
                  style={{ top: notchTop }} 
                >
                  <div className="vibrant-glow-orb" />
                </motion.div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
