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
function makeDiagnostic(severity, origin, code, message, extras = {}) {
  return {
    severity,
    origin,
    issue: {
      code,
      message,
      ...extras
    }
  };
}
function makeError(origin, code, message, extras = {}) {
  return makeDiagnostic("error", origin, code, message, extras);
}
function makeWarning(origin, code, message, extras = {}) {
  return makeDiagnostic("warning", origin, code, message, extras);
}

// src/cssStringify.ts
function cssLengthToString(len) {
  return `${len.value}${len.unit}`;
}
function isCssLength(v) {
  return typeof v === "object" && v !== null && "unit" in v && "value" in v && v.unit && typeof v.value === "number";
}
function trackBreadthToString(b) {
  if (isCssLength(b)) return cssLengthToString(b);
  switch (b.unit) {
    case "fr":
      return `${b.value}fr`;
    case "auto":
      return "auto";
    case "min-content":
      return "min-content";
    case "max-content":
      return "max-content";
    case "fit-content":
      return `fit-content(${cssLengthToString(b.value)})`;
    default: {
      const _never = b;
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

export {
  BREAKPOINTS,
  GRID_ERROR_CODE,
  makeError,
  makeWarning,
  gridUnitValueToString,
  gapValueToString
};
//# sourceMappingURL=chunk-NNZR6OKN.js.map