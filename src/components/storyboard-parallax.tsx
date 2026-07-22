import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StoryboardParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress through the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Since the SVGs are solid images containing the background and previous states,
  // we can simply stack them and fade the top layers in sequentially to simulate 
  // elements popping into the scene.

  // svg1 is now the base layer, so it doesn't need to fade in.

  // Step 2: Phone Ad (Frame 2) fades in
  const opacity2 = useTransform(scrollYProgress, [0.24, 0.36], [0, 1]);

  // Step 3: Tablet Ad (Frame 3) fades in
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.57], [0, 1]);

  // Step 4: Laptop Label appears. Clipped to hide the billboard.
  const opacity4 = useTransform(scrollYProgress, [0.66, 0.78], [0, 1]);

  // Step 5: Billboard Ad + Label appears. (Animation kept EXACTLY the same as requested)
  const opacity5 = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  // Unified cinematic zoom as the user scrolls down through the storyboard.
  // Starts significantly smaller (0.75) for a dramatic zoom-in effect.
  // Ends exactly at normal size (1) to guarantee no text is cut off at the edges.
  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);

  return (
    // Reduced height from 500vh to 400vh to increase scroll speed by 20%
    <section ref={containerRef} className="relative h-[400vh] w-full bg-[#E7DBF2]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          style={{ 
            scale, 
            z: 0, 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform"
          }}
        >
          {/* Base Layer: Monitor Ad (Frame 1) */}
          <motion.img
            src="/svg/1.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ 
              opacity: 1, 
              zIndex: 10, 
              z: 0, 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden", 
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect"
            }}
          />

          {/* Layer 2: Ad 1 appears */}
          <motion.img
            src="/svg/2.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ 
              opacity: opacity2, 
              zIndex: 20, 
              z: 0, 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden", 
              willChange: "opacity",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect"
            }}
          />

          {/* Layer 3: Ad 2 appears */}
          <motion.img
            src="/svg/3.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ 
              opacity: opacity3, 
              zIndex: 30, 
              z: 0, 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden", 
              willChange: "opacity",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect"
            }}
          />

          {/* Layer 4: Laptop Label (Final state but clipped to hide the billboard SCREEN content) */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ 
              opacity: opacity4, 
              zIndex: 40,
              z: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "opacity, clip-path",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25.6%, 53.4% 25.6%, 53.4% 59.5%, 66.6% 59.5%, 66.6% 66.4%, 68.8% 66.4%, 68.8% 25.6%, 0% 25.6%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect"
            }}
          />

          {/* Layer 5: Billboard + Label (Final state full) */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ 
              opacity: opacity5, 
              zIndex: 50, 
              z: 0, 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden", 
              willChange: "opacity",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect"
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
