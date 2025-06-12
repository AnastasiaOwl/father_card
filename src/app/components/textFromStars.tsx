import React, { useEffect, useRef } from "react";
import points from "../particle-points.json"

type Props = {
  width?: number;
  height?: number;
  color?: string;
  duration?: number;
};

export default function TextFromStars({
  width = 1200,
  height = 660,
  color = "white",
  duration = 1.6,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("points", points);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = points.map((to: {x: number, y: number}) => ({
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
      if (!running) return;
      if (!start) start = now;
      if (!ctx) return;
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
  }, [width, height, color, duration]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
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
