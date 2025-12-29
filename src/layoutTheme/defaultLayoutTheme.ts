/**
 * @fileoverview Default layout theme implementation for CSS Grid layout system.
 * Provides a complete, production-ready theme with sensible defaults for all layout scenarios.
 * This theme serves as both a working implementation and a reference for creating custom themes.
 * @module DefaultLayoutTheme
 */

import { GridBox } from "../box/gridBoxTypes";
import { makeGridBox } from "../box/gridBoxUtils";
import {
  BlockIDSFromSectionAndLayout,
  BoxSpan,
  BoxTransformations,
  Layout,
  SectionsIDSFromLayout,
} from "../boxLayout/boxLayoutTypes";
import { BREAKPOINTS } from "../breakpoints";
import { getOrigin } from "../geometry";
import { GridOptions } from "../gridOptionsTypes";
import { GridNodeViewOptions } from "../nodeViewOptions";
import { NodeID } from "../templates";

import { ThemeForLayout } from "./layoutThemeTypes";

/**
 * Good boring defaults for CSS Grid items.
 * - minWidth0/minHeight0 prevent overflow caused by min-size:auto
 * - stretch fills the grid area by default
 */

export const DEFAULT_GRID_NODE_VIEW_OPTIONS = {
  minWidth0: true,
  minHeight0: true,
  justifySelf: "stretch",
  alignSelf: "stretch",
  pointerEvents: "auto",
  dataAttrs: {},
  aria: {},
  visibility: "visible",
} as const satisfies Required<
  Pick<
    GridNodeViewOptions,
    | "minWidth0"
    | "minHeight0"
    | "justifySelf"
    | "alignSelf"
    | "pointerEvents"
    | "dataAttrs"
    | "aria"
    | "visibility"
  >
>;
/**
 * Resolves grid node view options by merging user-provided options with sensible defaults.
 * This function ensures all required properties are present while allowing selective overrides.
 * 
 * Key behaviors:
 * - Shallow merging prevents deep object mutation issues
 * - Always provides complete objects for dataAttrs and aria to prevent null reference errors
 * - Maintains type safety while avoiding complex generic hierarchies
 * - SSR-safe with predictable default values
 * 
 * @param opts - Optional user-provided grid node view options to override defaults
 * @returns Complete GridNodeViewOptions object with all required properties
 * 
 * @example
 * ```typescript
 * // Basic usage with no overrides
 * const defaultOptions = resolveGridNodeViewOptions();
 * 
 * // Override specific properties
 * const customOptions = resolveGridNodeViewOptions({
 *   justifySelf: 'center',
 *   zIndex: 100,
 *   dataAttrs: { 'data-testid': 'grid-item' }
 * });
 * 
 * // Aria attributes are safely merged
 * const accessibleOptions = resolveGridNodeViewOptions({
 *   aria: { role: 'button', label: 'Click me' }
 * });
 * ```
 */

export function resolveGridNodeViewOptions(opts?: GridNodeViewOptions): {
  zIndex?: number;
  minWidth0: boolean;
  minHeight0: boolean;
  justifySelf: "start" | "end" | "center" | "stretch";
  alignSelf: "start" | "end" | "center" | "stretch";
  pointerEvents: "auto" | "none";
  dataAttrs: Record<string, string>;
  aria: {
    role?: string;
    label?: string;
    labelledBy?: string;
    describedBy?: string;
  };
  visibility: "visible" | "hidden" | "visuallyHidden";
} {
  return {
    ...DEFAULT_GRID_NODE_VIEW_OPTIONS,
    ...opts,
    // ensure these objects are always present even if caller passes undefined
    dataAttrs: {
      ...DEFAULT_GRID_NODE_VIEW_OPTIONS.dataAttrs,
      ...(opts?.dataAttrs ?? {}),
    },
    aria: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS.aria, ...(opts?.aria ?? {}) },
  };
}
/**
 * Default CSS Grid container options providing production-ready, boring defaults.
 * These settings create predictable grid behavior that works well for most application layouts.
 * 
 * Configuration rationale:
 * - `autoFlow: "row"`: Matches natural DOM document flow expectations
 * - `overflow: "visible"`: Prevents unexpected clipping; opt-in for containment
 * - `justifyItems/alignItems: "stretch"`: Children fill their grid areas by default
 * - `justifyContent/alignContent: "start"`: Grid tracks pack from top-left (predictable)
 * - `implicitRowUnits/implicitColumnUnits: 1fr`: Auto-generated tracks use fractional units
 * - `gaps: 0px`: No spacing by default; add intentionally to avoid layout surprises
 * 
 * @constant
 * @type {GridOptions}
 * 
 * @example
 * ```typescript
 * // Use as base for custom grid configurations
 * const customGridOptions = {
 *   ...DEFAULT_GRID_OPTIONS,
 *   gap: { value: 16, unit: 'px' },
 *   justifyContent: 'center'
 * };
 * 
 * // For responsive layouts
 * const responsiveOptions = {
 *   ...DEFAULT_GRID_OPTIONS,
 *   implicitColumnUnits: { value: 250, unit: 'px' } // Fixed column width
 * };
 * ```
 */

export const DEFAULT_GRID_OPTIONS = {
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
} as const satisfies GridOptions;
/**
 * Resolves grid options by merging user-provided options with sensible defaults.
 * Uses shallow merging for predictable behavior and optimal performance.
 * 
 * Benefits:
 * - Shallow merging avoids deep object mutation concerns
 * - Predictable output regardless of input completeness
 * - SSR-safe with consistent default values
 * - Type-safe partial option overrides
 * 
 * @param opts - Optional partial grid options to override defaults
 * @returns Complete GridOptions object with all required properties
 * 
 * @example
 * ```typescript
 * // Use defaults
 * const defaultGrid = resolveGridOptions();
 * 
 * // Override specific properties
 * const spacedGrid = resolveGridOptions({
 *   gap: { value: 20, unit: 'px' },
 *   justifyContent: 'center'
 * });
 * 
 * // Responsive column sizing
 * const responsiveGrid = resolveGridOptions({
 *   implicitColumnUnits: { value: 300, unit: 'px' }
 * });
 * ```
 */

export function resolveGridOptions(opts?: Partial<GridOptions>): GridOptions {
  return {
    ...DEFAULT_GRID_OPTIONS,
    ...opts,
  };
}

/**
 * Default responsive transformations for horizontal layouts (rows).
 * Stacks vertically on mobile, switches to horizontal on larger screens.
 * Ideal for navigation bars, button groups, or horizontal content sections.
 * 
 * @constant
 * @type {BoxTransformations<NodeID>}
 */
export const DefaultTransformationsResponsiveRows = {
  xs: [{ stackVertically: {} }],
  sm: [{ stackHorizontally: {} }],
  md: [{ stackHorizontally: {} }],
  lg: [{ stackHorizontally: {} }],
  xl: [{ stackHorizontally: {} }],
} as const satisfies BoxTransformations<NodeID>;

/**
 * Default responsive transformations for vertical layouts (columns).
 * Maintains vertical stacking across all breakpoints.
 * Ideal for main content areas, article layouts, or form sections.
 * 
 * @constant
 * @type {BoxTransformations<NodeID>}
 */
export const DefaultTransformationsResponsiveColumns = {
  xs: [{ stackVertically: {} }],
  sm: [{ stackVertically: {} }],
  md: [{ stackVertically: {} }],
  lg: [{ stackVertically: {} }],
  xl: [{ stackVertically: {} }],
} as const satisfies BoxTransformations<NodeID>;

/**
 * Creates a complete default theme for a given layout type.
 * This function provides a production-ready theme implementation with sensible defaults
 * for all aspects of layout rendering, transformation, and visual presentation.
 * 
 * Theme behaviors:
 * - **Box span resolution**: Responsive sizing with full-width on mobile (xs breakpoint)
 * - **Section transformations**: Horizontal stacking for most content (responsive rows)
 * - **Layout transformations**: Vertical section stacking (responsive columns)
 * - **Visual options**: Stretch behavior with overflow prevention
 * - **Grid configuration**: Standard CSS Grid defaults with predictable behavior
 * 
 * The theme automatically handles:
 * - Mobile-first responsive design patterns
 * - CSS Grid best practices and common pitfall avoidance
 * - Accessibility-friendly default configurations
 * - SSR-compatible option resolution
 * 
 * @template L - The layout type this theme will be applied to
 * @param layout - The layout configuration to create a theme for
 * @returns Complete ThemeForLayout implementation with all required methods and options
 * 
 * @example
 * ```typescript
 * const myLayout = {
 *   header: { nav: { spanX: 4, spanY: 1 }, logo: { spanX: 2, spanY: 1 } },
 *   main: { content: { spanX: 6, spanY: 4 } }
 * } as const satisfies Layout;
 * 
 * const theme = getDefaultTheme(myLayout);
 * 
 * // Use theme methods
 * const gridBox = theme.resolveBoxSpan('header', 'nav', myLayout, { spanX: 4, spanY: 1 }, 'md');
 * const transforms = theme.sectionBoxTransforms('header', myLayout);
 * ```
 */
export const getDefaultTheme = <L extends Layout>(layout: L) => {
  const theme = {
    resolveBoxSpan: <S extends SectionsIDSFromLayout<L>>(
      section: S,
      boxId: BlockIDSFromSectionAndLayout<L, S>,
      layout: L,
      span: BoxSpan,
      bp: (typeof BREAKPOINTS)[number]
    ) => {
      let dx = span.spanX;
      let dy = span.spanY;

      if (bp === "xs") {
        // in xs, all boxes are full width
        dx = 1;
      }
      const gridBox: GridBox = makeGridBox(getOrigin(), { x: dx, y: dy });
      return gridBox;
    },
    sectionBoxTransforms: <S extends SectionsIDSFromLayout<L>>(
      section: S,
      layout: L
    ) => {
      return DefaultTransformationsResponsiveRows;
    },
    layoutTransforms: (layout: L) => {
      return DefaultTransformationsResponsiveColumns;
    },
    gridNodeOptions: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS },
    gridOptions: { ...DEFAULT_GRID_OPTIONS },
  } satisfies ThemeForLayout<L>;

  return theme;
};

// Working examples demonstrating the default theme usage

// Example 1: Basic layout definition using valid BlockIDs and SectionIDs
const exampleLayout = {
  header: {
    block_1: { spanX: 4, spanY: 1 },
    block_2: { spanX: 2, spanY: 1 },
    block_3: { spanX: 3, spanY: 1 }
  },
  main: {
    block_4: { spanX: 8, spanY: 6 },
    block_5: { spanX: 4, spanY: 6 }
  },
  footer: {
    block_6: { spanX: 6, spanY: 1 },
    block_7: { spanX: 6, spanY: 1 }
  }
} as const satisfies Layout;

const defaultTheme = getDefaultTheme(exampleLayout);

// Example 2: Using default grid node view options
const basicNodeOptions = resolveGridNodeViewOptions();
const customNodeOptions = resolveGridNodeViewOptions({
  justifySelf: 'center',
  zIndex: 100,
  dataAttrs: { 'data-testid': 'grid-item' }
});

const accessibleNodeOptions = resolveGridNodeViewOptions({
  aria: { role: 'button', label: 'Click me' },
  visibility: 'visible'
});

// Example 3: Using default grid options
const defaultGridConfig = resolveGridOptions();
const spacedGridConfig = resolveGridOptions({
  gap: { value: 20, unit: 'px' },
  justifyContent: 'center'
});

const responsiveGridConfig = resolveGridOptions({
  implicitColumnUnits: { value: 300, unit: 'px' },
  autoFlow: 'column'
});

// Example 4: Theme method usage with correct block IDs
// Resolve box spans for different breakpoints
const mobileNavBox = defaultTheme.resolveBoxSpan('header', 'block_1', exampleLayout, { spanX: 4, spanY: 1 }, 'xs');
const desktopNavBox = defaultTheme.resolveBoxSpan('header', 'block_1', exampleLayout, { spanX: 4, spanY: 1 }, 'lg');

// Get section transformations
const headerTransforms = defaultTheme.sectionBoxTransforms('header', exampleLayout);
const mainTransforms = defaultTheme.sectionBoxTransforms('main', exampleLayout);

// Get layout transformations
const layoutTransforms = defaultTheme.layoutTransforms(exampleLayout);

// Example 5: Custom theme based on defaults with correct GridBox usage
const customTheme = getDefaultTheme(exampleLayout);
// Override specific methods while keeping defaults for others
const enhancedTheme = {
  ...customTheme,
  resolveBoxSpan: <S extends SectionsIDSFromLayout<typeof exampleLayout>>(
    section: S,
    boxId: BlockIDSFromSectionAndLayout<typeof exampleLayout, S>,
    layout: typeof exampleLayout,
    span: BoxSpan,
    bp: (typeof BREAKPOINTS)[number]
  ) => {
    // Custom logic: add padding to all boxes by modifying the diagonal
    const baseBox = customTheme.resolveBoxSpan(section, boxId, layout, span, bp);
    return makeGridBox(
      { x: baseBox.origin.x + 10, y: baseBox.origin.y + 10 },
      { x: Math.max(baseBox.diagonal.x - 20, 50), y: Math.max(baseBox.diagonal.y - 20, 30) }
    );
  },
  gridOptions: resolveGridOptions({
    gap: { value: 16, unit: 'px' },
    justifyContent: 'center'
  })
};

// Example 6: Using transformation constants directly
const customRowTransforms = {
  ...DefaultTransformationsResponsiveRows,
  xs: [{ stackVertically: { gap: 10 } }],
  md: [{ stackHorizontally: { gap: 20 } }]
} as const satisfies BoxTransformations<NodeID>;

const customColumnTransforms = {
  ...DefaultTransformationsResponsiveColumns,
  xs: [{ stackVertically: { gap: 15 } }],
  lg: [{ stackVertically: { gap: 30 } }]
} as const satisfies BoxTransformations<NodeID>;
