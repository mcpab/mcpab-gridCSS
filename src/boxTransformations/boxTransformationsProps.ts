/**
 * @fileoverview Box transformation properties and types for CSS Grid layout system.
 * Provides comprehensive type definitions for transforming boxes within layouts,
 * including movement, alignment, and stacking operations.
 * @module BoxTransformationsProps
 */

import { Anchor, GridBox } from "../../src/box/gridBoxTypes";
import { Coordinate } from "../geometry";
import { DiagnosticEntry } from "../gridErrorShape";
import { NodeID } from "../templates/layoutIDs";

/**
 * Base properties for box transformations.
 * Defines the fundamental structure for identifying a box and its reference point.
 * The localIDs are the NodeIDs that can be used in box layouts.
 * 
 * @template BoxIDFrom - The type of box identifier that can be transformed
 * 
 * @example
 * ```typescript
 * const baseProps: BoxPropBase<'block_1'> = {
 *   boxId: 'block_1',
 *   anchor: 'topLeft'
 * };
 * ```
 */
export type BoxPropBase<BoxIDFrom extends NodeID> = {
  /** The identifier of the box to transform */
  boxId: BoxIDFrom;
  /** The anchor point on the box to use as reference for transformations */
  anchor: Anchor;
};

/**
 * Properties for moving a box to a specific position.
 * Enables moving a box from its current position to either absolute coordinates
 * or relative to another box's anchor point.
 * 
 * @template BoxID - The type of box identifier that can be moved
 * 
 * @example
 * ```typescript
 * // Move to absolute coordinates
 * const moveToAbsolute: BoxMoveToProps<'aside'> = {
 *   from: { boxId: 'aside', anchor: 'center' },
 *   to: { x: 100, y: 200 },
 *   gap: { x: 10, y: 5 }
 * };
 * 
 * // Move to another box's position
 * const moveToBox: BoxMoveToProps<'aside' | 'block_1'> = {
 *   from: { boxId: 'aside', anchor: 'center' },
 *   to: { boxId: 'block_1', anchor: 'topLeft' }
 * };
 * ```
 */
export type BoxMoveToProps<BoxID extends NodeID> = {
  /** The source box and its reference anchor */
  from: BoxPropBase<BoxID>;
  /** Target position - either absolute coordinates or another box's anchor */
  to: Coordinate | BoxPropBase<BoxID>;
  /** Optional gap to maintain from the target position */
  gap?: Coordinate;
};
/**
 * Properties for moving a box by a relative amount.
 * Enables translating a box from its current position by specified offsets.
 * Note: anchor is omitted as the movement is relative to the entire box.
 * 
 * @template BoxIDFrom - The type of box identifier that can be moved
 * 
 * @example
 * ```typescript
 * // Move by coordinate offset
 * const moveByCoord: BoxMoveByProps<'aside'> = {
 *   from: { boxId: 'aside' },
 *   by: { x: 100, y: 200 },
 *   gap: { x: 5, y: 5 }
 * };
 * 
 * // Move by uniform amount
 * const moveByUniform: BoxMoveByProps<'block_1'> = {
 *   from: { boxId: 'block_1' },
 *   by: 50
 * };
 * ```
 */
export type BoxMoveByProps<BoxIDFrom extends NodeID> = {
  /** The source box (anchor not needed for relative movement) */
  from: Omit<BoxPropBase<BoxIDFrom>, "anchor">;
  /** Movement offset - either coordinate object or uniform number */
  by: Coordinate | number;
  /** Optional gap to add to the movement */
  gap?: Coordinate;
};

/**
 * Properties for aligning a box to a specific Y-coordinate or another box's Y-position.
 * Enables vertical alignment operations within the layout.
 * 
 * @template BoxID - The type of box identifier that can be aligned
 * 
 * @example
 * ```typescript
 * // Align to absolute Y position
 * const alignToY: BoxAlignYProps<'block_4'> = {
 *   from: { boxId: 'block_4', anchor: 'bottomLeft' },
 *   to: 300,
 *   gap: 10
 * };
 * 
 * // Align to another box's Y position
 * const alignToBoxY: BoxAlignYProps<'block_1' | 'block_2'> = {
 *   from: { boxId: 'block_1', anchor: 'center' },
 *   to: { boxId: 'block_2', anchor: 'topLeft' }
 * };
 * ```
 */
export type BoxAlignYProps<BoxID extends NodeID> = {
  /** The source box and its reference anchor */
  from: BoxPropBase<BoxID>;
  /** Target Y position - either absolute number or another box's anchor */
  to: number | BoxPropBase<BoxID>;
  /** Optional gap to maintain from the target Y position */
  gap?: number;
};

/**
 * Properties for aligning a box to a specific X-coordinate or another box's X-position.
 * Enables horizontal alignment operations within the layout.
 * 
 * @template BoxID - The type of box identifier that can be aligned
 * 
 * @example
 * ```typescript
 * // Align to absolute X position
 * const alignToX: BoxAlignXProps<'sidebar'> = {
 *   from: { boxId: 'sidebar', anchor: 'topLeft' },
 *   to: 150,
 *   gap: 20
 * };
 * 
 * // Align to another box's X position
 * const alignToBoxX: BoxAlignXProps<'nav' | 'header'> = {
 *   from: { boxId: 'nav', anchor: 'topRight' },
 *   to: { boxId: 'header', anchor: 'topRight' }
 * };
 * ```
 */
export type BoxAlignXProps<BoxID extends NodeID> = {
  /** The source box and its reference anchor */
  from: BoxPropBase<BoxID>;
  /** Target X position - either absolute number or another box's anchor */
  to: number | BoxPropBase<BoxID>;
  /** Optional gap to maintain from the target X position */
  gap?: number;
};

/**
 * Union type of all possible box transformation properties.
 * Enables type-safe handling of any individual box transformation operation.
 * 
 * @template BoxID - The type of box identifier that can be transformed
 * 
 * @example
 * ```typescript
 * const transforms: BoxProps<'block_1' | 'aside'>[] = [
 *   { from: { boxId: 'aside', anchor: 'center' }, to: { x: 100, y: 200 } },
 *   { from: { boxId: 'block_1' }, by: 50 },
 *   { from: { boxId: 'aside', anchor: 'top' }, to: 300, gap: 10 }
 * ];
 * ```
 */
export type BoxProps<BoxID extends NodeID> =
  | BoxMoveToProps<BoxID>
  | BoxMoveByProps<BoxID>
  | BoxAlignYProps<BoxID>
  | BoxAlignXProps<BoxID>;

/**
 * Comprehensive database of all possible box transformation operations.
 * Maps transformation names to their corresponding property types.
 * Ensures all transformation IDs correspond to meaningful transformation properties.
 * 
 * @template BoxID - The type of box identifier that can be transformed
 * 
 * @example
 * ```typescript
 * // Individual transformation examples
 * const moveTransform: BoxMovesPropsObject<'block_1'>['moveTo'] = {
 *   from: { boxId: 'block_1', anchor: 'center' },
 *   to: { x: 100, y: 200 }
 * };
 * 
 * const stackTransform: BoxMovesPropsObject<'block_1'>['stackVertically'] = {
 *   gap: 20
 * };
 * 
 * const alignAllTransform: BoxMovesPropsObject<'block_1'>['alignAllToX'] = {
 *   to: 150,
 *   anchor: 'left'
 * };
 * ```
 */
export type BoxMovesPropsObject<BoxID extends NodeID> = {
  /** Move a box to a specific position or another box's anchor */
  moveTo: BoxMoveToProps<BoxID>;
  /** Move a box by a relative amount */
  moveBy: BoxMoveByProps<BoxID>;
  /** Align a box to a specific Y-coordinate or another box's Y-position */
  alignToY: BoxAlignYProps<BoxID>;
  /** Align a box to a specific X-coordinate or another box's X-position */
  alignToX: BoxAlignXProps<BoxID>;
  /** Align all boxes to the same Y-coordinate using specified anchor */
  alignAllToY: { to: number; anchor: Anchor };
  /** Align all boxes to the same X-coordinate using specified anchor */
  alignAllToX: { to: number; anchor: Anchor };
  /** Stack all boxes vertically with optional gap */
  stackVertically: { gap?: number };
  /** Stack all boxes horizontally with optional gap */
  stackHorizontally: { gap?: number };
};

/**
 * Extract transformation IDs from the box transformations object.
 * Provides type-safe access to all available transformation names.
 * 
 * @template BoxID - The type of box identifier
 */
export type TransformationIDs<BoxID extends NodeID> =
  keyof BoxMovesPropsObject<BoxID>;

/**
 * Constant array of all available transformation IDs.
 * Ensures compile-time verification that all transformations are accounted for.
 * 
 * @example
 * ```typescript
 * // Iterate through all available transformations
 * transformationIDs.forEach(id => {
 *   console.log(`Available transformation: ${id}`);
 * });
 * ```
 */
export const transformationIDs = [
  "moveTo",
  "moveBy",
  "alignToY",
  "alignToX",
  "alignAllToY",
  "alignAllToX",
  "stackVertically",
  "stackHorizontally",
] as const satisfies readonly TransformationIDs<any>[];

/**
 * Discriminated union type for box transformation properties.
 * Enables type-safe handling of transformations where each transformation
 * is identified by its unique key and contains the corresponding properties.
 * 
 * @template BoxID - The type of box identifier that can be transformed
 * 
 * @example
 * ```typescript
 * const transformations: Array<BoxMovesProps<'block_1' | 'aside'>> = [
 *   {
 *     moveTo: {
 *       from: { boxId: 'aside', anchor: 'center' },
 *       to: { boxId: 'block_1', anchor: 'topLeft' }
 *     }
 *   },
 *   {
 *     moveBy: {
 *       from: { boxId: 'aside' },
 *       by: { x: 100, y: 200 }
 *     }
 *   },
 *   {
 *     stackVertically: { gap: 20 }
 *   }
 * ];
 * ```
 */
export type BoxMovesProps<BoxID extends NodeID> = {
  [M in keyof BoxMovesPropsObject<any>]: {
    [K in M]: BoxMovesPropsObject<BoxID>[M];
  };
}[keyof BoxMovesPropsObject<any>];

/**
 * Union type of all possible box transformation identifiers.
 * Provides access to the keys of all available transformations.
 * 
 * @template BoxID - The type of box identifier that can be transformed
 */
export type AllBoxMovesProps<BoxID extends NodeID> =
  keyof BoxMovesPropsObject<BoxID>;

/**
 * Properties that transformation functions will receive.
 * Defines the input structure for each transformation implementation,
 * including the transformation properties, current box state, and diagnostics.
 * 
 * @template BoxID - The type of box identifier that can be transformed
 * 
 * @example
 * ```typescript
 * // Function props for moveTo transformation
 * const moveToProps: BoxMovesFunctionsProps<'block_1'>['moveTo'] = {
 *   boxprops: {
 *     from: { boxId: 'block_1', anchor: 'center' },
 *     to: { x: 100, y: 200 }
 *   },
 *   boxes: {
 *     'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 4 }, _normalized: 'GridBox' }
 *   },
 *   diagnostics: []
 * };
 * ```
 */
export type BoxMovesFunctionsProps<BoxID extends NodeID> = {
  [M in keyof BoxMovesPropsObject<any>]: {
    /** The specific transformation properties */
    boxprops: BoxMovesPropsObject<BoxID>[M];
    /** Current state of all boxes in the layout */
    boxes: Partial<Record<NodeID, GridBox>>;
    /** Array for recording diagnostic information and errors */
    diagnostics: DiagnosticEntry[];
  };
};

/**
 * Function signatures for implementing box transformations.
 * Defines the expected signature for each transformation function,
 * ensuring consistent interfaces across all transformation implementations.
 * 
 * Each function:
 * - Receives transformation properties, current boxes state, and diagnostics array
 * - Returns either a single transformed GridBox, undefined, or partial record of boxes
 * - May modify the diagnostics array to record errors or warnings
 * - Assumes in-place transformation of the boxes array
 * 
 * @template BoxID - The type of box identifier that can be transformed
 * 
 * @example
 * ```typescript
 * // Implementation example for moveTo function
 * const moveToImpl: BoxMovesFunctions<'block_1'>['moveTo'] = (props) => {
 *   const { boxprops, boxes, diagnostics } = props;
 *   const sourceBox = boxes[boxprops.from.boxId];
 *   
 *   if (!sourceBox) {
 *     diagnostics.push({
 *       level: 'error',
 *       message: `Box ${boxprops.from.boxId} not found`
 *     });
 *     return undefined;
 *   }
 *   
 *   // Transform the box...
 *   return transformedBox;
 * };
 * ```
 */
export type BoxMovesFunctions<BoxID extends NodeID> = {
  [M in keyof BoxMovesPropsObject<any>]: (
    props: BoxMovesFunctionsProps<BoxID>[M]
  ) => GridBox | undefined | Partial<Record<NodeID, GridBox>>;
};

/**
 * @example Example Usage Scenarios
 * 
 * ```typescript
 * // Array of multiple transformations
 * let transformations: Array<BoxMovesProps<'block_1' | 'aside'>> = [
 *   {
 *     moveTo: {
 *       from: {
 *         boxId: 'aside',
 *         anchor: 'center'
 *       },
 *       to: {
 *         boxId: 'block_1',
 *         anchor: 'topLeft'
 *       }
 *     }
 *   },
 *   {
 *     moveBy: {
 *       from: {
 *         boxId: 'aside',
 *       },
 *       by: {
 *         x: 100,
 *         y: 200
 *       },
 *     }
 *   },
 *   {
 *     moveTo: {
 *       from: {
 *         boxId: 'aside',
 *         anchor: 'center'
 *       },
 *       to: {
 *         boxId: 'block_1',
 *         anchor: 'topLeft'
 *       }
 *     }
 *   },
 * ];
 * 
 * // Single moveBy transformation
 * let moveByTransform: Partial<BoxMovesProps<'block_1' | 'aside' | 'block_4'>> = {
 *   moveBy: {
 *     from: { boxId: 'aside' },
 *     by: {
 *       x: 100,
 *       y: 200
 *     }
 *   }
 * };
 * 
 * // Y-alignment transformation
 * let alignYTransform: Partial<BoxMovesProps<'block_1' | 'aside' | 'block_4'>> = {
 *   alignToY: {
 *     from: { boxId: 'block_4', anchor: 'bottomLeft' },
 *     to: 300
 *   }
 * };
 * ```
 */

// =============================================================================
// Compilation Test Examples
// =============================================================================

// Array of multiple transformations
const kii: Array<BoxMovesProps<'block_1' | 'aside'>> = [
  {
    moveTo: {
      from: {
        boxId: 'aside',
        anchor: 'center'
      },
      to: {
        boxId: 'block_1',
        anchor: 'topLeft'
      }
    }
  },
  {
    moveBy: {
      from: {
        boxId: 'aside',
      },
      by: {
        x: 100,
        y: 200
      },
    }
  },
  {
    moveTo: {
      from: {
        boxId: 'aside',
        anchor: 'center'
      },
      to: {
        boxId: 'block_1',
        anchor: 'topLeft'
      }
    }
  },
];

// Single moveBy transformation
const rt: BoxMovesProps<'block_1' | 'aside' | 'block_4'> = {
  moveBy: {
    from: {
      boxId: 'aside'
    },
    by: {
      x: 100,
      y: 200
    }
  }
};

// Y-alignment transformation
const rt1: BoxMovesProps<'block_1' | 'aside' | 'block_4'> = {
  alignToY: {
    from: {
      boxId: 'block_4',
      anchor: 'bottomLeft'
    },
    to: 300
  }
};

// Additional examples for other transformation types
const stackVerticallyExample: BoxMovesProps<'block_1' | 'block_2'> = {
  stackVertically: {
    gap: 20
  }
};

const stackHorizontallyExample: BoxMovesProps<'nav' | 'sidebar'> = {
  stackHorizontally: {
    gap: 10
  }
};

const alignAllToYExample: BoxMovesProps<'header' | 'footer'> = {
  alignAllToY: {
    to: 100,
    anchor: 'topLeft'
  }
};

const alignAllToXExample: BoxMovesProps<'sidebar' | 'main'> = {
  alignAllToX: {
    to: 50,
    anchor: 'topLeft'
  }
};

const alignToXExample: BoxMovesProps<'nav' | 'header'> = {
  alignToX: {
    from: {
      boxId: 'nav',
      anchor: 'topRight'
    },
    to: {
      boxId: 'header',
      anchor: 'topRight'
    },
    gap: 5
  }
};

// Test with coordinate targets
const moveToCoordinateExample: BoxMovesProps<'block_1'> = {
  moveTo: {
    from: {
      boxId: 'block_1',
      anchor: 'center'
    },
    to: {
      x: 150,
      y: 200
    },
    gap: {
      x: 10,
      y: 5
    }
  }
};

// Test with number for moveBy
const moveByNumberExample: BoxMovesProps<'aside'> = {
  moveBy: {
    from: {
      boxId: 'aside'
    },
    by: 50
  }
};
