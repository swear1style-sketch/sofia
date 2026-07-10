import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { HeroCardStack } from "@/components/hero-card-stack";
import { ScrollVideoParallax } from "@/components/scroll-video-parallax";
import { LiquidNav } from "@/components/liquid-nav";

const SOFIA_CONTACT = "https://www.sofiapulse.com/#Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
    <LiquidNav />
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[600px] w-[600px] rounded-full bg-accent/40 blur-3xl" />

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <div className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Creative Platform
          </div>
          <h1 className="font-extrabold leading-[1.05] tracking-tight text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="whitespace-nowrap">Better Creative</span>
            <br />
            <span
              className="whitespace-nowrap bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              that gets Smarter.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Generate dynamic ads in minutes. Adapt by audience, moment, channel,
            and performance.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={SOFIA_CONTACT}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            >
              Create smarter ads
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://www.sofiapulse.com"
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 text-sm font-semibold text-foreground"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 transition-colors group-hover:bg-primary/10">
                <Play className="h-3.5 w-3.5 fill-primary text-primary" />
              </span>
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          <HeroCardStack />
        </motion.div>
      </section>

      {/* Designer transition into cinematic section */}
      <div className="relative z-10 -mt-px">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block h-[40px] w-full sm:h-[60px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="fadeToVideo" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.9 0.06 295)" stopOpacity="0" />
              <stop offset="100%" stopColor="oklch(0.785 0.035 302.5)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C240,35 480,35 720,20 C960,5 1200,5 1440,35 L1440,80 L0,80 Z"
            fill="url(#fadeToVideo)"
          />
        </svg>
      </div>
    </div>

    <ScrollVideoParallax />
    </>
  );
}
