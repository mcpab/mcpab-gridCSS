/**
 * @fileoverview Coordinate algebra operations for 2D vector mathematics.
 * Provides essential mathematical operations for coordinate manipulation and transformations.
 * @module CoordinateAlgebra
 */

import { Coordinate } from "./coordinateTypes"
import { multiply, reflectionOnXAxis, reflectionOnYAxis, rotationByThetaClockWise } from "./matrixAlgebra";

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
export const getOrigin = (): Coordinate => {
    return { x: 0, y: 0 };
}

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
export const linearCombination = (alpha: number, a: Coordinate, beta: number, b: Coordinate): Coordinate => {
    return { x: a.x * alpha + b.x * beta, y: a.y * alpha + b.y * beta };
}

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
export const multiplyScalar = (scalar: number, a: Coordinate): Coordinate => {
    return linearCombination(scalar, a, 0, getOrigin());
}

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
export const addCoordinates = (a: Coordinate, b: Coordinate): Coordinate => {
    return linearCombination(1, a, 1, b);
}

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
export const subtractCoordinates = (a: Coordinate, b: Coordinate): Coordinate => {
    return linearCombination(1, a, -1, b);
}

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
export const reflectOnXAxis = (coord: Coordinate): Coordinate => {
    return multiply(reflectionOnXAxis, coord);
}

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
export const reflectOnYAxis = (coord: Coordinate): Coordinate => {
    return multiply(reflectionOnYAxis, coord);
}

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
export const rotateByClockWise = (theta: number, coord: Coordinate): Coordinate => {
    const rotationMatrix = rotationByThetaClockWise(theta);
    return multiply(rotationMatrix, coord);
}

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
export const invert = (coord: Coordinate): Coordinate => {
    return multiplyScalar(-1, coord);
}

