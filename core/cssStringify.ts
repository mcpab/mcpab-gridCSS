/**
 * @fileoverview CSS Grid value types and converters for grid layout system.
 * Provides type definitions and conversion functions from domain objects to CSS strings.
 * @module CSSStringify
 */

/**
 * CSS length value with unit and numeric value.
 * @example
 * ```typescript
 * // --- Types (as you defined) ---
 * const length: CssLength = { unit: "px", value: 16 };
 * const percentage: CssLength = { unit: "%", value: 100 };
 * ```
 */
export type CssLength = { unit: "px" | "em" | "rem" | "%"; value: number };

/**
 * CSS Grid track breadth values including lengths, fractional units, and content-based sizing.
 * @example
 * ```typescript
 * const fixedWidth: TrackBreadth = { unit: "px", value: 200 };
 * const fractionalWidth: TrackBreadth = { unit: "fr", value: 1 };
 * const autoWidth: TrackBreadth = { unit: "auto" };
 * ```
 */
export type TrackBreadth =
  | CssLength
  | { unit: "fr"; value: number }
  | { unit: "min-content" }
  | { unit: "max-content" }
  | { unit: "fit-content"; value: CssLength }
  | { unit: "auto" };

/**
 * Grid unit value that can be a track breadth or minmax function.
 * @example
 * ```typescript
 * const simpleUnit: GridUnitValue = { unit: "fr", value: 1 };
 * const minmaxUnit: GridUnitValue = { 
 *   unit: "minmax", 
 *   min: { unit: "px", value: 100 }, 
 *   max: { unit: "fr", value: 1 } 
 * };
 * ```
 */
export type GridUnitValue =
  | TrackBreadth
  | { unit: "minmax"; min: TrackBreadth; max: TrackBreadth };

/**
 * Gap value for CSS Grid gaps (row-gap, column-gap, gap).
 * @example
 * ```typescript
 * const gap: GapValue = { unit: "px", value: 16 };
 * ```
 */
export type GapValue = CssLength;

/**
 * Converts a CSS length object to its string representation.
 * 
 * @param len - The CSS length object with unit and value
 * @returns CSS string representation
 * 
 * @example
 * ```typescript
 * // --- Converters (domain -> CSS string) ---
 * cssLengthToString({ unit: "px", value: 16 }); // "16px"
 * cssLengthToString({ unit: "%", value: 100 }); // "100%"
 * ```
 */
export function cssLengthToString(len: CssLength): string {
  return `${len.value}${len.unit}`;
}

/**
 * Type guard to check if an unknown value is a CssLength object.
 * 
 * @param v - The value to check
 * @returns True if the value is a CssLength, false otherwise
 * 
 * @example
 * ```typescript
 * // Type guard: is this object a CssLength?
 * if (isCssLength(someValue)) {
 *   // someValue is now typed as CssLength
 *   const css = cssLengthToString(someValue);
 * }
 * ```
 */
function isCssLength(v: unknown): v is CssLength {
  return (
    typeof v === "object" &&
    v !== null &&
    "unit" in v &&
    "value" in v &&
    (v as any).unit &&
    typeof (v as any).value === "number"
  );
}

/**
 * Converts a TrackBreadth object to its CSS string representation.
 * 
 * @param b - The track breadth object to convert
 * @returns CSS string representation
 * 
 * @example
 * ```typescript
 * trackBreadthToString({ unit: "fr", value: 1 }); // "1fr"
 * trackBreadthToString({ unit: "auto" }); // "auto"
 * trackBreadthToString({ unit: "fit-content", value: { unit: "px", value: 200 } }); // "fit-content(200px)"
 * ```
 */
export function trackBreadthToString(b: TrackBreadth): string {
  // CssLength case
  if (isCssLength(b)) return cssLengthToString(b);

  switch (b.unit) {
    case "fr":
      return `${b.value}fr`;
    case "auto":
      return "auto";
    case "min-content":
      return "min-content";
    case "max-content":
      return "max-content";
    case "fit-content":
      return `fit-content(${cssLengthToString(b.value)})`;
    default: {
      // Exhaustiveness guard: if you add units later, TS should complain here.
      const _never: never = b;
      return String(_never);
    }
  }
}

/**
 * Converts a GridUnitValue to its CSS string representation.
 * Handles both simple track breadths and minmax() functions.
 * 
 * @param v - The grid unit value to convert
 * @returns CSS string representation
 * 
 * @example
 * ```typescript
 * gridUnitValueToString({ unit: "fr", value: 1 }); // "1fr"
 * gridUnitValueToString({ 
 *   unit: "minmax", 
 *   min: { unit: "px", value: 100 }, 
 *   max: { unit: "fr", value: 1 } 
 * }); // "minmax(100px, 1fr)"
 * ```
 */
export function gridUnitValueToString(v: GridUnitValue): string {
  // "minmax" wrapper case
  if (typeof v === "object" && v !== null && "unit" in v && (v as any).unit === "minmax") {
    const mm = v as Extract<GridUnitValue, { unit: "minmax" }>;
    return `minmax(${trackBreadthToString(mm.min)}, ${trackBreadthToString(mm.max)})`;
  }

  // Otherwise it's a TrackBreadth
  return trackBreadthToString(v as TrackBreadth);
}

/**
 * Converts a GapValue to its CSS string representation.
 * 
 * @param g - The gap value to convert
 * @returns CSS string representation
 * 
 * @example
 * ```typescript
 * gapValueToString({ unit: "px", value: 16 }); // "16px"
 * gapValueToString({ unit: "rem", value: 1 }); // "1rem"
 * ```
 */
export function gapValueToString(g: GapValue): string {
  return cssLengthToString(g);
}
