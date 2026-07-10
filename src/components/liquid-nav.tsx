import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const SOFIA_LOGO = "/sofialogo.svg";

const SOFIA = "https://www.sofiapulse.com";
const CONTACT = `${SOFIA}/#Contact`;

const links = [
  { label: "Contact Us", href: CONTACT },
  { label: "Book a Demo", href: CONTACT },
  { label: "Request a Mockup", href: CONTACT },
  { label: "Visit sofiapulse.com", href: SOFIA },
];

export function LiquidNav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0.35, 0.7]);
  const blur = useTransform(scrollY, [0, 120], [16, 28]);
  const scale = useTransform(scrollY, [0, 120], [1, 0.97]);

  // Auto-hide on scroll down, reveal on scroll up
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const delta = latest - prev;
    // Ignore tiny jitters; require a meaningful gesture
    if (Math.abs(delta) < 6) return;
    if (latest < 80) {
      setHidden(false); // Always visible near the top
      return;
    }
    if (delta > 0) setHidden(true); // scrolling down
    else setHidden(false); // scrolling up
  });

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: hidden ? -140 : 0, opacity: hidden ? 0 : 1 }}
      transition={{
        y: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
        opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{ scale }}
      className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
    >
      <motion.div
        style={{
          backgroundColor: useTransform(bgOpacity, (o) => `rgba(255,255,255,${o})`),
          backdropFilter: useTransform(blur, (b) => `blur(${b}px) saturate(180%)`),
        }}
        className="relative flex items-center justify-between gap-4 rounded-full border border-white/50 px-3 py-2 shadow-[0_10px_40px_-15px_rgba(75,20,140,0.25)] ring-1 ring-white/30"
      >
        {/* inner glass highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.15) 100%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />

        <a href={SOFIA} target="_blank" rel="noopener noreferrer" className="relative flex items-center gap-2 pl-3 pr-2">
          <img src={SOFIA_LOGO} alt="sofiapulse" className="h-6 w-auto" />
        </a>

        <nav className="relative hidden items-center gap-1 md:flex">
          {links.slice(0, 3).map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <span className="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/50" />
              <span className="relative">{l.label}</span>
            </a>
          ))}
          <button className="relative ml-2 hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground lg:flex">
            EN <ChevronDown className="h-3 w-3" />
          </button>
        </nav>

        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Get Started</span>
          <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </motion.div>
    </motion.header>
  );
}