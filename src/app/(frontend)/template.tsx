"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

let hasShownPage = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const animate = hasShownPage && !reduce;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasShownPage = true;
    }, 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
