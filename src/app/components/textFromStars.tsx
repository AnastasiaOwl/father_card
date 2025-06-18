import React, { useEffect, useRef, useState } from "react";
import pointsDesktop from "../particle-points.json";
import pointsMobile from "../particle-points-mobile.json";

type Point = { x: number; y: number };

type Props = {
  color?: string;
  duration?: number;
};

export default function TextFromStars({
  color = "white",
  duration = 1.6,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 660 });

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    setPoints(isMobile ? pointsMobile : pointsDesktop);
    setDimensions(isMobile ? { width: 700, height: 380 } : { width: 1200, height: 660 });
  }, []);

  useEffect(() => {
    if (!points) return;

    const { width, height } = dimensions;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = points.map((to) => ({
      from: {
        x: Math.random() * width,
        y: height + 80 + Math.random() * 100,
      },
      to,
      delay: Math.random() * 0.6,
    }));

    let running = true;
    let start: number | null = null;

    function animate(now: number) {
      if (!running || !ctx) return;
      if (!start) start = now;
      const elapsed = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        const localElapsed = Math.max(0, elapsed - p.delay);
        const t =
          localElapsed < 0
            ? 0
            : localElapsed > duration
            ? 1
            : 1 - Math.pow(1 - localElapsed / duration, 2.3);

        const x = p.from.x + (p.to.x - p.from.x) * t;
        const y = p.from.y + (p.to.y - p.from.y) * t;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (elapsed < duration + 0.6) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
    return () => {
      running = false;
    };
  }, [points, dimensions, color, duration]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        display: "block",
        margin: "0 auto",
        position: "fixed",
        left: "50%",
        top: "65%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 300000,
        background: "transparent",
      }}
    />
  );
}
