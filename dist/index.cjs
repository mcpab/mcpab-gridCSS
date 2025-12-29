"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to2;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BREAKPOINTS: () => BREAKPOINTS,
  CSSLayout: () => CSSLayout,
  GRID_ERROR_CODE: () => GRID_ERROR_CODE,
  addCoordinates: () => addCoordinates,
  gapValueToString: () => gapValueToString,
  getDefaultTheme: () => getDefaultTheme,
  gridUnitValueToString: () => gridUnitValueToString,
  makeError: () => makeError,
  makeWarning: () => makeWarning,
  subtractCoordinates: () => subtractCoordinates,
  typedKeys: () => typedKeys
});
module.exports = __toCommonJS(src_exports);

// src/breakpoints.ts
var BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];

// src/gridErrorShape.ts
var GRID_ERROR_CODE = {
  // --- Core grid / geometry issues ----------------------------
  OVERLAP_NOT_ALLOWED: "OVERLAP_NOT_ALLOWED",
  // --- Pattern / semantic node issues -------------------------
  INVALID_TRANSFORMATION_PARAMS: "INVALID_TRANSFORMATION_PARAMS",
  // --- Runtime layout / builder anomalies --------------------
  NO_BOXES_PROCESSED: "NO_BOXES_PROCESSED",
  NO_SECTION_ID: "NO_SECTION_ID",
  BOX_SHAPE_MISSING_BP: "BOX_SHAPE_MISSING_BP",
  UNKNOWN_TRANSFORMATION: "UNKNOWN_TRANSFORMATION",
  EMPTY_GRID: "EMPTY_GRID",
  GRID_NORMALIZED_TO_POSITIVE_LINES: "GRID_NORMALIZED_TO_POSITIVE_LINES",
  MISSING_COORDINATES: "MISSING_COORDINATES",
  SECTION_SHAPES_MISSING_BP: "SECTION_SHAPES_MISSING_BP",
  UNKNOWN_NODE_ID: "UNKNOWN_NODE_ID",
  UNKNOWN_ANCHOR: "UNKNOWN_ANCHOR",
  BOX_SPAN_MISSING: "BOX_SPAN_MISSING",
  MISSING_BOX: "MISSING_BOX",
  CONSTRAINT_VIOLATION: "CONSTRAINT_VIOLATION"
};
function makeDiagnostic(severity, origin2, code, message, extras = {}) {
  return {
    severity,
    origin: origin2,
    issue: {
      code,
      message,
      ...extras
    }
  };
}
function makeError(origin2, code, message, extras = {}) {
  return makeDiagnostic("error", origin2, code, message, extras);
}
function makeWarning(origin2, code, message, extras = {}) {
  return makeDiagnostic("warning", origin2, code, message, extras);
}

// src/box/boxPositions.ts
var boxPosition = (box, boxAnchor) => {
  let coordinate;
  if (boxAnchor === "bottomLeft") {
    coordinate = {
      x: box.origin.x,
      y: box.origin.y
    };
  } else if (boxAnchor === "bottomRight") {
    coordinate = {
      x: box.origin.x + box.diagonal.x,
      y: box.origin.y
    };
  } else if (boxAnchor === "topLeft") {
    coordinate = {
      x: box.origin.x,
      y: box.origin.y + box.diagonal.y
    };
  } else if (boxAnchor === "topRight") {
    coordinate = {
      x: box.origin.x + box.diagonal.x,
      y: box.origin.y + box.diagonal.y
    };
  } else if (boxAnchor === "center") {
    coordinate = {
      x: box.origin.x + box.diagonal.x / 2,
      y: box.origin.y + box.diagonal.y / 2
    };
  } else {
    return void 0;
  }
  return coordinate;
};

// src/geometry/matrixAlgebra.ts
var reflectionOnXAxis = [
  [1, 0],
  [0, -1]
];
var reflectionOnYAxis = [
  [-1, 0],
  [0, 1]
];
var rotationByThetaClockWise = (theta) => {
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  return [
    [cosTheta, sinTheta],
    [-sinTheta, cosTheta]
  ];
};
var multiply = (matrix, v) => {
  return {
    x: matrix[0][0] * v.x + matrix[0][1] * v.y,
    y: matrix[1][0] * v.x + matrix[1][1] * v.y
  };
};

// src/geometry/coordinateAlgebra.ts
var getOrigin = () => {
  return { x: 0, y: 0 };
};
var linearCombination = (alpha, a2, beta, b2) => {
  return { x: a2.x * alpha + b2.x * beta, y: a2.y * alpha + b2.y * beta };
};
var multiplyScalar = (scalar, a2) => {
  return linearCombination(scalar, a2, 0, getOrigin());
};
var addCoordinates = (a2, b2) => {
  return linearCombination(1, a2, 1, b2);
};
var subtractCoordinates = (a2, b2) => {
  return linearCombination(1, a2, -1, b2);
};
var reflectOnXAxis = (coord4) => {
  return multiply(reflectionOnXAxis, coord4);
};
var reflectOnYAxis = (coord4) => {
  return multiply(reflectionOnYAxis, coord4);
};
var rotateByClockWise = (theta, coord4) => {
  const rotationMatrix = rotationByThetaClockWise(theta);
  return multiply(rotationMatrix, coord4);
};
var invert = (coord4) => {
  return multiplyScalar(-1, coord4);
};
var origin = getOrigin();
var offset = addCoordinates(origin, { x: 10, y: 20 });
var a = { x: 2, y: 3 };
var b = { x: 4, y: 1 };
var result = linearCombination(2, a, 3, b);
var blend = linearCombination(0.7, a, 0.3, b);
var coord = { x: 3, y: 4 };
var doubled = multiplyScalar(2, coord);
var halved = multiplyScalar(0.5, coord);
var negated = multiplyScalar(-1, coord);
var pointA = { x: 2, y: 3 };
var offsetValue = { x: 5, y: -1 };
var addResult = addCoordinates(pointA, offsetValue);
var final = addCoordinates(
  addCoordinates(pointA, offsetValue),
  { x: 1, y: 1 }
);
var endPoint = { x: 10, y: 8 };
var startPoint = { x: 3, y: 2 };
var displacement = subtractCoordinates(endPoint, startPoint);
var from = { x: 1, y: 1 };
var to = { x: 4, y: 5 };
var vector = subtractCoordinates(to, from);
var point = { x: 3, y: 4 };
var reflectedX = reflectOnXAxis(point);
var upperPoint = { x: 2, y: 5 };
var lowerPoint = reflectOnXAxis(upperPoint);
var reflectedY = reflectOnYAxis(point);
var rightPoint = { x: 5, y: 2 };
var leftPoint = reflectOnYAxis(rightPoint);
var pointForRotation = { x: 1, y: 0 };
var rotated90 = rotateByClockWise(Math.PI / 2, pointForRotation);
var rotated180 = rotateByClockWise(Math.PI, pointForRotation);
var rotated45 = rotateByClockWise(Math.PI / 4, { x: 1, y: 1 });
var pointToInvert = { x: 3, y: -4 };
var inverted = invert(pointToInvert);
var velocity = { x: 10, y: 5 };
var oppositeDirection = invert(velocity);
var originalBack = invert(invert(pointToInvert));

// src/geometry/coordinatesUtils.ts
var copyCoordinate = (coord4) => {
  return { x: coord4.x, y: coord4.y };
};

// src/box/gridBoxUtils.ts
var makeGridBox = (origin2, diagonal) => {
  const org = copyCoordinate(origin2);
  const diag = copyCoordinate(diagonal);
  diag.x = Math.abs(diag.x);
  diag.y = Math.abs(diag.y);
  return {
    origin: org,
    diagonal: diag,
    _normalized: "GridBox"
  };
};

// src/boxTransformations/defaultBoxTransformations.ts
function getCoordinateBoxTo(to2, boxes2, diagnostics2, source) {
  let toPoint;
  if (typeof to2 === "number") {
    toPoint = { x: to2, y: to2 };
  } else if ("x" in to2 && "y" in to2) {
    toPoint = { x: to2.x, y: to2.y };
  } else if ("boxId" in to2 && "anchor" in to2) {
    const boxTo = boxes2[to2.boxId];
    if (!boxTo) {
      diagnostics2.push(
        makeError(
          source,
          GRID_ERROR_CODE.UNKNOWN_NODE_ID,
          `${source} transformation has invalid 'to' boxId: ${to2.boxId}`
        )
      );
      return void 0;
    }
    const anchorCoord = boxPosition(boxTo, to2.anchor);
    if (!anchorCoord) {
      diagnostics2.push(
        makeError(
          source,
          GRID_ERROR_CODE.UNKNOWN_ANCHOR,
          `${source} transformation has invalid 'to' anchor: ${to2.anchor}`
        )
      );
      return void 0;
    }
    toPoint = anchorCoord;
  } else {
    diagnostics2.push(
      makeError(
        source,
        GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS,
        `${source} transformation has invalid 'to' parameter`
      )
    );
    return void 0;
  }
  return toPoint;
}
function validateBoxFrom(boxId, boxes2, diagnostics2, source) {
  const boxFrom = boxes2[boxId];
  if (!boxFrom) {
    diagnostics2.push(
      makeError(
        source,
        GRID_ERROR_CODE.UNKNOWN_NODE_ID,
        `${source} transformation has invalid 'from' boxId: ${boxId}`
      )
    );
    return void 0;
  }
  return boxFrom;
}
var moveTo = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { from: from2, to: to2, gap } = boxprops;
  const boxFrom = validateBoxFrom(from2.boxId, boxes2, diagnostics2, "moveTo");
  if (!boxFrom) {
    return void 0;
  }
  let toPoint = getCoordinateBoxTo(to2, boxes2, diagnostics2, "moveTo");
  if (!toPoint) {
    return void 0;
  }
  const fromAnchor = boxPosition(boxFrom, from2.anchor);
  if (!fromAnchor) {
    diagnostics2.push(
      makeError(
        "moveTo",
        GRID_ERROR_CODE.UNKNOWN_ANCHOR,
        `moveTo transformation has invalid 'from' anchor: ${from2.anchor}`
      )
    );
    return void 0;
  }
  if (gap !== void 0) {
    toPoint = addCoordinates(toPoint, gap);
  }
  const displacement2 = subtractCoordinates(toPoint, fromAnchor);
  let newOrigin = addCoordinates(boxFrom.origin, displacement2);
  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);
  boxes2[from2.boxId] = newBox;
  return newBox;
};
var moveBy = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { from: from2, by, gap } = boxprops;
  const boxFrom = validateBoxFrom(from2.boxId, boxes2, diagnostics2, "moveBy");
  if (!boxFrom) {
    return void 0;
  }
  let delta;
  if (typeof by === "number") {
    delta = { x: by, y: by };
  } else if ("x" in by && "y" in by) {
    delta = by;
  } else {
    diagnostics2.push(
      makeError(
        "moveBy",
        GRID_ERROR_CODE.INVALID_TRANSFORMATION_PARAMS,
        `moveBy transformation has invalid 'by' parameter`
      )
    );
    return void 0;
  }
  if (gap !== void 0) {
    delta = addCoordinates(delta, gap);
  }
  const newOrigin = addCoordinates(boxFrom.origin, delta);
  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);
  boxes2[from2.boxId] = newBox;
  return newBox;
};
var alignToY = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { from: from2, to: to2, gap } = boxprops;
  const boxFrom = validateBoxFrom(from2.boxId, boxes2, diagnostics2, "alignToY");
  if (!boxFrom) {
    return void 0;
  }
  const toPoint = getCoordinateBoxTo(to2, boxes2, diagnostics2, "alignToY");
  if (!toPoint) {
    return void 0;
  }
  const fromAnchor = boxPosition(boxFrom, from2.anchor);
  if (!fromAnchor) {
    diagnostics2.push(
      makeError(
        "alignToY",
        GRID_ERROR_CODE.UNKNOWN_ANCHOR,
        `alignToY transformation has invalid 'from' anchor: ${from2.anchor}`
      )
    );
    return void 0;
  }
  toPoint.x = fromAnchor.x;
  const displacement2 = subtractCoordinates(toPoint, fromAnchor);
  if (gap !== void 0) {
    displacement2.y += gap;
  }
  let newOrigin = addCoordinates(boxFrom.origin, displacement2);
  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);
  boxes2[from2.boxId] = newBox;
  return newBox;
};
var alignToX = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { from: from2, to: to2, gap } = boxprops;
  const boxFrom = validateBoxFrom(from2.boxId, boxes2, diagnostics2, "alignToX");
  if (!boxFrom) {
    return void 0;
  }
  const toPoint = getCoordinateBoxTo(to2, boxes2, diagnostics2, "alignToX");
  if (!toPoint) {
    return void 0;
  }
  const fromAnchor = boxPosition(boxFrom, from2.anchor);
  if (!fromAnchor) {
    diagnostics2.push(
      makeError(
        "alignToX",
        GRID_ERROR_CODE.UNKNOWN_ANCHOR,
        `alignToX transformation has invalid 'from' anchor: ${from2.anchor}`
      )
    );
    return void 0;
  }
  toPoint.y = fromAnchor.y;
  const displacement2 = subtractCoordinates(toPoint, fromAnchor);
  if (gap !== void 0) {
    displacement2.x += gap;
  }
  let newOrigin = addCoordinates(boxFrom.origin, displacement2);
  const newBox = makeGridBox(newOrigin, boxFrom.diagonal);
  boxes2[from2.boxId] = newBox;
  return newBox;
};
var alignAllToX = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { to: to2, anchor } = boxprops;
  let newBoxes = {};
  for (const boxId in boxes2) {
    const id = boxId;
    const newBox = alignToX({
      boxprops: {
        from: {
          boxId: id,
          anchor
        },
        to: to2
      },
      boxes: boxes2,
      diagnostics: diagnostics2
    });
    if (newBox) {
      newBoxes[id] = newBox;
      boxes2[id] = newBox;
    }
  }
  if (Object.keys(newBoxes).length === 0) {
    diagnostics2.push(
      makeError(
        "alignAllToX",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `alignAllToX transformation could not process any box`
      )
    );
    return void 0;
  }
  return newBoxes;
};
var alignAllToY = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { to: to2, anchor } = boxprops;
  let newBoxes = {};
  for (const boxId in boxes2) {
    const id = boxId;
    const newBox = alignToY({
      boxprops: {
        from: {
          boxId: id,
          anchor
        },
        to: to2
      },
      boxes: boxes2,
      diagnostics: diagnostics2
    });
    if (newBox) {
      newBoxes[id] = newBox;
      boxes2[id] = newBox;
    }
  }
  if (Object.keys(newBoxes).length === 0) {
    diagnostics2.push(
      makeError(
        "alignAllToY",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `alignAllToY transformation could not process any box`
      )
    );
    return void 0;
  }
  return newBoxes;
};
var stackHorizontally = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { gap } = boxprops;
  let newBoxes = {};
  let x0 = 0;
  for (const boxId in boxes2) {
    const id = boxId;
    const newBox = alignToX({
      boxprops: {
        from: {
          boxId: id,
          anchor: "bottomLeft"
        },
        to: x0
      },
      boxes: boxes2,
      diagnostics: diagnostics2
    });
    if (newBox) {
      newBoxes[id] = newBox;
      x0 += newBox.diagonal.x + (gap ? gap : 0);
      boxes2[id] = newBox;
    }
  }
  if (Object.keys(newBoxes).length === 0) {
    diagnostics2.push(
      makeError(
        "stackHorizontally",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `stackHorizontally transformation could not process any box`
      )
    );
    return void 0;
  }
  return newBoxes;
};
var stackVertically = (props) => {
  const { boxprops, boxes: boxes2, diagnostics: diagnostics2 } = props;
  const { gap } = boxprops;
  let newBoxes = {};
  let y0 = 0;
  for (const boxId in boxes2) {
    const id = boxId;
    const newBox = alignToY({
      boxprops: {
        from: {
          boxId: id,
          anchor: "bottomLeft"
        },
        to: y0
      },
      boxes: boxes2,
      diagnostics: diagnostics2
    });
    if (newBox) {
      newBoxes[id] = newBox;
      y0 += newBox.diagonal.y + (gap ? gap : 0);
      boxes2[id] = newBox;
    }
  }
  if (Object.keys(newBoxes).length === 0) {
    diagnostics2.push(
      makeError(
        "stackVertically",
        GRID_ERROR_CODE.NO_BOXES_PROCESSED,
        `stackVertically transformation could not process any box`
      )
    );
    return void 0;
  }
  return newBoxes;
};
var DefaultBoxTransformations = () => {
  return {
    moveTo,
    moveBy,
    alignToY,
    alignToX,
    alignAllToX,
    alignAllToY,
    stackHorizontally,
    stackVertically
  };
};
var existingBoxes = {
  "block_1": makeGridBox({ x: 0, y: 0 }, { x: 100, y: 50 }),
  "aside": makeGridBox({ x: 150, y: 100 }, { x: 80, y: 60 }),
  "sidebar": makeGridBox({ x: 0, y: 200 }, { x: 60, y: 120 }),
  "nav": makeGridBox({ x: 200, y: 0 }, { x: 120, y: 40 }),
  "header": makeGridBox({ x: 50, y: 300 }, { x: 200, y: 80 }),
  "main": makeGridBox({ x: 120, y: 150 }, { x: 180, y: 140 }),
  "block_4": makeGridBox({ x: 300, y: 50 }, { x: 90, y: 70 })
};
var myBoxes = {
  "block_1": makeGridBox({ x: 10, y: 10 }, { x: 50, y: 50 }),
  "block_2": makeGridBox({ x: 70, y: 10 }, { x: 50, y: 50 }),
  "block_3": makeGridBox({ x: 130, y: 10 }, { x: 50, y: 50 })
};
var diagnostics = [];
var boxes = { ...existingBoxes };
var coord1 = getCoordinateBoxTo(100, boxes, diagnostics, "moveTo");
var coord2 = getCoordinateBoxTo({ x: 50, y: 75 }, boxes, diagnostics, "moveTo");
var coord3 = getCoordinateBoxTo(
  { boxId: "block_1", anchor: "topLeft" },
  boxes,
  diagnostics,
  "moveTo"
);
var validBox = validateBoxFrom("block_1", boxes, diagnostics, "moveTo");
if (validBox) {
} else {
}
var moveToResult = moveTo({
  boxprops: {
    from: { boxId: "aside", anchor: "center" },
    to: { boxId: "block_1", anchor: "topLeft" },
    gap: { x: 10, y: 5 }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var moveByResult1 = moveBy({
  boxprops: {
    from: { boxId: "aside" },
    by: { x: 100, y: 50 },
    gap: { x: 5, y: 5 }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var moveByResult2 = moveBy({
  boxprops: {
    from: { boxId: "sidebar" },
    by: 25
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var alignToYResult1 = alignToY({
  boxprops: {
    from: { boxId: "block_4", anchor: "bottomLeft" },
    to: 300,
    gap: 10
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var alignToYResult2 = alignToY({
  boxprops: {
    from: { boxId: "sidebar", anchor: "center" },
    to: { boxId: "header", anchor: "bottomLeft" }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var alignToXResult1 = alignToX({
  boxprops: {
    from: { boxId: "nav", anchor: "topLeft" },
    to: 150,
    gap: 20
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var alignToXResult2 = alignToX({
  boxprops: {
    from: { boxId: "sidebar", anchor: "topRight" },
    to: { boxId: "main", anchor: "topLeft" }
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var alignAllToXResult = alignAllToX({
  boxprops: {
    to: 100,
    anchor: "topLeft"
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var alignAllToYResult = alignAllToY({
  boxprops: {
    to: 200,
    anchor: "topLeft"
  },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var stackHorizontallyResult1 = stackHorizontally({
  boxprops: { gap: 20 },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var stackHorizontallyResult2 = stackHorizontally({
  boxprops: {},
  boxes: { ...existingBoxes },
  diagnostics: []
});
var stackVerticallyResult1 = stackVertically({
  boxprops: { gap: 15 },
  boxes: { ...existingBoxes },
  diagnostics: []
});
var stackVerticallyResult2 = stackVertically({
  boxprops: {},
  boxes: { ...existingBoxes },
  diagnostics: []
});
var transformations = DefaultBoxTransformations();
var factoryResult = transformations.moveTo({
  boxprops: {
    from: { boxId: "block_1", anchor: "center" },
    to: { x: 100, y: 200 }
  },
  boxes: { ...myBoxes },
  diagnostics: []
});
var stackResult = transformations.stackHorizontally({
  boxprops: { gap: 20 },
  boxes: { ...myBoxes },
  diagnostics: []
});
var alignResult = transformations.alignAllToY({
  boxprops: { to: 100, anchor: "center" },
  boxes: { ...myBoxes },
  diagnostics: []
});

// src/boxTransformations/boxTransformationsProps.ts
var transformationIDs = [
  "moveTo",
  "moveBy",
  "alignToY",
  "alignToX",
  "alignAllToY",
  "alignAllToX",
  "stackVertically",
  "stackHorizontally"
];

// src/boxDesign/transformBoxMove.ts
var transformBoxMove = (transformationFactory, boxTransformations, gridBoxes, diagnostics2) => {
  BREAKPOINTS.forEach((bp) => {
    if (!(bp in boxTransformations)) {
      return;
    }
    const transformationsAtBp = boxTransformations[bp];
    if (!transformationsAtBp) {
      return;
    }
    transformationsAtBp.forEach((tx) => {
      const tr = tx;
      const txID = Object.keys(tr)[0];
      if (!transformationIDs.includes(txID)) {
        diagnostics2.push(makeError(
          "transformBoxMove",
          GRID_ERROR_CODE.UNKNOWN_TRANSFORMATION,
          `Unknown transformation key: ${txID}`
        ));
        return;
      }
      switch (txID) {
        case "moveTo":
          {
            const propsMove = tr.moveTo;
            let result2 = transformationFactory.moveTo({
              boxprops: propsMove,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `moveTo transformation failed for box ${JSON.stringify(propsMove)}`
              ));
            }
          }
          break;
        case "moveBy":
          {
            const propsMoveBy = tr.moveBy;
            let result2 = transformationFactory.moveBy({
              boxprops: propsMoveBy,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `moveBy transformation failed for box ${JSON.stringify(propsMoveBy)}`
              ));
            }
          }
          break;
        case "alignToY":
          {
            const propsAlignY = tr.alignToY;
            let result2 = transformationFactory.alignToY({
              boxprops: propsAlignY,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `alignToY transformation failed for box ${JSON.stringify(propsAlignY)}`
              ));
            }
          }
          break;
        case "alignToX":
          {
            const propsAlignX = tr.alignToX;
            let result2 = transformationFactory.alignToX({
              boxprops: propsAlignX,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `alignToX transformation failed for box ${JSON.stringify(propsAlignX)}`
              ));
            }
          }
          break;
        case "alignAllToY":
          {
            const propsAlignAllY = tr.alignAllToY;
            let result2 = transformationFactory.alignAllToY({
              boxprops: propsAlignAllY,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `alignAllToY transformation failed for box ${JSON.stringify(propsAlignAllY)}`
              ));
            }
          }
          break;
        case "alignAllToX":
          {
            const propsAlignAllX = tr.alignAllToX;
            let result2 = transformationFactory.alignAllToX({
              boxprops: propsAlignAllX,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `alignAllToX transformation failed for box ${JSON.stringify(propsAlignAllX)}`
              ));
            }
          }
          break;
        case "stackVertically":
          {
            const propsStackV = tr.stackVertically;
            let result2 = transformationFactory.stackVertically({
              boxprops: propsStackV,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `stackVertically transformation failed for box ${JSON.stringify(propsStackV)}`
              ));
            }
          }
          break;
        case "stackHorizontally":
          {
            const propsStackH = tr.stackHorizontally;
            let result2 = transformationFactory.stackHorizontally({
              boxprops: propsStackH,
              boxes: gridBoxes[bp],
              diagnostics: diagnostics2
            });
            if (!result2) {
              diagnostics2.push(makeError(
                "transformBoxMove",
                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                `stackHorizontally transformation failed for box ${JSON.stringify(propsStackH)}`
              ));
            }
          }
          break;
        default:
          diagnostics2.push(makeError(
            "transformBoxMove",
            GRID_ERROR_CODE.UNKNOWN_TRANSFORMATION,
            `Unhandled transformation key: ${txID}`
          ));
          const _exhaustive = txID;
          break;
      }
    });
  });
};

// src/boxDesign/layoutSectionBtoAbsolute.ts
function layoutSectionKeys(sections) {
  return Object.keys(sections).filter(
    (k) => sections[k] != null
  );
}
function layoutSectionBtoAbsolute(layoutSectionBounds, diagnostics2) {
  let LayoutAbsolute = {};
  let defaultBoxTransformations = DefaultBoxTransformations();
  let transformations2 = layoutSectionBounds.transformations ? layoutSectionBounds.transformations : {};
  const sections = layoutSectionKeys(layoutSectionBounds.sections);
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sections) {
      const boundBox = layoutSectionBounds.boundingBoxes[bp][sectionId];
      const localBoxes = layoutSectionBounds.sections[sectionId][bp];
      if (!localBoxes) {
        continue;
      }
      for (const boxId in localBoxes) {
        const box = localBoxes[boxId];
        if (!box) {
          continue;
        }
        box.origin = subtractCoordinates(box.origin, boundBox.origin);
      }
    }
  });
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sections) {
      const boundBox = layoutSectionBounds.boundingBoxes[bp][sectionId];
      boundBox.origin = { x: 1, y: 1 };
    }
  });
  transformBoxMove(
    defaultBoxTransformations,
    transformations2,
    layoutSectionBounds.boundingBoxes,
    diagnostics2
  );
  BREAKPOINTS.forEach((bp) => {
    const localGridBoxesPerBp = layoutSectionBounds.boundingBoxes[bp];
    for (const sectionId of sections) {
      const boundBox = localGridBoxesPerBp[sectionId];
      const localBoxes = layoutSectionBounds.sections[sectionId][bp];
      if (!localBoxes) {
        continue;
      }
      for (const boxId in localBoxes) {
        const box = localBoxes[boxId];
        if (!box) {
          continue;
        }
        box.origin = addCoordinates(box.origin, boundBox.origin);
      }
    }
  });
  LayoutAbsolute.gridDimensions = {
    rows: {},
    columns: {}
  };
  BREAKPOINTS.forEach((bp) => {
    const localGridBoxesPerBp = layoutSectionBounds.boundingBoxes[bp];
    let maxRow = 0;
    let maxCol = 0;
    for (const sectionId of sections) {
      const boundBox = localGridBoxesPerBp[sectionId];
      const boxMaxRow = boundBox.origin.y + boundBox.diagonal.y;
      const boxMaxCol = boundBox.origin.x + boundBox.diagonal.x;
      if (boxMaxRow > maxRow) {
        maxRow = boxMaxRow;
      }
      if (boxMaxCol > maxCol) {
        maxCol = boxMaxCol;
      }
    }
    LayoutAbsolute.gridDimensions.rows[bp] = Math.max(1, maxRow - 1);
    LayoutAbsolute.gridDimensions.columns[bp] = Math.max(1, maxCol - 1);
  });
  LayoutAbsolute.sections = {};
  let minCoordinate2 = {
    xs: { x: Infinity, y: Infinity },
    sm: { x: Infinity, y: Infinity },
    md: { x: Infinity, y: Infinity },
    lg: { x: Infinity, y: Infinity },
    xl: { x: Infinity, y: Infinity }
  };
  for (const sectionId of sections) {
    let crd = {};
    crd.coordinates = {};
    BREAKPOINTS.forEach((bp) => {
      crd.coordinates[bp] = {};
      let boxesatBp = layoutSectionBounds.sections[sectionId][bp];
      if (!boxesatBp) {
        return;
      }
      for (const boxId in boxesatBp) {
        const box = boxesatBp[boxId];
        if (!box) {
          continue;
        }
        let coord4 = getCSSCoordinates(box);
        crd.coordinates[bp][boxId] = coord4;
        if (coord4.gridColumnStart < minCoordinate2[bp].x) {
          minCoordinate2[bp].x = coord4.gridColumnStart;
        }
        if (coord4.gridRowStart < minCoordinate2[bp].y) {
          minCoordinate2[bp].y = coord4.gridRowStart;
        }
      }
    });
    LayoutAbsolute.sections[sectionId] = crd;
  }
  BREAKPOINTS.forEach((bp) => {
    if (minCoordinate2[bp].x === Infinity && minCoordinate2[bp].y === Infinity) {
      diagnostics2.push(
        makeWarning(
          "layoutSectionBtoAbsolute",
          GRID_ERROR_CODE.EMPTY_GRID,
          `Empty grid at breakpoint ${bp}. Setting minimal dimensions`
        )
      );
      LayoutAbsolute.gridDimensions.columns[bp] = 1;
      LayoutAbsolute.gridDimensions.rows[bp] = 1;
      return;
    }
    let dx = 0;
    let dy = 0;
    if (minCoordinate2[bp].x < 1) {
      dx = 1 - minCoordinate2[bp].x;
    }
    if (minCoordinate2[bp].y < 1) {
      dy = 1 - minCoordinate2[bp].y;
    }
    if (dx === 0 && dy === 0) {
      return;
    }
    LayoutAbsolute.gridDimensions.columns[bp] += dx;
    LayoutAbsolute.gridDimensions.rows[bp] += dy;
    diagnostics2.push(
      makeWarning(
        "layoutSectionBtoAbsolute",
        GRID_ERROR_CODE.GRID_NORMALIZED_TO_POSITIVE_LINES,
        `Grid normalized to positive values at bp ${bp}`
      )
    );
    for (const sectionId of sections) {
      let coordinates = LayoutAbsolute.sections[sectionId].coordinates[bp];
      if (!coordinates) {
        continue;
      }
      for (const boxId in coordinates) {
        let coordinate = coordinates[boxId];
        if (!coordinate) {
          continue;
        }
        coordinate.gridColumnEnd += dx;
        coordinate.gridColumnStart += dx;
        coordinate.gridRowStart += dy;
        coordinate.gridRowEnd += dy;
      }
    }
  });
  return LayoutAbsolute;
}
function getCSSCoordinates(box) {
  return {
    // Column positioning: start at origin X, end at origin X + width
    gridColumnStart: box.origin.x,
    gridColumnEnd: box.origin.x + box.diagonal.x,
    // Row positioning: start at origin Y, end at origin Y + height
    gridRowStart: box.origin.y,
    gridRowEnd: box.origin.y + box.diagonal.y
  };
}

// src/boxDesign/layoutSectionToBounds.ts
function layoutSectionKeys2(sections) {
  return Object.keys(sections).filter(
    (k) => sections[k] != null
  );
}
function layoutSectionToBounds(layoutSectionLocal, diagnostics2) {
  let layoutSectionBounds = {};
  layoutSectionBounds.sections = layoutSectionLocal.sections;
  layoutSectionBounds.boundingBoxes = {
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: {}
  };
  layoutSectionBounds.transformations = layoutSectionLocal.transformations;
  const sectionIds = layoutSectionKeys2(layoutSectionLocal.sections);
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sectionIds) {
      let boundPerSection;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let gridBoxes = layoutSectionLocal.sections[sectionId];
      const boxesAtBp = gridBoxes[bp];
      let foundAnyBox = false;
      for (const boxId in boxesAtBp) {
        const box = boxesAtBp[boxId];
        if (!box) {
          continue;
        }
        minX = Math.min(minX, box.origin.x);
        maxX = Math.max(maxX, box.origin.x + box.diagonal.x);
        minY = Math.min(minY, box.origin.y);
        maxY = Math.max(maxY, box.origin.y + box.diagonal.y);
        foundAnyBox = true;
      }
      if (!foundAnyBox) {
        diagnostics2.push(
          makeError(
            "layoutSectionToBounds",
            GRID_ERROR_CODE.MISSING_BOX,
            `No boxes found for section ${sectionId} at breakpoint ${bp}. Returning empty bounding box.`
          )
        );
        boundPerSection = makeGridBox({ x: 0, y: 0 }, { x: 0, y: 0 });
        layoutSectionBounds.boundingBoxes[bp][sectionId] = boundPerSection;
        continue;
      }
      boundPerSection = makeGridBox(
        {
          x: minX,
          // Top-left corner X coordinate
          y: minY
          // Top-left corner Y coordinate
        },
        {
          x: maxX - minX,
          // Width (right edge - left edge)
          y: maxY - minY
          // Height (bottom edge - top edge)
        }
      );
      layoutSectionBounds.boundingBoxes[bp][sectionId] = boundPerSection;
    }
  });
  return layoutSectionBounds;
}

// src/boxDesign/layoutTxToSectionLocal.ts
function layoutTxSectionKeys(sections) {
  return Object.keys(sections).filter(
    (k) => sections[k] != null
  );
}
function layoutTxToSectionLocal(layoutTx, diagnostics2) {
  const defaultBoxTransformations = DefaultBoxTransformations();
  let layoutSectionLocal = {
    sections: {},
    transformations: layoutTx.transformations ? layoutTx.transformations : {}
  };
  const sectionsKeys = layoutTxSectionKeys(layoutTx.sections);
  for (const sectionId of sectionsKeys) {
    layoutSectionLocal.sections[sectionId] = {};
    BREAKPOINTS.forEach((bp) => {
      layoutSectionLocal.sections[sectionId][bp] = layoutTx.sections[sectionId].gridBoxes[bp];
    });
  }
  for (const sectionId of sectionsKeys) {
    const transformations2 = layoutTx.sections[sectionId].transformations;
    if (!transformations2) {
      continue;
    }
    let localGridBoxesPerBp = layoutSectionLocal.sections[sectionId];
    transformBoxMove(
      defaultBoxTransformations,
      transformations2,
      localGridBoxesPerBp,
      diagnostics2
    );
  }
  return layoutSectionLocal;
}
var sectionsExample = {
  header: { gridBoxes: {}, transformations: {} },
  main: null,
  footer: { gridBoxes: {}, transformations: {} }
};
var keys = layoutTxSectionKeys(sectionsExample);
var layoutWithTxExample = {
  sections: {
    header: {
      gridBoxes: {
        xs: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 100, y: 50 }, _normalized: "GridBox" }
        },
        md: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 200, y: 50 }, _normalized: "GridBox" }
        },
        lg: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 300, y: 50 }, _normalized: "GridBox" }
        },
        sm: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 150, y: 50 }, _normalized: "GridBox" }
        },
        xl: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 400, y: 50 }, _normalized: "GridBox" }
        }
      },
      transformations: {
        xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg: [{ stackHorizontally: { gap: 30 } }],
        sm: [{ stackHorizontally: { gap: 15 } }],
        xl: [{ stackHorizontally: { gap: 40 } }]
      }
    },
    main: {
      gridBoxes: {
        xs: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 100, y: 50 }, _normalized: "GridBox" }
        },
        md: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 200, y: 50 }, _normalized: "GridBox" }
        },
        lg: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 300, y: 50 }, _normalized: "GridBox" }
        },
        sm: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 150, y: 50 }, _normalized: "GridBox" }
        },
        xl: {
          block_1: { origin: { x: 0, y: 0 }, diagonal: { x: 400, y: 50 }, _normalized: "GridBox" }
        }
      },
      transformations: {
        xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg: [{ stackHorizontally: { gap: 30 } }],
        sm: [{ stackHorizontally: { gap: 15 } }],
        xl: [{ stackHorizontally: { gap: 40 } }]
      }
    }
  },
  transformations: {
    xs: [{ stackHorizontally: {} }],
    md: [{ stackHorizontally: { gap: 20 } }],
    lg: [{ stackHorizontally: { gap: 30 } }],
    sm: [{ stackHorizontally: { gap: 15 } }],
    xl: [{ stackHorizontally: { gap: 40 } }]
  }
};
var diagnosticsExample = [];
var sectionLocalExample = layoutTxToSectionLocal(layoutWithTxExample, diagnosticsExample);
if (diagnosticsExample.length > 0) {
  console.log("Transformation issues:", diagnosticsExample);
}
var headerXsBlocks = sectionLocalExample.sections.header.xs;
var mainMdBlocks = sectionLocalExample.sections.main.md;
var layoutLevelTransforms = sectionLocalExample.transformations;

// src/boxDesign/CSSlayout.ts
function CSSLayout({
  layoutWithTx,
  diagnostics: diagnostics2,
  gridDiagnostic = { overlapPolicy: "allow", breakpoints: BREAKPOINTS }
}) {
  const layoutSectionLocal = layoutTxToSectionLocal(layoutWithTx, diagnostics2);
  const layoutSecBonds = layoutSectionToBounds(layoutSectionLocal, diagnostics2);
  const layoutSecAbs = layoutSectionBtoAbsolute(layoutSecBonds, diagnostics2);
  const overlapPolicy = gridDiagnostic.overlapPolicy || "allow";
  const breakpoints = gridDiagnostic.breakpoints || BREAKPOINTS;
  if (overlapPolicy !== "allow") {
    checkSectionsOverlap(
      layoutSecAbs,
      diagnostics2,
      overlapPolicy,
      breakpoints
    );
  }
  return layoutSecAbs;
}
function recordKeys(obj) {
  return Object.keys(obj);
}
function partialRecordKeys(obj) {
  return Object.keys(obj);
}
function overlaps(a2, b2) {
  return a2.gridColumnStart < b2.gridColumnEnd && // a's left < b's right
  b2.gridColumnStart < a2.gridColumnEnd && // b's left < a's right
  a2.gridRowStart < b2.gridRowEnd && // a's top < b's bottom
  b2.gridRowStart < a2.gridRowEnd;
}
function checkSectionsOverlap(layoutAbsolute, diagnostics2, overlapPolicy, breakpoints) {
  const sectionIds = recordKeys(layoutAbsolute.sections);
  for (const bp of breakpoints) {
    const boxesByBp = [];
    for (const sectionId of sectionIds) {
      const sectionBoxes = layoutAbsolute.sections[sectionId].coordinates[bp];
      if (!sectionBoxes) continue;
      const boxIds = partialRecordKeys(sectionBoxes);
      for (const boxId of boxIds) {
        const crd = sectionBoxes[boxId];
        if (!crd) continue;
        boxesByBp.push({
          id: `${bp}::${sectionId}::${boxId}`,
          // Unique composite identifier
          bp,
          sectionId,
          boxId,
          coords: crd
        });
      }
    }
    for (let i = 0; i < boxesByBp.length; i++) {
      const a2 = boxesByBp[i];
      for (let j = i + 1; j < boxesByBp.length; j++) {
        const b2 = boxesByBp[j];
        if (!overlaps(a2.coords, b2.coords)) continue;
        const details = {
          bp,
          a: {
            sectionId: a2.sectionId,
            boxId: a2.boxId,
            rect: {
              colStart: a2.coords.gridColumnStart,
              colEnd: a2.coords.gridColumnEnd,
              rowStart: a2.coords.gridRowStart,
              rowEnd: a2.coords.gridRowEnd
            }
          },
          b: {
            sectionId: b2.sectionId,
            boxId: b2.boxId,
            rect: {
              colStart: b2.coords.gridColumnStart,
              colEnd: b2.coords.gridColumnEnd,
              rowStart: b2.coords.gridRowStart,
              rowEnd: b2.coords.gridRowEnd
            }
          },
          pairKey: `${a2.id}__${b2.id}`
          // Unique pair identifier
        };
        const message = `Boxes ${a2.id} and ${b2.id} are overlapping.`;
        diagnostics2.push(
          overlapPolicy === "warn" ? makeWarning(
            "CSSLayout",
            GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
            message,
            {
              details
            }
          ) : makeError(
            "CSSLayout",
            GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
            message,
            {
              details
            }
          )
        );
      }
    }
  }
}

// src/layoutTheme/defaultLayoutTheme.ts
var DEFAULT_GRID_NODE_VIEW_OPTIONS = {
  minWidth0: true,
  minHeight0: true,
  justifySelf: "stretch",
  alignSelf: "stretch",
  pointerEvents: "auto",
  dataAttrs: {},
  aria: {},
  visibility: "visible"
};
function resolveGridNodeViewOptions(opts) {
  return {
    ...DEFAULT_GRID_NODE_VIEW_OPTIONS,
    ...opts,
    // ensure these objects are always present even if caller passes undefined
    dataAttrs: {
      ...DEFAULT_GRID_NODE_VIEW_OPTIONS.dataAttrs,
      ...opts?.dataAttrs ?? {}
    },
    aria: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS.aria, ...opts?.aria ?? {} }
  };
}
var DEFAULT_GRID_OPTIONS = {
  implicitRowUnits: { value: 1, unit: "fr" },
  implicitColumnUnits: { value: 1, unit: "fr" },
  overflow: "visible",
  autoFlow: "row",
  justifyItems: "stretch",
  alignItems: "stretch",
  justifyContent: "start",
  alignContent: "start",
  gap: { value: 0, unit: "px" },
  rowGap: { value: 0, unit: "px" },
  columnGap: { value: 0, unit: "px" }
};
function resolveGridOptions(opts) {
  return {
    ...DEFAULT_GRID_OPTIONS,
    ...opts
  };
}
var DefaultTransformationsResponsiveRows = {
  xs: [{ stackVertically: {} }],
  sm: [{ stackHorizontally: {} }],
  md: [{ stackHorizontally: {} }],
  lg: [{ stackHorizontally: {} }],
  xl: [{ stackHorizontally: {} }]
};
var DefaultTransformationsResponsiveColumns = {
  xs: [{ stackVertically: {} }],
  sm: [{ stackVertically: {} }],
  md: [{ stackVertically: {} }],
  lg: [{ stackVertically: {} }],
  xl: [{ stackVertically: {} }]
};
var getDefaultTheme = (layout) => {
  const theme = {
    resolveBoxSpan: (section, boxId, layout2, span, bp) => {
      let dx = span.spanX;
      let dy = span.spanY;
      if (bp === "xs") {
        dx = 1;
      }
      const gridBox = makeGridBox(getOrigin(), { x: dx, y: dy });
      return gridBox;
    },
    sectionBoxTransforms: (section, layout2) => {
      return DefaultTransformationsResponsiveRows;
    },
    layoutTransforms: (layout2) => {
      return DefaultTransformationsResponsiveColumns;
    },
    gridNodeOptions: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS },
    gridOptions: { ...DEFAULT_GRID_OPTIONS }
  };
  return theme;
};
var exampleLayout = {
  header: {
    block_1: { spanX: 4, spanY: 1 },
    block_2: { spanX: 2, spanY: 1 },
    block_3: { spanX: 3, spanY: 1 }
  },
  main: {
    block_4: { spanX: 8, spanY: 6 },
    block_5: { spanX: 4, spanY: 6 }
  },
  footer: {
    block_6: { spanX: 6, spanY: 1 },
    block_7: { spanX: 6, spanY: 1 }
  }
};
var defaultTheme = getDefaultTheme(exampleLayout);
var basicNodeOptions = resolveGridNodeViewOptions();
var customNodeOptions = resolveGridNodeViewOptions({
  justifySelf: "center",
  zIndex: 100,
  dataAttrs: { "data-testid": "grid-item" }
});
var accessibleNodeOptions = resolveGridNodeViewOptions({
  aria: { role: "button", label: "Click me" },
  visibility: "visible"
});
var defaultGridConfig = resolveGridOptions();
var spacedGridConfig = resolveGridOptions({
  gap: { value: 20, unit: "px" },
  justifyContent: "center"
});
var responsiveGridConfig = resolveGridOptions({
  implicitColumnUnits: { value: 300, unit: "px" },
  autoFlow: "column"
});
var mobileNavBox = defaultTheme.resolveBoxSpan("header", "block_1", exampleLayout, { spanX: 4, spanY: 1 }, "xs");
var desktopNavBox = defaultTheme.resolveBoxSpan("header", "block_1", exampleLayout, { spanX: 4, spanY: 1 }, "lg");
var headerTransforms = defaultTheme.sectionBoxTransforms("header", exampleLayout);
var mainTransforms = defaultTheme.sectionBoxTransforms("main", exampleLayout);
var layoutTransforms = defaultTheme.layoutTransforms(exampleLayout);
var customTheme = getDefaultTheme(exampleLayout);
var enhancedTheme = {
  ...customTheme,
  resolveBoxSpan: (section, boxId, layout, span, bp) => {
    const baseBox = customTheme.resolveBoxSpan(section, boxId, layout, span, bp);
    return makeGridBox(
      { x: baseBox.origin.x + 10, y: baseBox.origin.y + 10 },
      { x: Math.max(baseBox.diagonal.x - 20, 50), y: Math.max(baseBox.diagonal.y - 20, 30) }
    );
  },
  gridOptions: resolveGridOptions({
    gap: { value: 16, unit: "px" },
    justifyContent: "center"
  })
};
var customRowTransforms = {
  ...DefaultTransformationsResponsiveRows,
  xs: [{ stackVertically: { gap: 10 } }],
  md: [{ stackHorizontally: { gap: 20 } }]
};
var customColumnTransforms = {
  ...DefaultTransformationsResponsiveColumns,
  xs: [{ stackVertically: { gap: 15 } }],
  lg: [{ stackVertically: { gap: 30 } }]
};

// src/cssStringify.ts
function cssLengthToString(len) {
  return `${len.value}${len.unit}`;
}
function isCssLength(v) {
  return typeof v === "object" && v !== null && "unit" in v && "value" in v && v.unit && typeof v.value === "number";
}
function trackBreadthToString(b2) {
  if (isCssLength(b2)) return cssLengthToString(b2);
  switch (b2.unit) {
    case "fr":
      return `${b2.value}fr`;
    case "auto":
      return "auto";
    case "min-content":
      return "min-content";
    case "max-content":
      return "max-content";
    case "fit-content":
      return `fit-content(${cssLengthToString(b2.value)})`;
    default: {
      const _never = b2;
      return String(_never);
    }
  }
}
function gridUnitValueToString(v) {
  if (typeof v === "object" && v !== null && "unit" in v && v.unit === "minmax") {
    const mm = v;
    return `minmax(${trackBreadthToString(mm.min)}, ${trackBreadthToString(mm.max)})`;
  }
  return trackBreadthToString(v);
}
function gapValueToString(g) {
  return cssLengthToString(g);
}

// src/utils/utils.ts
function typedKeys(obj) {
  return Object.keys(obj);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BREAKPOINTS,
  CSSLayout,
  GRID_ERROR_CODE,
  addCoordinates,
  gapValueToString,
  getDefaultTheme,
  gridUnitValueToString,
  makeError,
  makeWarning,
  subtractCoordinates,
  typedKeys
});
//# sourceMappingURL=index.cjs.map