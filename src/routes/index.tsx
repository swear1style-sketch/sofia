import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useRef } from "react";

import { HeroCardStack } from "@/components/hero-card-stack";
import { LiquidNav } from "@/components/liquid-nav";
import { StoryboardParallax } from "@/components/storyboard-parallax";
import { SmoothScroll } from "@/components/smooth-scroll";
import { WhatWeOffer } from "@/components/what-we-offer";

const SOFIA_CONTACT = "https://www.sofiapulse.com/#Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function Word({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Index() {
  const D = 0.1;

  // ── Tall outer ref: this is what we scroll "through" ──────────────
  // Height = 100vh (visible) + 5 cards × 70vh each = 450vh total (faster)
  const scrollJackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: cardProgress } = useScroll({
    target: scrollJackRef,
    // Starts counting when the section top hits the viewport top,
    // ends when the section bottom hits the viewport bottom.
    offset: ["start start", "end end"],
  });



  return (
    <SmoothScroll>
      <LiquidNav />

      {/* ── Scroll-jacked hero: tall outer wrapper + sticky inner ── */}
      <div ref={scrollJackRef} style={{ height: "323vh" }}>
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100vh", backgroundColor: "#e7dbf2" }}
        >
          {/* Ultra-fine grain texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0 0.25  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: "240px 240px",
            }}
          />

          {/* Two-column grid */}
          <div className="relative z-10 mx-auto grid w-full max-w-7xl h-full items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-32">
            {/* Left: text content — always visible */}
            <div className="flex flex-col justify-center">
              <motion.div
                className="mb-7 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-primary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: D }}
              >
                <Sparkles className="h-4 w-4" />
                AI-Powered Creative Platform
              </motion.div>

              <h1
                className="font-bold leading-[1.08] tracking-tight text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
                style={{ textShadow: "0 2px 30px rgba(100,40,180,0.08)" }}
              >
                <div className="pb-2">
                  <Word delay={D + 0.05}>Better</Word>{" "}
                  <Word delay={D + 0.18}>Creative</Word>
                </div>
                <div className="text-primary whitespace-nowrap">
                  <Word delay={D + 0.35}>that</Word>{" "}
                  <Word delay={D + 0.45}>gets</Word>{" "}
                  <Word delay={D + 0.55}>Smarter.</Word>
                </div>
              </h1>

              <motion.p
                className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT, delay: D + 0.7 }}
              >
                Generate dynamic ads in minutes. Adapt by audience, moment, channel,
                and performance.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-wrap items-center gap-6"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: D + 0.85 }}
              >
                <a
                  href={SOFIA_CONTACT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_24px_60px_-12px_oklch(0.62_0.22_290_/_0.65)]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />
                  <span className="relative">Create smarter ads</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://www.sofiapulse.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-sm font-semibold text-foreground"
                >
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 transition-all duration-500 group-hover:border-primary group-hover:bg-primary/10">
                    <span className="absolute inset-0 rounded-full border border-primary/40 opacity-0 transition-all duration-700 group-hover:scale-125 group-hover:opacity-100" />
                    <Play className="h-3.5 w-3.5 fill-primary text-primary" />
                  </span>
                  See how it works
                </a>
              </motion.div>
            </div>

            {/* Right: scroll-driven card stack */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, ease: EASE_OUT, delay: D + 0.25 }}
            >
              <HeroCardStack scrollProgress={cardProgress} />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.5em] text-foreground/45"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: D + 1.3 }}
          >
            <span>Scroll</span>
            <motion.span
              className="block h-8 w-px origin-top bg-foreground/40"
              animate={{ scaleY: [0.2, 1, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      <StoryboardParallax />
      <WhatWeOffer />
    </SmoothScroll>
  );
}
