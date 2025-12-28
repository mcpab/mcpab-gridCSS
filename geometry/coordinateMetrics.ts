/**
 * @fileoverview Coordinate metrics and geometric calculations for 2D vectors.
 * Provides mathematical operations for measuring distances, angles, and spatial relationships.
 * @module CoordinateMetrics
 */

import { Coordinate } from "./coordinateTypes"

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
export const dot = (a:Coordinate, b:Coordinate): number => {
    return a.x * b.x + a.y * b.y;
}

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
export const norm = (v:Coordinate): number => {
    return Math.sqrt(dot(v, v));
}

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
export const distance = (a:Coordinate, b:Coordinate): number => {
    return norm({ x: b.x - a.x, y: b.y - a.y });
}

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
export const normalize = (v:Coordinate): Coordinate => {
    const len = norm(v);
    if (len === 0) {
        return { x: 0, y: 0 };
    }
    return { x: v.x / len, y: v.y / len };
}

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
export const angleBetween = (a:Coordinate, b:Coordinate): number => {
    const dotProduct = dot(a, b);
    const lengthsProduct = norm(a) * norm(b);
    if (lengthsProduct === 0) {
        return 0;
    }
    let cosTheta = dotProduct / lengthsProduct;
    // Clamp the value to the valid range of acos to avoid NaN due to floating point errors
    cosTheta = Math.max(-1, Math.min(1, cosTheta));
    return Math.acos(cosTheta);
}

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
export const boundingBox = (points: Coordinate[]): { min: Coordinate; max: Coordinate } => {

    if (points.length === 0) {
        return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
    }
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    for (const point of points) {
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
    }

    return {
        min: { x: minX, y: minY },
        max: { x: maxX, y: maxY }
    };
}

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
export const lerp = (a:Coordinate, b:Coordinate, t:number): Coordinate => {
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
    };
}

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
export const clamp = (v:Coordinate, min:Coordinate, max:Coordinate): Coordinate => {
    return {
        x: Math.max(min.x, Math.min(max.x, v.x)),
        y: Math.max(min.y, Math.min(max.y, v.y)),
    };
}


