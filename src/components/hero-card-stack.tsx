import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

export function HeroCardStack() {
  const [cards, setCards] = useState<Card[]>(initial);

  useEffect(() => {
    const t = setInterval(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative mx-auto flex h-[560px] w-full max-w-[640px] items-end justify-center"
      style={{ perspective: "1500px" }}
    >
      {/* 3D podium */}
      <img
        src={podiumImage}
        alt="3D podium"
        className="pointer-events-none absolute bottom-2 left-1/2 z-0 h-auto w-[280px] max-w-[75%] -translate-x-1/2"
        width={461}
        height={195}
        loading="lazy"
      />

      <div
        className="relative -translate-y-32 -translate-x-4 h-[264px] w-[340px] max-w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {cards.map((card, i) => {
          const offsetX = i * 16;
          const offsetY = i * -3;
          const scale = 1 - i * 0.02;
          const zIndex = cards.length - i;
          const blur = i === 0 ? 0 : i * 0.4;
          const thickness = 44;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", zIndex }}
              initial={false}
              animate={{
                x: offsetX,
                y: offsetY,
                scale,
                rotateY: -18,
                rotateX: 4,
                filter: `blur(${blur}px) brightness(${1 - i * 0.08})`,
                opacity: i > 4 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5 + i * 0.3,
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
                  {/* Browser chrome */}
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
                  {/* Overlay content */}
                  <div className="absolute inset-x-0 top-10 flex flex-col gap-2 p-5">
                    <span className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/90 drop-shadow">
                      {card.label}
                    </span>
                    {card.cta && (
                      <button className="mt-1 w-fit rounded-full bg-foreground px-4 py-1.5 text-[10px] font-bold tracking-wider text-background shadow-lg">
                        {card.cta}
                      </button>
                    )}
                  </div>
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
      </div>
    </div>
  );
}