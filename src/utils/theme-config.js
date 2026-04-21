/**
 * Theme configuration — JS-side design token aliases.
 *
 * These values mirror the CSS custom properties defined in src/index.css.
 * Use these when you need design tokens in JS (e.g. Recharts colour configs,
 * conditional class logic, or server-side rendering).
 *
 * DO NOT hard-code hex values in components — reference these constants instead.
 */

/** CSS variable references — resolved at runtime via getComputedStyle if needed. */
export const CSS_VARS = {
  primary:          "hsl(var(--primary))",
  primaryForeground:"hsl(var(--primary-foreground))",
  secondary:        "hsl(var(--secondary))",
  background:       "hsl(var(--background))",
  foreground:       "hsl(var(--foreground))",
  muted:            "hsl(var(--muted))",
  mutedForeground:  "hsl(var(--muted-foreground))",
  accent:           "hsl(var(--accent))",
  border:           "hsl(var(--border))",
  destructive:      "hsl(var(--destructive))",
  card:             "hsl(var(--card))",
  raftaarAi:        "hsl(var(--raftaar-ai))",
};

/**
 * Spacing scale (in px) — mirrors Tailwind's default scale.
 * Use when setting inline styles or canvas-based measurements.
 */
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  "2xl": 48,
};

/**
 * Breakpoints (in px) — mirrors Tailwind's default breakpoints.
 * Use with window.innerWidth comparisons or ResizeObserver logic.
 */
export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1536,
};

/**
 * Order status → colour mapping for badges and chart segments.
 * Values are Tailwind utility class strings (applied conditionally in components).
 */
export const ORDER_STATUS_COLORS = {
  placed:     "bg-blue-100   text-blue-700   border-blue-200",
  confirmed:  "bg-amber-100  text-amber-700  border-amber-200",
  dispatched: "bg-purple-100 text-purple-700 border-purple-200",
  delivered:  "bg-green-100  text-green-700  border-green-200",
  delayed:    "bg-red-100    text-red-700    border-red-200",
};
