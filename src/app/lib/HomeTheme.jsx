"use client";
/**
 * Thin helper — components import `useHomeTheme()` to get
 * theme-aware color tokens.  Dark is the original palette;
 * light flips the dark backgrounds to creams.
 */
import { useTheme } from "./ThemeContext";

const DARK = {
  heroBg:        "#1a0c06",
  sectionDk:     "#150f0a",
  sectionMid:    "#1e1510",
  sectionLight:  "#f5f0e8",
  sectionWhite:  "#ffffff",
  headingColor:  "#e8d9c4",
  textMuted:     "rgba(232,217,196,0.6)",
  textBody:      "#c8b99a",
  divider:       "#2e2318",
  instaBg:       "#1a0c06",
  instaCard:     "#2a1810",
  instaCardBd:   "#3a2015",
  instaCardSkeleton: "#3a2015",
  instaCardSkeletonAlt: "#4a2a1a",
  iconColor:     "#1e110a",
  blogCard:      "#1e1510",
  blogCardBd:    "#2e2318",
};

const LIGHT = {
  heroBg:        "#faf7f2",
  sectionDk:     "#faf7f2",
  sectionMid:    "#fdf9f4",
  sectionLight:  "#fff8f0",
  sectionWhite:  "#ffffff",
  headingColor:  "#2a1a0e",
  textMuted:     "rgba(42,26,14,0.6)",
  textBody:      "#6b4c35",
  divider:       "rgba(42,26,14,0.1)",
  instaBg:       "#faf7f2",
  instaCard:     "#ffffff",
  instaCardBd:   "#e8ddd5",
  instaCardSkeleton: "#f0e8dc",
  instaCardSkeletonAlt: "#e8ddd5",
  iconColor:     "#2a1a0e",
  blogCard:      "#ffffff",
  blogCardBd:    "#e8ddd5",
};

export function useHomeTheme() {
  const { homeTheme, mounted } = useTheme();
  const isDark = !mounted || homeTheme === "dark";
  return isDark ? DARK : LIGHT;
}
