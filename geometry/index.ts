/**
 * @fileoverview Geometry module for mcpab-gridcss framework providing comprehensive 2D coordinate and matrix operations.
 * 
 * This module contains all the mathematical foundations for the CSS Grid layout system, including:
 * - 2D coordinate types and transformations
 * - Vector algebra operations (addition, subtraction, scaling)
 * - Distance and metric calculations
 * - Matrix operations for geometric transformations
 * - Utility functions for coordinate manipulation
 * 
 * The geometry system is designed to support grid positioning, layout calculations,
 * and transformations needed for responsive CSS Grid components.
 * 
 * @module Geometry
 * @version 1.0.0
 */

// ===== COORDINATE TYPES =====
/**
 * Core coordinate and transformation types for 2D space.
 */
export type {
  Coordinate,
  CoordinateTransformation
} from './coordinateTypes';

// ===== MATRIX TYPES =====
/**
 * Matrix type definitions for 2D transformations.
 */
export type {
  Matrix2x2,
  DiagonalMatrix,
  UnitMatrix,
  SymmetricMatrix
} from './matrixTypes';

// ===== COORDINATE ALGEBRA =====
/**
 * Fundamental coordinate operations and vector algebra.
 */
export {
  getOrigin,
  linearCombination,
  multiplyScalar,
  addCoordinates,
  subtractCoordinates,
  reflectOnXAxis,
  reflectOnYAxis,
  rotateByClockWise,
  invert
} from './coordinateAlgebra';

// ===== COORDINATE METRICS =====
/**
 * Distance calculations and metric operations on coordinates.
 */
export {
  dot,
  norm,
  distance,
  normalize,
  angleBetween,
  boundingBox,
  lerp,
  clamp
} from './coordinateMetrics';

// ===== COORDINATE UTILITIES =====
/**
 * Helper functions for coordinate manipulation and analysis.
 */
export {
  minCoordinate,
  maxCoordinate,
  copyCoordinate
} from './coordinatesUtils';

// ===== MATRIX ALGEBRA =====
/**
 * Matrix operations for geometric transformations.
 */
export {
  unitMatrix,
  zeroMatrix,
  reflectionOnXAxis,
  reflectionOnYAxis,
  rotationByThetaClockWise,
  multiply
} from './matrixAlgebra';