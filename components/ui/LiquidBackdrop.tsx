"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface LiquidBackdropProps {
  /** subtle variation between pages so Today and Dashboard don't look identical */
  variant?: "today" | "dashboard";
}

export function LiquidBackdrop({ variant = "today" }: LiquidBackdropProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 20 });
  const py = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    function handleMove(clientX: number, clientY: number) {
      mx.set((clientX / window.innerWidth) * 2 - 1);
      my.set((clientY / window.innerHeight) * 2 - 1);
    }
    function onPointer(e: PointerEvent) {
      handleMove(e.clientX, e.clientY);
    }
    function onTouch(e: TouchEvent) {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [mx, my]);

  const t1x = useTransform(px, (v) => v * 26);
  const t1y = useTransform(py, (v) => v * 26);
  const t2x = useTransform(px, (v) => v * 44);
  const t2y = useTransform(py, (v) => v * 44);
  const t3x = useTransform(px, (v) => v * 18);
  const t3y = useTransform(py, (v) => v * 18);

  const isToday = variant === "today";
  const gradientBase = isToday
    ? "radial-gradient(circle at top left, rgba(0, 0, 0, 0.15) 0%, rgba(10, 10, 14, 0.03) 38%, rgba(5, 5, 10, 0.14) 100%)"
    : "radial-gradient(circle at top left, rgba(0, 0, 0, 0.12) 0%, rgba(10, 10, 14, 0) 38%, rgba(5, 5, 10, 0.17) 100%)";
  const blobOpacity = isToday ? 0.12 : 0.08;

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ background: gradientBase }}
    >
      <motion.div
        className="liquid-blob absolute rounded-full"
        style={{
          top: "-90px",
          right: "-60px",
          width: 420,
          height: 420,
          background: `radial-gradient(circle, var(--color-lg-1) 0%, transparent ${blobOpacity * 100}%)`,
          opacity: blobOpacity,
          x: t1x,
          y: t1y,
          animation: "liquidBreathe 9s ease-in-out infinite",
        }}
      />
      <motion.div
        className="liquid-blob absolute rounded-full"
        style={{
          bottom: "-100px",
          left: "-40px",
          width: 360,
          height: 360,
          background: `radial-gradient(circle, var(--color-lg-5) 0%, transparent 70%)`,
          opacity: blobOpacity,
          x: t2x,
          y: t2y,
          animation: "liquidBreathe 9s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      />
      <motion.div
        className="liquid-blob absolute rounded-full"
        style={{
          top: "45%",
          left: "55%",
          width: 300,
          height: 300,
          background: `radial-gradient(circle, var(--color-lg-${variant === "today" ? "2" : "4"}) 0%, transparent 70%)`,
          opacity: blobOpacity,
          x: t3x,
          y: t3y,
          animation: "liquidBreathe 9s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
    </div>
  );
}
