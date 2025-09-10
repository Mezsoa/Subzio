import { useEffect, useState, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function useScrambleText(target: string, speed = 100, loop = true) {
  const [display, setDisplay] = useState<string>(
    "".padStart(target.length, " ")
  );
  const frameRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    frameRef.current = 0;
    isAnimatingRef.current = true;

    const run = () => {
      if (!isAnimatingRef.current) return;

      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (i < frameRef.current) {
              return char;
            } else if (i === frameRef.current) {
              // Add some randomness to the reveal timing
              const shouldReveal = Math.random() > 0.3;
              return shouldReveal ? char : chars[Math.floor(Math.random() * chars.length)];
            } else {
              return chars[Math.floor(Math.random() * chars.length)];
            }
          })
          .join("")
      );

      if (frameRef.current < target.length) {
        frameRef.current++;
        timeoutRef.current = setTimeout(run, speed + Math.random() * 50); // Add some randomness to timing
      } else if (loop) {
        // Longer pause before restarting
        setTimeout(() => {
          if (isAnimatingRef.current) {
            frameRef.current = 0;
            run();
          }
        }, 2000 + Math.random() * 1000); // Random pause between 2-3 seconds
      }
    };

    run();

    return () => {
      isAnimatingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [target, speed, loop]);

  return display;
}
