import React from "react";

type NightSkyDotsProps = {
  count?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  style?: React.CSSProperties;
};

const NightSkyDots: React.FC<NightSkyDotsProps> = ({
  count = 1000,
  minSize = 1,
  maxSize = 3,
  className = "",
}) => {
  const dots = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size =
        minSize + Math.random() * (maxSize - minSize);
      const opacity = 0.7 + Math.random() * 0.3;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${left}vw`,
            top: `${top}vh`,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "white",
            opacity,
            pointerEvents: "none",
            filter: "blur(0.5px)",
          }}
        />
      );
    });
  }, [count, minSize, maxSize]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ overflow: "hidden" }}
      aria-hidden
    >
      {dots}
    </div>
  );
};

export default NightSkyDots;
