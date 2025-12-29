/**
 * @fileoverview Layout theme type definitions for CSS Grid layout system.
 * Defines theming interfaces that provide styling and transformation behaviors for layouts.
 * Themes control how layouts are rendered, transformed, and visually presented.
 * The examples in the comments below dont all compile. Correct examples are at the end of
 * the file.
 * @module LayoutThemeTypes
 */

import { GridBox } from "../box/gridBoxTypes";
import {
  BlockIDSFromSectionAndLayout,
  BoxSpan,
  BoxTransformations,
  Layout,
  SectionsIDSFromLayout,
} from "../boxLayout/boxLayoutTypes";
import { BREAKPOINTS } from "../breakpoints";
import { GridOptions } from "../gridOptionsTypes";
import { GridNodeViewOptions } from "../nodeViewOptions";

/**
 * Theme configuration interface for a specific layout type.
 * Provides all the necessary functions and options to control how a layout
 * is processed, transformed, and rendered across different breakpoints.
 *
 * A theme acts as a bridge between the abstract layout definition and the
 * concrete visual implementation, handling:
 * - Box span resolution and positioning
 * - Default transformations at section and layout levels
 * - Visual styling and rendering options
 * - Grid configuration and behavior
 *
 * @template L - The layout type this theme is designed for
 *
 * @example
 * ```typescript
 * const myTheme: ThemeForLayout<typeof myLayout> = {
 *   resolveBoxSpan: (section, boxId, layout, span, bp) => {
 *     // Convert span to GridBox for this breakpoint
 *     return makeGridBox({ x: 0, y: 0 }, { x: span.spanX * 50, y: span.spanY * 100 });
 *   },
 *
 *   sectionBoxTransforms: (section, layout) => ({
 *     xs: [{ stackVertically: { gap: 10 } }],
 *     md: [{ stackHorizontally: { gap: 20 } }]
 *   }),
 *
 *   layoutTransforms: (layout) => ({
 *     xs: [{ stackVertically: {} }],
 *     md: [{ stackVertically: { gap: 30 } }]
 *   }),
 *
 *   gridNodeOptions: {
 *     showGridLines: true,
 *     showBoxLabels: false
 *   },
 *
 *   gridOptions: {
 *     containerWidth: 1200,
 *     gutterSize: 20
 *   }
 * };
 * ```
 */
export type ThemeForLayout<L extends Layout> = {
  /**
   * Resolves a box span definition into a concrete GridBox for a specific breakpoint.
   * This function is responsible for converting the abstract spanX/spanY values
   * into actual positioned and sized GridBox coordinates.
   *
   * The resolution process typically involves:
   * - Calculating actual pixel dimensions from span units
   * - Applying grid constraints and gutters
   * - Considering breakpoint-specific sizing rules
   * - Positioning boxes within their section context
   *
   * @param section - The section identifier containing the box
   * @param boxId - The block identifier within the section
   * @param layout - The complete layout configuration
   * @param span - The span definition (spanX/spanY) to resolve
   * @param bp - The breakpoint for which to resolve the span
   * @returns A GridBox with concrete position and dimensions
   *
   * @example
   * ```typescript
   * // Resolve a 2x1 span in the header section for medium breakpoint
   * const gridBox = theme.resolveBoxSpan(
   *   'header',
   *   'block_1',
   *   layout,
   *   { spanX: 2, spanY: 1 },
   *   'md'
   * );
   * // Result: GridBox with calculated position and size
   * ```
   */
  resolveBoxSpan: <S extends SectionsIDSFromLayout<L>>(
    section: S,
    boxId: BlockIDSFromSectionAndLayout<L, S>,
    layout: L,
    span: BoxSpan,
    bp: (typeof BREAKPOINTS)[number]
  ) => GridBox;

  /**
   * Provides default box-level transformations applied within each section.
   * These transformations are applied to blocks within sections unless
   * explicitly overridden by the layout or runtime configuration.
   *
   * Common use cases:
   * - Stacking blocks vertically on mobile, horizontally on desktop
   * - Adding consistent spacing between section elements
   * - Applying section-specific alignment or positioning rules
   * - Creating responsive behavior at the section level
   *
   * @param section - The section identifier to get transformations for
   * @param layout - The complete layout configuration
   * @returns Box transformations for blocks within the specified section
   *
   * @example
   * ```typescript
   * // Get default transformations for header section
   * const headerTransforms = theme.sectionBoxTransforms('header', layout);
   * // Might return: { xs: [{ stackVertically: {} }], md: [{ stackHorizontally: {} }] }
   * ```
   */
  sectionBoxTransforms: <S extends SectionsIDSFromLayout<L>>(
    section: S,
    layout: L
  ) => BoxTransformations<BlockIDSFromSectionAndLayout<L, S>>;

  /**
   * Provides default section-level transformations for the entire layout.
   * These transformations control how sections are arranged and positioned
   * relative to each other, creating the overall page structure.
   *
   * Common use cases:
   * - Stacking sections vertically in reading order
   * - Adding spacing between major layout sections
   * - Creating responsive section arrangements
   * - Implementing sticky headers, fixed footers, or floating sidebars
   *
   * @param layout - The complete layout configuration
   * @returns Section transformations for the overall layout structure
   *
   * @example
   * ```typescript
   * // Get default layout-level transformations
   * const layoutTransforms = theme.layoutTransforms(layout);
   * // Might return: {
   * //   xs: [{ stackVertically: { gap: 20 } }],
   * //   lg: [{ stackVertically: { gap: 40 } }]
   * // }
   * ```
   */
  layoutTransforms: (layout: L) => BoxTransformations<SectionsIDSFromLayout<L>>;

  /**
   * Configuration options for grid node rendering and visual appearance.
   * Controls how individual nodes (blocks and sections) are displayed,
   * including debug visualizations, styling, and interactive behaviors.
   *
   * @example
   * ```typescript
   * const nodeOptions: GridNodeViewOptions = {
   *   showGridLines: true,        // Show grid overlay
   *   showBoxLabels: true,        // Display box IDs
   *   highlightOnHover: true,     // Interactive highlighting
   *   debugInfo: {
   *     showCoordinates: true,    // Show position info
   *     showBreakpoint: true      // Show active breakpoint
   *   }
   * };
   * ```
   */
  gridNodeOptions: GridNodeViewOptions;

  /**
   * Global grid configuration options that affect the entire layout system.
   * Controls fundamental grid behavior, sizing, and structural properties
   * that apply across all sections and breakpoints.
   *
   * @example
   * ```typescript
   * const gridOptions: GridOptions = {
   *   containerMaxWidth: 1200,    // Maximum container width
   *   gutterSize: 24,             // Space between grid items
   *   marginSize: 16,             // Outer margins
   *   columns: 12,                // Default column count
   *   responsive: true            // Enable responsive behavior
   * };
   * ```
   */
  gridOptions: GridOptions;
};

// Examples extracted from documentation comments above

import { makeGridBox } from "../box/gridBoxUtils";

// Example 1: Theme configuration from main interface documentation
const myLayout = {
  header: {
    block_1: { spanX: 2, spanY: 1 },
    block_2: { spanX: 1, spanY: 1 },
  },
  main: {
    block_3: { spanX: 3, spanY: 2 },
  },
} as const satisfies Layout;

const myTheme: ThemeForLayout<typeof myLayout> = {
  resolveBoxSpan: (section, boxId, layout, span, bp) => {
    // Convert span to GridBox for this breakpoint
    return makeGridBox(
      { x: 0, y: 0 },
      { x: span.spanX * 50, y: span.spanY * 100 }
    );
  },

  sectionBoxTransforms: (section, layout) => ({
    xs: [{ stackVertically: { gap: 10 } }],
    sm: [{ stackVertically: { gap: 15 } }],
    md: [{ stackHorizontally: { gap: 20 } }],
    lg: [{ stackHorizontally: { gap: 40 } }],
    xl: [{ stackHorizontally: { gap: 50 } }],
  }),

  layoutTransforms: (layout) => ({
    xs: [{ stackVertically: { gap: 10 } }],
    sm: [{ stackVertically: { gap: 15 } }],
    md: [{ stackHorizontally: { gap: 20 } }],
    lg: [{ stackHorizontally: { gap: 40 } }],
    xl: [{ stackHorizontally: { gap: 50 } }],
  }),

  gridNodeOptions: {
    justifySelf: "center",
  },

  gridOptions: {
    implicitRowUnits: { value: 1, unit: "fr" },
    implicitColumnUnits: { value: 1, unit: "fr" },

    overflow: "visible",
    autoFlow: "row",

    justifyItems: "stretch",
    alignItems: "stretch",

    justifyContent: "start",
    alignContent: "start",

    gap: { value: 0, unit: "px" },
    rowGap: { value: 0, unit: "px" },
    columnGap: { value: 0, unit: "px" },
  },
};

// Example 2: Resolving box spans from resolveBoxSpan documentation
const theme = myTheme; // Reference theme for examples
const layout = myLayout; // Reference layout for examples

// Resolve a 2x1 span in the header section for medium breakpoint
const gridBox = theme.resolveBoxSpan(
  "header",
  "block_1",
  layout,
  { spanX: 2, spanY: 1 },
  "md"
);
// Result: GridBox with calculated position and size

// Example 3: Section transforms from sectionBoxTransforms documentation
// Get default transformations for header section
const headerTransforms = theme.sectionBoxTransforms("header", layout);
// Might return: { xs: [{ stackVertically: {} }], md: [{ stackHorizontally: {} }] }

// Example 4: Layout transforms from layoutTransforms documentation
// Get default layout-level transformations
const layoutTransforms = theme.layoutTransforms(layout);
// Might return: {
//   xs: [{ stackVertically: { gap: 20 } }],
//   lg: [{ stackVertically: { gap: 40 } }]
// }

// Example 5: Grid node options from gridNodeOptions documentation
const nodeOptions: GridNodeViewOptions = {
  alignSelf: "start",
};

// Example 6: Grid options from gridOptions documentation
const gridOptions: GridOptions = {
  implicitRowUnits: { value: 1, unit: "fr" },
  implicitColumnUnits: { value: 1, unit: "fr" },

  overflow: "visible",
  autoFlow: "row",

  justifyItems: "stretch",
  alignItems: "stretch",

  justifyContent: "start",
  alignContent: "start",

  gap: { value: 0, unit: "px" },
  rowGap: { value: 0, unit: "px" },
  columnGap: { value: 0, unit: "px" },
};
