/**
 * @fileoverview Box position utilities for grid layout system.
 * Provides functions to calculate specific anchor points within boxes.
 * @module BoxPositions
 */

import { Coordinate } from "../geometry";
import { GridBoxPointPosition } from "./gridBoxTypes";


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
   