import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const VIDEO_SRC = "/parallax-scene.mp4";

/**
 * Cinematic scroll-driven video parallax.
 * Uses a hidden <video> as a frame source and paints frames into a <canvas>
 * whose currentTime is driven by scroll progress (Apple-style).
 */
export function ScrollVideoParallax() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);

  // Scroll progress across the entire pinned section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smoothed progress for buttery scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Foreground parallax layers
  const bgScale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 1.03, 1.12]);
  const bgY = useTransform(smoothProgress, [0, 1], ["-3%", "3%"]);

  // Load & prepare video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setDuration(video.duration || 0);
      setReady(true);
      drawFrame();
    };
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("loadeddata", handleLoaded);
    // iOS Safari nudge
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  const drawFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !video.videoWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    // cover-fit
    const vRatio = video.videoWidth / video.videoHeight;
    const cRatio = w / h;
    let dw = w;
    let dh = h;
    if (vRatio > cRatio) {
      dh = h;
      dw = h * vRatio;
    } else {
      dw = w;
      dh = w / vRatio;
    }
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(video, dx, dy, dw, dh);
  };

  // Subscribe to smoothed progress and update video currentTime + redraw
  useEffect(() => {
    if (!ready || !duration) return;
    const unsub = smoothProgress.on("change", (p) => {
      const video = videoRef.current;
      if (!video) return;
      const t = Math.max(0, Math.min(duration - 0.05, p * duration));
      // Some browsers throttle rapid currentTime writes; guard with rAF
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        try {
          video.currentTime = t;
        } catch {
          /* noop */
        }
        drawFrame();
      });
    });
    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, duration, smoothProgress]);

  // Redraw on seeked (frame actually available) and on resize
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onSeek = () => drawFrame();
    video.addEventListener("seeked", onSeek);
    const onResize = () => drawFrame();
    window.addEventListener("resize", onResize);
    return () => {
      video.removeEventListener("seeked", onSeek);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic scene"
      className="relative w-full"
      style={{ height: "432vh" }}
    >
      {/* Pinned viewport */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: "oklch(0.94 0.045 310)" }}
      >
        {/* Base tone that matches the hero's ending color at the very top,
            keeping the same lavender family so there is zero visible seam
            with the hero above. Slight deepening toward the bottom keeps
            depth without breaking the theme. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.94 0.045 310) 0%, oklch(0.9 0.055 300) 50%, oklch(0.86 0.065 295) 100%)",
          }}
        />

        {/* Canvas video layer with parallax */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            scale: bgScale,
            y: bgY,
            filter: "brightness(1.5) saturate(1.1)",
            opacity: ready ? 1 : 0,
            transition: "opacity 1.2s ease-out",
          }}
        >
          <canvas ref={canvasRef} className="h-full w-full" />
        </motion.div>

        {/* Subtle lavender tint so the video reads as part of the hero theme
            without washing out details. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "oklch(0.885 0.06 293)",
            mixBlendMode: "soft-light",
            opacity: 0.35,
          }}
        />
        {/* Gentle top/bottom fade so video edges never feel harsh
            against the lavender bg. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.94 0.045 310 / 0.35) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, oklch(0.86 0.065 295 / 0.25) 100%)",
          }}
        />

        {/* Hidden source video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className="hidden"
        />
      </div>
    </section>
  );
}