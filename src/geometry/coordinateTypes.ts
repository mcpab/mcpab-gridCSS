
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
export type Coordinate = { x: number; y: number; };

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
export type CoordinateTransformation = (v: Coordinate) => Coordinate;