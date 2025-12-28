/**
 * @fileoverview Box position utilities for grid layout system.
 * Provides functions to calculate specific anchor points within boxes.
 * @module BoxPositions
 */

import { GridBoxPointPosition } from "./gridBoxTypes";
import { Coordinate } from "../../geometry/coordinateTypes";

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
export const boxPosition: GridBoxPointPosition = (box, boxAnchor) => {

    let coordinate: Coordinate;

    // Calculate coordinate based on the anchor position
    if (boxAnchor === 'bottomLeft') {
        // Bottom-left is the box origin
        coordinate = {
            x: box.origin.x,
            y: box.origin.y
        };
    } else if (boxAnchor === 'bottomRight') {
        // Bottom-right adds full width to origin x
        coordinate = {
            x: box.origin.x + box.diagonal.x,
            y: box.origin.y
        };
    } else if (boxAnchor === 'topLeft') {
        // Top-left adds full height to origin y
        coordinate = {
            x: box.origin.x,
            y: box.origin.y + box.diagonal.y
        };
    } else if (boxAnchor === 'topRight') {
        // Top-right adds both width and height to origin
        coordinate = {
            x: box.origin.x + box.diagonal.x,
            y: box.origin.y + box.diagonal.y
        };
    } else if (boxAnchor === 'center') {
        // Center point is origin plus half width and half height
        coordinate = {
            x: box.origin.x + box.diagonal.x / 2,
            y: box.origin.y + box.diagonal.y / 2
        };
    } else {
        // Return undefined for invalid anchor positions
        return undefined;
    }

    return coordinate;

}

/**
 * Moves a box so that its specified anchor point is positioned at the given coordinate.
 * 
 * @param box - The grid box to move
 * @param boxAnchor - The anchor point of the box to align with the target coordinate
 * @param coordinate - The target coordinate or a function that calculates it
 * @returns A new box with updated position, or undefined if operation fails
 * 
 * @example
 * ```typescript
 * export const moveTo: MoveBoxTo = (box, boxAnchor, coordinate) => {
 *     let anchor = boxPosition(box, boxAnchor);
 *     if (!anchor) return undefined;
 *     let target: Coordinate;
 *     if (typeof coordinate === 'function') {
 *         let result = coordinate(box, boxAnchor);
 *         if (!result) return undefined;
 *         target = result;
 *     } else {
 *         target = coordinate;
 *     }
 *     const delta = subtractCoordinates(target, anchor);
 *     const newOrigin = addCoordinates(box.origin, delta);
 *     return {
 *         ...box,
 *         origin: newOrigin
 *     };
 * }
 * ```
 */
// export const moveTo: MoveBoxTo = (box, boxAnchor, coordinate) => {

//     let anchor = boxPosition(box, boxAnchor);
//     if (!anchor) return undefined;

//     let target: Coordinate;

//     if (typeof coordinate === 'function') {
//         let result = coordinate(box, boxAnchor);
//         if (!result) return undefined;
//         target = result;
//         //
//     } else {
//         target = coordinate;
//     }

//     const delta = subtractCoordinates(target, anchor);

//     const newOrigin = addCoordinates(box.origin, delta);

//     return {
//         ...box,
//         origin: newOrigin
//     };
// }

/**
 * Moves a box by a specified delta from its current anchor position.
 * 
 * @param box - The grid box to move
 * @param boxAnchor - The anchor point to use as reference for the movement
 * @param delta - The movement delta or a function that calculates it
 * @returns A new box with updated position, or undefined if operation fails
 * 
 * @example
 * ```typescript
 * export const moveBy: MoveBoxBy = (box, boxAnchor, delta) => {
 *     let anchor = boxPosition(box, boxAnchor);
 *     if (!anchor) return undefined;
 *     let movement: Coordinate;
 *     if (typeof delta === 'function') {
 *         let result = delta(box, boxAnchor);
 *         if (!result) return undefined;
 *         movement = result;
 *     } else {
 *         movement = delta;
 *     }
 *     const newOrigin = addCoordinates(box.origin, movement);
 *     return {
 *         ...box,
 *         origin: newOrigin
 *     };
 * }
 * ```
 */
// export const moveBy: MoveBoxBy = (box, boxAnchor, delta) => {

//     let anchor = boxPosition(box, boxAnchor);
//     if (!anchor) return undefined;

//     let movement: Coordinate;

//     if (typeof delta === 'function') {
//         let result = delta(box, boxAnchor);
//         if (!result) return undefined;
//         movement = result;
//         //
//     } else {
//         movement = delta;
//     }

//     const newOrigin = addCoordinates(box.origin, movement);

//     return {
//         ...box,
//         origin: newOrigin
//     };

// }

/**
 * Stretches a box by adding the specified delta to both width and height.
 * 
 * The delta is applied as an absolute value to ensure the box always grows.
 * 
 * @param box - The grid box to stretch
 * @param delta - The amount to add to both width and height (will be made absolute)
 * @returns A new box with increased dimensions
 * 
 * @example
 * ```typescript
 * export const stretch: StretchBox = (box, delta) => {
 *     return {
 *         ...box,
 *         diagonal: {
 *             x: box.diagonal.x + Math.abs(delta),
 *             y: box.diagonal.y + Math.abs(delta)
 *         }
 *     };
 * }
 * ```
 */
// export const stretch: StretchBox = (box, delta) => {
//     return {
//         ...box,
//         diagonal: {
//             x: box.diagonal.x + Math.abs(delta),
//             y: box.diagonal.y + Math.abs(delta)
//         }
//     };
// }