"use client";

import { motion, useAnimation, useMotionValue, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import NightSkyDots from "../components/nightSkyComponent";
import TextFromStars from "../components/textFromStars";

type StarSVGProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  style?: React.CSSProperties;
};

export default function Dashboard() {
  const STAR_BOX_SIZE = 100;
  const STAR_WIDTH = 76;
  const STAR_HEIGHT = 67;

  const starsControls = useAnimation();
  const maskSize = useMotionValue(0);
  const finalImgAnimation = useAnimation();
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [removed,     setRemoved    ] = useState<boolean>(false);
  const [maskSizeState, setMaskSizeState] = useState(maskSize.get());
  const [maskActive, setMaskActive] = useState<boolean>(false);
  const [showStars, setShowStars] = useState<boolean>(false);
  const [girlVisible, setGirlVisible] = useState<boolean>(false);
  const [showAnimation,   setShowAnimation  ] = useState<boolean>(false);
  const [animationDone, setAnimationDone] = useState<boolean>(false);
  const [showNightSky, setShowNightSky] = useState<boolean>(false);
  const [starsOnString, setStarsOnString] = useState<boolean>(false);
  const [stringHeights, setStringHeights] = useState<number[]>([]);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);
  const starTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showText, setShowText] =useState<boolean>(false);
  const shineRef = useRef<HTMLAudioElement | null>(null);
  const finaleRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    shineRef.current = new Audio("/sounds/shine.mp3");
    shineRef.current.preload = "auto";

    finaleRef.current = new Audio("/sounds/See_You_Again.mp3");
    finaleRef.current.preload = "auto";
  }, []);

  function handleFirstTap() {
    setHasInteracted(true);
    setTimeout(() => setRemoved(true), 14500);
  }


  const PULSE_COUNT = 4;

    const stars = [
  { size: 40, className: "fixed md:top-[80%] lg:top-[90%] left-[52%]" },
  { size: 50, className: "fixed md:top-[80%] lg:top-[90%] left-[50%]" },
  { size: 42, className: "fixed md:top-[80%] lg:top-[90%] left-[48%]" },
  { size: 12, className: "fixed md:top-[80%] lg:top-[90%] left-[50%]" },
  { size: 14, className: "fixed md:top-[80%] lg:top-[90%] left-[53%]" },
  { size: 58, className: "fixed md:top-[76%] lg:top-[86%] left-[50%]" },
  { size: 60, className: "fixed md:top-[76%] lg:top-[86%] left-[52%]" },
  { size: 15, className: "fixed md:top-[81%] lg:top-[91%] left-[54%]" },
  { size: 34, className: "fixed md:top-[81%] lg:top-[91%] left-[49%]" },
  { size: 34, className: "fixed md:top-[79%] lg:top-[89%] left-[50%]" },
  { size: 34, className: "fixed md:top-[79%] lg:top-[89%] left-[52%]" },
  { size: 55, className: "fixed md:top-[79%] lg:top-[86%] left-[48%]" },
];

  const [burstPositions, setBurstPositions] = useState<{ x: number; y: number }[]>(
    stars.map(() => ({ x: 0, y: 0 }))
  );


  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 1024);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);

    return isMobile;
  }

  const isMobile = useIsMobile();

  const starBurstTargets = isMobile
    ? [
        { x: 300, y: -220 },
        { x: -220, y: -80 },
        { x: -280, y: -200 },
        { x: -160, y: -180 },
        { x: 110, y: -210 },
        { x: -90, y: -20 },
        { x: 280, y: -100 },
        { x: -320, y: -230 },
        { x: 200, y: -10 },
        { x: -80, y: -165 },
        { x: 90, y: -60 },
        { x: -335, y: -75 },
      ]
    : [
        { x: 450, y: -450 },
        { x: -650, y: -180 },
        { x: -300, y: -250 },
        { x: -700, y: -600 },
        { x: 550, y: -180 },
        { x: -170, y: -50 },
        { x: 200, y: -550 },
        { x: -610, y: -480 },
        { x: 220, y: -300 },
        { x: -160, y: -260 },
        { x: 500, y: -120 },
        { x: -190, y: -470 },
      ];


  const starAnimations = useRef(stars.map(() => useAnimation())).current;

  function getResponsiveDelay() {
  if (typeof window === "undefined") return 0;
  const width = window.innerWidth;
  if (width < 768) return 0;    
  return 1000;                      
}

  function getResponsiveDelayBase() {
    if (typeof window === "undefined") return 0.8;
    const width = window.innerWidth;
    if (width < 768) return 3.6;      
    return 0.8;                  
  }

  function getShowAnimationDelay() {
    if (typeof window === "undefined") return 0;
    const width = window.innerWidth;
    return width < 768 ? 100000 : 0;
  }

  const initialY = typeof window !== "undefined" && window.innerWidth < 768 ? -50 : -100;


  useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = maskSize.on("change", (v) => setMaskSizeState(v));
    return unsubscribe;
  }, [maskSize]);

  useEffect(() => {
    if (!showAnimation) return;
    const timer = setTimeout(() => setAnimationDone(true), 2000);
    return () => clearTimeout(timer);
  }, [showAnimation]);

  useEffect(() => {
    if (!showStars) return;

    stars.forEach((_, i) => {
      setTimeout(() => {
        const shine = shineRef.current;
        if (shine) {
          shine.currentTime = 0;
          shine.play().catch(console.error);
        }
      }, 1000 + i * 300);
    });
  }, [showStars]);

  useEffect(() => {
    if (!showStars) return;
    const totalStarDuration = 1.0 + (stars.length - 1) * 0.3 + 0.8;
    const timer = setTimeout(() => {
      const final = finaleRef.current;
      if (final) {
        final.currentTime = 0;
        final.play().catch(console.error);
      }
    }, totalStarDuration * 1000);

    return () => clearTimeout(timer);
  }, [showStars]);


  useEffect(() => {
    if (!showStars) return;
    const sizes = [10, 30, 50, 80, 120];
    const pulse = async () => {
    for (let i = 0; i < PULSE_COUNT; i++) {
      if (i === 0) {
        setGirlVisible(true);
        setMaskActive(true);
        setShowNightSky(true);
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
        const showAnimationDelay = getShowAnimationDelay();
        setTimeout(() => setShowAnimation(true), showAnimationDelay);
        const hideGirlDelay = getResponsiveDelay();
        setTimeout(() => setGirlVisible(false), hideGirlDelay);
  };
    const timer = setTimeout(pulse, (1 + stars.length * 0.3 + 0.8) * (getResponsiveDelay()));
    return () => clearTimeout(timer);
  }, [showStars, stars.length]);

  useEffect(() => {
    if (showAnimation) {
      const animateStars = async () => {
        const baseDelay = getResponsiveDelayBase();
        await Promise.all(
          stars.map((star, i) =>
            starAnimations[i].start({
              y: initialY,
              scale: 1,
              transition: { duration: 2, ease: "easeInOut", delay: baseDelay, },
            })
          )
        );
        await Promise.all([
          ...stars.map((star, i) =>
            starAnimations[i].start({
              x: starBurstTargets[i].x,
              y: starBurstTargets[i].y,
              scale: 2.5,
              transition: { duration: 1.6, ease: "easeInOut" },
            })
          ),
          finalImgAnimation.start({
            y: 700,
            opacity: 0,
            transition: { duration: 1.6, ease: "easeInOut" },
          }),
          
        ]);
        setBurstPositions(starBurstTargets);
        setStarsOnString(true);
        setShowText(true);
      };
      animateStars();
    }
  }, [showAnimation]);

  const StarSVG = ({ size = 32, style, ...props }: StarSVGProps) => {
    const w = size * (STAR_WIDTH / STAR_BOX_SIZE);
    const h = size * (STAR_HEIGHT / STAR_BOX_SIZE);


  return (
    <div
      className="w-[32px] h-[28px] md:w-[24px] md:h-[21px] lg:w-[32px] lg:h-[28px]"
      style={{ width: w, height: h }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="12 0 76 67"
        {...props}
        style={style}
      >
        <polygon
          points="50,0 61,24 88,24 66,41 75,67 50,51 25,67 34,41 12,24 39,24"
          fill="white"
        />
      </svg>
    </div>
  );
};

useEffect(() => {
  if (!starsOnString) return;

  const heights: number[] = [];
  starTopRefs.current.forEach((ref, i) => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      heights[i] = rect.top + window.scrollY;
    }
  });
  setStringHeights(heights);
}, [starsOnString]);


  const mask =
    maskActive && girlVisible
      ? `radial-gradient(circle at 50% 76%, white ${maskSizeState}%, transparent ${maskSizeState + 12}%)`
      : undefined;

    return(
    <div className="h-[100dvh]  bg-black relative overflow-hidden">
    {!hasInteracted && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => {
              shineRef.current?.play().then(() => {
                shineRef.current?.pause();
                shineRef.current!.currentTime = 0;
              }).catch(console.error);

              finaleRef.current?.play().then(() => {
                finaleRef.current?.pause();
                finaleRef.current!.currentTime = 0;
              }).catch(console.error);
              handleFirstTap();
            }}
          >
            <p className="text-white text-2xl">тапни будь-де</p>
          </div>
    )}
   {hasInteracted && showNightSky && (
        <div
          className="fixed inset-0 w-full h-full z-0 pointer-events-none"
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            transition: "mask-image 0.5s, -webkit-mask-image 0.5s",
            background: "black",
          }}
        >
          <NightSkyDots />
        </div>
      )}
      <motion.img
        src="/images/girl.png"
        alt="girl"
        initial={{ opacity: 1 }}
        animate={{ opacity: girlVisible ? 1 : 0 }}
        className="fixed lg:top-[65%] lg:left-[52%] md:top-[50%]  md:left-[53%] lg:w-[550px] lg:h-[550px] md:w-[300px] md:h-[300px] -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex: 5,
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          transition: "mask-image 0.5s, -webkit-mask-image 0.5s",
        }}
      />
      {hasInteracted && showAnimation && !animationDone && (
      <motion.div 
        className="fixed lg:top-[29%] left-[34%] md:top-[10%] pointer-events-none "
        initial={{ opacity: 1 }}
      >
        <iframe
          src="/dragonbones/fathercard.html"
          className="lg:w-[550px] lg:h-[550px] md:w-[300px] md:h-[300px]"
          style={{
            border: "none",
            zIndex: 1,
          }}
        />
      </motion.div>
    )}
    {hasInteracted && animationDone && (
      <motion.img
        src="/dragonbones/final.png"
        alt="Final"
        animate={finalImgAnimation}
        initial={{ y: 0, opacity: 1 }}
        className="fixed lg:top-[27%] lg:left-[34%] md:top-[8%] md:left-[34%] lg:w-[550px] lg:h-[550px] md:w-[290px] md:h-[290px]"
        style={{ zIndex: 1 }}
      />
    )}
    {stars.map((star, i) => (
      <motion.div
        key={i}
       ref={(el: HTMLDivElement | null) => {
          starRefs.current[i] = el;
        }}
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
        style={{ zIndex: 10, position: "fixed" }}
      >
        <motion.div animate={starsControls}>
          
          <motion.div
            animate={starAnimations[i]}
            onPointerDown={starsOnString ? () => {
            starAnimations[i].start({
              rotate: [-22, 28, -14, 6, 0],
              transition: { duration: 1.3, ease: "easeInOut" },
            });
            } : undefined}
            onTouchStart={starsOnString ? () => {
             starAnimations[i].start({
              rotate: [-22, 28, -14, 6, 0],
              transition: { duration: 1.3, ease: "easeInOut" },
            });
           } : undefined}
            style={{
              transformOrigin: "50% 0%",
              cursor: starsOnString ? "pointer" : "default",
              pointerEvents: starsOnString ? "auto" : "none",
               position: "relative", 
            }}
          >
            <div
                className="scale-100 md:scale-[0.6] lg:scale-100"
                ref={(el) => { starTopRefs.current[i] = el; }}
              >
              <StarSVG  size={star.size} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    ))}
    {starsOnString &&
        stars.map((star, i) => {
          const height = stringHeights[i] ?? 0; // fallback if undefined

          const getPercent = (css: string, type: "left" | "top") => {
            const match = css.match(new RegExp(`${type}-\\[(\\d+)%\\]`));
            return match ? Number(match[1]) : 50;
          };

          const leftPercent = getPercent(star.className, "left");
          const starWidthPx = star.size * (STAR_WIDTH / STAR_BOX_SIZE);

          const left = `calc(${leftPercent}% + ${starBurstTargets[i].x}px + ${starWidthPx / 2}px - 0.5px)`;

          return (
            <div
              key={`string-${i}`}
              style={{
                position: "fixed",
                top: 0,
                left,
                width: "1px",
                height: `${height}px`,
                background: "white",
                opacity: 0.2,
                zIndex: 9,
                pointerEvents: "none",
              }}
            />
          );
        })}
        {hasInteracted && showText && (
          <TextFromStars/>
        )}
      </div>
      )
  }