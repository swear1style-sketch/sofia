import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

import { HeroCardStack } from "@/components/hero-card-stack";
import { IntroLoader } from "@/components/intro-loader";
import { LiquidNav } from "@/components/liquid-nav";
import { ScrollVideoParallax } from "@/components/scroll-video-parallax";
import { SmoothScroll } from "@/components/smooth-scroll";

const SOFIA_CONTACT = "https://www.sofiapulse.com/#Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

// Custom easings used across reveal animations for a coherent premium rhythm.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function Word({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom pr-[0.18em] pb-[0.15em] -mb-[0.15em]">
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
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("sofia_intro_seen") === "1";
  });

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hero dissolves into the cinematic scene as user scrolls.
  const heroContentOpacity = useTransform(heroProgress, [0, 0.6, 0.95], [1, 0.85, 0]);
  const heroContentScale = useTransform(heroProgress, [0, 1], [1, 0.96]);
  const heroContentY = useTransform(heroProgress, [0, 1], ["0%", "-8%"]);

  // Reveal delay: if intro already played this session, start immediately;
  // otherwise wait for the curtains to open.
  const D = ready ? 0.1 : 2.5;

  return (
    <SmoothScroll>
      <IntroLoader onDone={() => setReady(true)} />
      <LiquidNav />

      <motion.section
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden"
        style={{ backgroundColor: "#e7dbf2" }}
      >
        {/* Ultra-fine grain to lift the flat lavender from digital-flat to
            premium matte. Kept below 3% opacity so it never becomes noise. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0 0.25  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />

        {/* Hero content wrapper — scrubs opacity/scale on scroll for the
            dissolve into the cinematic section. */}
        <motion.div
          className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-16 pt-28 lg:min-h-screen lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-32"
          style={{
            opacity: heroContentOpacity,
            scale: heroContentScale,
            y: heroContentY,
          }}
        >
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

            <h1 className="font-extrabold leading-[1.02] tracking-[-0.02em] text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              <div>
                <Word delay={D + 0.05}>Better</Word>
                <Word delay={D + 0.18}>Creative</Word>
              </div>
              <div
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                <Word delay={D + 0.35}>that</Word>
                <Word delay={D + 0.45}>gets</Word>
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
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-500 hover:scale-[1.03]"
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

            {/* Studio-style meta strip */}
            <motion.div
              className="mt-16 flex items-center gap-6 text-[10px] font-medium uppercase tracking-[0.4em] text-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: D + 1.1 }}
            >
              <span>V. 26.01</span>
              <span className="h-px w-8 bg-foreground/25" />
              <span>Est. 2024</span>
              <span className="h-px w-8 bg-foreground/25" />
              <span>Sofia Studio</span>
            </motion.div>
          </div>

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: D + 0.25 }}
          >
            <HeroCardStack />
          </motion.div>
        </motion.div>

        {/* Scroll indicator — small, luxury detail */}
        <motion.div
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.5em] text-foreground/45"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: D + 1.3 }}
          style={{ opacity: heroContentOpacity }}
        >
          <span>Scroll</span>
          <motion.span
            className="block h-8 w-px origin-top bg-foreground/40"
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.section>

      <ScrollVideoParallax />
    </SmoothScroll>
  );
}
