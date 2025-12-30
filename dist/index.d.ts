import { C as Coordinate, L as LayoutWithTx, S as SectionIDs, B as BlocksIDs, D as DiagnosticEntry, a as BREAKPOINTS, b as LayoutAbsolute, c as SectionsInLayoutWithTx, d as BlocksInLayoutWithTx, e as Layout, f as SectionsIDSFromLayout, g as BlockIDSFromSectionAndLayout, h as BoxSpan, G as GridBox } from './GridCssMuiRenderer-DXP7Idyx.js';
export { s as BPs, n as BoxMoveToProps, l as BoxMovesFunctions, m as BoxMovesProps, k as BoxTransformations, o as CSSCoordinates, t as GRID_ERROR_CODE, y as GridCssMuiRendererProps, q as GridNodeViewOptions, p as GridOptions, i as LayoutSectionBounds, j as LayoutSectionLocal, r as NodeID, N as NodeRenderConfig, T as TransformationIDs, w as gapValueToString, x as gridUnitValueToString, u as makeError, v as makeWarning } from './GridCssMuiRenderer-DXP7Idyx.js';
import 'react/jsx-runtime';

/**
 * @fileoverview Coordinate algebra operations for 2D vector mathematics.
 * Provides essential mathematical operations for coordinate manipulation and transformations.
 * @module CoordinateAlgebra
 */

/**
 * Adds two coordinates together (vector addition).
 * Combines the x and y components separately.
 *
 * @param a - First coordinate
 * @param b - Second coordinate
 * @returns The sum of the coordinates
 *
 * @example
 * ```typescript
 * const pointA: Coordinate = { x: 2, y: 3 };
 * const offset: Coordinate = { x: 5, y: -1 };
 *
 * const result = addCoordinates(pointA, offset);  // { x: 7, y: 2 }
 *
 * // Chain multiple additions
 * const final = addCoordinates(
 *   addCoordinates(pointA, offset),
 *   { x: 1, y: 1 }
 * );  // { x: 8, y: 3 }
 * ```
 */
declare const addCoordinates: (a: Coordinate, b: Coordinate) => Coordinate;
/**
 * Subtracts the second coordinate from the first (vector subtraction).
 * Computes a - b by subtracting corresponding components.
 *
 * @param a - The coordinate to subtract from
 * @param b - The coordinate to subtract
 * @returns The difference a - b
 *
 * @example
 * ```typescript
 * const endPoint: Coordinate = { x: 10, y: 8 };
 * const startPoint: Coordinate = { x: 3, y: 2 };
 *
 * const displacement = subtractCoordinates(endPoint, startPoint);  // { x: 7, y: 6 }
 *
 * // Calculate distance vector
 * const from: Coordinate = { x: 1, y: 1 };
 * const to: Coordinate = { x: 4, y: 5 };
 * const vector = subtractCoordinates(to, from);  // { x: 3, y: 4 }
 * ```
 */
declare const subtractCoordinates: (a: Coordinate, b: Coordinate) => Coordinate;

/**
 * CSS Layout Generator
 *
 * This module orchestrates the complete transformation pipeline from layout definitions
 * with transformations to final CSS Grid coordinates. It coordinates multiple transformation
 * phases and provides optional overlap detection and validation.
 *
 * Main pipeline:
 * 1. Convert layout transformations to local section coordinates
 * 2. Calculate bounding boxes for each section
 * 3. Transform to absolute CSS Grid coordinates
 * 4. Optionally validate for overlapping elements
 *
 * Features:
 * - Multi-breakpoint responsive layout support
 * - Configurable overlap detection (allow/warn/error)
 * - Comprehensive diagnostic reporting
 * - Type-safe section and block ID handling
 */

/**
 * Configuration for grid validation and diagnostic behavior
 *
 * @property overlapPolicy - How to handle overlapping boxes:
 *   - "allow": No overlap checking (default)
 *   - "warn": Check and report warnings for overlaps
 *   - "error": Check and report errors for overlaps
 * @property breakpoints - Which breakpoints to validate (defaults to all)
 */
type GridDiagnostic = {
    overlapPolicy?: "allow" | "warn" | "error";
    breakpoints?: readonly (typeof BREAKPOINTS)[number][];
};
/**
 * Props for the main CSSLayout function
 *
 * @template L - Layout type extending LayoutWithTx
 * @property layoutWithTx - Input layout with transformation configurations
 * @property diagnostics - Array to collect errors and warnings
 * @property gridDiagnostic - Optional validation configuration
 */
type CSSLayoutProps<L extends LayoutWithTx<SectionIDs, BlocksIDs>> = {
    layoutWithTx: L;
    diagnostics: DiagnosticEntry[];
    gridDiagnostic?: GridDiagnostic;
};
/**
 * Main CSS Layout transformation function
 *
 * Orchestrates the complete pipeline to transform a layout with transformations
 * into final CSS Grid coordinates. This is the primary entry point for the
 * layout transformation system.
 *
 * Transformation Pipeline:
 * 1. layoutTxToSectionLocal - Applies transformations and converts to local coordinates
 * 2. layoutSectionToBounds - Calculates bounding boxes for each section
 * 3. layoutSectionBtoAbsolute - Converts to absolute CSS Grid coordinates
 * 4. checkSectionsOverlap - Optionally validates for overlapping elements
 *
 * @template L - Layout type that extends LayoutWithTx
 * @param props - Configuration object containing layout, diagnostics, and validation options
 * @returns Layout with absolute CSS Grid coordinates for all sections and boxes
 */
declare function CSSLayout<L extends LayoutWithTx<any, any>>({ layoutWithTx, diagnostics, gridDiagnostic, }: CSSLayoutProps<L>): LayoutAbsolute<SectionsInLayoutWithTx<L>, BlocksInLayoutWithTx<L>>;

/**
 * @fileoverview Default layout theme implementation for CSS Grid layout system.
 * Provides a complete, production-ready theme with sensible defaults for all layout scenarios.
 * This theme serves as both a working implementation and a reference for creating custom themes.
 * @module DefaultLayoutTheme
 */

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
declare const getDefaultTheme: <L extends Layout>(layout: L) => {
    resolveBoxSpan: <S extends SectionsIDSFromLayout<L>>(section: S, boxId: BlockIDSFromSectionAndLayout<L, S>, layout: L, span: BoxSpan, bp: (typeof BREAKPOINTS)[number]) => GridBox;
    sectionBoxTransforms: <S extends SectionsIDSFromLayout<L>>(section: S, layout: L) => {
        readonly xs: [{
            readonly stackVertically: {};
        }];
        readonly sm: [{
            readonly stackHorizontally: {};
        }];
        readonly md: [{
            readonly stackHorizontally: {};
        }];
        readonly lg: [{
            readonly stackHorizontally: {};
        }];
        readonly xl: [{
            readonly stackHorizontally: {};
        }];
    };
    layoutTransforms: (layout: L) => {
        readonly xs: [{
            readonly stackVertically: {};
        }];
        readonly sm: [{
            readonly stackVertically: {};
        }];
        readonly md: [{
            readonly stackVertically: {};
        }];
        readonly lg: [{
            readonly stackVertically: {};
        }];
        readonly xl: [{
            readonly stackVertically: {};
        }];
    };
    gridNodeOptions: {
        minWidth0: true;
        minHeight0: true;
        justifySelf: "stretch";
        alignSelf: "stretch";
        pointerEvents: "auto";
        dataAttrs: {};
        aria: {};
        visibility: "visible";
    };
    gridOptions: {
        implicitRowUnits: {
            readonly value: 1;
            readonly unit: "fr";
        };
        implicitColumnUnits: {
            readonly value: 1;
            readonly unit: "fr";
        };
        overflow: "visible";
        autoFlow: "row";
        justifyItems: "stretch";
        alignItems: "stretch";
        justifyContent: "start";
        alignContent: "start";
        gap: {
            readonly value: 0;
            readonly unit: "px";
        };
        rowGap: {
            readonly value: 0;
            readonly unit: "px";
        };
        columnGap: {
            readonly value: 0;
            readonly unit: "px";
        };
    };
};

/**
 * @fileoverview Utility functions for type-safe object operations.
 * Provides type-safe alternatives to common JavaScript object operations.
 * @module Utils
 */
/**
 * Returns the keys of an object with proper type safety.
 * Provides a type-safe alternative to Object.keys() that preserves key types.
 *
 * @template T - The object type
 * @param obj - The object to extract keys from
 * @returns Array of keys with proper typing
 *
 * @example
 * ```typescript
 * const config = {
 *   width: 100,
 *   height: 200,
 *   visible: true
 * } as const;
 *
 * // Type-safe keys
 * const keys = typedKeys(config); // Array<"width" | "height" | "visible">
 *
 * // Compare with Object.keys() which returns string[]
 * const unsafeKeys = Object.keys(config); // string[]
 *
 * // Usage in loops
 * typedKeys(config).forEach(key => {
 *   console.log(config[key]); // TypeScript knows the correct type
 * });
 * ```
 */
declare function typedKeys<T extends object>(obj: T): Array<keyof T>;

export { BREAKPOINTS, BlocksIDs, BlocksInLayoutWithTx, CSSLayout, Coordinate, DiagnosticEntry, GridBox, Layout, LayoutAbsolute, LayoutWithTx, SectionIDs, SectionsInLayoutWithTx, addCoordinates, getDefaultTheme, subtractCoordinates, typedKeys };
