/**
 * @fileoverview CSS Grid configuration options and layout behavior types.
 * Provides comprehensive type definitions for configuring CSS Grid container properties.
 * @module GridOptionsTypes
 */

import type { GapValue, GridUnitValue } from './cssStringify';

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
export type GridOptions = {
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
  justifyContent:
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
  /** CSS align-content: Vertical alignment of grid tracks within the container */
  alignContent:
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

  /** CSS gap: Shorthand for both row and column gaps */
  gap: GapValue;
  /** CSS row-gap: Vertical spacing between grid rows */
  rowGap: GapValue;
  /** CSS column-gap: Horizontal spacing between grid columns */
  columnGap: GapValue;
};
