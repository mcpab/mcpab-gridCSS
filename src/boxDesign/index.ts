/**
 * Box Design Module Exports
 * 
 * This module provides the complete box design and transformation pipeline
 * for converting layout definitions into CSS Grid coordinates. It exports
 * the main transformation functions and utilities needed for responsive
 * grid layout generation.
 * 
 * Main Pipeline Functions:
 * - CSSLayout: Complete pipeline orchestrator (main entry point)
 * - layoutTxToSectionLocal: Apply transformations to local coordinates
 * - layoutSectionToBounds: Calculate bounding boxes for sections
 * - layoutSectionBtoAbsolute: Convert to absolute CSS Grid coordinates
 * - transformBoxMove: Core transformation engine
 * 
 * Utilities:
 * - checkSectionsOverlap: Overlap detection and validation
 * - recordKeys/partialRecordKeys: Type-safe key extraction utilities
 */

// Main pipeline orchestrator - primary entry point for layout transformation
export { CSSLayout } from './CSSlayout';

// Overlap detection and validation utilities
export { checkSectionsOverlap } from './CSSlayout';

// Core transformation pipeline functions
export { layoutSectionBtoAbsolute } from './layoutSectionBtoAbsolute';
export { layoutSectionToBounds } from './layoutSectionToBounds';
export { layoutTxToSectionLocal } from './layoutTxToSectionLocal';
export { layoutToTx } from './layoutToTx';

// Box transformation engine
export { transformBoxMove } from './transformBoxMove';

// Layout transformation utilities (if layoutToTx exists and has exports)
// Note: layoutToTx.ts may contain additional utilities - adjust exports as needed
export * from './layoutToTx';

/**
 * Re-export commonly used types for convenience
 * These types are frequently needed when working with the box design pipeline
 */

// Import and re-export key types from related modules for convenience
// Users can import these directly from the boxDesign module without needing
// to know the exact source module
export type {
  // Layout structure types
  LayoutAbsolute,
  LayoutSectionBounds,
  LayoutSectionLocal,
  LayoutWithTx,
  BoxTransformations,
  BoxesCoordinates,
  
 
} from '../boxLayout/boxLayoutTypes';

export type {
  // Transformation function interfaces
  BoxMovesFunctions,
  BoxMovesProps,
  TransformationIDs,
  BoxMovesPropsObject,
  BoxMoveToProps,
} from '../boxTransformations';

export type {
  // Grid box types
  GridBox,
} from '../box/gridBoxTypes';

export type {
  // CSS coordinate types
  CSSCoordinates,
} from '../gridNodeTypes';

export type {
  // Error and diagnostic types
  DiagnosticEntry,
} from '../gridErrorShape';

export type {
  // Template identifier types
  SectionIDs,
  BlocksIDs,
  NodeID,
} from '../templates';

export type {
  // Responsive breakpoint types
  BPs,
} from '../breakpoints';