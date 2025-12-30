"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mui.ts
var mui_exports = {};
__export(mui_exports, {
  DefaultNodeRender: () => DefaultNodeRender,
  GridCssMuiRenderer: () => GridCssMuiRenderer,
  getNodeDomProps: () => getNodeDomProps,
  getNodeSxProps: () => getNodeSxProps
});
module.exports = __toCommonJS(mui_exports);

// src/integration/mui/GridCssMuiRenderer.tsx
var import_Box2 = __toESM(require("@mui/material/Box"), 1);

// src/integration/mui/DefaultNodeRender.tsx
var import_styles = require("@mui/material/styles");
var import_useMediaQuery = __toESM(require("@mui/material/useMediaQuery"), 1);
var import_Box = __toESM(require("@mui/material/Box"), 1);
var import_jsx_runtime = require("react/jsx-runtime");
var visuallyHiddenStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "visible",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
function getNodeSxProps(view) {
  const v = view ?? {};
  const minWidth0 = v.minWidth0 ?? true;
  const minHeight0 = v.minHeight0 ?? true;
  return {
    // Apply minimum size constraints conditionally
    ...minWidth0 ? { minWidth: 0 } : {},
    ...minHeight0 ? { minHeight: 0 } : {},
    // CSS Grid alignment within the assigned grid area
    justifySelf: v.justifySelf ?? "stretch",
    // Horizontal alignment (default: fill area)
    alignSelf: v.alignSelf ?? "stretch",
    // Vertical alignment (default: fill area)
    // Stacking order control (only apply if explicitly set)
    ...v.zIndex != null ? { zIndex: v.zIndex } : {},
    // Mouse interaction control
    pointerEvents: v.pointerEvents ?? "auto",
    // Visibility handling with different hide mechanisms
    ...v.visibility === "hidden" ? { visibility: "hidden" } : {},
    ...v.visibility === "visuallyHidden" ? visuallyHiddenStyle : {}
  };
}
function getNodeDomProps(view) {
  const v = view ?? {};
  const aria = v.aria ?? {};
  const domProps = {};
  if (aria.role) domProps.role = aria.role;
  if (aria.label) domProps["aria-label"] = aria.label;
  if (aria.labelledBy) domProps["aria-labelledby"] = aria.labelledBy;
  if (aria.describedBy) domProps["aria-describedby"] = aria.describedBy;
  if (v.dataAttrs) {
    for (const [k, val] of Object.entries(v.dataAttrs)) {
      const key = k.startsWith("data-") ? k : `data-${k}`;
      domProps[key] = String(val);
    }
  }
  return domProps;
}
function DefaultNodeRender({
  section,
  boxId,
  cssCoordinateBPs,
  content
}) {
  const nodeSx = getNodeSxProps(content.view);
  const domProps = getNodeDomProps(content.view);
  const theme = (0, import_styles.useTheme)();
  const upSm = (0, import_useMediaQuery.default)(theme.breakpoints.up("sm"));
  const upMd = (0, import_useMediaQuery.default)(theme.breakpoints.up("md"));
  const upLg = (0, import_useMediaQuery.default)(theme.breakpoints.up("lg"));
  const upXl = (0, import_useMediaQuery.default)(theme.breakpoints.up("xl"));
  const bp = upXl ? "xl" : upLg ? "lg" : upMd ? "md" : upSm ? "sm" : "xs";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_Box.default,
    {
      ...domProps,
      sx: {
        // Foundation styles for proper grid node behavior
        boxSizing: "border-box",
        // Include padding/border in size calculations
        position: "relative",
        // Establish positioning context for children
        overflow: "visible",
        // Don't clip content by default (opt-in clipping via view)
        minWidth: 0,
        // Allow content to shrink below natural minimum width
        minHeight: 0,
        // Allow content to shrink below natural minimum height
        // Responsive CSS Grid positioning
        // Each breakpoint gets its specific grid coordinates
        gridColumnStart: {
          xs: cssCoordinateBPs.xs.gridColumnStart,
          sm: cssCoordinateBPs.sm.gridColumnStart,
          md: cssCoordinateBPs.md.gridColumnStart,
          lg: cssCoordinateBPs.lg.gridColumnStart,
          xl: cssCoordinateBPs.xl.gridColumnStart
        },
        gridColumnEnd: {
          xs: cssCoordinateBPs.xs.gridColumnEnd,
          sm: cssCoordinateBPs.sm.gridColumnEnd,
          md: cssCoordinateBPs.md.gridColumnEnd,
          lg: cssCoordinateBPs.lg.gridColumnEnd,
          xl: cssCoordinateBPs.xl.gridColumnEnd
        },
        gridRowStart: {
          xs: cssCoordinateBPs.xs.gridRowStart,
          sm: cssCoordinateBPs.sm.gridRowStart,
          md: cssCoordinateBPs.md.gridRowStart,
          lg: cssCoordinateBPs.lg.gridRowStart,
          xl: cssCoordinateBPs.xl.gridRowStart
        },
        gridRowEnd: {
          xs: cssCoordinateBPs.xs.gridRowEnd,
          sm: cssCoordinateBPs.sm.gridRowEnd,
          md: cssCoordinateBPs.md.gridRowEnd,
          lg: cssCoordinateBPs.lg.gridRowEnd,
          xl: cssCoordinateBPs.xl.gridRowEnd
        },
        // Apply view-driven style overrides
        // This includes alignment, sizing, visibility, z-index, etc.
        ...nodeSx
      },
      children: content.contentRenderer ? content.contentRenderer({
        sectionId: section,
        bp,
        boxId,
        coords: cssCoordinateBPs[bp]
      }) : null
    }
  );
}

// src/breakpoints.ts
var BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];

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

// src/integration/mui/GridCssMuiRenderer.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function getSxProps(gridOptions) {
  const gapCss = gridOptions.gap ? gapValueToString(gridOptions.gap) : "0px";
  return {
    // Implicit grid track sizing for auto-generated columns
    gridAutoColumns: gridOptions.implicitColumnUnits == null ? "auto" : gridUnitValueToString(gridOptions.implicitColumnUnits),
    // Implicit grid track sizing for auto-generated rows
    gridAutoRows: gridOptions.implicitRowUnits == null ? "auto" : gridUnitValueToString(gridOptions.implicitRowUnits),
    // Direction for auto-placement of grid items
    gridAutoFlow: gridOptions.autoFlow ?? "row",
    // Default: row-wise placement
    // Container overflow behavior
    overflow: gridOptions.overflow ?? "visible",
    // Default: don't clip content
    // Individual item alignment within their grid areas
    justifyItems: gridOptions.justifyItems ?? "stretch",
    // Horizontal alignment
    alignItems: gridOptions.alignItems ?? "stretch",
    // Vertical alignment
    // Grid content alignment within the container
    justifyContent: gridOptions.justifyContent ?? "start",
    // Horizontal content alignment
    alignContent: gridOptions.alignContent ?? "start",
    // Vertical content alignment
    // Grid gap configuration with fallbacks
    gap: gapCss,
    // Overall gap for both rows and columns
    rowGap: gridOptions.rowGap ? gapValueToString(gridOptions.rowGap) : gapCss,
    columnGap: gridOptions.columnGap ? gapValueToString(gridOptions.columnGap) : gapCss
  };
}
function TopContainer({
  layoutAbsolute,
  gridOptionsOverride,
  children
}) {
  const gridOptionsResolved = getSxProps(gridOptionsOverride || {});
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_Box2.default,
    {
      sx: {
        display: "grid",
        // Container sizing constraints
        // 🔒 Hard clamp to parent width to prevent overflow
        width: "100%",
        // Fill available width
        maxWidth: "100%",
        // Never exceed parent width
        minWidth: 0,
        // Allow shrinking below natural minimum
        boxSizing: "border-box",
        // Include padding/border in width
        // Responsive grid template definitions
        // 🔒 Allow tracks to shrink using minmax(0, 1fr)
        gridTemplateColumns: {
          xs: `repeat(${layoutAbsolute.gridDimensions.columns.xs}, minmax(0, 1fr))`,
          sm: `repeat(${layoutAbsolute.gridDimensions.columns.sm}, minmax(0, 1fr))`,
          md: `repeat(${layoutAbsolute.gridDimensions.columns.md}, minmax(0, 1fr))`,
          lg: `repeat(${layoutAbsolute.gridDimensions.columns.lg}, minmax(0, 1fr))`,
          xl: `repeat(${layoutAbsolute.gridDimensions.columns.xl}, minmax(0, 1fr))`
        },
        // Row templates with content-driven sizing
        gridTemplateRows: {
          xs: `repeat(${layoutAbsolute.gridDimensions.rows.xs}, minmax(min-content, auto))`,
          sm: `repeat(${layoutAbsolute.gridDimensions.rows.sm}, minmax(min-content, auto))`,
          md: `repeat(${layoutAbsolute.gridDimensions.rows.md}, minmax(min-content, auto))`,
          lg: `repeat(${layoutAbsolute.gridDimensions.rows.lg}, minmax(min-content, auto))`,
          xl: `repeat(${layoutAbsolute.gridDimensions.rows.xl}, minmax(min-content, auto))`
        },
        // Apply configured grid options (gaps, alignment, etc.)
        ...gridOptionsResolved
      },
      children
    }
  );
}
var dummyCSSCoordinates = {
  gridColumnStart: 0,
  gridColumnEnd: 0,
  gridRowStart: 0,
  gridRowEnd: 0
};
function partialRecordKeys(obj) {
  return Object.keys(obj);
}
function recordKeys(obj) {
  return Object.keys(obj);
}
var fallbackCSSCoordinates = {
  gridColumnStart: 1,
  // Start at first column
  gridColumnEnd: 2,
  // End after first column (1 column wide)
  gridRowStart: 1,
  // Start at first row
  gridRowEnd: 2
  // End after first row (1 row tall)
};
function GridCssMuiRenderer({
  layoutAbsolute,
  layoutRendering,
  diagnostics,
  gridOptionsOverride
}) {
  const nodes = {};
  const sectionIds = recordKeys(layoutAbsolute.sections);
  for (const sectionId of sectionIds) {
    for (const bp of BREAKPOINTS) {
      const boxesAtBP = layoutAbsolute.sections[sectionId].coordinates[bp];
      if (!boxesAtBP) {
        diagnostics.push(
          makeError(
            "GridCssMuiRenderer",
            GRID_ERROR_CODE.SECTION_SHAPES_MISSING_BP,
            `Missing box shapes for section "${String(
              sectionId
            )}" at breakpoint "${bp}"`,
            { details: { sectionId, bp } }
          )
        );
        continue;
      }
      const boxIds = partialRecordKeys(boxesAtBP);
      for (const boxId of boxIds) {
        const crd = boxesAtBP[boxId];
        if (!crd) {
          diagnostics.push(
            makeError(
              "GridCssMuiRenderer",
              GRID_ERROR_CODE.BOX_SHAPE_MISSING_BP,
              `Missing box shape for box "${String(
                boxId
              )}" in section "${String(sectionId)}" at breakpoint "${bp}"`,
              { details: { sectionId, boxId, bp } }
            )
          );
          continue;
        }
        const nodeKey = `${String(sectionId)}::${String(boxId)}`;
        const resolved = layoutRendering?.[sectionId]?.[boxId] ?? {
          contentRenderer: () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, {}),
          // Empty fragment as fallback
          view: {}
          // Empty view options as fallback
        };
        if (!nodes[nodeKey]) {
          nodes[nodeKey] = {
            sectionId,
            boxId,
            // Initialize all breakpoint coordinates with dummy values
            coordinate: {
              xs: dummyCSSCoordinates,
              sm: dummyCSSCoordinates,
              md: dummyCSSCoordinates,
              lg: dummyCSSCoordinates,
              xl: dummyCSSCoordinates
            },
            content: resolved
            // Use resolved rendering configuration
          };
        } else {
          if (!nodes[nodeKey].content) nodes[nodeKey].content = resolved;
        }
        nodes[nodeKey].coordinate[bp] = crd;
      }
    }
  }
  for (const nodeKey of Object.keys(nodes)) {
    const node = nodes[nodeKey];
    for (const bp of BREAKPOINTS) {
      const crd = node.coordinate[bp];
      if (crd.gridColumnStart === 0 && crd.gridColumnEnd === 0 && crd.gridRowStart === 0 && crd.gridRowEnd === 0) {
        const message = `Box "${String(node.boxId)}" in section "${String(
          node.sectionId
        )}" is missing coordinates for breakpoint "${bp}". Recovering with default coordinates.`;
        diagnostics.push(
          makeError(
            "GridCssMuiRenderer",
            GRID_ERROR_CODE.MISSING_COORDINATES,
            message,
            {
              details: { sectionId: node.sectionId, boxId: node.boxId, bp }
            }
          )
        );
        node.coordinate[bp] = fallbackCSSCoordinates;
      }
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    TopContainer,
    {
      layoutAbsolute,
      gridOptionsOverride,
      children: Object.entries(nodes).map(([nodeKey, node]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        DefaultNodeRender,
        {
          cssCoordinateBPs: node.coordinate,
          section: node.sectionId,
          boxId: node.boxId,
          content: node.content
        },
        nodeKey
      ))
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultNodeRender,
  GridCssMuiRenderer,
  getNodeDomProps,
  getNodeSxProps
});
//# sourceMappingURL=mui.cjs.map