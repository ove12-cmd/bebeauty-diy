"use client";

import { motion } from "framer-motion";

/**
 * Animated hamburger ⇄ close icon: the three bars morph into an X instead of
 * swapping abruptly between two separate SVGs. Driven by the nav's own
 * `menuOpen` state rather than hover — this is a controlled toggle, not a
 * hover preview.
 */
export default function MenuIcon({ open }: { open: boolean }) {
  const barTransition = { duration: 0.25, ease: "easeInOut" as const };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <motion.rect
        x="4"
        width="16"
        height="1.8"
        rx="0.9"
        fill="currentColor"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={open ? { y: 11.1, rotate: 45 } : { y: 6, rotate: 0 }}
        transition={barTransition}
      />
      <motion.rect
        x="4"
        y="11.1"
        width="16"
        height="1.8"
        rx="0.9"
        fill="currentColor"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.rect
        x="4"
        width="16"
        height="1.8"
        rx="0.9"
        fill="currentColor"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={open ? { y: 11.1, rotate: -45 } : { y: 16.2, rotate: 0 }}
        transition={barTransition}
      />
    </svg>
  );
}
