/**
 * @fileoverview Grid node type definitions for layout positioning and configuration.
 * Provides types for CSS Grid coordinates, layout flags, and responsive positioning.
 * @module GridNodeTypes
 */

/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 */


import { BPs } from "./breakpoints";

/**
 * Layout configuration flags for grid node behavior and constraints.
 * 
 * @example
 * ```typescript
 * const layoutFlags: GridNodeLayoutFlags = {
 *   allowOverlap: true,
 *   constrainChildren: false,
 *   visibility: "visible" // no visuallyHidden here
 * };
 * ```
 */
export type GridNodeLayoutFlags = {
  /** Whether this node can overlap with other nodes */
  allowOverlap?: boolean;
  /** Whether to constrain child elements within this node's bounds */
  constrainChildren?: boolean;
  /** Visibility state of the node */
  visibility?: "visible" | "hidden"; // no visuallyHidden here
};

/**
 * Absolute coordinates for CSS Grid node positioning.
 * Defines the exact grid lines where a node starts and ends.
 * 
 * @example
 * ```typescript
 * // Absolute coordinates for grid node positioning
 * const coordinates: CSSCoordinates = {
 *   gridRowStart: 1,      // Start at row line 1
 *   gridColumnStart: 2,   // Start at column line 2  
 *   gridRowEnd: 3,        // End at row line 3 (exclusive)
 *   gridColumnEnd: 5      // End at column line 5 (exclusive)
 * };
 * // This creates a 2-row × 3-column grid area
 * ```
 */
export type CSSCoordinates = {
  /** Starting row line (1-based, inclusive) */
  gridRowStart: number;
  /** Starting column line (1-based, inclusive) */
  gridColumnStart: number;
  /** Ending row line (1-based, exclusive) */
  gridRowEnd: number; // exclusive
  /** Ending column line (1-based, exclusive) */
  gridColumnEnd: number; // exclusive
};
/**
 * Grid node identity and metadata (currently unused).
 * 
 * @example
 * ```typescript
 * // Grid node identity and metadata
 * type GridNodeIdentityK<ID extends string = string> = {
 *   parentId?: ID;        // Optional parent node reference
 *   name?: string;        // display/debug name  
 *   id: ID;              // Unique identifier
 * };
 * ```
 */
// export type GridNodeIdentityK<ID extends string = string> = {
//     parentId?: ID;
//     name?: string; // display/debug name
//     id: ID;
// };

/**
 * Responsive CSS coordinates across all breakpoints.
 * Maps each breakpoint to its corresponding CSS Grid coordinates.
 * 
 * @example
 * ```typescript
 * // Absolute positioned grid node with identity, coordinates, and options
 * const responsiveCoords: CSSCoordinatesBPS = {
 *   xs: { gridRowStart: 1, gridColumnStart: 1, gridRowEnd: 2, gridColumnEnd: 2 },
 *   sm: { gridRowStart: 1, gridColumnStart: 1, gridRowEnd: 2, gridColumnEnd: 3 },
 *   md: { gridRowStart: 1, gridColumnStart: 2, gridRowEnd: 2, gridColumnEnd: 4 },
 *   lg: { gridRowStart: 1, gridColumnStart: 2, gridRowEnd: 2, gridColumnEnd: 5 },
 *   xl: { gridRowStart: 1, gridColumnStart: 3, gridRowEnd: 2, gridColumnEnd: 6 }
 * };
 * ```
 */
export type CSSCoordinatesBPS = BPs<CSSCoordinates>;
