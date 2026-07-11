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

  // Frame 2 (Ad 1 appears) fades in between 10% and 25% scroll
  const opacity2 = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // Frame 3 (Ad 2 appears) fades in between 35% and 50% scroll
  const opacity3 = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);

  // Frame 4 (Laptop Label appears). We use 4.svg but clip out the right side (billboard)
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);

  // Frame 5 (Billboard Ad + Label appears). We use full 4.svg
  const opacity5 = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  // Unified cinematic zoom as the user scrolls down through the storyboard
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-[#E7DBF2]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-full max-w-7xl aspect-[1600/883]"
          style={{ scale }}
        >
          {/* Base Layer: Frame 1 (Device appears/base state) */}
          <motion.img
            src="/svg/1.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            // Ensure this layer is always fully visible beneath the others
            style={{ zIndex: 10 }}
          />

          {/* Layer 2: Ad 1 appears */}
          <motion.img
            src="/svg/2.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity2, zIndex: 20 }}
          />

          {/* Layer 3: Ad 2 appears */}
          <motion.img
            src="/svg/3.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity3, zIndex: 30 }}
          />

          {/* Layer 4: Laptop Label (Final state but clipped to hide the billboard ad AND billboard label) */}
          {/* 
            This polygon precisely isolates the laptop while hiding the entire billboard:
            - x=45% avoids the monitor but catches the start of the billboard text.
            - y=59% protects the top curved lid of the laptop.
            - x=68% drops down the right edge of the laptop to hide the right sliver of the billboard frame.
            - y=55% on the far right protects the OLV label while hiding any billboard labels above it.
          */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ 
              opacity: opacity4, 
              zIndex: 40,
              clipPath: "polygon(0% 0%, 45% 0%, 45% 59%, 70% 59%, 70% 78%, 100% 78%, 100% 100%, 0% 100%)"
            }}
          />

          {/* Layer 5: Billboard + Label (Final state full) */}
          <motion.img
            src="/svg/4.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: opacity5, zIndex: 50 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
