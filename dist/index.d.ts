import { C as Coordinate, S as SectionIDs, B as BlocksIDs, L as Layout, a as BoxSpan, b as BREAKPOINTS, G as GridBox, c as BoxTransformations, d as GridNodeViewOptions, e as GridOptions, D as DiagnosticEntry, f as LayoutAbsolute, g as LayoutSectionBounds, h as LayoutSectionLocal, i as LayoutWithTx, j as BoxMovesFunctions, N as NodeID, k as BPs, l as GridBoxPointPosition } from './mui-VjCe46Ih.js';
export { E as AllBoxMovesProps, I as Anchor, r as BPSGridBoxes, z as BoxAlignXProps, y as BoxAlignYProps, x as BoxMoveByProps, p as BoxMoveToProps, F as BoxMovesFunctionsProps, n as BoxMovesProps, o as BoxMovesPropsObject, w as BoxPropBase, A as BoxProps, m as BoxesCoordinates, O as Breakpoint, q as CSSCoordinates, K as CSSCoordinatesBPS, M as Cards, a0 as CoordinateTransformation, a1 as CssLength, ab as DefaultNodeRender, U as DiagnosticOrigin, Q as DiagnosticSeverity, W as GRID_ERROR_CODE, a4 as GapValue, s as GridBoxesAndTx, a9 as GridCssMuiRenderer, aa as GridCssMuiRendererProps, V as GridErrorCode, X as GridIssue, J as GridNodeLayoutFlags, a3 as GridUnitValue, v as LayoutRenderingOverride, u as NodeRenderConfig, t as NodeRenderCtx, P as PartialBps, R as Rows, a2 as TrackBreadth, T as TransformationIDs, a5 as cssLengthToString, a8 as gapValueToString, ad as getNodeDomProps, ac as getNodeSxProps, a7 as gridUnitValueToString, Y as makeDiagnostic, Z as makeError, $ as makeInfo, _ as makeWarning, a6 as trackBreadthToString, H as transformationIDs } from './mui-VjCe46Ih.js';
import 'react/jsx-runtime';
import '@mui/material/styles';
import '@mui/system';
import 'react';

/**
 * @fileoverview Type definitions for 2x2 matrices used in geometric transformations.
 * Provides specialized matrix types for different mathematical structures and operations.
 * @module MatrixTypes
 */
/**
 * General 2x2 matrix type with arbitrary numeric values.
 * Represents a 2-row by 2-column matrix for 2D transformations.
 *
 * @example
 * ```typescript
 * // General transformation matrix
 * const transform: Matrix2x2 = [
 *   [2, 1],    // First row: [2, 1]
 *   [0, 3]     // Second row: [0, 3]
 * ];
 *
 * // Rotation matrix
 * const rotation: Matrix2x2 = [
 *   [Math.cos(Math.PI/4), Math.sin(Math.PI/4)],
 *   [-Math.sin(Math.PI/4), Math.cos(Math.PI/4)]
 * ];
 *
 * // Scaling matrix
 * const scale: Matrix2x2 = [
 *   [2, 0],    // Scale x by 2
 *   [0, 3]     // Scale y by 3
 * ];
 * ```
 */
type Matrix2x2 = [
    [number, number],
    [
        number,
        number
    ]
];
/**
 * Diagonal matrix with specified diagonal values and zeros elsewhere.
 * Useful for scaling transformations and other diagonal operations.
 *
 * @template d1 - The value of the top-left diagonal element
 * @template d2 - The value of the bottom-right diagonal element
 *
 * @example
 * ```typescript
 * // Scaling matrix: scales x by 2, y by 3
 * const scaleMatrix: DiagonalMatrix<2, 3> = [
 *   [2, 0],
 *   [0, 3]
 * ];
 *
 * // Identity matrix as diagonal
 * const identity: DiagonalMatrix<1, 1> = [
 *   [1, 0],
 *   [0, 1]
 * ];
 *
 * // Reflection matrix: flip x, preserve y
 * const flipX: DiagonalMatrix<-1, 1> = [
 *   [-1, 0],
 *   [0, 1]
 * ];
 * ```
 */
type DiagonalMatrix<d1 extends number, d2 extends number> = [
    [d1, 0],
    [
        0,
        d2
    ]
];
/**
 * Unit diagonal matrix where both diagonal elements have the same value.
 * Special case of diagonal matrix for uniform scaling or identity operations.
 *
 * @template d - The value for both diagonal elements
 *
 * @example
 * ```typescript
 * // Identity matrix
 * const identity: UnitMatrix<1> = [
 *   [1, 0],
 *   [0, 1]
 * ];
 *
 * // Uniform scaling by 2
 * const scale2x: UnitMatrix<2> = [
 *   [2, 0],
 *   [0, 2]
 * ];
 *
 * // Zero matrix
 * const zero: UnitMatrix<0> = [
 *   [0, 0],
 *   [0, 0]
 * ];
 *
 * // Inversion matrix
 * const invert: UnitMatrix<-1> = [
 *   [-1, 0],
 *   [0, -1]
 * ];
 * ```
 */
type UnitMatrix<d extends number> = DiagonalMatrix<d, d>;
/**
 * Symmetric matrix where off-diagonal elements are equal.
 * Represents matrices that are symmetric across the main diagonal.
 *
 * @template d1 - The value of the diagonal elements
 * @template d2 - The value of the off-diagonal elements
 *
 * @example
 * ```typescript
 * // Shear transformation matrix
 * const shear: SymmetricMatrix<1, 0.5> = [
 *   [1, 0.5],
 *   [0.5, 1]
 * ];
 *
 * // Identity matrix as symmetric
 * const identity: SymmetricMatrix<1, 0> = [
 *   [1, 0],
 *   [0, 1]
 * ];
 *
 * // Custom symmetric transformation
 * const custom: SymmetricMatrix<2, 1> = [
 *   [2, 1],
 *   [1, 2]
 * ];
 *
 * // Note: These matrices have special mathematical properties
 * // such as having real eigenvalues and orthogonal eigenvectors
 * ```
 */
type SymmetricMatrix<d1 extends number, d2 extends number> = [
    [d1, d2],
    [
        d2,
        d1
    ]
];

/**
 * @fileoverview Coordinate algebra operations for 2D vector mathematics.
 * Provides essential mathematical operations for coordinate manipulation and transformations.
 * @module CoordinateAlgebra
 */

/**
 * Returns the origin coordinate (0, 0).
 * Convenient factory function for creating the zero vector.
 *
 * @returns The origin coordinate { x: 0, y: 0 }
 *
 * @example
 * ```typescript
 * const origin = getOrigin();  // { x: 0, y: 0 }
 *
 * // Use as starting point for calculations
 * const offset = addCoordinates(origin, { x: 10, y: 20 });
 * ```
 */
declare const getOrigin: () => Coordinate;
/**
 * Calculates a linear combination of two coordinates.
 * Computes alpha * a + beta * b for two coordinates with scalar coefficients.
 *
 * @param alpha - Scalar coefficient for coordinate a
 * @param a - First coordinate
 * @param beta - Scalar coefficient for coordinate b
 * @param b - Second coordinate
 * @returns The linear combination result
 *
 * @example
 * ```typescript
 * const a: Coordinate = { x: 2, y: 3 };
 * const b: Coordinate = { x: 4, y: 1 };
 *
 * // 2 * a + 3 * b = 2*(2,3) + 3*(4,1) = (4,6) + (12,3) = (16,9)
 * const result = linearCombination(2, a, 3, b);  // { x: 16, y: 9 }
 *
 * // Weighted average: 0.7 * a + 0.3 * b
 * const blend = linearCombination(0.7, a, 0.3, b);
 * ```
 */
declare const linearCombination: (alpha: number, a: Coordinate, beta: number, b: Coordinate) => Coordinate;
/**
 * Multiplies a coordinate by a scalar value.
 * Scales both x and y components by the same factor.
 *
 * @param scalar - The scaling factor
 * @param a - The coordinate to scale
 * @returns The scaled coordinate
 *
 * @example
 * ```typescript
 * const coord: Coordinate = { x: 3, y: 4 };
 *
 * const doubled = multiplyScalar(2, coord);     // { x: 6, y: 8 }
 * const halved = multiplyScalar(0.5, coord);    // { x: 1.5, y: 2 }
 * const negated = multiplyScalar(-1, coord);    // { x: -3, y: -4 }
 * ```
 */
declare const multiplyScalar: (scalar: number, a: Coordinate) => Coordinate;
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
 * Reflects a coordinate across the X-axis.
 * Negates the y-component while keeping x unchanged.
 *
 * @param coord - The coordinate to reflect
 * @returns The reflected coordinate
 *
 * @example
 * ```typescript
 * const point: Coordinate = { x: 3, y: 4 };
 * const reflected = reflectOnXAxis(point);  // { x: 3, y: -4 }
 *
 * // Mirror across horizontal axis
 * const upperPoint: Coordinate = { x: 2, y: 5 };
 * const lowerPoint = reflectOnXAxis(upperPoint);  // { x: 2, y: -5 }
 * ```
 */
declare const reflectOnXAxis: (coord: Coordinate) => Coordinate;
/**
 * Reflects a coordinate across the Y-axis.
 * Negates the x-component while keeping y unchanged.
 *
 * @param coord - The coordinate to reflect
 * @returns The reflected coordinate
 *
 * @example
 * ```typescript
 * const point: Coordinate = { x: 3, y: 4 };
 * const reflected = reflectOnYAxis(point);  // { x: -3, y: 4 }
 *
 * // Mirror across vertical axis
 * const rightPoint: Coordinate = { x: 5, y: 2 };
 * const leftPoint = reflectOnYAxis(rightPoint);  // { x: -5, y: 2 }
 * ```
 */
declare const reflectOnYAxis: (coord: Coordinate) => Coordinate;
/**
 * Rotates a coordinate clockwise by the specified angle.
 * Uses matrix multiplication for accurate rotation transformation.
 *
 * @param theta - The rotation angle in radians (clockwise)
 * @param coord - The coordinate to rotate
 * @returns The rotated coordinate
 *
 * @example
 * ```typescript
 * const point: Coordinate = { x: 1, y: 0 };
 *
 * // Rotate 90 degrees clockwise (π/2 radians)
 * const rotated90 = rotateByClockWise(Math.PI / 2, point);  // { x: 0, y: -1 }
 *
 * // Rotate 180 degrees (π radians)
 * const rotated180 = rotateByClockWise(Math.PI, point);     // { x: -1, y: 0 }
 *
 * // Rotate 45 degrees
 * const rotated45 = rotateByClockWise(Math.PI / 4, { x: 1, y: 1 });
 * // Result: approximately { x: 1.414, y: 0 }
 * ```
 */
declare const rotateByClockWise: (theta: number, coord: Coordinate) => Coordinate;
/**
 * Inverts a coordinate by negating both components.
 * Equivalent to multiplying by -1 or rotating 180 degrees around origin.
 *
 * @param coord - The coordinate to invert
 * @returns The inverted coordinate
 *
 * @example
 * ```typescript
 * const point: Coordinate = { x: 3, y: -4 };
 * const inverted = invert(point);  // { x: -3, y: 4 }
 *
 * // Useful for direction reversal
 * const velocity: Coordinate = { x: 10, y: 5 };
 * const oppositeDirection = invert(velocity);  // { x: -10, y: -5 }
 *
 * // Double inversion returns original
 * const original = invert(invert(point));  // { x: 3, y: -4 }
 * ```
 */
declare const invert: (coord: Coordinate) => Coordinate;

/**
 * @fileoverview Coordinate metrics and geometric calculations for 2D vectors.
 * Provides mathematical operations for measuring distances, angles, and spatial relationships.
 * @module CoordinateMetrics
 */

/**
 * Calculates the dot product of two vectors.
 * Returns the scalar product a·b = ax*bx + ay*by.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns The dot product scalar value
 *
 * @example
 * ```typescript
 * const a: Coordinate = { x: 3, y: 4 };
 * const b: Coordinate = { x: 2, y: 1 };
 *
 * const dotProduct = dot(a, b);  // 3*2 + 4*1 = 10
 *
 * // Perpendicular vectors have dot product of 0
 * const perpA: Coordinate = { x: 1, y: 0 };
 * const perpB: Coordinate = { x: 0, y: 1 };
 * const perpDot = dot(perpA, perpB);  // 0
 *
 * // Parallel vectors have maximum dot product
 * const parallel = dot(a, a);  // 25 (same as ||a||²)
 * ```
 */
declare const dot: (a: Coordinate, b: Coordinate) => number;
/**
 * Calculates the Euclidean norm (magnitude/length) of a vector.
 * Returns ||v|| = √(x² + y²).
 *
 * @param v - The vector to measure
 * @returns The length of the vector
 *
 * @example
 * ```typescript
 * const v: Coordinate = { x: 3, y: 4 };
 * const length = norm(v);  // √(3² + 4²) = √25 = 5
 *
 * // Unit vector has length 1
 * const unit: Coordinate = { x: 1, y: 0 };
 * const unitLength = norm(unit);  // 1
 *
 * // Zero vector has length 0
 * const zero = norm({ x: 0, y: 0 });  // 0
 * ```
 */
declare const norm: (v: Coordinate) => number;
/**
 * Calculates the Euclidean distance between two points.
 * Returns ||b - a|| = √((bx-ax)² + (by-ay)²).
 *
 * @param a - First point
 * @param b - Second point
 * @returns The distance between the points
 *
 * @example
 * ```typescript
 * const pointA: Coordinate = { x: 0, y: 0 };
 * const pointB: Coordinate = { x: 3, y: 4 };
 *
 * const dist = distance(pointA, pointB);  // 5
 *
 * // Distance from point to itself is 0
 * const selfDist = distance(pointA, pointA);  // 0
 *
 * // Distance is symmetric
 * const dist1 = distance(pointA, pointB);
 * const dist2 = distance(pointB, pointA);  // same as dist1
 * ```
 */
declare const distance: (a: Coordinate, b: Coordinate) => number;
/**
 * Normalizes a vector to unit length (length = 1).
 * Returns v/||v|| for non-zero vectors, or zero vector for zero input.
 *
 * @param v - The vector to normalize
 * @returns The unit vector in the same direction, or zero vector if input is zero
 *
 * @example
 * ```typescript
 * const v: Coordinate = { x: 3, y: 4 };
 * const unit = normalize(v);  // { x: 0.6, y: 0.8 }
 *
 * // Verify it's a unit vector
 * const length = norm(unit);  // 1 (approximately)
 *
 * // Zero vector normalizes to zero
 * const zero = normalize({ x: 0, y: 0 });  // { x: 0, y: 0 }
 *
 * // Direction vectors
 * const right = normalize({ x: 10, y: 0 });  // { x: 1, y: 0 }
 * const diagonal = normalize({ x: 1, y: 1 }); // { x: 0.707..., y: 0.707... }
 * ```
 */
declare const normalize: (v: Coordinate) => Coordinate;
/**
 * Calculates the angle between two vectors in radians.
 * Returns the acute angle (0 to π) between the vectors.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns The angle in radians (0 to π)
 *
 * @example
 * ```typescript
 * const right: Coordinate = { x: 1, y: 0 };
 * const up: Coordinate = { x: 0, y: 1 };
 *
 * const angle = angleBetween(right, up);  // π/2 (90 degrees)
 *
 * // Parallel vectors
 * const parallel = angleBetween(right, { x: 2, y: 0 });  // 0
 *
 * // Opposite vectors
 * const opposite = angleBetween(right, { x: -1, y: 0 });  // π (180 degrees)
 *
 * // Convert to degrees
 * const degrees = angle * (180 / Math.PI);  // 90
 * ```
 */
declare const angleBetween: (a: Coordinate, b: Coordinate) => number;
/**
 * Calculates the axis-aligned bounding box of a set of points.
 * Returns the minimum and maximum coordinates that contain all points.
 *
 * @param points - Array of coordinates to bound
 * @returns Object with min and max coordinates, or origin box if empty array
 *
 * @example
 * ```typescript
 * const points: Coordinate[] = [
 *   { x: 1, y: 2 },
 *   { x: 5, y: 1 },
 *   { x: 3, y: 6 },
 *   { x: 0, y: 3 }
 * ];
 *
 * const box = boundingBox(points);
 * // Result: {
 * //   min: { x: 0, y: 1 },
 * //   max: { x: 5, y: 6 }
 * // }
 *
 * // Empty array returns origin box
 * const emptyBox = boundingBox([]);  // { min: {0,0}, max: {0,0} }
 *
 * // Single point
 * const singleBox = boundingBox([{ x: 3, y: 4 }]);
 * // Result: { min: {3,4}, max: {3,4} }
 * ```
 */
declare const boundingBox: (points: Coordinate[]) => {
    min: Coordinate;
    max: Coordinate;
};
/**
 * Linear interpolation between two coordinates.
 * Returns a + t * (b - a) where t=0 gives a, t=1 gives b.
 *
 * @param a - Starting coordinate (t=0)
 * @param b - Ending coordinate (t=1)
 * @param t - Interpolation parameter (0 to 1 for interpolation, outside for extrapolation)
 * @returns The interpolated coordinate
 *
 * @example
 * ```typescript
 * const start: Coordinate = { x: 0, y: 0 };
 * const end: Coordinate = { x: 10, y: 20 };
 *
 * const middle = lerp(start, end, 0.5);    // { x: 5, y: 10 }
 * const quarter = lerp(start, end, 0.25);  // { x: 2.5, y: 5 }
 * const atStart = lerp(start, end, 0);     // { x: 0, y: 0 }
 * const atEnd = lerp(start, end, 1);       // { x: 10, y: 20 }
 *
 * // Extrapolation (t > 1 or t < 0)
 * const beyond = lerp(start, end, 1.5);    // { x: 15, y: 30 }
 * const before = lerp(start, end, -0.5);   // { x: -5, y: -10 }
 * ```
 */
declare const lerp: (a: Coordinate, b: Coordinate, t: number) => Coordinate;
/**
 * Clamps a coordinate to stay within specified bounds.
 * Constrains each component to the range [min, max].
 *
 * @param v - The coordinate to clamp
 * @param min - Minimum allowed values for each component
 * @param max - Maximum allowed values for each component
 * @returns The clamped coordinate
 *
 * @example
 * ```typescript
 * const point: Coordinate = { x: 15, y: -5 };
 * const minBounds: Coordinate = { x: 0, y: 0 };
 * const maxBounds: Coordinate = { x: 10, y: 10 };
 *
 * const clamped = clamp(point, minBounds, maxBounds);
 * // Result: { x: 10, y: 0 }
 *
 * // Already within bounds
 * const inside: Coordinate = { x: 5, y: 3 };
 * const unchanged = clamp(inside, minBounds, maxBounds);
 * // Result: { x: 5, y: 3 }
 *
 * // Useful for keeping coordinates in viewport
 * const screenBounds = { min: { x: 0, y: 0 }, max: { x: 1920, y: 1080 } };
 * ```
 */
declare const clamp: (v: Coordinate, min: Coordinate, max: Coordinate) => Coordinate;

/**
 * @fileoverview Coordinate utility functions for common operations.
 * Provides helper functions for coordinate manipulation, comparison, and copying.
 * @module CoordinatesUtils
 */

/**
 * Returns a coordinate with the minimum x and y values from two input coordinates.
 * Performs component-wise minimum operation.
 *
 * @param a - First coordinate
 * @param b - Second coordinate
 * @returns Coordinate with min(a.x, b.x) and min(a.y, b.y)
 *
 * @example
 * ```typescript
 * const pointA: Coordinate = { x: 5, y: 10 };
 * const pointB: Coordinate = { x: 3, y: 15 };
 *
 * const min = minCoordinate(pointA, pointB);  // { x: 3, y: 10 }
 *
 * // Useful for bounding box calculations
 * const topLeft = minCoordinate(
 *   { x: 100, y: 50 },
 *   { x: 80, y: 70 }
 * );  // { x: 80, y: 50 }
 *
 * // Works with negative coordinates
 * const negative = minCoordinate(
 *   { x: -5, y: 2 },
 *   { x: 3, y: -8 }
 * );  // { x: -5, y: -8 }
 * ```
 */
declare const minCoordinate: (a: Coordinate, b: Coordinate) => Coordinate;
/**
 * Returns a coordinate with the maximum x and y values from two input coordinates.
 * Performs component-wise maximum operation.
 *
 * @param a - First coordinate
 * @param b - Second coordinate
 * @returns Coordinate with max(a.x, b.x) and max(a.y, b.y)
 *
 * @example
 * ```typescript
 * const pointA: Coordinate = { x: 5, y: 10 };
 * const pointB: Coordinate = { x: 3, y: 15 };
 *
 * const max = maxCoordinate(pointA, pointB);  // { x: 5, y: 15 }
 *
 * // Useful for bounding box calculations
 * const bottomRight = maxCoordinate(
 *   { x: 100, y: 50 },
 *   { x: 80, y: 70 }
 * );  // { x: 100, y: 70 }
 *
 * // Combined with minCoordinate for bounding box
 * const points = [{ x: 10, y: 5 }, { x: 3, y: 12 }, { x: 8, y: 2 }];
 * const min = points.reduce(minCoordinate);
 * const max = points.reduce(maxCoordinate);
 * // Bounding box: { min: {3, 2}, max: {10, 12} }
 * ```
 */
declare const maxCoordinate: (a: Coordinate, b: Coordinate) => Coordinate;
/**
 * Creates a shallow copy of a coordinate.
 * Returns a new coordinate object with the same x and y values.
 *
 * @param coord - The coordinate to copy
 * @returns A new coordinate with identical values
 *
 * @example
 * ```typescript
 * const original: Coordinate = { x: 10, y: 20 };
 * const copy = copyCoordinate(original);  // { x: 10, y: 20 }
 *
 * // Modifications to copy don't affect original
 * copy.x = 30;
 * console.log(original.x);  // Still 10
 * console.log(copy.x);     // Now 30
 *
 * // Useful for immutable operations
 * const points: Coordinate[] = [
 *   { x: 1, y: 2 },
 *   { x: 3, y: 4 }
 * ];
 * const copiedPoints = points.map(copyCoordinate);
 *
 * // Safe transformation without mutation
 * const transformedPoint = copyCoordinate(original);
 * transformedPoint.x += 5;
 * transformedPoint.y *= 2;
 * ```
 */
declare const copyCoordinate: (coord: Coordinate) => Coordinate;

/**
 * @fileoverview 2x2 matrix algebra operations for geometric transformations.
 * Provides matrix constants and operations for coordinate transformations in 2D space.
 * @module MatrixAlgebra
 */

/**
 * The 2x2 identity matrix.
 * Leaves coordinates unchanged when multiplied.
 *
 * @example
 * ```typescript
 * // Identity matrix: [[1, 0], [0, 1]]
 * const point: Coordinate = { x: 5, y: 3 };
 * const unchanged = multiply(unitMatrix, point);  // { x: 5, y: 3 }
 *
 * // Useful as starting point for transformations
 * const customMatrix = unitMatrix.map(row => [...row]);
 * ```
 */
declare const unitMatrix: UnitMatrix<1>;
/**
 * The 2x2 zero matrix.
 * Maps all coordinates to the origin (0, 0).
 *
 * @example
 * ```typescript
 * // Zero matrix: [[0, 0], [0, 0]]
 * const point: Coordinate = { x: 10, y: 20 };
 * const origin = multiply(zeroMatrix, point);  // { x: 0, y: 0 }
 *
 * // Useful for nullifying transformations
 * ```
 */
declare const zeroMatrix: UnitMatrix<0>;
/**
 * Reflection matrix across the X-axis.
 * Negates the y-coordinate while preserving the x-coordinate.
 *
 * @example
 * ```typescript
 * // Reflection on X-axis: [[1, 0], [0, -1]]
 * const point: Coordinate = { x: 5, y: 3 };
 * const reflected = multiply(reflectionOnXAxis, point);  // { x: 5, y: -3 }
 *
 * // Mirror points across horizontal axis
 * const upperPoint = { x: 2, y: 4 };
 * const lowerPoint = multiply(reflectionOnXAxis, upperPoint);  // { x: 2, y: -4 }
 * ```
 */
declare const reflectionOnXAxis: Matrix2x2;
/**
 * Reflection matrix across the Y-axis.
 * Negates the x-coordinate while preserving the y-coordinate.
 *
 * @example
 * ```typescript
 * // Reflection on Y-axis: [[-1, 0], [0, 1]]
 * const point: Coordinate = { x: 5, y: 3 };
 * const reflected = multiply(reflectionOnYAxis, point);  // { x: -5, y: 3 }
 *
 * // Mirror points across vertical axis
 * const rightPoint = { x: 7, y: 2 };
 * const leftPoint = multiply(reflectionOnYAxis, rightPoint);  // { x: -7, y: 2 }
 * ```
 */
declare const reflectionOnYAxis: Matrix2x2;
/**
 * Creates a 2x2 rotation matrix for clockwise rotation by the specified angle.
 * Uses standard rotation matrix formula with trigonometric functions.
 *
 * @param theta - The rotation angle in radians (positive for clockwise rotation)
 * @returns 2x2 rotation matrix
 *
 * @example
 * ```typescript
 * // 90-degree clockwise rotation
 * const rotate90 = rotationByThetaClockWise(Math.PI / 2);
 * const point = { x: 1, y: 0 };
 * const rotated = multiply(rotate90, point);  // { x: 0, y: -1 }
 *
 * // 45-degree rotation
 * const rotate45 = rotationByThetaClockWise(Math.PI / 4);
 * const diagonal = multiply(rotate45, { x: 1, y: 1 });
 * // Result: approximately { x: 1.414, y: 0 }
 *
 * // 180-degree rotation (equivalent to point inversion)
 * const rotate180 = rotationByThetaClockWise(Math.PI);
 * const inverted = multiply(rotate180, { x: 3, y: 4 });  // { x: -3, y: -4 }
 *
 * // Convert degrees to radians
 * const rotateByDegrees = (degrees: number) =>
 *   rotationByThetaClockWise(degrees * Math.PI / 180);
 * ```
 */
declare const rotationByThetaClockWise: (theta: number) => Matrix2x2;
/**
 * Multiplies a 2x2 matrix by a coordinate vector.
 * Performs matrix-vector multiplication: M * v where M is 2x2 and v is 2x1.
 *
 * @param matrix - The 2x2 transformation matrix
 * @param v - The coordinate vector to transform
 * @returns The transformed coordinate
 *
 * @example
 * ```typescript
 * // Basic matrix multiplication
 * const matrix: Matrix2x2 = [[2, 0], [0, 3]];
 * const point: Coordinate = { x: 4, y: 5 };
 * const result = multiply(matrix, point);  // { x: 8, y: 15 }
 *
 * // Chain transformations
 * const scale2x = [[2, 0], [0, 2]];
 * const rotate90 = rotationByThetaClockWise(Math.PI / 2);
 *
 * const original = { x: 1, y: 1 };
 * const scaled = multiply(scale2x, original);     // { x: 2, y: 2 }
 * const rotated = multiply(rotate90, scaled);     // { x: 2, y: -2 }
 *
 * // Identity transformation
 * const unchanged = multiply(unitMatrix, point);  // { x: 4, y: 5 }
 *
 * // Formula: [a b] * [x] = [ax + by]
 * //          [c d]   [y]   [cx + dy]
 * ```
 */
declare const multiply: (matrix: Matrix2x2, v: Coordinate) => Coordinate;

/**
 * @fileoverview Layout templates catalog for CSS Grid layout system.
 * Provides pre-defined layout configurations organized by categories and use cases.
 * @module LayoutsCatalog
 */
/**
 * Union type of all available catalog categories.
 * Extracts the top-level keys from the layouts catalog.
 */
type CatalogEntries = keyof typeof layoutsCatalog;
/**
 * Union type of layout names within a specific catalog category.
 * Extracts the layout keys for a given category.
 *
 * @template K - The catalog category to get layout entries for
 */
type LayoutsEntries<K extends CatalogEntries> = keyof (typeof layoutsCatalog)[K];
/**
 * Type of the complete layouts catalog.
 * Provides type safety for the entire catalog structure.
 */
type LayoutsCatalog = typeof layoutsCatalog;
/**
 * Retrieves all available catalog category keys.
 * Returns an array of category names for iterating through the catalog.
 *
 * @returns Array of catalog category names
 *
 * @example
 * ```typescript
 * const categories = getCatalogCategoryKeys();
 * // Result: ['primary20', 'secondary']
 *
 * categories.forEach(category => {
 *   console.log(`Available category: ${category}`);
 * });
 * ```
 */
declare const getCatalogCategoryKeys: () => CatalogEntries[];
/**
 * Retrieves all layout keys for a specific catalog category.
 * Returns an array of layout names within the specified category.
 *
 * @template K - The catalog category type
 * @param catalogKey - The category to get layouts for
 * @returns Array of layout names in the specified category
 *
 * @example
 * ```typescript
 * const primary20Layouts = getLayoutKeysForCategory('primary20');
 * // Result: ['page_band', 'page_headerContentFooter', 'page_twoCol_10_10', ...]
 *
 * const secondaryLayouts = getLayoutKeysForCategory('secondary');
 * // Result: ['singleCell', 'twoCells', 'sideBarAndContent', ...]
 * ```
 */
declare const getLayoutKeysForCategory: <K extends CatalogEntries>(catalogKey: K) => LayoutsEntries<K>[];
/**
 * Retrieves a specific layout from the catalog with type safety.
 * Returns a deep clone of the layout to prevent mutations of the original template.
 *
 * @template K - The catalog category type
 * @template L - The layout name type within the category
 * @param catalogKey - The category containing the desired layout
 * @param layoutKey - The name of the layout to retrieve
 * @returns A deep clone of the requested layout
 *
 * @example
 * ```typescript
 * // Get a two-column layout from primary20 category
 * const twoColLayout = getLayoutFromCatalog('primary20', 'page_twoCol_10_10');
 *
 * // Get a simple layout from secondary category
 * const singleLayout = getLayoutFromCatalog('secondary', 'singleCell');
 *
 * // Use in layout configuration
 * const myLayout = getLayoutFromCatalog('primary20', 'page_headerContentFooter');
 * // Safe to modify myLayout without affecting the catalog
 * ```
 */
declare const getLayoutFromCatalog: <K extends CatalogEntries, L extends LayoutsEntries<K>>(catalogKey: K, layoutKey: L) => LayoutsCatalog[K][L];
/**
 * Comprehensive catalog of pre-defined layout templates.
 * Organized into categories based on grid complexity and use cases.
 *
 * Categories:
 * - `primary20`: Layouts designed for 20-column grids, suitable for desktop/wide screens
 * - `secondary`: Simpler layouts with flexible column counts, suitable for smaller screens
 *
 * Available layouts:
 *
 * **Primary20 Category (20-column grid layouts):**
 * - `page_band`: Single full-width band layout
 * - `page_headerContentFooter`: Classic header-content-footer structure
 * - `page_twoCol_10_10`: Equal two-column layout (50/50 split)
 * - `page_twoCol_5_15`: Narrow sidebar with wide content (25/75 split)
 * - `page_twoCol_15_5`: Wide content with narrow sidebar (75/25 split)
 * - `page_twoCol_4_16`: Very narrow sidebar layout (20/80 split)
 * - `page_twoCol_16_4`: Maximum content with minimal sidebar (80/20 split)
 * - `page_twoCol_8_12`: Medium sidebar with main content (40/60 split)
 * - `page_twoCol_12_8`: Main content with medium sidebar (60/40 split)
 * - `page_threeCol_5_10_5`: Balanced three-column with central focus
 * - `page_docs_3_14_3`: Documentation style with narrow sidebars
 * - `page_docs_4_12_4`: Wider documentation layout
 * - `page_fourCol_5_5_5_5`: Equal four-column grid
 * - `page_dashboard_kpis_then_content`: Dashboard with KPI row and content section
 *
 * **Secondary Category (Flexible responsive layouts):**
 * - `singleCell`: Minimal single block layout
 * - `twoCells`: Simple two equal blocks
 * - `sideBarAndContent`: Sidebar with wider content area
 * - `footerHeader5Columns`: Header/footer with 5-column content grid
 * - `footerHeader3Columns`: Header/footer with 3-column content
 * - `header2colFooter`: Header with 2-column content and footer
 * - `header3colFooter`: Header with 3-column content and footer
 * - `twoRowsOf3`: Grid with two rows of 3 columns each
 * - `twoRowsOf6`: Dense grid with two rows of 6 columns each
 * - `mixedDensityShowcase`: Progressive grid with increasing column density
 * - `featuredRow4`: 4 blocks with one double-wide featured block
 * - `featuredRow5`: 5 blocks with one double-wide featured block
 * - `featuredRow5Big`: 5 blocks with one triple-wide featured block
 *
 * Each layout is a complete Layout configuration with sections, blocks, and span definitions.
 * All layouts use the spanX/spanY system to define block dimensions within their grid context.
 */
declare const layoutsCatalog: {
    /**
     * Primary20 category: Layout templates designed for 20-column grids.
     * These layouts are optimized for desktop and wide-screen displays.
     * All spanX values are calculated based on a 20-column grid system.
     */
    primary20: {
        /**
         * Single full-width band layout.
         * Contains one row with a single block spanning the full 20 columns.
         * Perfect for hero sections, banners, or simple single-content pages.
         */
        page_band: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Classic header-content-footer layout.
         * Three-section vertical layout with full-width sections.
         * Standard pattern for most web pages and applications.
         */
        page_headerContentFooter: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            content: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Equal two-column layout (10/10 split).
         * Header and footer span full width, main content split evenly.
         * Ideal for balanced content presentation or comparison layouts.
         */
        page_twoCol_10_10: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Narrow sidebar with wide content (5/15 split).
         * Left sidebar takes 25% width, content area takes 75%.
         * Common for navigation + content layouts.
         */
        page_twoCol_5_15: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Wide content with narrow sidebar (15/5 split).
         * Content area takes 75% width, right sidebar takes 25%.
         * Useful for primary content with secondary information.
         */
        page_twoCol_15_5: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Very narrow sidebar layout (4/16 split).
         * Minimal sidebar for icons/navigation, maximum content space.
         * Suitable for app interfaces with icon-based navigation.
         */
        page_twoCol_4_16: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Wide content with very narrow sidebar (16/4 split).
         * Maximum content space with minimal sidebar.
         * Mirror of the 4/16 layout with sidebar on the right.
         */
        page_twoCol_16_4: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Medium sidebar with main content (8/12 split).
         * Sidebar takes 40% width, content takes 60%.
         * Good balance for secondary navigation and content.
         */
        page_twoCol_8_12: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Main content with medium sidebar (12/8 split).
         * Content takes 60% width, sidebar takes 40%.
         * Mirror of the 8/12 layout with sidebar on the right.
         */
        page_twoCol_12_8: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Balanced three-column layout (5/10/5 split).
         * Equal sidebars with wider central content area.
         * Classic layout for content with two complementary sidebars.
         */
        page_threeCol_5_10_5: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Documentation-style layout (3/14/3 split).
         * Narrow sidebars with maximum central content space.
         * Optimized for reading experiences with minimal distractions.
         */
        page_docs_3_14_3: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Wider documentation layout (4/12/4 split).
         * Slightly wider sidebars for more navigation or content options.
         * Balance between content focus and sidebar functionality.
         */
        page_docs_4_12_4: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Equal four-column layout (5/5/5/5 split).
         * Perfect symmetry with four equal content areas.
         * Ideal for feature showcases, product grids, or dashboard cards.
         */
        page_fourCol_5_5_5_5: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Dashboard layout with KPI row and content section.
         * Top row for key performance indicators (4 equal blocks).
         * Bottom section with sidebar and main content area.
         * Perfect for admin dashboards and analytics interfaces.
         */
        page_dashboard_kpis_then_content: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            main: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
            };
            content: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
    };
    /**
     * Secondary category: Flexible layouts with adaptive column counts.
     * These layouts are designed to be more responsive and work well on various screen sizes.
     * Column counts are minimal and can be adapted to different grid systems.
     */
    secondary: {
        /**
         * Minimal single cell layout.
         * Contains one block in one row - simplest possible layout.
         * Perfect for landing pages, simple forms, or focused content.
         */
        singleCell: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Simple two-cell layout.
         * Two blocks side by side in equal proportions.
         * Basic building block for comparison layouts.
         */
        twoCells: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Sidebar with content layout.
         * Small sidebar (1 unit) with wider content area (5 units).
         * Responsive alternative to fixed-width sidebar layouts.
         */
        sideBarAndContent: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Header-footer layout with 5-column content.
         * Header and footer with sidebar/content split.
         * Content area has 5 equal columns for flexible organization.
         */
        footerHeader5Columns: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            content: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Simple header-content-footer with 3 columns.
         * Equal-width content columns for balanced presentation.
         * Clean and symmetric layout for basic content organization.
         */
        footerHeader3Columns: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            content: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Header with 2-column content and footer.
         * Minimal header/footer with two-column content area.
         * Perfect for simple comparison or side-by-side content.
         */
        header2colFooter: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            content: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Header with 3-column content and footer.
         * Similar to header2colFooter but with three content columns.
         * Good for feature showcases or service presentations.
         */
        header3colFooter: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            content: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Two rows with 3 columns each.
         * Grid of 6 equal blocks arranged in 2 rows.
         * Perfect for feature grids, team members, or product showcases.
         */
        twoRowsOf3: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            row_2: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Two rows with 6 columns each.
         * Dense grid of 12 equal blocks for extensive content.
         * Suitable for galleries, portfolios, or comprehensive listings.
         */
        twoRowsOf6: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
                block_6: {
                    spanX: number;
                    spanY: number;
                };
            };
            row_2: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
                block_6: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Mixed density showcase layout.
         * Progressive grid that starts simple and becomes more complex.
         * Demonstrates increasing content density from 1 to 5 columns per row.
         * Perfect for showcasing scalability or progressive disclosure.
         */
        mixedDensityShowcase: {
            header: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
            };
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
            };
            row_2: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
            };
            row_3: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
            };
            row_4: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
            };
            footer: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
                block_6: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Featured row with 4 blocks (one double-wide).
         * Second block spans 2 columns for emphasis.
         * Great for highlighting featured content alongside regular items.
         */
        featuredRow4: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Featured row with 5 blocks (one double-wide).
         * Similar to featuredRow4 but with additional content block.
         * Balances featured content with more supporting elements.
         */
        featuredRow5: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
        /**
         * Featured row with prominent triple-wide block.
         * Second block spans 3 columns for maximum emphasis.
         * Perfect for hero content with minimal supporting elements.
         */
        featuredRow5Big: {
            row_1: {
                block_1: {
                    spanX: number;
                    spanY: number;
                };
                block_2: {
                    spanX: number;
                    spanY: number;
                };
                block_3: {
                    spanX: number;
                    spanY: number;
                };
                block_4: {
                    spanX: number;
                    spanY: number;
                };
                block_5: {
                    spanX: number;
                    spanY: number;
                };
            };
        };
    };
};

/**
 * @fileoverview Layout theme type definitions for CSS Grid layout system.
 * Defines theming interfaces that provide styling and transformation behaviors for layouts.
 * Themes control how layouts are rendered, transformed, and visually presented.
 * The examples in the comments below dont all compile. Correct examples are at the end of
 * the file.
 * @module LayoutThemeTypes
 */

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
type ThemeForLayout<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs> = {
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
    resolveBoxSpan: <S extends SectionIDs, B extends BlocksIDs>(section: S, boxId: B, layout: Layout<sectionIDS, blockIDS>, span: BoxSpan, bp: (typeof BREAKPOINTS)[number]) => GridBox;
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
    sectionBoxTransforms: <S extends SectionIDs, B extends BlocksIDs>(section: S, layout: Layout<sectionIDS, blockIDS>) => BoxTransformations<B>;
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
    layoutTransforms: (layout: Layout<sectionIDS, blockIDS>) => BoxTransformations<sectionIDS>;
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

/**
 * @fileoverview Default layout theme implementation for CSS Grid layout system.
 * Provides a complete, production-ready theme with sensible defaults for all layout scenarios.
 * This theme serves as both a working implementation and a reference for creating custom themes.
 * @module DefaultLayoutTheme
 */

/**
 * Good boring defaults for CSS Grid items.
 * - minWidth0/minHeight0 prevent overflow caused by min-size:auto
 * - stretch fills the grid area by default
 */
declare const DEFAULT_GRID_NODE_VIEW_OPTIONS: {
    readonly minWidth0: true;
    readonly minHeight0: true;
    readonly justifySelf: "stretch";
    readonly alignSelf: "stretch";
    readonly pointerEvents: "auto";
    readonly dataAttrs: {};
    readonly aria: {};
    readonly visibility: "visible";
};
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
declare function resolveGridNodeViewOptions(opts?: GridNodeViewOptions): {
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
};
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
declare const DEFAULT_GRID_OPTIONS: {
    readonly implicitRowUnits: {
        readonly value: 1;
        readonly unit: "fr";
    };
    readonly implicitColumnUnits: {
        readonly value: 1;
        readonly unit: "fr";
    };
    readonly overflow: "visible";
    readonly autoFlow: "row";
    readonly justifyItems: "stretch";
    readonly alignItems: "stretch";
    readonly justifyContent: "start";
    readonly alignContent: "start";
    readonly gap: {
        readonly value: 0;
        readonly unit: "px";
    };
    readonly rowGap: {
        readonly value: 0;
        readonly unit: "px";
    };
    readonly columnGap: {
        readonly value: 0;
        readonly unit: "px";
    };
};
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
declare function resolveGridOptions(opts?: Partial<GridOptions>): GridOptions;
/**
 * Default responsive transformations for horizontal layouts (rows).
 * Stacks vertically on mobile, switches to horizontal on larger screens.
 * Ideal for navigation bars, button groups, or horizontal content sections.
 *
 * @constant
 * @type {BoxTransformations<NodeID>}
 */
declare const DefaultTransformationsResponsiveRows: {
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
/**
 * Default responsive transformations for vertical layouts (columns).
 * Maintains vertical stacking across all breakpoints.
 * Ideal for main content areas, article layouts, or form sections.
 *
 * @constant
 * @type {BoxTransformations<NodeID>}
 */
declare const DefaultTransformationsResponsiveColumns: {
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
declare const getDefaultTheme: <sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(layout: Layout<sectionIDS, blockIDS>) => {
    resolveBoxSpan: <S extends SectionIDs, B extends BlocksIDs>(section: S, boxId: B, layout: Layout<sectionIDS, blockIDS>, span: BoxSpan, bp: (typeof BREAKPOINTS)[number]) => GridBox;
    sectionBoxTransforms: <S extends SectionIDs, B_1 extends BlocksIDs>(section: S, layout: Layout<sectionIDS, blockIDS>) => {
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
    layoutTransforms: (layout: Layout<sectionIDS, blockIDS>) => {
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
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block identifiers
 * @property layout - Input layout definition before transformation processing
 * @property diagnostics - Array to collect errors, warnings, and diagnostic information
 * @property theme - Optional layout theme for applying transformations and styling
 * @property gridDiagnostic - Optional validation configuration for overlap detection
 */
type CSSLayoutProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
    layout: Layout<sectionIDs, blockIDs>;
    diagnostics: DiagnosticEntry[];
    theme?: ThemeForLayout<sectionIDs, blockIDs>;
    gridDiagnostic?: GridDiagnostic;
};
/**
 * Main CSS Layout transformation function
 *
 * Orchestrates the complete transformation pipeline from layout definition
 * to final CSS Grid coordinates. This is the primary entry point that handles
 * the entire layout processing workflow internally.
 *
 * Complete Transformation Pipeline:
 * 1. layoutToTx - Applies theme transformations and converts to LayoutWithTx
 * 2. layoutTxToSectionLocal - Resolves transformations to local section coordinates
 * 3. layoutSectionToBounds - Calculates bounding boxes for each section
 * 4. layoutSectionBtoAbsolute - Converts to absolute CSS Grid coordinates
 * 5. checkSectionsOverlap - Validates for overlapping elements (if enabled)
 *
 * Features:
 * - Handles multi-breakpoint responsive layouts automatically
 * - Applies theme-based transformations (stacking, positioning, spacing)
 * - Provides configurable overlap detection and validation
 * - Generates comprehensive diagnostic reporting
 *
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block identifiers
 * @param props - Configuration object containing layout definition and options
 * @returns Complete layout with absolute CSS Grid coordinates for all sections and blocks
 *
 * @example
 * ```typescript
 * const diagnostics: DiagnosticEntry[] = [];
 * const layoutAbsolute = CSSLayout({
 *   layout: myLayout,
 *   diagnostics,
 *   theme: customTheme, // optional
 *   gridDiagnostic: { overlapPolicy: 'warn' } // optional
 * });
 * ```
 */
declare function CSSLayout<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>({ layout, diagnostics, theme, gridDiagnostic, }: CSSLayoutProps<sectionIDs, blockIDs>): LayoutAbsolute<sectionIDs, blockIDs>;
/**
 * Check for overlapping boxes across all sections and report violations
 *
 * This function performs comprehensive overlap detection across the entire layout,
 * checking all boxes against each other within each breakpoint. It generates
 * detailed diagnostic reports for any overlaps found.
 *
 * Algorithm:
 * 1. Flatten all boxes from all sections into a single list per breakpoint
 * 2. Compare every box against every other box (O(n²) complexity)
 * 3. For each overlap, generate detailed diagnostic information
 * 4. Add warnings or errors to diagnostics based on overlap policy
 *
 * @template sectionIDs - Section identifier type
 * @template blockIDs - Block identifier type
 * @param layoutAbsolute - Layout with final absolute CSS coordinates
 * @param diagnostics - Array to add overlap reports to
 * @param overlapPolicy - Whether to generate warnings or errors for overlaps
 * @param breakpoints - Which breakpoints to check for overlaps
 */
declare function checkSectionsOverlap<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(layoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs>, diagnostics: DiagnosticEntry[], overlapPolicy: "warn" | "error", breakpoints: readonly (typeof BREAKPOINTS)[number][]): void;

/**
 * Layout Section Bounds to Absolute
 *
 * This module converts layout sections with bounding boxes to absolute CSS grid coordinates.
 * It performs coordinate transformations to position sections and their contained boxes
 * in absolute CSS grid coordinates, handling responsive breakpoints and ensuring
 * all coordinates are positive (≥1) as required by CSS Grid specification.
 *
 * The transformation process involves:
 * 1. Converting box positions from local to relative-to-bounding-box coordinates
 * 2. Positioning bounding boxes at (1,1) and applying transformations
 * 3. Converting relative positions back to absolute coordinates
 * 4. Normalizing all coordinates to ensure they are ≥1
 */

/**
 * Convert layout sections with bounding boxes to absolute CSS grid coordinates
 *
 * This function performs a complex coordinate transformation process to convert
 * sections with bounded layouts into absolute CSS grid coordinates. The process
 * ensures all coordinates are valid for CSS Grid (≥1) and properly positioned.
 *
 * Transformation steps:
 * 1. Convert box origins from absolute to relative-to-bounding-box coordinates
 * 2. Position all bounding boxes at (1,1) as starting reference point
 * 3. Apply any configured transformations to bounding boxes
 * 4. Convert box coordinates back to absolute positions
 * 5. Calculate grid dimensions and normalize coordinates to positive values
 *
 * @template sectionIDs - Type representing the available section identifiers
 * @template blockIDs - Type representing the available block/box identifiers
 * @param layoutSectionBounds - Layout with sections and their calculated bounding boxes
 * @param diagnostics - Array to collect any errors or warnings during processing
 * @returns Layout with absolute CSS grid coordinates for all sections and boxes
 */
declare function layoutSectionBtoAbsolute<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(layoutSectionBounds: LayoutSectionBounds<sectionIDs, blockIDs>, diagnostics: DiagnosticEntry[]): LayoutAbsolute<sectionIDs, blockIDs>;

/**
 * Layout Section To Bounds
 *
 * This module converts layout sections with local positioning to sections with bounding boxes.
 * It calculates the minimum bounding rectangle that contains all boxes within each section
 * across different breakpoints (responsive design sizes).
 */

/**
 * Convert layout sections with local positioning to sections with bounding boxes
 *
 * This function calculates the minimum bounding rectangle (bounds) that contains all boxes
 * within each section across different responsive breakpoints. It processes each section
 * and breakpoint combination to find the smallest rectangle that encompasses all boxes.
 *
 * @template sectionIDs - Type representing the available section identifiers
 * @template blockIDs - Type representing the available block/box identifiers
 * @param layoutSectionLocal - Layout with sections containing boxes positioned locally
 * @param diagnostics - Array to collect any errors or warnings during processing
 * @returns Layout with calculated bounding boxes for each section at each breakpoint
 */
declare function layoutSectionToBounds<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(layoutSectionLocal: LayoutSectionLocal<sectionIDs, blockIDs>, diagnostics: DiagnosticEntry[]): LayoutSectionBounds<sectionIDs, blockIDs>;

/**
 * @fileoverview Layout transformation to section-local coordinate conversion.
 * Converts layout transformations into section-local coordinates and applies box transformations.
 * Handles the transition from layout-level coordinates to section-specific positioning.
 * @module LayoutTxToSectionLocal
 */

/**
 * Converts a layout with transformations into section-local coordinate space.
 * This function processes the transformation pipeline by applying section-level box transformations
 * while maintaining the layout structure in local coordinates relative to each section.
 *
 * Processing pipeline:
 * 1. Initializes default box transformations for movement operations
 * 2. Creates section-local layout structure with grid boxes from the layout transformation
 * 3. Copies grid box data for each breakpoint to maintain positioning information
 * 4. Applies section-specific transformations using the box movement system
 * 5. Returns the final layout in section-local coordinate space
 *
 * Key behaviors:
 * - Preserves layout-level transformations in the output structure
 * - Converts grid boxes from layout coordinates to section-relative coordinates
 * - Applies transformation functions (stacking, alignment, etc.) within each section
 * - Collects diagnostic information for any transformation issues
 * - Handles missing transformations gracefully by skipping affected sections
 *
 * @template sectionIDs - The section identifier types for this layout
 * @template blockIDs - The block identifier types for this layout
 * @param layoutTx - Layout with transformations containing positioned grid boxes
 * @param diagnostics - Array to collect diagnostic information and errors during processing
 * @returns Layout in section-local coordinates with applied transformations
 *
 * @example
 * ```typescript
 * const layoutWithTx: LayoutWithTx<'header' | 'main', 'block_1' | 'block_2'> = {
 *   sections: {
 *     header: {
 *       gridBoxes: { xs: { block_1: gridBox1 }, md: { block_1: gridBox1 } },
 *       transformations: { xs: [{ stackHorizontally: {} }] }
 *     }
 *   },
 *   transformations: { xs: [{ stackVertically: {} }] }
 * };
 *
 * const diagnostics: DiagnosticEntry[] = [];
 * const sectionLocal = layoutTxToSectionLocal(layoutWithTx, diagnostics);
 *
 * // Result contains section-relative positioned boxes with applied transformations
 * // sectionLocal.sections[sectionId][breakpoint][blockId] = transformed GridBox
 * ```
 */
declare function layoutTxToSectionLocal<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(layoutTx: LayoutWithTx<sectionIDs, blockIDs>, diagnostics: DiagnosticEntry[]): LayoutSectionLocal<sectionIDs, blockIDs>;

/**
 * @fileoverview Layout to transformation converter for CSS Grid layout system.
 * Transforms abstract layout definitions into concrete grid transformations with positioning data.
 * Handles the conversion from layout specifications to executable grid configurations across breakpoints.
 * @module LayoutToTx
 */

/**
 * Extracts section keys that are actually present in the layout at runtime.
 * Provides both runtime and type safety by filtering based on value existence rather than just key presence.
 * This prevents processing of undefined or null sections that might exist as keys but have no content.
 *
 * Key behaviors:
 * - Filters by VALUE existence, not just key presence
 * - Runtime-safe boundary checking prevents null reference errors
 * - Type-safe return maintains compile-time guarantees
 * - Handles dynamic layout structures where sections may be conditionally defined
 *
 * @template L - The layout type to extract section keys from
 * @param layout - The layout object to extract present section keys from
 * @returns Array of section IDs that have actual content (not null/undefined)
 *
 * @example
 * ```typescript
 * const layout = {
 *   header: { block_1: { spanX: 2, spanY: 1 } },
 *   main: null, // This section will be filtered out
 *   footer: { block_2: { spanX: 1, spanY: 1 } }
 * };
 *
 * const presentSections = layoutSectionKeysPresent(layout);
 * // Returns: ['header', 'footer'] (main is excluded)
 * ```
 */
declare function layoutSectionKeysPresent<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(layout: Layout<sectionIDS, blockIDS>): Array<sectionIDS>;
/**
 * Runtime type guard to validate that a string matches the BlocksIDs pattern.
 * Ensures that only properly formatted block identifiers are processed, preventing
 * issues with malformed or unexpected keys that might exist in dynamic layouts.
 *
 * Block IDs must follow the pattern 'block_' followed by additional characters.
 * This function acts as a runtime safety net for type checking that can't be
 * enforced at compile time when dealing with dynamic object keys.
 *
 * @param k - The string to validate as a BlocksID
 * @returns True if the string is a valid BlocksID, false otherwise
 *
 * @example
 * ```typescript
 * isBlocksID('block_1'); // true
 * isBlocksID('block_header'); // true
 * isBlocksID('section_1'); // false
 * isBlocksID('invalid'); // false
 *
 * // Usage in filtering
 * const keys = Object.keys(someObject);
 * const blockKeys = keys.filter(isBlocksID);
 * ```
 */
declare function isBlocksID(k: string): k is BlocksIDs;
/**
 * Extracts block keys that are actually present within a specific section of a layout.
 * Provides type-safe access to blocks within a section, ensuring that the returned
 * block IDs are valid for the specific layout and section combination.
 *
 * Key features:
 * - Layout-bound generics tie L and S to actual runtime arguments
 * - No free-floating generic parameters that could cause type mismatches
 * - Runtime filtering ensures only valid block IDs are returned
 * - Type safety guarantees that returned IDs exist in the specified section
 *
 * This function is essential for the transformation pipeline as it ensures
 * that only blocks that actually exist in the layout are processed for grid conversion.
 *
 * @template L - The layout type (inferred from the layout parameter)
 * @template Sec - The section type (inferred from the section parameter, constrained to valid sections in L)
 * @param layout - The complete layout object
 * @param section - The section key to extract block keys from
 * @returns Array of block IDs that exist within the specified section
 *
 * @example
 * ```typescript
 * const layout = {
 *   header: { block_1: { spanX: 2, spanY: 1 }, block_2: { spanX: 1, spanY: 1 } },
 *   main: { block_3: { spanX: 4, spanY: 2 } }
 * };
 *
 * const headerBlocks = layoutBlockKeysPresent(layout, 'header');
 * // Returns: ['block_1', 'block_2']
 *
 * const mainBlocks = layoutBlockKeysPresent(layout, 'main');
 * // Returns: ['block_3']
 * ```
 */
declare function layoutBlockKeysPresent<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(layout: Layout<sectionIDS, blockIDS>, section: sectionIDS): Array<blockIDS>;
/**
 * Converts an abstract layout definition into a concrete layout with transformations and grid boxes.
 * This is the main transformation function that processes layout specifications and generates
 * executable grid configurations for all breakpoints using the provided or default theme.
 *
 * Processing pipeline:
 * 1. Applies default theme if none provided
 * 2. Extracts present sections from the layout
 * 3. For each section, extracts present blocks
 * 4. For each block at each breakpoint, resolves box spans to concrete GridBox coordinates
 * 5. Applies section and layout-level transformations
 * 6. Collects diagnostic information for any issues encountered
 *
 * Error handling:
 * - Missing sections are logged and skipped
 * - Missing box spans are logged and skipped
 * - Diagnostic entries provide detailed error information for debugging
 * - Process continues despite individual failures to maximize valid output
 *
 * @template L - The layout type being processed
 * @param layout - The abstract layout definition to convert
 * @param diagnostic - Array to collect diagnostic information and errors
 * @param theme - Optional theme for customizing the conversion process (uses default if not provided)
 * @returns Complete layout with transformations and positioned grid boxes for all breakpoints
 *
 * @example
 * ```typescript
 * const layout = {
 *   header: { block_1: { spanX: 4, spanY: 1 }, block_2: { spanX: 2, spanY: 1 } },
 *   main: { block_3: { spanX: 6, spanY: 4 } }
 * };
 *
 * const diagnostics: DiagnosticEntry[] = [];
 * const layoutWithTx = layoutToTx(layout, diagnostics);
 *
 * // Result contains:
 * // - layoutWithTx.sections[sectionId].gridBoxes[breakpoint][blockId] = GridBox
 * // - layoutWithTx.sections[sectionId].transformations = section-level transforms
 * // - layoutWithTx.transformations = layout-level transforms
 *
 * // Check for any issues
 * if (diagnostics.length > 0) {
 *   console.log('Processing issues:', diagnostics);
 * }
 * ```
 */
declare function layoutToTx<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(layout: Layout<sectionIDS, blockIDS>, diagnostic: DiagnosticEntry[], theme?: ThemeForLayout<sectionIDS, blockIDS>): LayoutWithTx<sectionIDS, blockIDS>;

/**
 * @fileoverview Default implementations of box transformation functions for CSS Grid layout system.
 * Provides concrete implementations for all transformation operations defined in boxTransformationsProps.
 * These functions modify box positions and dimensions in a sparse map object structure.
 * @module DefaultBoxTransformations
 */

/**
 * Factory function that creates the default transformation registry.
 * Returns a complete implementation of all box transformation functions
 * defined in the BoxMovesFunctions interface. This serves as the standard
 * implementation of the transformation system.
 *
 * The registry provides implementations for:
 * - `moveTo`: Move box to specific position or another box's anchor
 * - `moveBy`: Move box by relative amount
 * - `alignToY`: Align box vertically while preserving X position
 * - `alignToX`: Align box horizontally while preserving Y position
 * - `alignAllToX`: Align all boxes to same X coordinate
 * - `alignAllToY`: Align all boxes to same Y coordinate
 * - `stackHorizontally`: Arrange boxes in horizontal sequence
 * - `stackVertically`: Arrange boxes in vertical sequence
 *
 * @returns Complete registry of transformation functions
 *
 * @example
 * ```typescript
 * // Get the default transformation registry
 * const transformations = DefaultBoxTransformations();
 *
 * // Use a specific transformation
 * const result = transformations.moveTo({
 *   boxprops: {
 *     from: { boxId: 'block_1', anchor: 'center' },
 *     to: { x: 100, y: 200 }
 *   },
 *   boxes: myBoxes,
 *   diagnostics: []
 * });
 *
 * // Apply multiple transformations
 * transformations.stackHorizontally({
 *   boxprops: { gap: 20 },
 *   boxes: myBoxes,
 *   diagnostics: []
 * });
 *
 * transformations.alignAllToY({
 *   boxprops: { to: 100, anchor: 'center' },
 *   boxes: myBoxes,
 *   diagnostics: []
 * });
 * ```
 */
declare const DefaultBoxTransformations: () => BoxMovesFunctions<NodeID>;

/**
 * Transform Box Move Engine
 *
 * This module provides the core transformation engine that applies box movement and alignment
 * transformations to grid layouts. It processes transformation configurations across all
 * responsive breakpoints and applies them using a pluggable transformation factory.
 *
 * Supported Transformations:
 * - moveTo: Position box at specific coordinates
 * - moveBy: Translate box by offset amounts
 * - alignToX/alignToY: Align box to specific coordinate
 * - alignAllToX/alignAllToY: Align multiple boxes to same coordinate
 * - stackVertically/stackHorizontally: Arrange boxes in stacks
 *
 * The engine is type-safe and provides comprehensive error handling with detailed
 * diagnostic reporting for transformation failures.
 */

/**
 * Apply box movement transformations across all responsive breakpoints
 *
 * This is the main transformation engine that processes box transformation configurations
 * and applies them to grid layouts. It handles multiple transformation types and provides
 * comprehensive error handling and diagnostic reporting.
 *
 * Processing Flow:
 * 1. Iterate through each responsive breakpoint (xs, sm, md, lg, xl)
 * 2. For each breakpoint, process all configured transformations in sequence
 * 3. Validate transformation types and apply using the transformation factory
 * 4. Report errors and constraint violations through diagnostics
 *
 * @template BoxID - Type extending NodeID for box identifiers
 * @param transformationFactory - Factory providing transformation function implementations
 * @param boxTransformations - Configuration of transformations per breakpoint
 * @param gridBoxes - Grid boxes to transform, organized by breakpoint
 * @param diagnostics - Array to collect errors and warnings during processing
 */
declare const transformBoxMove: <BoxID extends NodeID>(transformationFactory: BoxMovesFunctions<BoxID>, boxTransformations: BoxTransformations<BoxID>, gridBoxes: BPs<Partial<Record<BoxID, GridBox>>>, diagnostics: DiagnosticEntry[]) => void;

/**
 * Creates a normalized {@link GridBox} from an origin and a diagonal vector.
 *
 * @remarks
 * - This function does not attach the box to any global grid; the coordinates
 *   are interpreted in an abstract local reference system.
 * - `origin` is treated as a position for the bottom-left corner.
 * - `diagonal` is treated as a size/extent vector; its components are made
 *   non-negative so that the resulting box has a well-defined width and height.
 *
 * @param origin - Bottom-left corner of the box in local coordinates.
 * @param diagonal - Vector from `origin` toward the opposite corner. Its `x`
 * and `y` components may be negative on input; they are converted to absolute
 * values during normalization.
 *
 * @returns A normalized {@link GridBox} where `diagonal.x` and `diagonal.y`
 * are guaranteed to be non-negative.
 */
declare const makeGridBox: (origin: Coordinate, diagonal: Coordinate) => GridBox;
/**
 * Creates a deep copy of an existing {@link GridBox}.
 *
 * @remarks
 * The returned box preserves the `_normalized` brand and assumes that the
 * input already satisfies the `GridBox` invariants.
 *
 * @param box - The box to copy.
 * @returns A new {@link GridBox} with copied `origin` and `diagonal`.
 */
declare const copyGridBox: (box: GridBox) => GridBox;

/**
 * @fileoverview Box position utilities for grid layout system.
 * Provides functions to calculate specific anchor points within boxes.
 * @module BoxPositions
 */

/**
 * Calculates the coordinate position of a specific anchor point within a box.
 *
 * @param box - The grid box object containing origin and diagonal properties
 * @param boxAnchor - The anchor position to calculate: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'center'
 * @returns The coordinate of the specified anchor point, or undefined if anchor is invalid
 *
 * @example
 * ```typescript
 * // 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'center'
 * const box = { origin: { x: 0, y: 0 }, diagonal: { x: 100, y: 50 } };
 * const centerPos = boxPosition(box, 'center');
 * ```
 */
declare const boxPosition: GridBoxPointPosition;

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

export { BPs, BREAKPOINTS, BlocksIDs, BoxMovesFunctions, BoxSpan, BoxTransformations, CSSLayout, type CatalogEntries, Coordinate, DEFAULT_GRID_NODE_VIEW_OPTIONS, DEFAULT_GRID_OPTIONS, DefaultBoxTransformations, DefaultTransformationsResponsiveColumns, DefaultTransformationsResponsiveRows, DiagnosticEntry, type DiagonalMatrix, GridBox, GridBoxPointPosition, GridNodeViewOptions, GridOptions, Layout, LayoutAbsolute, LayoutSectionBounds, LayoutSectionLocal, LayoutWithTx, type LayoutsCatalog, type LayoutsEntries, type Matrix2x2, NodeID, SectionIDs, type SymmetricMatrix, type ThemeForLayout, type UnitMatrix, addCoordinates, angleBetween, boundingBox, boxPosition, checkSectionsOverlap, clamp, copyCoordinate, copyGridBox, distance, dot, getCatalogCategoryKeys, getDefaultTheme, getLayoutFromCatalog, getLayoutKeysForCategory, getOrigin, invert, isBlocksID, layoutBlockKeysPresent, layoutSectionBtoAbsolute, layoutSectionKeysPresent, layoutSectionToBounds, layoutToTx, layoutTxToSectionLocal, lerp, linearCombination, makeGridBox, maxCoordinate, minCoordinate, multiply, multiplyScalar, norm, normalize, reflectOnXAxis, reflectOnYAxis, reflectionOnXAxis, reflectionOnYAxis, resolveGridNodeViewOptions, resolveGridOptions, rotateByClockWise, rotationByThetaClockWise, subtractCoordinates, transformBoxMove, typedKeys, unitMatrix, zeroMatrix };
