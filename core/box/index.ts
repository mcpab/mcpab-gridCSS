/**
 * @fileoverview Box module exports for grid layout system.
 * Provides grid box types, utilities, and position calculations.
 * @module Box
 */

// Types
export type {
    GridBox,
    Anchor,
    GridBoxPointPosition
} from './gridBoxTypes';

// Utilities
export {
    makeGridBox,
    copyGridBox
} from './gridBoxUtils';

// Position calculations
export {
    boxPosition
} from './boxPositions';