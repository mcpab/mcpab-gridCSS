/**
 * @fileoverview Default implementations of box transformation functions for CSS Grid layout system.
 * Provides concrete implementations for all transformation operations defined in boxTransformationsProps.
 * These functions modify box positions and dimensions in a sparse map object structure.
 * @module DefaultBoxTransformations
 */

import { boxPosition } from "../box/boxPositions";
import { GridBox } from "../box/gridBoxTypes";
import { makeGridBox } from "../box/gridBoxUtils";
import { Coordinate, addCoordinates, subtractCoordinates } from "../geometry";
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from "../gridErrorShape";
import { NodeID } from "../templates/layoutIDs";
import {
    AllBoxMovesProps,
    BoxMovesFunctions,
    BoxMovesFunctionsProps,
    BoxPropBase
} from "./boxTransformationsProps";

/**
 * Utility function to resolve coordinate targets from various input types.
 * Handles conversion from numbers, coordinates, or box anchor references to actual coordinates.
 * This is a key function used throughout the transformation system to normalize target positions.
 * 
 * @param to - The target specification (number, coordinate, or box anchor reference)
 * @param boxes - Sparse map object containing all available boxes
 * @param diagnostics - Array to record any errors encountered during resolution
 * @param source - The transformation type making this call (for error reporting)
 * @returns The resolved coordinate, or undefined if resolution failed
 * 
 * @example
 * ```typescript
 * // Resolve from number
 * const coord1 = getCoordinateBoxTo(100, boxes, diagnostics, "moveTo");
 * // Result: { x: 100, y: 100 }
 * 
 * // Resolve from coordinate
 * const coord2 = getCoordinateBoxTo({ x: 50, y: 75 }, boxes, diagnostics, "moveTo");
 * // Result: { x: 50, y: 75 }
 * 
 * // Resolve from box anchor
 * const coord3 = getCoordinateBoxTo(
 *   { boxId: 'block_1', anchor: 'topLeft' }, 
 *   boxes, 
 *   diagnostics, 
 *   "moveTo"
 * );
 * // Result: coordinate of block_1's topLeft anchor
 * ```
 */
function getCoordinateBoxTo(
  to: number | Coordinate | BoxPropBase<NodeID>,
  boxes: Partial<Record<NodeID, GridBox>>,
  diagnostics: DiagnosticEntry[],
  source: AllBoxMovesProps<any>
): Coordinate | undefined {
  let toPoint: Coordinate;

  if (typeof to === "number") {
    toPoint = { x: to, y: to };
  } else if ("x" in to && "y" in to) {
    toPoint = { x: to.x, y: to.y };
  } else if ("boxId" in to && "anchor" in to) {
    const boxTo = boxes[to.boxId];

    if (!boxTo) {
      diagnostics.push(
        makeError(
          source,
          GRID_ERROR_CODE.UNKNOWN_NODE_ID,
          `${source} transformation has invalid 'to' boxId: ${to.boxId}`
        )
      );
      return undefined;
    }

    const anchorCoord = boxPosition(boxTo, to.anchor);

    if (!anchorCoord) {
      diagnostics.push(
        makeError(
          source,
          GRID_ERROR_CODE.UNKNOWN_ANCHOR,
          `${source} transformation has invalid 'to' anchor: ${to.anchor}`
        )
      );
      return undefined;
    }
    toPoint = anchorCoord;
  } else {
    diagnostics.push(
      makeError(
        source,
        GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS,
        `${source} transformation has invalid 'to' parameter`
      )
    );
    return undefined;
  }

  return toPoint;
}

/**
 * Helper function to validate the existence of a source box in transformations.
 * Ensures that the specified box ID exists in the boxes collection before proceeding with transformations.
 * 
 * @param boxId - The box identifier to validate
 * @param boxes - Sparse map object containing all available boxes
 * @param diagnostics - Array to record validation errors
 * @param source - The transformation type making this call (for error reporting)
 * @returns The validated GridBox, or undefined if validation failed
 * 
 * @example
 * ```typescript
 * const validBox = validateBoxFrom('block_1', boxes, diagnostics, "moveTo");
 * if (validBox) {
 *   // Proceed with transformation using validBox
 * } else {
 *   // Handle validation failure (error already recorded in diagnostics)
 * }
 * ```
 */
function validateBoxFrom(
  boxId: NodeID,
  boxes: Partial<Record<NodeID, GridBox>>,
  diagnostics: DiagnosticEntry[],
  source: AllBoxMovesProps<any>
): GridBox | undefined {
  const boxFrom = boxes[boxId];
  if (!boxFrom) {
    diagnostics.push(
      makeError(
        source,
        GRID_ERROR_CODE.UNKNOWN_NODE_ID,
        `${source} transformation has invalid 'from' boxId: ${boxId}`
      )
    );
    return undefined;
  }

  return boxFrom;
}

/**
 * Moves a box to a specific target position.
 * Calculates the displacement needed to move the specified anchor of the source box
 * to align with the target position, then applies this displacement to the entire box.
 * 
 * The transformation:
 * 1. Validates the source box exists
 * 2. Resolves the target position (absolute coordinate or another box's anchor)
 * 3. Calculates displacement from source anchor to target
 * 4. Applies optional gap offset
 * 5. Creates new box with adjusted origin
 * 6. Updates the boxes collection in-place
 * 
 * @param props - MoveTo transformation properties including source, target, and optional gap
 * @returns The transformed GridBox, or undefined if transformation failed
 * 
 * @example
 * ```typescript
 * // Move aside's center to block_1's topLeft
 * const result = moveTo({
 *   boxprops: {
 *     from: { boxId: 'aside', anchor: 'center' },
 *     to: { boxId: 'block_1', anchor: 'topLeft' },
 *     gap: { x: 10, y: 5 }
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
const moveTo = (props: BoxMovesFunctionsProps<NodeID>["moveTo"]) => {
  const { boxprops, boxes, diagnostics } = props;

  const { from, to, gap } = boxprops;

  const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, "moveTo");

  if (!boxFrom) {
    return undefined;
  }

  let toPoint = getCoordinateBoxTo(to, boxes, diagnostics, "moveTo");

  if (!toPoint) {
    return undefined;
  }

  const fromAnchor = boxPosition(boxFrom, from.anchor);
  if (!fromAnchor) {
    diagnostics.push(
      makeError(
        "moveTo",
        GRID_ERROR_CODE.UNKNOWN_ANCHOR,
        `moveTo transformation has invalid 'from' anchor: ${from.anchor}`
      )
    );
    return undefined;
  }

  if (gap !== undefined) {
    toPoint = addCoordinates(toPoint, gap);
  }
  const displacement = subtractCoordinates(toPoint, fromAnchor);

  let newOrigin = addCoordinates(boxFrom.origin, displacement);

  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

  boxes[from.boxId] = newBox;

  return newBox;
};

/**
 * Moves a box by a specified relative amount.
 * Applies a translation vector to the box's current position, moving it by the specified offset.
 * Unlike moveTo, this operation is relative to the box's current position rather than absolute.
 * 
 * The transformation:
 * 1. Validates the source box exists
 * 2. Converts the 'by' parameter to a coordinate delta (handles both number and Coordinate types)
 * 3. Applies optional gap offset to the delta
 * 4. Adds the delta to the box's current origin
 * 5. Creates new box with the translated origin
 * 6. Updates the boxes collection in-place
 * 
 * @param props - MoveBy transformation properties including source box and movement delta
 * @returns The transformed GridBox, or undefined if transformation failed
 * 
 * @example
 * ```typescript
 * // Move box by coordinate offset
 * const result1 = moveBy({
 *   boxprops: {
 *     from: { boxId: 'aside' },
 *     by: { x: 100, y: 50 },
 *     gap: { x: 5, y: 5 }
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * 
 * // Move box by uniform amount
 * const result2 = moveBy({
 *   boxprops: {
 *     from: { boxId: 'sidebar' },
 *     by: 25
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
const moveBy = (props: BoxMovesFunctionsProps<NodeID>["moveBy"]) => {
  const { boxprops, boxes, diagnostics } = props;
  const { from, by, gap } = boxprops;

  const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, "moveBy");

  if (!boxFrom) {
    return undefined;
  }

  let delta: Coordinate;
  if (typeof by === "number") {
    delta = { x: by, y: by };
  } else if ("x" in by && "y" in by) {
    delta = by;
  } else {
    diagnostics.push(
      makeError(
        "moveBy",
        GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS,
        `moveBy transformation has invalid 'by' parameter`
      )
    );
    return undefined;
  }

  if (gap !== undefined) {
    delta = addCoordinates(delta, gap);
  }

  const newOrigin = addCoordinates(boxFrom.origin, delta);

  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

  boxes[from.boxId] = newBox;

  return newBox;
};

/**
 * Aligns a box's Y-coordinate to a specific target while preserving its X-coordinate.
 * Moves the specified anchor of the source box vertically to match the target Y position.
 * The X-coordinate of the box remains unchanged, creating a pure vertical alignment.
 * 
 * The transformation:
 * 1. Validates the source box exists
 * 2. Resolves the target position (absolute Y or another box's anchor)
 * 3. Preserves the current X position by setting toPoint.x = fromAnchor.x
 * 4. Calculates vertical displacement needed
 * 5. Applies optional gap offset to the Y displacement
 * 6. Creates new box with adjusted origin
 * 7. Updates the boxes collection in-place
 * 
 * @param props - AlignToY transformation properties including source, target Y position, and optional gap
 * @returns The transformed GridBox, or undefined if transformation failed
 * 
 * @example
 * ```typescript
 * // Align to absolute Y position
 * const result1 = alignToY({
 *   boxprops: {
 *     from: { boxId: 'block_4', anchor: 'bottomLeft' },
 *     to: 300,
 *     gap: 10
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * 
 * // Align to another box's Y position
 * const result2 = alignToY({
 *   boxprops: {
 *     from: { boxId: 'sidebar', anchor: 'center' },
 *     to: { boxId: 'header', anchor: 'bottomLeft' }
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
const alignToY = (props: BoxMovesFunctionsProps<NodeID>["alignToY"]) => {
  const { boxprops, boxes, diagnostics } = props;

  const { from, to, gap } = boxprops;

  const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, "alignToY");

  if (!boxFrom) {
    return undefined;
  }

  const toPoint = getCoordinateBoxTo(to, boxes, diagnostics, "alignToY");

  if (!toPoint) {
    return undefined;
  }

  const fromAnchor = boxPosition(boxFrom, from.anchor);
  if (!fromAnchor) {
    diagnostics.push(
      makeError(
        "alignToY",
        GRID_ERROR_CODE.UNKNOWN_ANCHOR,
        `alignToY transformation has invalid 'from' anchor: ${from.anchor}`
      )
    );
    return undefined;
  }

  toPoint.x = fromAnchor.x;

  const displacement = subtractCoordinates(toPoint, fromAnchor);

  if (gap !== undefined) {
    displacement.y += gap;
  }

  let newOrigin = addCoordinates(boxFrom.origin, displacement);

  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

  boxes[from.boxId] = newBox;

  return newBox;
};

/**
 * Aligns a box's X-coordinate to a specific target while preserving its Y-coordinate.
 * Moves the specified anchor of the source box horizontally to match the target X position.
 * The Y-coordinate of the box remains unchanged, creating a pure horizontal alignment.
 * 
 * The transformation:
 * 1. Validates the source box exists
 * 2. Resolves the target position (absolute X or another box's anchor)
 * 3. Preserves the current Y position by setting toPoint.y = fromAnchor.y
 * 4. Calculates horizontal displacement needed
 * 5. Applies optional gap offset to the X displacement
 * 6. Creates new box with adjusted origin
 * 7. Updates the boxes collection in-place
 * 
 * @param props - AlignToX transformation properties including source, target X position, and optional gap
 * @returns The transformed GridBox, or undefined if transformation failed
 * 
 * @example
 * ```typescript
 * // Align to absolute X position
 * const result1 = alignToX({
 *   boxprops: {
 *     from: { boxId: 'nav', anchor: 'topLeft' },
 *     to: 150,
 *     gap: 20
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * 
 * // Align to another box's X position
 * const result2 = alignToX({
 *   boxprops: {
 *     from: { boxId: 'sidebar', anchor: 'topRight' },
 *     to: { boxId: 'main', anchor: 'topLeft' }
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
const alignToX = (props: BoxMovesFunctionsProps<NodeID>["alignToX"]) => {
  const { boxprops, boxes, diagnostics } = props;
  const { from, to, gap } = boxprops;

  const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, "alignToX");

  if (!boxFrom) {
    return undefined;
  }

  const toPoint = getCoordinateBoxTo(to, boxes, diagnostics, "alignToX");

  if (!toPoint) {
    return undefined;
  }

  const fromAnchor = boxPosition(boxFrom, from.anchor);
  if (!fromAnchor) {
    diagnostics.push(
      makeError(
        "alignToX",
        GRID_ERROR_CODE.UNKNOWN_ANCHOR,
        `alignToX transformation has invalid 'from' anchor: ${from.anchor}`
      )
    );
    return undefined;
  }

  toPoint.y = fromAnchor.y;

  const displacement = subtractCoordinates(toPoint, fromAnchor);

  if (gap !== undefined) {
    displacement.x += gap;
  }

  let newOrigin = addCoordinates(boxFrom.origin, displacement);

  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

  boxes[from.boxId] = newBox;

  return newBox;
};

/**
 * Aligns all boxes to the same X-coordinate using a specified anchor point.
 * Iterates through all available boxes and applies X-alignment to each one,
 * creating a vertical line of aligned elements.
 * 
 * The transformation:
 * 1. Iterates through all boxes in the collection
 * 2. Applies alignToX to each box using the specified anchor and target X position
 * 3. Collects successfully transformed boxes
 * 4. Updates the boxes collection in-place
 * 5. Returns the collection of transformed boxes
 * 
 * @param props - AlignAllToX transformation properties including target X position and anchor
 * @returns Partial record of transformed boxes, or undefined if no boxes were processed
 * 
 * @example
 * ```typescript
 * // Align all boxes' left edges to X=100
 * const result = alignAllToX({
 *   boxprops: {
 *     to: 100,
 *     anchor: 'topLeft'
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
const alignAllToX = (props: BoxMovesFunctionsProps<NodeID>["alignAllToX"]) => {
  const { boxprops, boxes, diagnostics } = props;
  const { to, anchor } = boxprops;

  let newBoxes: Partial<Record<NodeID, GridBox>> = {};

  for (const boxId in boxes) {
    const id = boxId as NodeID;
    const newBox = alignToX({
      boxprops: {
        from: {
          boxId: id,
          anchor: anchor,
        },
        to: to,
      },
      boxes,
      diagnostics,
    });

    if (newBox) {
      newBoxes[id] = newBox;
      boxes[id] = newBox;
    }
  }

  if (Object.keys(newBoxes).length === 0) {
    diagnostics.push(
      makeError(
        "alignAllToX",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `alignAllToX transformation could not process any box`
      )
    );
    return undefined;
  }

  return newBoxes;
};

/**
 * Aligns all boxes to the same Y-coordinate using a specified anchor point.
 * Iterates through all available boxes and applies Y-alignment to each one,
 * creating a horizontal line of aligned elements.
 * 
 * The transformation:
 * 1. Iterates through all boxes in the collection
 * 2. Applies alignToY to each box using the specified anchor and target Y position
 * 3. Collects successfully transformed boxes
 * 4. Updates the boxes collection in-place
 * 5. Returns the collection of transformed boxes
 * 
 * @param props - AlignAllToY transformation properties including target Y position and anchor
 * @returns Partial record of transformed boxes, or undefined if no boxes were processed
 * 
 * @example
 * ```typescript
 * // Align all boxes' top edges to Y=200
 * const result = alignAllToY({
 *   boxprops: {
 *     to: 200,
 *     anchor: 'topLeft'
 *   },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
// align all boxes to a given Y coordinate
const alignAllToY = (props: BoxMovesFunctionsProps<NodeID>["alignAllToY"]) => {
  const { boxprops, boxes, diagnostics } = props;
  const { to, anchor } = boxprops;

  let newBoxes: Partial<Record<NodeID, GridBox>> = {};

  for (const boxId in boxes) {
    const id = boxId as NodeID;

    const newBox = alignToY({
      boxprops: {
        from: {
          boxId: id,
          anchor: anchor,
        },
        to: to,
      },
      boxes,
      diagnostics,
    });

    if (newBox) {
      newBoxes[id] = newBox;
      boxes[id] = newBox;
    }
  }

  if (Object.keys(newBoxes).length === 0) {
    diagnostics.push(
      makeError(
        "alignAllToY",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `alignAllToY transformation could not process any box`
      )
    );

    return undefined;
  }
  return newBoxes;
};

/**
 * Arranges boxes in a horizontal stack with optional spacing.
 * Positions boxes side by side from left to right, with each box's left edge
 * aligned to the right edge of the previous box plus optional gap.
 * 
 * The transformation:
 * 1. Starts with X position at 0
 * 2. For each box, aligns its bottomLeft anchor to current X position
 * 3. Updates X position to box's right edge plus gap
 * 4. Continues for all boxes, creating a horizontal sequence
 * 5. Updates the boxes collection in-place
 * 
 * @param props - StackHorizontally transformation properties including optional gap
 * @returns Partial record of transformed boxes, or undefined if no boxes were processed
 * 
 * @example
 * ```typescript
 * // Stack boxes horizontally with 20px gap
 * const result = stackHorizontally({
 *   boxprops: { gap: 20 },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * 
 * // Stack boxes with no gap (touching edges)
 * const result2 = stackHorizontally({
 *   boxprops: {},
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
// stack boxes horizontally with an optional gap
const stackHorizontally = (
  props: BoxMovesFunctionsProps<NodeID>["stackHorizontally"]
) => {
  const { boxprops, boxes, diagnostics } = props;
  const { gap } = boxprops;

  let newBoxes: Partial<Record<NodeID, GridBox>> = {};

  let x0 = 0;

  for (const boxId in boxes) {
    const id = boxId as NodeID;
    const newBox = alignToX({
      boxprops: {
        from: {
          boxId: id,
          anchor: "bottomLeft",
        },
        to: x0,
      },
      boxes,
      diagnostics,
    });

    if (newBox) {
      newBoxes[id] = newBox;
      x0 += newBox.diagonal.x + (gap ? gap : 0);
      boxes[id] = newBox;
    }
  }

  if (Object.keys(newBoxes).length === 0) {
    diagnostics.push(
      makeError(
        "stackHorizontally",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `stackHorizontally transformation could not process any box`
      )
    );

    return undefined;
  }

  return newBoxes;
};

/**
 * Arranges boxes in a vertical stack with optional spacing.
 * Positions boxes one above another from bottom to top, with each box's bottom edge
 * aligned to the top edge of the previous box plus optional gap.
 * 
 * The transformation:
 * 1. Starts with Y position at 0
 * 2. For each box, aligns its bottomLeft anchor to current Y position
 * 3. Updates Y position to box's top edge plus gap
 * 4. Continues for all boxes, creating a vertical sequence
 * 5. Updates the boxes collection in-place
 * 
 * @param props - StackVertically transformation properties including optional gap
 * @returns Partial record of transformed boxes, or undefined if no boxes were processed
 * 
 * @example
 * ```typescript
 * // Stack boxes vertically with 15px gap
 * const result = stackVertically({
 *   boxprops: { gap: 15 },
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * 
 * // Stack boxes with no gap (touching edges)
 * const result2 = stackVertically({
 *   boxprops: {},
 *   boxes: existingBoxes,
 *   diagnostics: []
 * });
 * ```
 */
// stack boxes vertically with an optional gap
const stackVertically = (
  props: BoxMovesFunctionsProps<NodeID>["stackVertically"]
) => {
  const { boxprops, boxes, diagnostics } = props;
  const { gap } = boxprops;

  let newBoxes: Partial<Record<NodeID, GridBox>> = {};

  let y0 = 0;

  for (const boxId in boxes) {
    const id = boxId as NodeID;
    const newBox = alignToY({
      boxprops: {
        from: {
          boxId: id,
          anchor: "bottomLeft",
        },
        to: y0,
      },
      boxes,
      diagnostics,
    });

    if (newBox) {
      newBoxes[id] = newBox;
      y0 += newBox.diagonal.y + (gap ? gap : 0);
      boxes[id] = newBox;
    }
  }

  if (Object.keys(newBoxes).length === 0) {
    diagnostics.push(
      makeError(
        "stackVertically",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `stackVertically transformation could not process any box`
      )
    );

    return undefined;
  }

  return newBoxes;
};

/**
 * Factory function that creates the default transformation registry.
 * Returns a complete implementation of all box transformation functions
 * defined in the BoxMovesFunctions interface. This serves as the standard
 * implementation of the transformation system.
 * 
 * The registry provides implementations for:
 * - `moveTo`: Move box to specific position or another box's anchor
 * - `moveBy`: Move box by relative amount
 * - `alignToY`: Align box vertically while preserving X position
 * - `alignToX`: Align box horizontally while preserving Y position
 * - `alignAllToX`: Align all boxes to same X coordinate
 * - `alignAllToY`: Align all boxes to same Y coordinate
 * - `stackHorizontally`: Arrange boxes in horizontal sequence
 * - `stackVertically`: Arrange boxes in vertical sequence
 * 
 * @returns Complete registry of transformation functions
 * 
 * @example
 * ```typescript
 * // Get the default transformation registry
 * const transformations = DefaultBoxTransformations();
 * 
 * // Use a specific transformation
 * const result = transformations.moveTo({
 *   boxprops: {
 *     from: { boxId: 'block_1', anchor: 'center' },
 *     to: { x: 100, y: 200 }
 *   },
 *   boxes: myBoxes,
 *   diagnostics: []
 * });
 * 
 * // Apply multiple transformations
 * transformations.stackHorizontally({
 *   boxprops: { gap: 20 },
 *   boxes: myBoxes,
 *   diagnostics: []
 * });
 * 
 * transformations.alignAllToY({
 *   boxprops: { to: 100, anchor: 'center' },
 *   boxes: myBoxes,
 *   diagnostics: []
 * });
 * ```
 */
// the factory of default transformations
// a registry of all verbs
export const DefaultBoxTransformations = (): BoxMovesFunctions<NodeID> => {
  return {
    moveTo: moveTo,

    moveBy: moveBy,

    alignToY: alignToY,

    alignToX: alignToX,

    alignAllToX: alignAllToX,

    alignAllToY: alignAllToY,

    stackHorizontally: stackHorizontally,

    stackVertically: stackVertically,
  };
};

// =============================================================================
// Compilation Test Examples
// =============================================================================

// Mock data for testing
const existingBoxes: Partial<Record<NodeID, GridBox>> = {
  'block_1': makeGridBox({ x: 0, y: 0 }, { x: 100, y: 50 }),
  'aside': makeGridBox({ x: 150, y: 100 }, { x: 80, y: 60 }),
  'sidebar': makeGridBox({ x: 0, y: 200 }, { x: 60, y: 120 }),
  'nav': makeGridBox({ x: 200, y: 0 }, { x: 120, y: 40 }),
  'header': makeGridBox({ x: 50, y: 300 }, { x: 200, y: 80 }),
  'main': makeGridBox({ x: 120, y: 150 }, { x: 180, y: 140 }),
  'block_4': makeGridBox({ x: 300, y: 50 }, { x: 90, y: 70 })
};

const myBoxes: Partial<Record<NodeID, GridBox>> = {
  'block_1': makeGridBox({ x: 10, y: 10 }, { x: 50, y: 50 }),
  'block_2': makeGridBox({ x: 70, y: 10 }, { x: 50, y: 50 }),
  'block_3': makeGridBox({ x: 130, y: 10 }, { x: 50, y: 50 })
};

let diagnostics: DiagnosticEntry[] = [];
let boxes = { ...existingBoxes };

// getCoordinateBoxTo examples
// Resolve from number
const coord1 = getCoordinateBoxTo(100, boxes, diagnostics, "moveTo");
// Result: { x: 100, y: 100 }

// Resolve from coordinate
const coord2 = getCoordinateBoxTo({ x: 50, y: 75 }, boxes, diagnostics, "moveTo");
// Result: { x: 50, y: 75 }

// Resolve from box anchor
const coord3 = getCoordinateBoxTo(
  { boxId: 'block_1', anchor: 'topLeft' }, 
  boxes, 
  diagnostics, 
  "moveTo"
);
// Result: coordinate of block_1's topLeft anchor

// validateBoxFrom example
const validBox = validateBoxFrom('block_1', boxes, diagnostics, "moveTo");
if (validBox) {
  // Proceed with transformation using validBox
} else {
  // Handle validation failure (error already recorded in diagnostics)
}

// moveTo example
// Move aside's center to block_1's topLeft
const moveToResult = moveTo({
  boxprops: {
    from: { boxId: 'aside', anchor: 'center' },
    to: { boxId: 'block_1', anchor: 'topLeft' },
    gap: { x: 10, y: 5 }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// moveBy examples
// Move box by coordinate offset
const moveByResult1 = moveBy({
  boxprops: {
    from: { boxId: 'aside' },
    by: { x: 100, y: 50 },
    gap: { x: 5, y: 5 }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// Move box by uniform amount
const moveByResult2 = moveBy({
  boxprops: {
    from: { boxId: 'sidebar' },
    by: 25
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// alignToY examples
// Align to absolute Y position
const alignToYResult1 = alignToY({
  boxprops: {
    from: { boxId: 'block_4', anchor: 'bottomLeft' },
    to: 300,
    gap: 10
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// Align to another box's Y position
const alignToYResult2 = alignToY({
  boxprops: {
    from: { boxId: 'sidebar', anchor: 'center' },
    to: { boxId: 'header', anchor: 'bottomLeft' }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// alignToX examples
// Align to absolute X position
const alignToXResult1 = alignToX({
  boxprops: {
    from: { boxId: 'nav', anchor: 'topLeft' },
    to: 150,
    gap: 20
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// Align to another box's X position
const alignToXResult2 = alignToX({
  boxprops: {
    from: { boxId: 'sidebar', anchor: 'topRight' },
    to: { boxId: 'main', anchor: 'topLeft' }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// alignAllToX example
// Align all boxes' left edges to X=100
const alignAllToXResult = alignAllToX({
  boxprops: {
    to: 100,
    anchor: 'topLeft'
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// alignAllToY example
// Align all boxes' top edges to Y=200
const alignAllToYResult = alignAllToY({
  boxprops: {
    to: 200,
    anchor: 'topLeft'
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// stackHorizontally examples
// Stack boxes horizontally with 20px gap
const stackHorizontallyResult1 = stackHorizontally({
  boxprops: { gap: 20 },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// Stack boxes with no gap (touching edges)
const stackHorizontallyResult2 = stackHorizontally({
  boxprops: {},
  boxes: { ...existingBoxes },
  diagnostics: []
});

// stackVertically examples
// Stack boxes vertically with 15px gap
const stackVerticallyResult1 = stackVertically({
  boxprops: { gap: 15 },
  boxes: { ...existingBoxes },
  diagnostics: []
});

// Stack boxes with no gap (touching edges)
const stackVerticallyResult2 = stackVertically({
  boxprops: {},
  boxes: { ...existingBoxes },
  diagnostics: []
});

// DefaultBoxTransformations examples
// Get the default transformation registry
const transformations = DefaultBoxTransformations();

// Use a specific transformation
const factoryResult = transformations.moveTo({
  boxprops: {
    from: { boxId: 'block_1', anchor: 'center' },
    to: { x: 100, y: 200 }
  },
  boxes: { ...myBoxes },
  diagnostics: []
});

// Apply multiple transformations
const stackResult = transformations.stackHorizontally({
  boxprops: { gap: 20 },
  boxes: { ...myBoxes },
  diagnostics: []
});

const alignResult = transformations.alignAllToY({
  boxprops: { to: 100, anchor: 'center' },
  boxes: { ...myBoxes },
  diagnostics: []
});
