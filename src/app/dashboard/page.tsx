"use client";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

type StarSVGProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  style?: React.CSSProperties;
};

export default function Dashboard() {

  const starsControls = useAnimation();
  const [maskSize, setMaskSize] = useState(15);
  const [showStars, setShowStars] = useState(false);

  const PULSE_COUNT = 3;

    const stars = [
  { size: 40, className: "fixed top-[90%] left-[52%]" },
  { size: 50, className: "fixed top-[90%] left-[50%]" },
  { size: 42, className: "fixed top-[90%] left-[48%]" },
  { size: 12, className: "fixed top-[90%] left-[50%]" },
  { size: 14, className: "fixed top-[90%] left-[53%]" },
  { size: 58, className: "fixed top-[86%] left-[50%]" },
  { size: 60, className: "fixed top-[86%] left-[52%]" },
  { size: 15, className: "fixed top-[91%] left-[54%]" },
  { size: 34, className: "fixed top-[91%] left-[49%]" },
  { size: 34, className: "fixed top-[89%] left-[50%]" },
  { size: 34, className: "fixed top-[89%] left-[52%]" },
  { size: 55, className: "fixed top-[86%] left-[48%]" },
];

useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 5000);
    return () => clearTimeout(timer);
  }, []);

 useEffect(() => {
    if (showStars) {
      const totalAppearTime = 1 + stars.length * 0.3 + 0.8;
      const sizes = [15, 30, 50, 80, 120];
      const pulse = async () => {
        for (let i = 1; i <= PULSE_COUNT; i++) {
          setMaskSize(sizes[i - 1]);
          await starsControls.start({
            filter: `drop-shadow(0px 0px ${12 * i}px white) drop-shadow(0px 0px ${16 * i}px white)`,
            transition: { duration: 0.3 },
          });
          await new Promise((r) => setTimeout(r, 200));
          await starsControls.start({
            filter: `drop-shadow(0px 0px 2px white)`,
            transition: { duration: 0.2 },
          });
          await new Promise((r) => setTimeout(r, 150));
        }
        setMaskSize(sizes[sizes.length - 1]);
        await starsControls.start({
          filter: `drop-shadow(0px 0px 36px white) drop-shadow(0px 0px 48px white)`,
          transition: { duration: 0.4 },
        });
        await starsControls.start({
          filter: `drop-shadow(0px 0px 8px white)`,
          transition: { duration: 0.6 },
        });
      };
      setTimeout(pulse, totalAppearTime * 1000);
    }
  }, [showStars, starsControls, stars.length]);

    const StarSVG = ({ size = 32, style, ...props }: StarSVGProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" {...props} style={style}>
        <polygon
        points="50,15 61,39 88,39 66,56 75,82 50,66 25,82 34,56 12,39 39,39"
        fill="white"
        />
    </svg>
    );
    const mask = `radial-gradient(circle at 52% 70%, white ${maskSize}%, transparent ${maskSize + 10}%)`;
    return(
    <div className="h-[100dvh]  bg-black relative overflow-hidden">
      <motion.img
        src="/images/girl.png"
        alt="girl"
        className="fixed top-[65%] left-[52%] lg:w-[550px] lg:h-[550px] md:w-[180px] md:h-[180px] -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex: 5,
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          transition: "mask-image 0.5s, -webkit-mask-image 0.5s",
        }}
      />
      {stars.map((star, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: showStars ? 1 : 0
          }}
          transition={{
            delay: showStars ? 1.0 + i * 0.3 : 0,
            duration: 0.8,
            type: "tween"
          }}
          className={star.className}
          style={{ zIndex: 10, pointerEvents: "none", position: "fixed" }}
        >
          <motion.div animate={starsControls}>
            <StarSVG size={star.size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
    )
}