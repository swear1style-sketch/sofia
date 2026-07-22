import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Shared soft-edge vignette mask — extracted as a constant to avoid
// re-creating inline style objects every render.
const EDGE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

const LAYER_BASE = {
  z: 0,
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
  maskImage: EDGE_MASK,
  WebkitMaskImage: EDGE_MASK,
  WebkitMaskComposite: "source-in" as const,
  maskComposite: "intersect" as const,
};

export function StoryboardParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Each SVG is a complete frame. We stack them and cross-fade sequentially
  // so devices appear one-by-one with their labels.

  // Layer 2: second device fades in
  const opacity2 = useTransform(scrollYProgress, [0.24, 0.36], [0, 1]);

  // Layer 3: third device fades in
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.57], [0, 1]);

  // Layer 4: laptop appears (billboard hidden via clip-path)
  const opacity4 = useTransform(scrollYProgress, [0.66, 0.78], [0, 1]);

  // Layer 5: billboard + label revealed
  const opacity5 = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  // Cinematic zoom
  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);

  return (
    <section ref={containerRef} className="relative h-[380vh] w-full bg-[#E7DBF2]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          style={{
            scale,
            z: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
          }}
        >
          {/* Base Layer: First device (always visible) */}
          <img
            src="/svg/1.svg"
            alt=""
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ ...LAYER_BASE, zIndex: 10 }}
          />

          {/* Layer 2: Second device */}
          <motion.img
            src="/svg/2.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ ...LAYER_BASE, opacity: opacity2, zIndex: 20 }}
          />

          {/* Layer 3: Third device */}
          <motion.img
            src="/svg/3.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ ...LAYER_BASE, opacity: opacity3, zIndex: 30 }}
          />

          {/* Layer 4: Laptop (billboard clipped out via static polygon) */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{
              ...LAYER_BASE,
              opacity: opacity4,
              zIndex: 40,
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25.6%, 53.4% 25.6%, 53.4% 59.5%, 66.6% 59.5%, 66.6% 66.4%, 68.8% 66.4%, 68.8% 25.6%, 0% 25.6%)",
            }}
          />

          {/* Layer 5: Billboard revealed (all devices visible) */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ ...LAYER_BASE, opacity: opacity5, zIndex: 50 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
