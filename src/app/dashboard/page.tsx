"use client";
import { motion, useAnimation, useMotionValue, useSpring, animate } from "framer-motion";
import { useState, useEffect } from "react";

type StarSVGProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  style?: React.CSSProperties;
};

export default function Dashboard() {

  const starsControls = useAnimation();
  const maskSize = useMotionValue(0);
  const [maskSizeState, setMaskSizeState] = useState(maskSize.get());
  const [maskActive, setMaskActive] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [girlVisible, setGirlVisible] = useState(false);


  const PULSE_COUNT = 4;

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
    const timer = setTimeout(() => setShowStars(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  const unsubscribe = maskSize.on("change", (v) => setMaskSizeState(v));
  return unsubscribe;
}, [maskSize]);


useEffect(() => {
  if (!showStars) return;
  const sizes = [10, 30, 50, 80, 120];
  const pulse = async () => {
  for (let i = 0; i < PULSE_COUNT; i++) {
    if (i === 0) {
      setGirlVisible(true);
      setMaskActive(true);
    }
    await Promise.all([
      animate(maskSize, sizes[i + 1], { duration: 0.5, ease: "easeInOut" }).finished,
      starsControls.start({
        filter: `drop-shadow(0px 0px ${16 * (i + 1)}px white) drop-shadow(0px 0px ${18 * (i + 1)}px white)`,
        transition: { duration: 0.5 },
      }),
    ]);
    await Promise.all([
      animate(maskSize, sizes[i + 1] - 10, { duration: 0.18, ease: "easeInOut" }).finished,
      starsControls.start({
        filter: `drop-shadow(0px 0px 8px white) drop-shadow(0px 0px 10px white)`,
        transition: { duration: 0.18 },
      }),
    ]);
    await Promise.all([
      animate(maskSize, sizes[i + 1], { duration: 0.15, ease: "easeInOut" }).finished,
      starsControls.start({
        filter: `drop-shadow(0px 0px ${16 * (i + 1)}px white) drop-shadow(0px 0px ${18 * (i + 1)}px white)`,
        transition: { duration: 0.15 },
      }),
    ]);
    await new Promise((r) => setTimeout(r, 200));
    await starsControls.start({
      filter: `drop-shadow(0px 0px 2px white)`,
      transition: { duration: 0.2 },
    });
    await new Promise((r) => setTimeout(r, 150));
  }
  await starsControls.start({
    filter: `drop-shadow(0px 0px 36px white) drop-shadow(0px 0px 48px white)`,
    transition: { duration: 0.4 },
  });
  await starsControls.start({
    filter: `drop-shadow(0px 0px 8px white)`,
    transition: { duration: 0.6 },
  });
};
  const timer = setTimeout(pulse, (1 + stars.length * 0.3 + 0.8) * 1000);
  return () => clearTimeout(timer);
}, [showStars, stars.length]);



    const StarSVG = ({ size = 32, style, ...props }: StarSVGProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" {...props} style={style}>
        <polygon
        points="50,15 61,39 88,39 66,56 75,82 50,66 25,82 34,56 12,39 39,39"
        fill="white"
        />
    </svg>
    );

 const mask =
  maskActive && girlVisible
    ? `radial-gradient(circle at 50% 76%, white ${maskSizeState}%, transparent ${maskSizeState + 12}%)`
    : undefined;



    return(
    <div className="h-[100dvh]  bg-black relative overflow-hidden">
      <motion.img
        src="/images/girl.png"
        alt="girl"
        initial={{ opacity: 0 }}
        animate={{ opacity: girlVisible ? 1 : 0 }}
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