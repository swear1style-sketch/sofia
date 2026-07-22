import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll powered by Lenis. Applied once at the root so every
 * scroll gesture across the site is buttery — matching premium studio sites.
 * Framer Motion's useScroll continues to work because Lenis moves the native
 * scrollTop under the hood.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: isMobile ? 1.15 : 1.05,
      touchMultiplier: 1.7,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
