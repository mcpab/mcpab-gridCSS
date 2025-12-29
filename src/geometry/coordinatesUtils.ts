/**
 * @fileoverview Coordinate utility functions for common operations.
 * Provides helper functions for coordinate manipulation, comparison, and copying.
 * @module CoordinatesUtils
 */

import { Coordinate } from "./coordinateTypes";

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
export const minCoordinate = (a: Coordinate, b: Coordinate): Coordinate => {
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) };
}

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
export const maxCoordinate = (a: Coordinate, b: Coordinate): Coordinate => {
    return { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) };
}

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
export const copyCoordinate = (coord: Coordinate): Coordinate => {
    return { x: coord.x, y: coord.y };
}

