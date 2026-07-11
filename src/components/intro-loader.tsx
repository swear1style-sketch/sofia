import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOGO_SRC = "/sofialogo.svg";

const BRAND = "#e7dbf2";
const INK = "oklch(0.19 0.06 285)";
const ACCENT = "oklch(0.62 0.22 290)";

/**
 * Cinematic first-visit welcome:
 *   1. Flat lavender curtain fills the viewport (matches hero exactly — zero flash)
 *   2. A hairline draws horizontally across the middle
 *   3. Logo + wordmark reveal from behind a rising mask
 *   4. A subtle brand tag fades in below
 *   5. Curtains split (top up, bottom down) revealing the hero
 * Total: ~2.4s. Skips on subsequent nav via sessionStorage so users only see it
 * once per session — luxury, not annoyance.
 */
export function IntroLoader({ onDone }: { onDone?: () => void }) {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    if (!alive) {
      onDone?.();
      return;
    }
    // Lock body scroll while intro is running
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      setAlive(false);
      onDone?.();
      document.body.style.overflow = prev;
    }, 2400);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [alive, onDone]);

  return (
    <AnimatePresence>
      {alive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top curtain */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{ backgroundColor: BRAND }}
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
          />
          {/* Bottom curtain */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ backgroundColor: BRAND }}
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
          />

          {/* Hairline that draws across the seam */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 origin-center"
            style={{
              background: `linear-gradient(to right, transparent 0%, ${INK}55 40%, ${INK}55 60%, transparent 100%)`,
              width: "min(560px, 60vw)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />

          {/* Brand mark stack */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative overflow-hidden">
              {/* Shimmer behind logo */}
              <motion.div
                aria-hidden
                className="absolute inset-0 -inset-x-8"
                style={{
                  background: `radial-gradient(ellipse at center, ${ACCENT}20 0%, transparent 70%)`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0.4], scale: [0.5, 1.2, 1] }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              />
              <motion.img
                src={LOGO_SRC}
                alt="sofiapulse"
                className="relative h-9 w-auto sm:h-10"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-40%", opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
              />
            </div>

            <div className="overflow-hidden">
              <motion.div
                className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.55em]"
                style={{ color: `${INK}` }}
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 0.75 }}
                exit={{ y: "-30%", opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
              >
                <motion.span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                Better creative, smarter
              </motion.div>
            </div>
          </div>

          {/* Corner counter — tiny, luxury magazine detail */}
          <motion.div
            className="absolute bottom-8 left-8 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.4em]"
            style={{ color: `${INK}80` }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <span>2026</span>
            <span style={{ backgroundColor: `${INK}40` }} className="inline-block h-px w-6" />
            <span>Sofiapulse Studio</span>
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.4em]"
            style={{ color: `${INK}80` }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <ProgressCount duration={1600} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProgressCount({ duration }: { duration: number }) {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) id = requestAnimationFrame(tick);
      else setDone(true);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [duration]);
  return (
    <>
      <motion.span
        className="tabular-nums"
        animate={done ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {String(n).padStart(3, "0")}
      </motion.span>
      <span style={{ backgroundColor: "currentColor", opacity: 0.4 }} className="inline-block h-px w-6" />
      <span>Loading</span>
    </>
  );
}
