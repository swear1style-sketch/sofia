import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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

const initial: Card[] = [
  { id: 1, src: sneaker, label: "NEW COLLECTION", cta: "SHOP NOW" },
  { id: 2, src: mountain, label: "ESCAPE", cta: "EXPLORE" },
  { id: 3, src: sunglasses, label: "sofia.crea", badge: "LOVED" },
  { id: 4, src: perfume, label: "SIGNATURE", cta: "DISCOVER" },
  { id: 5, src: bag, label: "LIMITED TIME", badge: "20% OFF", cta: "BUY NOW" },
];

/**
 * Premium 3D card deck.
 *
 * Base state — cards are stacked with a fanned lean (each card tilts
 * incrementally on Y and lifts on Z, creating a photograph-in-a-viewer feel).
 *
 * Mouse parallax — the whole deck tilts subtly on rotateX / rotateY based on
 * where the cursor sits in the container. Springs make it feel weighted, not
 * jittery.
 *
 * Auto-cycle — every 3.6s the top card animates on a curved trajectory: it
 * scales down, rotates further, lifts up-and-out, then dives behind the deck.
 * The remaining cards each shift forward one slot on the same soft spring so
 * the deck never "jumps". Two-phase to give the eye time to follow.
 */
export function HeroCardStack() {
  const [cards, setCards] = useState<Card[]>(initial);
  const [flying, setFlying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if we are on a mobile device for performance optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for silky, heavy deck rotation
  const deckRotateX = useSpring(useTransform(mouseY, [-1, 1], [16, -16]), {
    stiffness: 120,
    damping: 30,
    mass: 1.2,
  });
  const deckRotateY = useSpring(useTransform(mouseX, [-1, 1], [-16, 16]), {
    stiffness: 120,
    damping: 30,
    mass: 1.2,
  });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  }, [mouseX, mouseY]);

  const handleLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // 3.6s cycle allows the user to read the top card before it animates
    const interval = setInterval(() => {
      setFlying(true);
      setTimeout(() => {
        setCards((prev) => {
          const arr = [...prev];
          const top = arr.shift();
          if (top) arr.push(top);
          return arr;
        });
        setFlying(false);
      }, 900); // Wait for the fly out to visually clear before popping it to the back
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto flex h-[620px] w-full max-w-[700px] items-end justify-center select-none scale-[0.8] origin-bottom sm:scale-100"
      style={{ perspective: "1600px" }}
    >
      {/* Ambient glow beneath the deck — kept ultra subtle so the flat lavender
          background remains clean and uninterrupted. */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[280px] h-[40px] rounded-[100%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(160,110,210,0.18) 0%, rgba(160,110,210,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* The metallic, premium podium. Layered below the deck to ground it. */}
      <motion.img
        src={podiumImage}
        alt="Display Podium"
        className="absolute bottom-0 z-0 w-[380px] max-w-[85%] object-contain"
        style={{
          rotateX: deckRotateX,
          rotateY: deckRotateY,
          transformStyle: "preserve-3d",
        }}
      />

      {/* Deck */}
      <motion.div
        className="relative -translate-y-44 -translate-x-4 h-[300px] w-[380px] max-w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: deckRotateX,
          rotateY: deckRotateY,
        }}
      >
        {cards.map((card, i) => {
          const isTop = i === 0;
          const offsetX = i * 18;
          const offsetY = i * -5;
          const scale = 1 - i * 0.03;
          const zIndex = cards.length - i;
          const thickness = 44;

          // Fly-out choreography for the top card
          const flyState = isTop && flying
            ? {
                x: offsetX + 220,
                y: offsetY - 80,
                scale: 0.78,
                rotateY: -55,
                rotateX: 14,
                rotateZ: 8,
                filter: isMobile ? "brightness(0.9)" : "blur(2px) brightness(0.9)",
                opacity: 0,
                transition: {
                  duration: 0.9,
                  ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
                },
              }
            : null;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", zIndex }}
              initial={false}
              animate={
                flyState ?? {
                  x: offsetX,
                  y: offsetY,
                  scale,
                  rotateY: -18,
                  rotateX: 4,
                  rotateZ: 0,
                  filter: isMobile ? `brightness(${1 - i * 0.06})` : `blur(${i === 0 ? 0 : i * 0.3}px) brightness(${1 - i * 0.06})`,
                  opacity: i > 4 ? 0 : 1,
                }
              }
              transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5 + i * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
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
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 bg-card shadow-[var(--shadow-card)]"
                  style={{ transform: "translateZ(0)" }}
                >
                  <div className="flex items-center gap-1.5 bg-background/90 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                    <span className="h-2 w-2 rounded-full bg-primary/30" />
                  </div>
                  <img
                    src={card.src}
                    alt={card.label}
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
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
