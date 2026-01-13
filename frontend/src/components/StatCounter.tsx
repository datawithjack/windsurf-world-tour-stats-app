import { useEffect, useState, useRef } from 'react';

interface StatCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  delay?: number;
}

const StatCounter = ({ end, duration = 2000, suffix = '', delay = 0 }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const countRef = useRef<number>(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(end);
      setIsComplete(true);
      return;
    }

    const startTime = performance.now() + delay;

    const animate = (currentTime: number) => {
      if (currentTime < startTime) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = Math.floor(easeOut * end);

      if (current !== countRef.current) {
        countRef.current = current;
        setCount(current);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, delay]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <span
      className={`text-6xl md:text-7xl text-white transition-opacity duration-500 font-bebas ${
        isComplete ? 'opacity-100' : 'opacity-70'
      }`}
      aria-live={isComplete ? 'polite' : 'off'}
      aria-atomic="true"
    >
      {formatNumber(count)}{suffix}
    </span>
  );
};

export default StatCounter;
