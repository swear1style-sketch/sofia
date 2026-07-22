import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import sneaker from "@/assets/card-sneaker.jpg";
import sunglasses from "@/assets/card-sunglasses.jpg";
import bag from "@/assets/card-bag.jpg";
import mountain from "@/assets/card-mountain.jpg";
import perfume from "@/assets/card-perfume.jpg";
import podiumImage from "@/assets/podium-v2-cropped.png";

type Card = {
  id: number;
  src: string;
  label: string;
  badge?: string;
  cta?: string;
};

const CARDS: Card[] = [
  { id: 1, src: sneaker,    label: "NEW COLLECTION", cta: "SHOP NOW" },
  { id: 2, src: mountain,   label: "ESCAPE",         cta: "EXPLORE" },
  { id: 3, src: sunglasses, label: "sofia.crea",     badge: "LOVED" },
  { id: 4, src: perfume,    label: "SIGNATURE",      cta: "DISCOVER" },
  { id: 5, src: bag,        label: "LIMITED TIME",   badge: "20% OFF", cta: "BUY NOW" },
];

const N = CARDS.length;

// Cubic easeOut: starts fast, decelerates smoothly at the end — premium feel
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
// Cubic easeIn: starts slow, accelerates — for the initial card liftoff
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Scroll-driven card deck.
 *
 * Each card ejects when the user scrolls through its dedicated "slot".
 * Progress 0→1 maps to all N cards being ejected one-by-one.
 * Mouse parallax 3D tilt is preserved for premium feel.
 */
export function HeroCardStack({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [scrollP, setScrollP] = useState(0);
  const [isReady, setIsReady]    = useState(false);
  const [isMobile, setIsMobile]  = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // We only eject 4 cards (the last one stays), so divide the scroll into 4 slots.
  const N = CARDS.length - 1;

  // Reactively update scrollP whenever the MotionValue changes
  useMotionValueEvent(scrollProgress, "change", (v) => setScrollP(v));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);



  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex h-[620px] w-full max-w-[700px] items-end justify-center select-none scale-[0.8] origin-bottom sm:scale-100"
      style={{ perspective: "1600px" }}
    >
      {/* Ambient glow beneath the deck */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[280px] h-[40px] rounded-[100%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(160,110,210,0.18) 0%, rgba(160,110,210,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Metallic podium */}
      <img
        src={podiumImage}
        alt="Display Podium"
        className="absolute bottom-0 z-0 w-[380px] max-w-[85%] object-contain"
      />

      {/* Deck */}
      <div
        className="relative -translate-y-44 -translate-x-4 h-[300px] w-[380px] max-w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {CARDS.map((card, i) => {
          // ── Per-card scroll slot ──────────────────────────────────────
          // Overlapping slots: each card takes 40% of the scroll to eject, starting at 20% intervals.
          // This ensures the final moving card (i=3) finishes exactly at scrollP = 1.0.
          const slotStart = (i / N) * 0.8;
          const ejectEnd  = slotStart + 0.4;

          // Raw linear eject progress (0 = idle, 1 = done)
          // The last card (i === N - 1) never ejects, it stays on the podium.
          const isLastCard = i === N - 1;
          const rawEjectP = isLastCard ? 0 : Math.max(0, Math.min(1,
            scrollP < slotStart ? 0 :
            scrollP >= ejectEnd  ? 1 :
            (scrollP - slotStart) / (ejectEnd - slotStart)
          ));

          // Apply cubic easing for silky-smooth acceleration/deceleration
          const ejectP = easeOutCubic(rawEjectP);
          const isEjected = rawEjectP >= 1;

          // ── Stack position (smooth shift as cards ahead eject) ────────
          const ejectedBefore = Math.max(0, Math.min(i, scrollP * N));
          const stackPos      = Math.max(0, i - ejectedBefore);

          const stackX          = stackPos * 18;
          const stackY          = stackPos * -5;
          const stackScale      = Math.max(0.85, 1 - stackPos * 0.03);
          const stackBrightness = 1 - stackPos * 0.06;
          // NOTE: CSS blur was removed — it's extremely expensive on mobile GPUs
          // and causes frame drops during scroll. Brightness dimming alone provides
          // sufficient visual depth cue for the stack.

          // ── Ejection trajectory (eased) ──────────────────────────────
          // Card shifts right a bit, lifts slightly, and fades out smoothly
          // We reduce the physical distance on mobile so cards don't clip harshly against the screen edge.
          const ejectDistance = isMobile ? 60 : 150;
          const ejectX       = easeOutCubic(ejectP) * ejectDistance;
          const ejectY       = -ejectP * (isMobile ? 15 : 30); 
          const ejectRotateZ = ejectP * 8;
          // Fade starts early so it dissolves as it moves
          const ejectOpacity = Math.max(0, 1 - ejectP / 0.7);

          // ── Final merged values ───────────────────────────────────────
          const finalX       = stackX + (rawEjectP > 0 ? ejectX : 0);
          const finalY       = stackY + (rawEjectP > 0 ? ejectY : 0);
          const finalScale   = stackScale * (rawEjectP > 0 ? 1 + ejectP * 0.05 : 1);
          const finalOpacity = isEjected ? 0 : (rawEjectP > 0 ? Math.max(0, ejectOpacity) : (i > 4 ? 0 : 1));
          const finalBrightness = rawEjectP > 0 ? 1.15 : stackBrightness;
          const finalFilter = `brightness(${finalBrightness})`;

          const thickness = 44;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                zIndex: N - i,
                x: finalX,
                y: finalY,
                scale: finalScale,
                rotateY: -18,
                rotateX: 4,
                rotateZ: ejectP > 0 ? ejectRotateZ : 0,
                opacity: finalOpacity,
                filter: finalFilter,
                willChange: rawEjectP > 0 && rawEjectP < 1 ? "transform, opacity" : "auto",
              }}
            >
              <div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back face */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/50 to-black/20"
                  style={{ transform: `translateZ(-${thickness}px)` }}
                />
                {/* Left edge thickness */}
                <div
                  className="absolute left-0 top-0 rounded-l-sm bg-gradient-to-r from-black/80 to-black/40"
                  style={{
                    width: `${thickness}px`,
                    height: "100%",
                    transform: "translateX(-100%) rotateY(-90deg)",
                    transformOrigin: "right center",
                    backfaceVisibility: "hidden",
                  }}
                />
                {/* Bottom edge thickness */}
                <div
                  className="absolute bottom-0 left-0 rounded-b-sm bg-gradient-to-t from-black/80 to-black/40"
                  style={{
                    width: "100%",
                    height: `${thickness}px`,
                    transform: "translateY(100%) rotateX(90deg)",
                    transformOrigin: "top center",
                    backfaceVisibility: "hidden",
                  }}
                />
                {/* Front face */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 bg-card"
                  style={{
                    transform: "translateZ(0)",
                    boxShadow: "var(--shadow-card), 0 0 30px rgba(160, 110, 210, 0.5), 0 0 80px rgba(160, 110, 210, 0.4)",
                  }}
                >
                  <div className="flex items-center gap-1.5 bg-background/90 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                  </div>
                  <img
                    src={card.src}
                    alt={card.label}
                    loading="eager"
                    decoding="async"
                    className="h-[calc(100%-32px)] w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 top-10 flex flex-col gap-2 p-5">
                    <span className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/90 drop-shadow">
                      {card.label}
                    </span>
                    {card.cta && (
                      <span className="mt-1 w-fit rounded-full bg-foreground px-4 py-1.5 text-[10px] font-bold tracking-wider text-background shadow-lg">
                        {card.cta}
                      </span>
                    )}
                  </div>
                  {/* Glass reflection overlay */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 35%, transparent 55%)",
                    }}
                  />
                  {card.badge && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-bold tracking-wider text-background">
                      {card.badge}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
