
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
export type Matrix2x2 = [[number, number],
    [number, number]];

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
 export type DiagonalMatrix<d1 extends number,d2 extends number> = [[d1, 0],
    [0, d2]];

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
export type UnitMatrix<d extends number> = DiagonalMatrix<d, d>;

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
export type SymmetricMatrix<d1 extends number,d2 extends number> = [[d1, d2],
    [d2, d1]];
