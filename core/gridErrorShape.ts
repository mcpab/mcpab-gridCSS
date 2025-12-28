/**
 * @fileoverview Grid error handling and diagnostic system.
 * Provides types and utilities for error reporting, validation, and debugging in the grid layout system.
 * @module GridErrorShape
 */

import { NodeID } from "../templates/layoutIDs";
import { AllBoxMovesProps } from "./boxTransformations/boxTransformationsProps";


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
export type DiagnosticSeverity = 'error' | 'warning' | 'info';

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
export type DiagnosticOrigin =
  | AllBoxMovesProps<any>  // box transformations
  | 'transformBoxMove' // box move transformer
  | 'layoutSectionToBounds' // layout section to bounds converter
  | 'layoutSectionBtoAbsolute'
  | 'CSSLayout'
  | 'GridCssMuiRenderer'
  | 'layoutToTx'
  ;



// 3) Canonical error codes (SCREAMING_SNAKE_CASE)
//    Use these constants everywhere instead of string literals.

// Brand marker – only used by the type system
declare const gridErrorCodeBrand: unique symbol;
type GridErrorCodeBrand = { readonly [gridErrorCodeBrand]: true };

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
export type GridErrorCode = string & GridErrorCodeBrand;

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
export const GRID_ERROR_CODE = {
  // --- Core grid / geometry issues ----------------------------
  OVERLAP_NOT_ALLOWED: 'OVERLAP_NOT_ALLOWED' as GridErrorCode,

  // --- Pattern / semantic node issues -------------------------
  INVALID_TRANSFORMATION_PARAMS: 'INVALID_TRANSFORMATION_PARAMS' as GridErrorCode,

  // --- Runtime layout / builder anomalies --------------------
  NO_BOXES_PROCESSED: 'NO_BOXES_PROCESSED' as GridErrorCode,
  NO_SECTION_ID: 'NO_SECTION_ID' as GridErrorCode,
  BOX_SHAPE_MISSING_BP: 'BOX_SHAPE_MISSING_BP' as GridErrorCode,
  UNKNOWN_TRANSFORMATION: 'UNKNOWN_TRANSFORMATION' as GridErrorCode,
  EMPTY_GRID: 'EMPTY_GRID' as GridErrorCode,
  GRID_NORMALIZED_TO_POSITIVE_LINES: 'GRID_NORMALIZED_TO_POSITIVE_LINES' as GridErrorCode,
  MISSING_COORDINATES: 'MISSING_COORDINATES' as GridErrorCode,
  SECTION_SHAPES_MISSING_BP: 'SECTION_SHAPES_MISSING_BP' as GridErrorCode,

} as const;

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
export type GridIssue = {
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
export type DiagnosticEntry = {
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
export function makeDiagnostic(
  severity: DiagnosticSeverity,
  origin: DiagnosticOrigin,
  code: GridErrorCode,
  message: string,
  extras: IssueExtras = {}
): DiagnosticEntry {
  return {
    severity,
    origin,
    issue: {
      code,
      message,
      ...extras,
    },
  };
}

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
export function makeError(
  origin: DiagnosticOrigin,
  code: GridErrorCode,
  message: string,
  extras: IssueExtras = {}
): DiagnosticEntry {
  return makeDiagnostic('error', origin, code, message, extras);
}

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
export function makeWarning(
  origin: DiagnosticOrigin,
  code: GridErrorCode,
  message: string,
  extras: IssueExtras = {}
): DiagnosticEntry {
  return makeDiagnostic('warning', origin, code, message, extras);
}

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
export function makeInfo(
  origin: DiagnosticOrigin,
  code: GridErrorCode,
  message: string,
  extras: IssueExtras = {}
): DiagnosticEntry {
  return makeDiagnostic('info', origin, code, message, extras);
}
