import * as react_jsx_runtime from 'react/jsx-runtime';
import { Theme } from '@mui/material/styles';
import { SystemStyleObject } from '@mui/system';
import React$1 from 'react';

/**
 * @fileoverview Core coordinate system types for 2D geometry operations.
 * Provides fundamental types for representing points and transformations in 2D space.
 * @module CoordinateTypes
 */
/**
 * Represents a point or vector in 2D coordinate space.
 *
 * @example
 * ```typescript
 * // Point coordinates
 * const origin: Coordinate = { x: 0, y: 0 };
 * const topRight: Coordinate = { x: 100, y: 50 };
 *
 * // Vector operations
 * const offset: Coordinate = { x: 10, y: -5 };
 * const newPosition: Coordinate = {
 *   x: origin.x + offset.x,  // 10
 *   y: origin.y + offset.y   // -5
 * };
 *
 * // Grid positioning
 * const gridCell: Coordinate = { x: 2, y: 3 }; // Column 2, Row 3
 * ```
 */
type Coordinate = {
    x: number;
    y: number;
};
/**
 * Function type for transforming coordinates from one space to another.
 * Takes a coordinate and returns a transformed coordinate.
 *
 * @param v - The input coordinate to transform
 * @returns The transformed coordinate
 *
 * @example
 * ```typescript
 * // Translation transformation
 * const translate: CoordinateTransformation = (v) => ({
 *   x: v.x + 10,
 *   y: v.y + 20
 * });
 *
 * // Scaling transformation
 * const scale: CoordinateTransformation = (v) => ({
 *   x: v.x * 2,
 *   y: v.y * 2
 * });
 *
 * // Rotation transformation (90 degrees)
 * const rotate90: CoordinateTransformation = (v) => ({
 *   x: -v.y,
 *   y: v.x
 * });
 *
 * // Usage
 * const point: Coordinate = { x: 5, y: 10 };
 * const translated = translate(point);     // { x: 15, y: 30 }
 * const scaled = scale(point);            // { x: 10, y: 20 }
 * const rotated = rotate90(point);        // { x: -10, y: 5 }
 * ```
 */
type CoordinateTransformation = (v: Coordinate) => Coordinate;

/**
 * A normalized rectangular box in an abstract local grid.
 *
 * @remarks
 * - `GridBox` is purely geometric and lives in a local reference system shared
 *   with other boxes; it is not tied to any CSS or pixel space.
 * - `origin` is the bottom-left corner of the box in that local coordinate system.
 * - `diagonal` is a vector (extent) from `origin` to the opposite corner, not the
 *   absolute position of that corner.
 * - The box is considered “normalized” if its `diagonal` components are
 *   non-negative; this is tracked by the `_normalized` brand.
 */
type GridBox = {
    /**
     * Bottom-left corner of the box in local coordinates.
     * Interpreted as a position, not a size.
     */
    origin: Coordinate;
    /**
     * Non-negative extent of the box from `origin` to the opposite corner.
     *
     * @remarks
     * - Interpreted as a width/height vector: the opposite corner can be
     *   derived as `origin + diagonal` (component-wise).
     * - After normalization, both `diagonal.x` and `diagonal.y` are ≥ 0.
     */
    diagonal: Coordinate;
    /**
     * Brand tag indicating that this box has been created or normalized
     * by a trusted constructor (such as {@link makeGridBox}) and satisfies
     * the `GridBox` invariants.
     */
    readonly _normalized: 'GridBox';
};
/**
 * Named reference points on a {@link GridBox}.
 *
 * @remarks
 * These anchors are defined in the same abstract local coordinate system as
 * the box itself and are derived from the box's `origin` (bottom-left corner)
 * and `diagonal` (extent vector):
 *
 * - `bottomLeft`  – the box's origin.
 * - `bottomRight` – the point horizontally at `origin.x + diagonal.x` and
 *   vertically at `origin.y`.
 * - `topLeft`     – the point horizontally at `origin.x` and vertically at
 *   `origin.y + diagonal.y`.
 * - `topRight`    – the point at `origin + diagonal` (component-wise).
 * - `center`      – the point at the geometric center of the box, i.e.
 *   `origin + diagonal / 2` (component-wise).
 */
type Anchor = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'center';
/**
 * Function signature for computing the position of an anchor point on a
 * {@link GridBox}.
 *
 * @remarks
 * - The returned coordinate is expressed in the same abstract local reference
 *   system as the `GridBox`.
 * - Implementations may return `undefined` for degenerate boxes (e.g. zero
 *   width or height) or for anchors that cannot be computed under specific
 *   policies.
 *
 * @param box - The target {@link GridBox} whose anchor position should be computed.
 * @param boxAnchor - The anchor on the box to locate.
 * @returns The coordinate of the requested anchor in local space, or
 * `undefined` if the position cannot be determined.
 */
type GridBoxPointPosition = (box: GridBox, boxAnchor: Anchor) => Coordinate | undefined;

/**
 * @fileoverview Layout identifier types for CSS Grid layout system.
 * Defines standardized naming conventions for layout sections, blocks, and elements.
 * @module LayoutIDs
 */
/**
 * Numeric range type for generating numbered identifiers.
 * Constrains numbers to 1-10 range for consistent naming patterns.
 * Used as suffixes in template literal types for creating numbered IDs.
 */
type nb = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
/**
 * Row identifiers for grid layout systems.
 * Generates numbered row identifiers from `row_1` to `row_10`.
 * Used for organizing content into horizontal sections.
 *
 * @example
 * ```typescript
 * const firstRow: Rows = "row_1";
 * const lastRow: Rows = "row_10";
 * ```
 */
type Rows = `row_${nb}`;
/**
 * Section identifiers for major layout areas.
 * Defines semantic names for common website sections plus numbered alternatives.
 * Combines semantic section names with numbered sections and rows for flexibility.
 *
 * Includes:
 * - Common semantic sections: header, nav, main, aside, content, footer
 * - Marketing sections: hero, banner, cta (call-to-action)
 * - Generic sections: sidebar
 * - Numbered sections: section_1 through section_10
 * - Row sections: row_1 through row_10
 *
 * @example
 * ```typescript
 * const headerSection: SectionIDs = "header";
 * const customSection: SectionIDs = "section_5";
 * const topRow: SectionIDs = "row_1";
 * ```
 */
type SectionIDs = `header` | 'nav' | 'main' | 'aside' | 'content' | 'footer' | 'hero' | 'banner' | 'sidebar' | 'cta' | `section_${nb}` | Rows;
/**
 * Card identifiers for card-based layout components.
 * Generates numbered card identifiers from `card_1` to `card_10`.
 * Used for organizing repeating content elements like product cards, articles, etc.
 *
 * @example
 * ```typescript
 * const firstCard: Cards = "card_1";
 * const productCard: Cards = "card_3";
 * ```
 */
type Cards = `card_${nb}`;
/**
 * Block identifiers for layout building blocks.
 * Generates numbered block identifiers from `block_1` to `block_10`.
 * Used for organizing content within sections into discrete blocks.
 *
 * @example
 * ```typescript
 * const mainBlock: BlocksIDs = "block_1";
 * const sidebarBlock: BlocksIDs = "block_2";
 * ```
 */
type BlocksIDs = `block_${nb}`;
/**
 * Union type of all possible node identifiers in the layout system.
 * Combines all section, card, and block identifiers into a single type.
 * This is the primary identifier type used throughout the layout system
 * for referencing any element in the grid.
 *
 * @example
 * ```typescript
 * const headerNode: NodeID = "header";
 * const cardNode: NodeID = "card_1";
 * const blockNode: NodeID = "block_1";
 *
 * // Use in functions that work with any layout element
 * function processNode(nodeId: NodeID) {
 *   // Handle any type of layout node
 * }
 * ```
 */
type NodeID = SectionIDs | Cards | BlocksIDs;

/**
 * @fileoverview Grid error handling and diagnostic system.
 * Provides types and utilities for error reporting, validation, and debugging in the grid layout system.
 * @module GridErrorShape
 */

/**
 * Severity levels for diagnostic messages.
 *
 * @example
 * ```typescript
 * // 1) Severity
 * const errorLevel: DiagnosticSeverity = 'error';
 * const warningLevel: DiagnosticSeverity = 'warning';
 * ```
 */
type DiagnosticSeverity = 'error' | 'warning' | 'info';
/**
 * Origin sources for diagnostic messages indicating where in the system an issue occurred.
 *
 * @example
 * ```typescript
 * // 2) Where the diagnostic comes from (high-level, not per-function)
 * const layoutOrigin: DiagnosticOrigin = 'CSSLayout';
 * const rendererOrigin: DiagnosticOrigin = 'GridCssMuiRenderer';
 * const transformOrigin: DiagnosticOrigin = 'transformBoxMove';
 * ```
 */
type DiagnosticOrigin = AllBoxMovesProps<any> | 'transformBoxMove' | 'layoutSectionToBounds' | 'layoutSectionBtoAbsolute' | 'CSSLayout' | 'GridCssMuiRenderer' | 'layoutToTx';
declare const gridErrorCodeBrand: unique symbol;
type GridErrorCodeBrand = {
    readonly [gridErrorCodeBrand]: true;
};
/**
 * Branded string type for grid error codes to ensure type safety.
 *
 * @example
 * ```typescript
 * // 3) Canonical error codes (SCREAMING_SNAKE_CASE)
 * //    Use these constants everywhere instead of string literals.
 * const errorCode: GridErrorCode = GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED;
 * ```
 */
type GridErrorCode = string & GridErrorCodeBrand;
/**
 * Canonical error code constants for the grid layout system.
 * Use these constants instead of string literals for type safety and consistency.
 *
 * @example
 * ```typescript
 * // Core grid issues
 * GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED
 *
 * // Transformation issues
 * GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS
 *
 * // Runtime layout issues
 * GRID_ERROR_CODE.MISSING_COORDINATES
 * ```
 */
declare const GRID_ERROR_CODE: {
    readonly OVERLAP_NOT_ALLOWED: GridErrorCode;
    readonly INVALID_TRANSFORMATION_PARAMS: GridErrorCode;
    readonly NO_BOXES_PROCESSED: GridErrorCode;
    readonly NO_SECTION_ID: GridErrorCode;
    readonly BOX_SHAPE_MISSING_BP: GridErrorCode;
    readonly UNKNOWN_TRANSFORMATION: GridErrorCode;
    readonly EMPTY_GRID: GridErrorCode;
    readonly GRID_NORMALIZED_TO_POSITIVE_LINES: GridErrorCode;
    readonly MISSING_COORDINATES: GridErrorCode;
    readonly SECTION_SHAPES_MISSING_BP: GridErrorCode;
    readonly UNKNOWN_NODE_ID: GridErrorCode;
    readonly UNKNOWN_ANCHOR: GridErrorCode;
    readonly BOX_SPAN_MISSING: GridErrorCode;
    readonly MISSING_BOX: GridErrorCode;
    readonly CONSTRAINT_VIOLATION: GridErrorCode;
};
/**
 * A single issue payload containing error details.
 *
 * @example
 * ```typescript
 * // 4) A single "issue" payload
 * const issue: GridIssue = {
 *   code: GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
 *   message: 'Boxes are overlapping without z-index',
 *   elementId: 'header',
 *   details: { coordinates: { x: 0, y: 0 } }
 * };
 * ```
 */
type GridIssue = {
    code: GridErrorCode;
    message: string;
    elementId?: NodeID;
    details?: unknown;
};
/**
 * Unified diagnostic entry combining severity, origin, and issue details.
 *
 * @example
 * ```typescript
 * // 5) Unified diagnostic entry
 * const diagnostic: DiagnosticEntry = {
 *   severity: 'error',
 *   origin: 'CSSLayout',
 *   issue: {
 *     code: GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
 *     message: 'Grid overlap detected'
 *   }
 * };
 * ```
 */
type DiagnosticEntry = {
    readonly severity: DiagnosticSeverity;
    readonly origin: DiagnosticOrigin;
    readonly issue: GridIssue;
};
/**
 * Helper constructors for creating diagnostic entries without repeating object shape.
 *
 * @example
 * ```typescript
 * // 6) Helper constructors (so you don't repeat the object shape everywhere)
 * const extras: IssueExtras = {
 *   elementId: 'sidebar',
 *   details: { bounds: { width: 100, height: 200 } }
 * };
 * ```
 */
type IssueExtras = Omit<GridIssue, 'code' | 'message'>;
/**
 * Creates a diagnostic entry with specified severity, origin, and issue details.
 *
 * @param severity - The severity level of the diagnostic
 * @param origin - The origin/source of the diagnostic
 * @param code - The error code
 * @param message - The error message
 * @param extras - Additional issue details
 * @returns A complete diagnostic entry
 *
 * @example
 * ```typescript
 * const diagnostic = makeDiagnostic(
 *   'error',
 *   'CSSLayout',
 *   GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
 *   'Grid boxes overlap detected'
 * );
 * ```
 */
declare function makeDiagnostic(severity: DiagnosticSeverity, origin: DiagnosticOrigin, code: GridErrorCode, message: string, extras?: IssueExtras): DiagnosticEntry;
/**
 * Creates an error-level diagnostic entry.
 *
 * @param origin - The origin/source of the error
 * @param code - The error code
 * @param message - The error message
 * @param extras - Additional issue details
 * @returns A diagnostic entry with 'error' severity
 *
 * @example
 * ```typescript
 * const errorDiagnostic = makeError(
 *   'GridCssMuiRenderer',
 *   GRID_ERROR_CODE.MISSING_COORDINATES,
 *   'Required coordinates are missing'
 * );
 * ```
 */
declare function makeError(origin: DiagnosticOrigin, code: GridErrorCode, message: string, extras?: IssueExtras): DiagnosticEntry;
/**
 * Creates a warning-level diagnostic entry.
 *
 * @param origin - The origin/source of the warning
 * @param code - The error code
 * @param message - The warning message
 * @param extras - Additional issue details
 * @returns A diagnostic entry with 'warning' severity
 *
 * @example
 * ```typescript
 * const warningDiagnostic = makeWarning(
 *   'CSSLayout',
 *   GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
 *   'Grid overlap detected but allowed'
 * );
 * ```
 */
declare function makeWarning(origin: DiagnosticOrigin, code: GridErrorCode, message: string, extras?: IssueExtras): DiagnosticEntry;
/**
 * Creates an info-level diagnostic entry.
 *
 * @param origin - The origin/source of the info
 * @param code - The error code
 * @param message - The info message
 * @param extras - Additional issue details
 * @returns A diagnostic entry with 'info' severity
 *
 * @example
 * ```typescript
 * const infoDiagnostic = makeInfo(
 *   'layoutSectionBtoAbsolute',
 *   GRID_ERROR_CODE.GRID_NORMALIZED_TO_POSITIVE_LINES,
 *   'Grid coordinates normalized to positive values'
 * );
 * ```
 */
declare function makeInfo(origin: DiagnosticOrigin, code: GridErrorCode, message: string, extras?: IssueExtras): DiagnosticEntry;

/**
 * @fileoverview Box transformation properties and types for CSS Grid layout system.
 * Provides comprehensive type definitions for transforming boxes within layouts,
 * including movement, alignment, and stacking operations.
 * @module BoxTransformationsProps
 */

/**
 * Base properties for box transformations.
 * Defines the fundamental structure for identifying a box and its reference point.
 * The localIDs are the NodeIDs that can be used in box layouts.
 *
 * @template BoxIDFrom - The type of box identifier that can be transformed
 *
 * @example
 * ```typescript
 * const baseProps: BoxPropBase<'block_1'> = {
 *   boxId: 'block_1',
 *   anchor: 'topLeft'
 * };
 * ```
 */
type BoxPropBase<BoxIDFrom extends NodeID> = {
    /** The identifier of the box to transform */
    boxId: BoxIDFrom;
    /** The anchor point on the box to use as reference for transformations */
    anchor: Anchor;
};
/**
 * Properties for moving a box to a specific position.
 * Enables moving a box from its current position to either absolute coordinates
 * or relative to another box's anchor point.
 *
 * @template BoxID - The type of box identifier that can be moved
 *
 * @example
 * ```typescript
 * // Move to absolute coordinates
 * const moveToAbsolute: BoxMoveToProps<'aside'> = {
 *   from: { boxId: 'aside', anchor: 'center' },
 *   to: { x: 100, y: 200 },
 *   gap: { x: 10, y: 5 }
 * };
 *
 * // Move to another box's position
 * const moveToBox: BoxMoveToProps<'aside' | 'block_1'> = {
 *   from: { boxId: 'aside', anchor: 'center' },
 *   to: { boxId: 'block_1', anchor: 'topLeft' }
 * };
 * ```
 */
type BoxMoveToProps<BoxID extends NodeID> = {
    /** The source box and its reference anchor */
    from: BoxPropBase<BoxID>;
    /** Target position - either absolute coordinates or another box's anchor */
    to: Coordinate | BoxPropBase<BoxID>;
    /** Optional gap to maintain from the target position */
    gap?: Coordinate;
};
/**
 * Properties for moving a box by a relative amount.
 * Enables translating a box from its current position by specified offsets.
 * Note: anchor is omitted as the movement is relative to the entire box.
 *
 * @template BoxIDFrom - The type of box identifier that can be moved
 *
 * @example
 * ```typescript
 * // Move by coordinate offset
 * const moveByCoord: BoxMoveByProps<'aside'> = {
 *   from: { boxId: 'aside' },
 *   by: { x: 100, y: 200 },
 *   gap: { x: 5, y: 5 }
 * };
 *
 * // Move by uniform amount
 * const moveByUniform: BoxMoveByProps<'block_1'> = {
 *   from: { boxId: 'block_1' },
 *   by: 50
 * };
 * ```
 */
type BoxMoveByProps<BoxIDFrom extends NodeID> = {
    /** The source box (anchor not needed for relative movement) */
    from: Omit<BoxPropBase<BoxIDFrom>, "anchor">;
    /** Movement offset - either coordinate object or uniform number */
    by: Coordinate | number;
    /** Optional gap to add to the movement */
    gap?: Coordinate;
};
/**
 * Properties for aligning a box to a specific Y-coordinate or another box's Y-position.
 * Enables vertical alignment operations within the layout.
 *
 * @template BoxID - The type of box identifier that can be aligned
 *
 * @example
 * ```typescript
 * // Align to absolute Y position
 * const alignToY: BoxAlignYProps<'block_4'> = {
 *   from: { boxId: 'block_4', anchor: 'bottomLeft' },
 *   to: 300,
 *   gap: 10
 * };
 *
 * // Align to another box's Y position
 * const alignToBoxY: BoxAlignYProps<'block_1' | 'block_2'> = {
 *   from: { boxId: 'block_1', anchor: 'center' },
 *   to: { boxId: 'block_2', anchor: 'topLeft' }
 * };
 * ```
 */
type BoxAlignYProps<BoxID extends NodeID> = {
    /** The source box and its reference anchor */
    from: BoxPropBase<BoxID>;
    /** Target Y position - either absolute number or another box's anchor */
    to: number | BoxPropBase<BoxID>;
    /** Optional gap to maintain from the target Y position */
    gap?: number;
};
/**
 * Properties for aligning a box to a specific X-coordinate or another box's X-position.
 * Enables horizontal alignment operations within the layout.
 *
 * @template BoxID - The type of box identifier that can be aligned
 *
 * @example
 * ```typescript
 * // Align to absolute X position
 * const alignToX: BoxAlignXProps<'sidebar'> = {
 *   from: { boxId: 'sidebar', anchor: 'topLeft' },
 *   to: 150,
 *   gap: 20
 * };
 *
 * // Align to another box's X position
 * const alignToBoxX: BoxAlignXProps<'nav' | 'header'> = {
 *   from: { boxId: 'nav', anchor: 'topRight' },
 *   to: { boxId: 'header', anchor: 'topRight' }
 * };
 * ```
 */
type BoxAlignXProps<BoxID extends NodeID> = {
    /** The source box and its reference anchor */
    from: BoxPropBase<BoxID>;
    /** Target X position - either absolute number or another box's anchor */
    to: number | BoxPropBase<BoxID>;
    /** Optional gap to maintain from the target X position */
    gap?: number;
};
/**
 * Union type of all possible box transformation properties.
 * Enables type-safe handling of any individual box transformation operation.
 *
 * @template BoxID - The type of box identifier that can be transformed
 *
 * @example
 * ```typescript
 * const transforms: BoxProps<'block_1' | 'aside'>[] = [
 *   { from: { boxId: 'aside', anchor: 'center' }, to: { x: 100, y: 200 } },
 *   { from: { boxId: 'block_1' }, by: 50 },
 *   { from: { boxId: 'aside', anchor: 'top' }, to: 300, gap: 10 }
 * ];
 * ```
 */
type BoxProps<BoxID extends NodeID> = BoxMoveToProps<BoxID> | BoxMoveByProps<BoxID> | BoxAlignYProps<BoxID> | BoxAlignXProps<BoxID>;
/**
 * Comprehensive database of all possible box transformation operations.
 * Maps transformation names to their corresponding property types.
 * Ensures all transformation IDs correspond to meaningful transformation properties.
 *
 * @template BoxID - The type of box identifier that can be transformed
 *
 * @example
 * ```typescript
 * // Individual transformation examples
 * const moveTransform: BoxMovesPropsObject<'block_1'>['moveTo'] = {
 *   from: { boxId: 'block_1', anchor: 'center' },
 *   to: { x: 100, y: 200 }
 * };
 *
 * const stackTransform: BoxMovesPropsObject<'block_1'>['stackVertically'] = {
 *   gap: 20
 * };
 *
 * const alignAllTransform: BoxMovesPropsObject<'block_1'>['alignAllToX'] = {
 *   to: 150,
 *   anchor: 'left'
 * };
 * ```
 */
type BoxMovesPropsObject<BoxID extends NodeID> = {
    /** Move a box to a specific position or another box's anchor */
    moveTo: BoxMoveToProps<BoxID>;
    /** Move a box by a relative amount */
    moveBy: BoxMoveByProps<BoxID>;
    /** Align a box to a specific Y-coordinate or another box's Y-position */
    alignToY: BoxAlignYProps<BoxID>;
    /** Align a box to a specific X-coordinate or another box's X-position */
    alignToX: BoxAlignXProps<BoxID>;
    /** Align all boxes to the same Y-coordinate using specified anchor */
    alignAllToY: {
        to: number;
        anchor: Anchor;
    };
    /** Align all boxes to the same X-coordinate using specified anchor */
    alignAllToX: {
        to: number;
        anchor: Anchor;
    };
    /** Stack all boxes vertically with optional gap */
    stackVertically: {
        gap?: number;
    };
    /** Stack all boxes horizontally with optional gap */
    stackHorizontally: {
        gap?: number;
    };
};
/**
 * Extract transformation IDs from the box transformations object.
 * Provides type-safe access to all available transformation names.
 *
 * @template BoxID - The type of box identifier
 */
type TransformationIDs<BoxID extends NodeID> = keyof BoxMovesPropsObject<BoxID>;
/**
 * Constant array of all available transformation IDs.
 * Ensures compile-time verification that all transformations are accounted for.
 *
 * @example
 * ```typescript
 * // Iterate through all available transformations
 * transformationIDs.forEach(id => {
 *   console.log(`Available transformation: ${id}`);
 * });
 * ```
 */
declare const transformationIDs: readonly ["moveTo", "moveBy", "alignToY", "alignToX", "alignAllToY", "alignAllToX", "stackVertically", "stackHorizontally"];
/**
 * Discriminated union type for box transformation properties.
 * Enables type-safe handling of transformations where each transformation
 * is identified by its unique key and contains the corresponding properties.
 *
 * @template BoxID - The type of box identifier that can be transformed
 *
 * @example
 * ```typescript
 * const transformations: Array<BoxMovesProps<'block_1' | 'aside'>> = [
 *   {
 *     moveTo: {
 *       from: { boxId: 'aside', anchor: 'center' },
 *       to: { boxId: 'block_1', anchor: 'topLeft' }
 *     }
 *   },
 *   {
 *     moveBy: {
 *       from: { boxId: 'aside' },
 *       by: { x: 100, y: 200 }
 *     }
 *   },
 *   {
 *     stackVertically: { gap: 20 }
 *   }
 * ];
 * ```
 */
type BoxMovesProps<BoxID extends NodeID> = {
    [M in keyof BoxMovesPropsObject<any>]: {
        [K in M]: BoxMovesPropsObject<BoxID>[M];
    };
}[keyof BoxMovesPropsObject<any>];
/**
 * Union type of all possible box transformation identifiers.
 * Provides access to the keys of all available transformations.
 *
 * @template BoxID - The type of box identifier that can be transformed
 */
type AllBoxMovesProps<BoxID extends NodeID> = keyof BoxMovesPropsObject<BoxID>;
/**
 * Properties that transformation functions will receive.
 * Defines the input structure for each transformation implementation,
 * including the transformation properties, current box state, and diagnostics.
 *
 * @template BoxID - The type of box identifier that can be transformed
 *
 * @example
 * ```typescript
 * // Function props for moveTo transformation
 * const moveToProps: BoxMovesFunctionsProps<'block_1'>['moveTo'] = {
 *   boxprops: {
 *     from: { boxId: 'block_1', anchor: 'center' },
 *     to: { x: 100, y: 200 }
 *   },
 *   boxes: {
 *     'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 4 }, _normalized: 'GridBox' }
 *   },
 *   diagnostics: []
 * };
 * ```
 */
type BoxMovesFunctionsProps<BoxID extends NodeID> = {
    [M in keyof BoxMovesPropsObject<any>]: {
        /** The specific transformation properties */
        boxprops: BoxMovesPropsObject<BoxID>[M];
        /** Current state of all boxes in the layout */
        boxes: Partial<Record<NodeID, GridBox>>;
        /** Array for recording diagnostic information and errors */
        diagnostics: DiagnosticEntry[];
    };
};
/**
 * Function signatures for implementing box transformations.
 * Defines the expected signature for each transformation function,
 * ensuring consistent interfaces across all transformation implementations.
 *
 * Each function:
 * - Receives transformation properties, current boxes state, and diagnostics array
 * - Returns either a single transformed GridBox, undefined, or partial record of boxes
 * - May modify the diagnostics array to record errors or warnings
 * - Assumes in-place transformation of the boxes array
 *
 * @template BoxID - The type of box identifier that can be transformed
 *
 * @example
 * ```typescript
 * // Implementation example for moveTo function
 * const moveToImpl: BoxMovesFunctions<'block_1'>['moveTo'] = (props) => {
 *   const { boxprops, boxes, diagnostics } = props;
 *   const sourceBox = boxes[boxprops.from.boxId];
 *
 *   if (!sourceBox) {
 *     diagnostics.push({
 *       level: 'error',
 *       message: `Box ${boxprops.from.boxId} not found`
 *     });
 *     return undefined;
 *   }
 *
 *   // Transform the box...
 *   return transformedBox;
 * };
 * ```
 */
type BoxMovesFunctions<BoxID extends NodeID> = {
    [M in keyof BoxMovesPropsObject<any>]: (props: BoxMovesFunctionsProps<BoxID>[M]) => GridBox | undefined | Partial<Record<NodeID, GridBox>>;
};

/**
 * Standard responsive breakpoint names
 */
declare const BREAKPOINTS: readonly ["xs", "sm", "md", "lg", "xl"];
type Breakpoint = (typeof BREAKPOINTS)[number];
/**
 * Complete breakpoint record with all breakpoints required
 */
type BPs<T> = Record<Breakpoint, T>;
/**
 * Partial breakpoint record with only xs required
 */
type PartialBps<T> = {
    xs: T;
} & Partial<Record<Exclude<Breakpoint, 'xs'>, T>>;

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
type GridNodeLayoutFlags = {
    /** Whether this node can overlap with other nodes */
    allowOverlap?: boolean;
    /** Whether to constrain child elements within this node's bounds */
    constrainChildren?: boolean;
    /** Visibility state of the node */
    visibility?: "visible" | "hidden";
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
type CSSCoordinates = {
    /** Starting row line (1-based, inclusive) */
    gridRowStart: number;
    /** Starting column line (1-based, inclusive) */
    gridColumnStart: number;
    /** Ending row line (1-based, exclusive) */
    gridRowEnd: number;
    /** Ending column line (1-based, exclusive) */
    gridColumnEnd: number;
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
type CSSCoordinatesBPS = BPs<CSSCoordinates>;

/**
 * @fileoverview Grid node view configuration options for styling and behavior.
 * Provides comprehensive options for configuring individual grid node appearance and interaction.
 * @module NodeViewOptions
 */
/**
 * Configuration options for individual grid node view properties and behavior.
 * All properties are optional, allowing for flexible node-specific customization.
 *
 * @example
 * ```typescript
 * const nodeOptions: GridNodeViewOptions = {
 *   // Layering and positioning
 *   zIndex: 10,
 *   justifySelf: 'center',
 *   alignSelf: 'stretch',
 *
 *   // Size constraints
 *   minWidth0: true,   // Prevent min-width: auto overflow
 *   minHeight0: true,  // Prevent min-height: auto overflow
 *
 *   // Interaction
 *   pointerEvents: 'auto',
 *   visibility: 'visible',
 *
 *   // HTML attributes
 *   dataAttrs: {
 *     testid: 'grid-item',
 *     role: 'article'
 *   },
 *
 *   // Accessibility
 *   aria: {
 *     role: 'main',
 *     label: 'Primary content area',
 *     labelledBy: 'section-heading'
 *   }
 * };
 * ```
 */
type GridNodeViewOptions = Partial<{
    /** CSS z-index value for layering control */
    zIndex: number;
    /** Whether to set min-width: 0 to prevent overflow from content */
    minWidth0: boolean;
    /** Whether to set min-height: 0 to prevent overflow from content */
    minHeight0: boolean;
    /** CSS justify-self: Horizontal alignment within the grid area */
    justifySelf: 'start' | 'end' | 'center' | 'stretch';
    /** CSS align-self: Vertical alignment within the grid area */
    alignSelf: 'start' | 'end' | 'center' | 'stretch';
    /** CSS pointer-events: Whether the element can be the target of pointer events */
    pointerEvents: 'auto' | 'none';
    /** HTML data attributes to be applied to the element */
    dataAttrs: Record<string, string>;
    /** ARIA accessibility attributes for screen readers and assistive technology */
    aria: {
        /** ARIA role attribute */
        role?: string;
        /** ARIA label for accessibility */
        label?: string;
        /** ID of element that labels this element */
        labelledBy?: string;
        /** ID of element that describes this element */
        describedBy?: string;
    };
    /** Visibility state: visible, hidden, or visually hidden (accessible but not visible) */
    visibility: 'visible' | 'hidden' | 'visuallyHidden';
}>;

/**
 * @fileoverview Box layout type definitions for the CSS Grid layout system.
 * Provides comprehensive type safety for grid layouts, sections, blocks,
 *  and responsive transformations. The code examples in this file dont all compile. Please refer to the
 * examples in the end of the file for working examples.
 * @module BoxLayoutTypes
 */

/**
 * Defines the grid span dimensions for a box element.
 * Specifies how many grid columns and rows a box should occupy.
 *
 * @example
 * ```typescript
 * // A box that spans 2 columns and 3 rows
 * const largeBox: BoxSpan = { spanX: 2, spanY: 3 };
 *
 * // A single cell box
 * const singleBox: BoxSpan = { spanX: 1, spanY: 1 };
 *
 * // A horizontal banner (4 columns, 1 row)
 * const banner: BoxSpan = { spanX: 4, spanY: 1 };
 * ```
 */
type BoxSpan = {
    spanX: number;
    spanY: number;
};
/**
 * The basic layout structure of the design system.
 * Maps section IDs to their contained blocks with span configurations.
 * Uses partial records to allow flexible, incomplete layout definitions.
 *
 * @example
 * ```typescript
 * const layout: Layout = {
 *   header: {
 *     block_1: { spanX: 2, spanY: 1 },
 *     block_2: { spanX: 6, spanY: 1 }
 *   },
 *   main: {
 *     block_1: { spanX: 2, spanY: 4 },
 *     block_2: { spanX: 4, spanY: 4 }
 *   },
 *   footer: {
 *     block_1: { spanX: 8, spanY: 1 }
 *   }
 * };
 * ```
 */
type Layout<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = Partial<Record<sectionIDs, Partial<Record<blockIDs, BoxSpan>>>>;
/**
 * Box transformations configuration across breakpoints.
 * Defines all possible transformations that can be applied to boxes in the layout.
 * Each breakpoint can have multiple transformation operations applied in sequence.
 *
 * @template BoxId - The type of box identifiers that can be transformed
 *
 * @example
 * ```typescript
 * const transformations: BoxTransformations<'block_1' | 'block_2'> = {
 *   xs: [
 *     { moveTo: { from: { boxId: 'block_1', anchor: 'bottomLeft' }, to: { x: 1, y: 1 } } },
 *     { moveBy: { from: { boxId: 'block_2' }, by: { x: 10, y: 20 } } }
 *   ],
 *   md: [
 *     { moveTo: { from: { boxId: 'block_2', anchor: 'topRight' }, to: { x: 5, y: 3 } } }
 *   ],
 *   lg: [
 *     { stackVertically: {} },
 *     { moveBy: { from: { boxId: 'block_1' }, by: { x: 0, y: 50 } } }
 *   ],
 *   xl: [
 *     { stackHorizontally: {} }
 *   ],
 *   sm: [
 *     { moveBy: { from: { boxId: 'block_2' }, by: { x: 25, y: 0 } } }
 *   ]
 * };
 * ```
 */
type BoxTransformations<BoxId extends NodeID> = BPs<Array<BoxMovesProps<BoxId>>>;
/**
 * Grid boxes configuration across breakpoints.
 * Maps block IDs to their GridBox configurations for each responsive breakpoint.
 *
 * @template BlockIDs - The union type of block identifiers
 *
 * @example
 * ```typescript
 * const boxes: BPSGridBoxes<'block_1' | 'block_2'> = {
 *   xs: {
 *     'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *   },
 *   md: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   },
 *   lg: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   },
 *   xl: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   },
 *   sm: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   }
 * };
 * ```
 */
type BPSGridBoxes<BlockIDs extends NodeID> = BPs<Partial<Record<BlockIDs, GridBox>>>;
/**
 * Combines grid boxes with optional transformations.
 * Represents a complete grid section with its boxes and potential transformations.
 *
 * @template BlockIDs - The union type of block identifiers in this section
 *
 * @example
 * ```typescript
 * const boxes: GridBoxesAndTx<'block_1' | 'block_2'> = {
 *   gridBoxes: {
 *     xs: {
 *       'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *     },
 *     md: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     },
 *     lg: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     },
 *     xl: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     },
 *     sm: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     }
 *   },
 * *     xs: [{
 *       moveTo: { from: { boxId: 'block_1', anchor: 'bottomLeft' }, to: { x: 1, y: 1 } }
 *     }],
 *     md: [{
 *       moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *     }],
 *     lg: [{
 *       moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *     }],
 *     sm: [
 *       { moveBy: { from: { boxId: 'block_2' }, by: { x: 50, y: 100 } } }
 *     ],
 *     xl: [{
 *       moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *     }]
 *   }
 * };
 * ```
 */
type GridBoxesAndTx<BlockIDs extends NodeID> = {
    gridBoxes: BPSGridBoxes<BlockIDs>;
    transformations?: BoxTransformations<BlockIDs>;
};
/**
 * Complete layout with grid boxes and transformations.
 * The fundamental layout structure that includes both static grid definitions
 * and dynamic transformations that can modify the layout at runtime.
 *
 * @template sectionIDs - Union type of section identifiers
 * @template blockIDs - Union type of block identifiers
 *
 * @example
 * ```typescript
 * const layoutWithTxExample: LayoutWithTx<'header' | 'main' | 'footer', 'block_1' | 'block_2'> = {
 *   sections: {
 *     header: {
 *       gridBoxes: {
 *         xs: {
 *           'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *         },
 *         md: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         lg: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         xl: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         sm: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         }
 *       },
 *       transformations: {
 *         xs: [{
 *           moveTo: { from: { boxId: 'block_1', anchor: 'bottomLeft' }, to: { x: 1, y: 1 } }
 *         }],
 *         md: [{
 *           moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *         }],
 *         lg: [{
 *           moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *         }],
 *         sm: [
 *           { moveBy: { from: { boxId: 'block_2' }, by: { x: 50, y: 100 } } }
 *         ],
 *         xl: [{
 *           moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *         }]
 *       }
 *     },
 *     main: {
 *       gridBoxes: {
 *         xs: {
 *           'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *         },
 *         md: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         lg: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         xl: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         sm: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         }
 *       }
 *     },
 *     footer: {
 *       gridBoxes: {
 *         xs: {
 *           'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *         },
 *         md: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         lg: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         xl: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         sm: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         }
 *       }
 *     }
 *   },
 *   transformations: {
 *     xs: [{ stackVertically: {} }],
 *     sm: [{ stackHorizontally: {} }],
 *     md: [{ stackHorizontally: {} }],
 *     lg: [{ stackHorizontally: {} }],
 *     xl: [{ stackHorizontally: {} }],
 *   }
 * };
 * ```
 */
type LayoutWithTx<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
    sections: Record<sectionIDs, GridBoxesAndTx<blockIDs>>;
    transformations?: BoxTransformations<sectionIDs>;
};
/**
 * Extracts all section IDs from a LayoutWithTx type.
 * Provides type-safe access to sections that exist in a specific layout with transformations.
 *
 * @template L - The LayoutWithTx type to extract section IDs from
 *
 * @example
 * ```typescript
 * type MyLayout = LayoutWithTx<'header' | 'main', 'block_1' | 'block_2'>;
 * type MySections = SectionsInLayoutWithTx<MyLayout>; // 'header' | 'main'
 * ```
 */
/**
 * Extracts all block IDs from a LayoutWithTx type.
 * Creates a union of all block IDs that exist across all sections in the layout.
 *
 * @template L - The LayoutWithTx type to extract block IDs from
 *
 * @example
 * ```typescript
 * type MyLayout = LayoutWithTx<'header' | 'main', 'block_1' | 'block_2' | 'block_3'>;
 * type MyBlocks = BlocksInLayoutWithTx<MyLayout>; // 'block_1' | 'block_2' | 'block_3'
 * ```
 */
/**
 * Layout after applying transformations to section children.
 * Contains local grid boxes per section with relative coordinates within each section.
 * This is an intermediate processing stage where transformations have been applied
 * to individual blocks, but sections still maintain their own local coordinate systems.
 *
 * @template SectionID - The union type of section identifiers
 * @template BlockIDs - The union type of block identifiers
 *
 * @example
 * ```typescript
 * const localLayout: LayoutSectionLocal<'header' | 'main', 'block_1' | 'block_2'> = {
 *   sections: {
 *     header: {
 *       xs: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 2 }, _normalized: 'GridBox' },
 *         'block_2': { origin: { x: 4, y: 0 }, diagonal: { x: 8, y: 2 }, _normalized: 'GridBox' },
 *       },
 *       md: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 6, y: 2 }, _normalized: 'GridBox' },
 *         'block_2': { origin: { x: 6, y: 0 }, diagonal: { x: 12, y: 2 }, _normalized: 'GridBox' },
 *       }
 *     },
 *     main: {
 *       xs: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 8, y: 6 }, _normalized: 'GridBox' },
 *       },
 *       md: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 12, y: 8 }, _normalized: 'GridBox' },
 *       }
 *     }
 *   },
 *   transformations: {
 *     xs: [{ stackVertically: {} }],
 *     md: [{ stackHorizontally: {} }]
 *   }
 * };
 * ```
 */
type LayoutSectionLocal<SectionID extends SectionIDs, BlockIDs extends BlocksIDs> = {
    sections: Record<SectionID, BPSGridBoxes<BlockIDs>>;
    transformations?: BoxTransformations<SectionID>;
};
/**
 * Layout with bounding boxes for each section.
 * Children boxes are still in relative grid coordinates within their sections,
 * but bounding boxes define the overall container dimensions for each section.
 * This is used for calculating section positioning in the global layout.
 *
 * @template SectionID - The union type of section identifiers
 * @template BlockIDs - The union type of block identifiers
 *
 */
type LayoutSectionBounds<SectionID extends SectionIDs, BlockIDs extends BlocksIDs> = {
    sections: Record<SectionID, BPSGridBoxes<BlockIDs>>;
    boundingBoxes: BPs<Record<SectionID, GridBox>>;
    transformations?: BoxTransformations<SectionID>;
};
/**
 * Box coordinates in CSS units (pixels, percentages, etc.).
 * Represents the final positioning of boxes after all transformations and
 * coordinate system conversions have been applied.
 *
 * @template BlockIDs - The union type of block identifiers
  
 */
type BoxesCoordinates<BlockIDs extends NodeID> = {
    coordinates: BPs<Partial<Record<BlockIDs, CSSCoordinates>>>;
};
/**
 * Final layout with absolute CSS coordinates.
 * Represents the complete processed layout where all boxes have been positioned
 * in absolute CSS units. This is the final output used for rendering.
 *
 * @template SectionID - The union type of section identifiers
 * @template BlockIDs - The union type of block identifiers
 *
 */
type LayoutAbsolute<SectionID extends SectionIDs, BlockIDs extends BlocksIDs> = {
    gridDimensions: {
        rows: BPs<number>;
        columns: BPs<number>;
    };
    sections: Record<SectionID, BoxesCoordinates<BlockIDs>>;
};
/**
 * Context provided to node renderers.
 * Contains all the information needed to render a specific block at a specific breakpoint.
 *
 * @template sectionID - The section identifier type
 * @template blockIDs - The block identifier type
 * @template BP - The breakpoint type (defaults to all breakpoints)
 *
 * @example
 * ```typescript
 * const renderContext: NodeRenderCtx<'header', 'block_1', 'md'> = {
 *   sectionId: 'header',
 *   bp: 'md',
 *   boxId: 'block_1',
 *   coords: {
 *     left: '0px',
 *     top: '0px',
 *     width: '50%',
 *     height: '100px'
 *   }
 * };
 *
 * // Usage in a renderer
 * function MyRenderer(ctx: NodeRenderCtx<'header', 'block_1'>) {
 *   return (
 *     <div style={{
 *       position: 'absolute',
 *       left: ctx.coords.left,
 *       top: ctx.coords.top,
 *       width: ctx.coords.width,
 *       height: ctx.coords.height
 *     }}>
 *       Content for {ctx.sectionId} - {ctx.boxId} at {ctx.bp}
 *     </div>
 *   );
 * }
 * ```
 */
type NodeRenderCtx<sectionID extends SectionIDs, blockIDs extends BlocksIDs, BP extends Breakpoint = Breakpoint> = {
    sectionId: sectionID;
    bp: BP;
    boxId: blockIDs;
    coords: CSSCoordinates;
};
/**
 * Configuration for rendering individual nodes.
 * Allows customization of both content and visual styling for specific blocks.
 *
 * @template sectionID - The section identifier type
 * @template blockIDs - The block identifier type
 *
 * @example
 * ```typescript
 * const renderConfig: NodeRenderConfig<'header', 'block_1' | 'block_2'> = {
 *   contentRenderer: (ctx) => {
 *     if (ctx.boxId === 'block_1') {
 *       return <h1>Header Title</h1>;
 *     }
 *     if (ctx.boxId === 'block_2') {
 *       return <nav>Navigation Menu</nav>;
 *     }
 *     return null;
 *   },
 *   view: {
 *     showGridLines: true,
 *     showBoxLabels: true,
 *     highlightOnHover: true,
 *     debugInfo: {
 *       showCoordinates: true,
 *       showBreakpoint: true
 *     }
 *   }
 * };
 * ```
 */
type NodeRenderConfig<sectionID extends SectionIDs, blockIDs extends BlocksIDs> = {
    contentRenderer?: (ctx: NodeRenderCtx<sectionID, blockIDs>) => React.ReactNode;
    view?: GridNodeViewOptions;
};
/**
 * Rendering overrides for customizing layout appearance.
 * Allows selective customization of rendering behavior for specific sections,
 * breakpoints, and blocks. All levels are optional, providing fine-grained control.
 *
 * @template sectionID - The section identifier type
 * @template blockIDs - The block identifier type
 *
 * @example
 * ```typescript
 * const renderOverrides: LayoutRenderingOverride<'header' | 'main', 'block_1' | 'block_2'> = {
 *   // Override header section only
 *   header: {
 *     // Only for medium and large breakpoints
 *     md: {
 *       // Only for block_1
 *       block_1: {
 *         contentRenderer: (ctx) => <h1>Custom Header</h1>,
 *         view: {
 *           showGridLines: false,
 *           backgroundColor: '#f0f0f0'
 *         }
 *       }
 *     },
 *     lg: {
 *       block_1: {
 *         contentRenderer: (ctx) => <h1>Large Screen Header</h1>
 *       },
 *       block_2: {
 *         view: {
 *           highlightOnHover: true
 *         }
 *       }
 *     }
 *   },
 *   // Main section overrides
 *   main: {
 *     xs: {
 *       block_1: {
 *         contentRenderer: (ctx) => <div>Mobile Content</div>
 *       }
 *     }
 *   }
 * };
 * ```
 */
type LayoutRenderingOverride<sectionID extends SectionIDs, blockIDs extends BlocksIDs> = Partial<{
    [S in sectionID]: Partial<{
        [BP in Breakpoint]: Partial<Record<blockIDs, NodeRenderConfig<sectionID, blockIDs>>>;
    }>;
}>;

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
type CssLength = {
    unit: "px" | "em" | "rem" | "%";
    value: number;
};
/**
 * CSS Grid track breadth values including lengths, fractional units, and content-based sizing.
 * @example
 * ```typescript
 * const fixedWidth: TrackBreadth = { unit: "px", value: 200 };
 * const fractionalWidth: TrackBreadth = { unit: "fr", value: 1 };
 * const autoWidth: TrackBreadth = { unit: "auto" };
 * ```
 */
type TrackBreadth = CssLength | {
    unit: "fr";
    value: number;
} | {
    unit: "min-content";
} | {
    unit: "max-content";
} | {
    unit: "fit-content";
    value: CssLength;
} | {
    unit: "auto";
};
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
type GridUnitValue = TrackBreadth | {
    unit: "minmax";
    min: TrackBreadth;
    max: TrackBreadth;
};
/**
 * Gap value for CSS Grid gaps (row-gap, column-gap, gap).
 * @example
 * ```typescript
 * const gap: GapValue = { unit: "px", value: 16 };
 * ```
 */
type GapValue = CssLength;
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
declare function cssLengthToString(len: CssLength): string;
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
declare function trackBreadthToString(b: TrackBreadth): string;
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
declare function gridUnitValueToString(v: GridUnitValue): string;
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
declare function gapValueToString(g: GapValue): string;

/**
 * @fileoverview CSS Grid configuration options and layout behavior types.
 * Provides comprehensive type definitions for configuring CSS Grid container properties.
 * @module GridOptionsTypes
 */

/**
 * Comprehensive CSS Grid container configuration options.
 * Covers all major CSS Grid properties for layout behavior, sizing, alignment, and spacing.
 *
 * @example
 * ```typescript
 * // Grid auto-sizing configuration
 * const gridOptions: GridOptions = {
 *   // Implicit track sizing
 *   implicitRowUnits: { unit: 'fr', value: 1 },
 *   implicitColumnUnits: { unit: 'px', value: 200 },
 *
 *   // Layout flow and overflow
 *   overflow: 'visible',
 *   autoFlow: 'row',
 *
 *   // Item alignment
 *   justifyItems: 'stretch',
 *   alignItems: 'stretch',
 *
 *   // Content alignment
 *   justifyContent: 'start',
 *   alignContent: 'start',
 *
 *   // Spacing
 *   gap: { unit: 'px', value: 16 },
 *   rowGap: { unit: 'px', value: 12 },
 *   columnGap: { unit: 'px', value: 20 }
 * };
 * ```
 */
type GridOptions = {
    /** CSS grid-auto-rows: Size of implicitly created row tracks */
    implicitRowUnits: GridUnitValue;
    /** CSS grid-auto-columns: Size of implicitly created column tracks */
    implicitColumnUnits: GridUnitValue;
    /** CSS overflow: How to handle content that overflows the grid container */
    overflow: 'visible' | 'hidden' | 'scroll' | 'auto';
    /** CSS grid-auto-flow: Direction for auto-placed grid items */
    autoFlow: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
    /** CSS justify-items: Default horizontal alignment for grid items */
    justifyItems: 'start' | 'end' | 'center' | 'stretch';
    /** CSS align-items: Default vertical alignment for grid items */
    alignItems: 'start' | 'end' | 'center' | 'stretch';
    /** CSS justify-content: Horizontal alignment of grid tracks within the container */
    justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
    /** CSS align-content: Vertical alignment of grid tracks within the container */
    alignContent: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
    /** CSS gap: Shorthand for both row and column gaps */
    gap: GapValue;
    /** CSS row-gap: Vertical spacing between grid rows */
    rowGap: GapValue;
    /** CSS column-gap: Horizontal spacing between grid columns */
    columnGap: GapValue;
};

/**
 * Props for the main GridCssMuiRenderer component
 *
 * @template sectionID - Union type of valid section identifiers
 * @template blockID - Union type of valid block/box identifiers
 * @template LA - Layout type extending LayoutAbsolute
 */
type GridCssMuiRendererProps<sectionID extends SectionIDs, blockID extends BlocksIDs> = {
    layoutAbsolute: LayoutAbsolute<sectionID, blockID>;
    diagnostics: DiagnosticEntry[];
    layoutRendering?: LayoutRenderingOverride<sectionID, blockID>;
    gridOptionsOverride?: Partial<GridOptions>;
};
/**
 * Main Grid CSS MUI Renderer Component
 *
 * Renders a complete CSS Grid layout using Material-UI components. This is the primary
 * entry point for converting layout definitions into rendered UI components.
 *
 * Processing Flow:
 * 1. Extract and process all boxes from all sections across all breakpoints
 * 2. Build node registry with coordinates and rendering configurations
 * 3. Handle missing coordinates with error reporting and fallbacks
 * 4. Render CSS Grid container with positioned child nodes
 *
 * Error Handling:
 * - Missing breakpoint data: Reports errors and skips processing
 * - Missing box coordinates: Reports errors and applies fallback positioning
 * - Malformed data: Graceful degradation with diagnostic reporting
 *
 * @template sectionID - Union type of valid section identifiers
 * @template blockID - Union type of valid block/box identifiers
 * @template LA - Layout type extending LayoutAbsolute
 * @param props - Component props including layout, rendering overrides, and options
 * @returns Rendered CSS Grid layout with positioned nodes
 */
declare function GridCssMuiRenderer<sectionID extends SectionIDs, blockID extends BlocksIDs>({ layoutAbsolute, layoutRendering, diagnostics, gridOptionsOverride, }: GridCssMuiRendererProps<sectionID, blockID>): react_jsx_runtime.JSX.Element;

type MuiTheme = Theme;
type MuiSystemStyleObject = SystemStyleObject<MuiTheme>;

/**
 * Generate MUI sx props based on grid node view options
 *
 * Converts GridNodeViewOptions into MUI's sx prop object, handling various
 * visual and layout properties including sizing constraints, positioning,
 * visibility, and accessibility.
 *
 * Supported options:
 * - minWidth0/minHeight0: Allow content to shrink below natural minimum
 * - justifySelf/alignSelf: CSS Grid alignment within grid area
 * - zIndex: Stacking order control
 * - pointerEvents: Mouse interaction control
 * - visibility: Show/hide/visually-hide content
 *
 * @param view - Optional view configuration object
 * @returns MUI sx prop object with computed styles
 */
declare function getNodeSxProps(view?: GridNodeViewOptions): MuiSystemStyleObject;
/**
 * Generate DOM attributes and props from grid node view options
 *
 * Converts GridNodeViewOptions into React DOM attributes, specifically handling
 * accessibility (ARIA) attributes and custom data attributes. This ensures proper
 * semantic markup and accessibility support for grid nodes.
 *
 * Supported features:
 * - ARIA attributes (role, label, labelledby, describedby)
 * - Custom data attributes with automatic "data-" prefixing
 * - Type-safe attribute handling
 *
 * @param view - Optional view configuration object
 * @returns Object containing React DOM attributes
 */
type DataAttributes = Record<`data-${string}`, string>;
declare function getNodeDomProps(view?: GridNodeViewOptions): React$1.HTMLAttributes<HTMLElement> & DataAttributes;
/**
 * Props for the DefaultNodeRender component
 *
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 */
type DefaultNodeRenderProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
    section: sectionIDs;
    boxId: blockIDs;
    cssCoordinateBPs: BPs<CSSCoordinates>;
    content: NodeRenderConfig<sectionIDs, blockIDs>;
};
/**
 * Default Node Renderer Component
 *
 * Renders a grid node using Material-UI components with full responsive CSS Grid support.
 * This component handles the conversion from grid coordinates to CSS Grid properties
 * and applies them across all responsive breakpoints.
 *
 * Key Features:
 * - Responsive CSS Grid positioning using MUI breakpoint system
 * - Automatic breakpoint detection and coordinate application
 * - Accessibility attribute management
 * - Flexible content rendering through render props
 * - Integration with MUI theming
 *
 * The component uses MUI's useMediaQuery to detect the current breakpoint and
 * applies the appropriate CSS Grid coordinates for that breakpoint.
 *
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 * @param props - Component props including coordinates, content, and identifiers
 * @returns Rendered grid node as MUI Box component
 */
declare function DefaultNodeRender<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>({ section, boxId, cssCoordinateBPs, content, }: DefaultNodeRenderProps<sectionIDs, blockIDs>): react_jsx_runtime.JSX.Element;

export { makeInfo as $, type BoxProps as A, type BlocksIDs as B, type Coordinate as C, type DiagnosticEntry as D, type AllBoxMovesProps as E, type BoxMovesFunctionsProps as F, type GridBox as G, transformationIDs as H, type Anchor as I, type GridNodeLayoutFlags as J, type CSSCoordinatesBPS as K, type Layout as L, type Cards as M, type NodeID as N, type Breakpoint as O, type PartialBps as P, type DiagnosticSeverity as Q, type Rows as R, type SectionIDs as S, type TransformationIDs as T, type DiagnosticOrigin as U, type GridErrorCode as V, GRID_ERROR_CODE as W, type GridIssue as X, makeDiagnostic as Y, makeError as Z, makeWarning as _, type BoxSpan as a, type CoordinateTransformation as a0, type CssLength as a1, type TrackBreadth as a2, type GridUnitValue as a3, type GapValue as a4, cssLengthToString as a5, trackBreadthToString as a6, gridUnitValueToString as a7, gapValueToString as a8, GridCssMuiRenderer as a9, type GridCssMuiRendererProps as aa, DefaultNodeRender as ab, getNodeSxProps as ac, getNodeDomProps as ad, BREAKPOINTS as b, type BoxTransformations as c, type GridNodeViewOptions as d, type GridOptions as e, type LayoutAbsolute as f, type LayoutSectionBounds as g, type LayoutSectionLocal as h, type LayoutWithTx as i, type BoxMovesFunctions as j, type BPs as k, type GridBoxPointPosition as l, type BoxesCoordinates as m, type BoxMovesProps as n, type BoxMovesPropsObject as o, type BoxMoveToProps as p, type CSSCoordinates as q, type BPSGridBoxes as r, type GridBoxesAndTx as s, type NodeRenderCtx as t, type NodeRenderConfig as u, type LayoutRenderingOverride as v, type BoxPropBase as w, type BoxMoveByProps as x, type BoxAlignYProps as y, type BoxAlignXProps as z };
