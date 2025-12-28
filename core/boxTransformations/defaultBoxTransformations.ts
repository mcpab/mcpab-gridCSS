import { addCoordinates, subtractCoordinates } from "../../geometry/coordinateAlgebra";
import { Coordinate } from "../../geometry/coordinateTypes";
import { GridBox } from "../box/gridBoxTypes";
import { makeGridBox } from "../box/gridBoxUtils";
import { NodeID } from "../../templates/layoutIDs";
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from "../gridErrorShape";
import { boxPosition } from "../box/boxPositions";
import { AllBoxMovesProps, BoxMovesFunctions, BoxMovesFunctionsProps, BoxMovesProps, BoxPropBase } from "./boxTransformationsProps";


// In my world, my boxes are in an sparse map object "boxes: Partial<Record<NodeID, GridBox>>" and I
// want to get the coordinate of a "to" parameter that can be a number, a coordinate,
// or a box anchor reference
// This is a key function used in several parts of the system
function getCoordinateBoxTo(
    to: number | Coordinate | BoxPropBase<NodeID>,
    boxes: Partial<Record<NodeID, GridBox>>, diagnostics: DiagnosticEntry[],
    source: AllBoxMovesProps<any>): Coordinate | undefined {

    let toPoint: Coordinate;

    if (typeof to === 'number') {

        toPoint = { x: to, y: to };

    } else if ('x' in to && 'y' in to) {

        toPoint = { x: to.x, y: to.y };

    } else if ('boxId' in to && 'anchor' in to) {

        const boxTo = boxes[to.boxId];

        if (!boxTo) {
            diagnostics.push(makeError(
                source,
                GRID_ERROR_CODE.UNKNOWN_NODE_ID,
                `${source} transformation has invalid 'to' boxId: ${to.boxId}`,))
            return undefined
        };

        const anchorCoord = boxPosition(boxTo, to.anchor);

        if (!anchorCoord) {
            diagnostics.push(makeError(
                source,
                GRID_ERROR_CODE.UNKNOWN_ANCHOR,
                `${source} transformation has invalid 'to' anchor: ${to.anchor}`,))
            return undefined;
        }
        toPoint = anchorCoord;

    } else {
        diagnostics.push(makeError(
            source,
            GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS,
            `${source} transformation has invalid 'to' parameter`,))
        return undefined;
    }

    return toPoint;

}

// an helper function to validate the "from" boxId
function validateBoxFrom(
    boxId: NodeID,
    boxes: Partial<Record<NodeID, GridBox>>, diagnostics: DiagnosticEntry[],
    source: AllBoxMovesProps<any>): GridBox | undefined {

    const boxFrom = boxes[boxId];
    if (!boxFrom) {
        diagnostics.push(makeError(
            source,
            GRID_ERROR_CODE.UNKNOWN_NODE_ID,
            `${source} transformation has invalid 'from' boxId: ${boxId}`,))
        return undefined
    };

    return boxFrom;

}

//this is the function that will move the box
const moveTo = (props: BoxMovesFunctionsProps<NodeID>['moveTo']) => {

    const { boxprops, boxes, diagnostics } = props;

    const { from, to, gap } = boxprops;

    const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, 'moveTo');

    if (!boxFrom) {
        return undefined;
    };

    let toPoint = getCoordinateBoxTo(to, boxes, diagnostics, 'moveTo');

    if (!toPoint) {
        return undefined;
    };

    const fromAnchor = boxPosition(boxFrom, from.anchor);
    if (!fromAnchor) {
        diagnostics.push(makeError(
            'moveTo',
            GRID_ERROR_CODE.UNKNOWN_ANCHOR,
            `moveTo transformation has invalid 'from' anchor: ${from.anchor}`,))
        return undefined;
    };

    if (gap !== undefined) {
        toPoint = addCoordinates(toPoint, gap);
    }
    const displacement = subtractCoordinates(toPoint, fromAnchor);

    let newOrigin = addCoordinates(boxFrom.origin, displacement);

    const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

    boxes[from.boxId] = newBox;

    return newBox;

}

// this moves the box by a given amount
const moveBy = (props: BoxMovesFunctionsProps<NodeID>['moveBy']) => {

    const { boxprops, boxes, diagnostics } = props;
    const { from, by, gap } = boxprops;

    const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, 'moveBy');

    if (!boxFrom) {
        return undefined;
    };

    let delta: Coordinate;
    if (typeof by === 'number') {
        delta = { x: by, y: by };
    } else if ('x' in by && 'y' in by) {
        delta = by;
    } else {
        diagnostics.push(makeError(
            'moveBy',
            GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS,
            `moveBy transformation has invalid 'by' parameter`,))
        return undefined;
    }

    if (gap !== undefined) {
        delta = addCoordinates(delta, gap);
    }

    const newOrigin = addCoordinates(boxFrom.origin, delta);

    const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

    boxes[from.boxId] = newBox;

    return newBox;

}

// this align the Y coordinate of a box to a given target
const alignToY = (props: BoxMovesFunctionsProps<NodeID>['alignToY']) => {

    const { boxprops, boxes, diagnostics } = props;

    const { from, to, gap } = boxprops;

    const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, 'alignToY');

    if (!boxFrom) {
        return undefined;
    };

    const toPoint = getCoordinateBoxTo(to, boxes, diagnostics, 'alignToY');

    if (!toPoint) {
        return undefined;
    };

    const fromAnchor = boxPosition(boxFrom, from.anchor);
    if (!fromAnchor) {
        diagnostics.push(makeError(
            'alignToY',
            GRID_ERROR_CODE.UNKNOWN_ANCHOR,
            `alignToY transformation has invalid 'from' anchor: ${from.anchor}`,))
        return undefined;
    };

    toPoint.x = fromAnchor.x;

    const displacement = subtractCoordinates(toPoint, fromAnchor);

    if (gap !== undefined) {
        displacement.y += gap;
    }

    let newOrigin = addCoordinates(boxFrom.origin, displacement);

    const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

    boxes[from.boxId] = newBox;

    return newBox;

}

// this align the X coordinate of a box to a given target
const alignToX = (props: BoxMovesFunctionsProps<NodeID>['alignToX']) => {

    const { boxprops, boxes, diagnostics } = props;
    const { from, to, gap } = boxprops;

    const boxFrom = validateBoxFrom(from.boxId, boxes, diagnostics, 'alignToX');

    if (!boxFrom) {
        return undefined;
    };

    const toPoint = getCoordinateBoxTo(to, boxes, diagnostics, 'alignToX');

    if (!toPoint) {
        return undefined;
    };

    const fromAnchor = boxPosition(boxFrom, from.anchor);
    if (!fromAnchor) {
        diagnostics.push(makeError(
            'alignToX',
            GRID_ERROR_CODE.UNKNOWN_ANCHOR,
            `alignToX transformation has invalid 'from' anchor: ${from.anchor}`,))
        return undefined;
    };

    toPoint.y = fromAnchor.y;

    const displacement = subtractCoordinates(toPoint, fromAnchor);

    if (gap !== undefined) {
        displacement.x += gap;
    }

    let newOrigin = addCoordinates(boxFrom.origin, displacement);

    const newBox = makeGridBox(newOrigin, boxFrom.diagonal);

    boxes[from.boxId] = newBox;

    return newBox;

}

const alignAllToX = (props: BoxMovesFunctionsProps<NodeID>['alignAllToX']) => {

    const { boxprops, boxes, diagnostics } = props;
    const { to, anchor } = boxprops;

    let newBoxes: Partial<Record<NodeID, GridBox>> = {};

    for (const boxId in boxes) {

        const id = boxId as NodeID;
        const newBox = alignToX({
            boxprops: {
                from: {
                    boxId: id,
                    anchor: anchor
                },
                to: to
            },
            boxes,
            diagnostics
        });

        if (newBox) {
            newBoxes[id] = newBox;
            boxes[id] = newBox;
        }



    }

    if (Object.keys(newBoxes).length === 0) {
        diagnostics.push(makeError(
            'alignAllToX',
            GRID_ERROR_CODE.NO_BOXES_PROCESSED,
            `alignAllToX transformation could not process any box`,));
        return undefined;
    }

    return newBoxes;

}

// align all boxes to a given Y coordinate
const alignAllToY = (props: BoxMovesFunctionsProps<NodeID>['alignAllToY']) => {

    const { boxprops, boxes, diagnostics } = props;
    const { to, anchor } = boxprops;

    let newBoxes: Partial<Record<NodeID, GridBox>> = {};

    for (const boxId in boxes) {

        const id = boxId as NodeID;

        const newBox = alignToY({
            boxprops: {
                from: {
                    boxId: id,
                    anchor: anchor
                },
                to: to
            },
            boxes,
            diagnostics
        });

        if (newBox) {
            newBoxes[id] = newBox;
            boxes[id] = newBox;
        }


    }

    if (Object.keys(newBoxes).length === 0) {
        diagnostics.push(makeError(
            'alignAllToY',
            GRID_ERROR_CODE.NO_BOXES_PROCESSED,
            `alignAllToY transformation could not process any box`,));


        return undefined;
    } return newBoxes;

}

// stack boxes horizontally with an optional gap
const stackHorizontally = (props: BoxMovesFunctionsProps<NodeID>['stackHorizontally']) => {

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
                    anchor: 'bottomLeft'
                },
                to: x0
            },
            boxes,
            diagnostics
        });

        if (newBox) {
            newBoxes[id] = newBox;
            x0 += newBox.diagonal.x + (gap ? gap : 0);
            boxes[id] = newBox;
        }
    }

    if (Object.keys(newBoxes).length === 0) {
        diagnostics.push(makeError(
            'stackHorizontally',
            GRID_ERROR_CODE.NO_BOXES_PROCESSED,
            `stackHorizontally transformation could not process any box`,));


        return undefined;
    }

    return newBoxes;

}


// stack boxes vertically with an optional gap
const stackVertically = (props: BoxMovesFunctionsProps<NodeID>['stackVertically']) => {

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
                    anchor: 'bottomLeft'
                },
                to: y0
            },
            boxes,
            diagnostics
        });

        if (newBox) {
            newBoxes[id] = newBox;
            y0 += newBox.diagonal.y + (gap ? gap : 0);
            boxes[id] = newBox;
        }
    }

    if (Object.keys(newBoxes).length === 0) {
        diagnostics.push(makeError(
            'stackVertically',
            GRID_ERROR_CODE.NO_BOXES_PROCESSED,
            `stackVertically transformation could not process any box`,));


        return undefined;
    }

    return newBoxes;
}

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

    }

}