/**
 * @fileoverview 2x2 matrix algebra operations for geometric transformations.
 * Provides matrix constants and operations for coordinate transformations in 2D space.
 * @module MatrixAlgebra
 */

import { Coordinate } from "./coordinateTypes";
import { Matrix2x2, UnitMatrix } from "./matrixTypes";

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
export const unitMatrix: UnitMatrix<1> = [[1, 0],
[0, 1]];

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
export const zeroMatrix: UnitMatrix<0> = [[0, 0],
[0, 0]];

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
export const reflectionOnXAxis: Matrix2x2 = [[1, 0],
[0, -1]];

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
export const reflectionOnYAxis: Matrix2x2 = [[-1, 0],
[0, 1]];

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
export const rotationByThetaClockWise = (theta: number): Matrix2x2 => {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    return [
        [cosTheta, sinTheta],
        [-sinTheta, cosTheta]
    ];
};

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
export const multiply = (matrix: Matrix2x2, v:Coordinate): Coordinate => {
    return {
        x: matrix[0][0] * v.x + matrix[0][1] * v.y,
        y: matrix[1][0] * v.x + matrix[1][1] * v.y,
    };
}


