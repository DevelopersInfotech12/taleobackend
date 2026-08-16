"use client";
/**
 * Shared scroll/entrance animation primitives (framer-motion).
 * Drop-in wrappers — use instead of a plain <div>/<section> around
 * text blocks, images, or groups of cards to get "pro" section animations
 * site-wide with one consistent easing/timing language.
 */
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1]; // signature ease used across HeroBanner already

/** Fade + rise. Use for headings, paragraphs, CTA groups, whole sections. */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  duration = 0.8,
  y = 28,
  once = true,
  amount = 0.25,
  className = "",
  style = {},
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Fade + slide in from a side. Good for image/text split layouts. */
export function RevealSide({
  children,
  as = "div",
  from = "left", // left | right
  delay = 0,
  duration = 0.9,
  distance = 48,
  once = true,
  amount = 0.25,
  className = "",
  style = {},
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  const x = from === "left" ? -distance : distance;
  return (
    <Comp
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Scale-in, for images/cards/badges. */
export function RevealScale({
  children,
  as = "div",
  delay = 0,
  duration = 0.8,
  scale = 0.92,
  once = true,
  amount = 0.25,
  className = "",
  style = {},
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Stagger container — wrap a list/grid of children (cards, links, images). */
export function Stagger({
  children,
  as = "div",
  stagger = 0.12,
  delayChildren = 0,
  once = true,
  amount = 0.2,
  className = "",
  style = {},
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Individual item to use inside <Stagger>. */
export function StaggerItem({
  children,
  as = "div",
  y = 24,
  duration = 0.7,
  className = "",
  style = {},
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Image wrapper: gentle zoom-out-to-rest on enter + hover zoom. Wrap around an <img>/<Image>. */
export function RevealImage({
  children,
  delay = 0,
  duration = 1.1,
  once = true,
  amount = 0.2,
  className = "",
  style = {},
  hoverZoom = true,
  ...rest
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.12 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      whileHover={hoverZoom ? { scale: 1.04 } : undefined}
      style={{ overflow: "hidden", ...style }}
      className={className}
      {...rest}
    >
      <motion.div
        whileHover={hoverZoom ? { scale: 1.06 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
