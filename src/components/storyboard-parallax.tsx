import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StoryboardParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress through the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Since the SVGs are solid images containing the background and previous states,
  // we can simply stack them and fade the top layers in sequentially to simulate 
  // elements popping into the scene.

  // Step 1: Monitor Ad (Frame 1) fades in, while Frame 0 (blank) fades out to prevent background bleeding
  const opacity0 = useTransform(scrollYProgress, [0.03, 0.15], [1, 0]);
  const opacity1 = useTransform(scrollYProgress, [0.03, 0.15], [0, 1]);

  // Step 2: Phone Ad (Frame 2) fades in
  const opacity2 = useTransform(scrollYProgress, [0.24, 0.36], [0, 1]);

  // Step 3: Tablet Ad (Frame 3) fades in
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.57], [0, 1]);

  // Step 4: Laptop Label appears. Clipped to hide the billboard.
  const opacity4 = useTransform(scrollYProgress, [0.66, 0.78], [0, 1]);

  // Step 5: Billboard Ad + Label appears. (Animation kept EXACTLY the same as requested)
  const opacity5 = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  // Unified cinematic zoom as the user scrolls down through the storyboard (increased zoom effect)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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
          {/* Base Layer: Frame 0 (All devices empty) */}
          <motion.img
            src="/svg/0.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity0, zIndex: 5, z: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", willChange: "opacity" }}
          />

          {/* Layer 1: Monitor Ad appears */}
          <motion.img
            src="/svg/1.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity1, zIndex: 10, z: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", willChange: "opacity" }}
          />

          {/* Layer 2: Ad 1 appears */}
          <motion.img
            src="/svg/2.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity2, zIndex: 20, z: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", willChange: "opacity" }}
          />

          {/* Layer 3: Ad 2 appears */}
          <motion.img
            src="/svg/3.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity3, zIndex: 30, z: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", willChange: "opacity" }}
          />

          {/* Layer 4: Laptop Label (Final state but clipped to hide the billboard SCREEN content)
              Uses polygon with L-shaped hole to cut out the billboard while preserving the laptop.
              Billboard rect: x=859 y=231 w=237 h=351, stroke=black sw=10
                Left=53.4%, Right=68.8%, Top=25.6%, Bottom=66.4%
              Laptop rect: x=837 y=525 w=227 h=157, stroke=black sw=4
                Left=52.2%, Right=66.6%, Top=59.5%, Bottom=77.2%
              The hole is L-shaped:
                Full billboard width (53.4% to 68.8%) from top 25.6% down to laptop top 59.5%
                Then only the strip RIGHT of laptop (66.6% to 68.8%) from 59.5% down to 66.4%
          */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ 
              opacity: opacity4, 
              zIndex: 40,
              z: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "opacity, clip-path",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25.6%, 53.4% 25.6%, 53.4% 59.5%, 66.6% 59.5%, 66.6% 66.4%, 68.8% 66.4%, 68.8% 25.6%, 0% 25.6%)"
            }}
          />

          {/* Layer 5: Billboard + Label (Final state full) */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity5, zIndex: 50, z: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", willChange: "opacity" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
