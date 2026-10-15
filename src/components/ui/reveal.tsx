"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fades content in once it scrolls into view. Not for above-the-fold content.
 * A `noscript` rule in the root layout keeps `[data-reveal]` visible without JavaScript.
 */
export function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
