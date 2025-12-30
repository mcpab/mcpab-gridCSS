/**
 * Grid CSS MUI Renderer
 *
 * This module provides the main MUI-based renderer for CSS Grid layouts. It converts
 * layout definitions with absolute coordinates into rendered MUI components with proper
 * CSS Grid positioning and responsive behavior.
 *
 * Key Features:
 * - Responsive CSS Grid container with configurable grid options
 * - Automatic node positioning using CSS Grid coordinates
 * - Error handling and diagnostic reporting for missing coordinates
 * - Flexible content rendering through render prop overrides
 * - Integration with MUI theming and styling system
 * - Support for implicit grid sizing and overflow behaviors
 *
 * The renderer creates a CSS Grid container and positions all nodes within it,
 * handling responsive breakpoints and providing fallback behaviors for missing data.
 */

// MUI core imports - using specific file paths for better tree shaking
import Box from "@mui/material/Box";
import { MuiSxProps } from "./muiTypes";
// Internal type imports for grid system integration
import { BlocksIDs, SectionIDs } from "../../templates/layoutIDs"; // Template identifier types
import { DefaultNodeRender } from "./DefaultNodeRender"; // Default node rendering component
import {
  LayoutAbsolute,
  LayoutRenderingOverride,
  NodeRenderConfig,
} from "../../boxLayout"; // Layout types
import { BPs, BREAKPOINTS } from "../../breakpoints"; // Breakpoint system
import { gapValueToString, gridUnitValueToString } from "../../cssStringify"; // CSS value utilities
import {
  DiagnosticEntry,
  makeError,
  GRID_ERROR_CODE,
} from "../../gridErrorShape"; // Error handling
import { CSSCoordinates } from "../../gridNodeTypes"; // CSS coordinate types
import { GridOptions } from "../../gridOptionsTypes"; // Grid configuration options

/**
 * Convert grid options to MUI sx props for the CSS Grid container
 *
 * Transforms GridOptions configuration into MUI-compatible sx properties
 * that control CSS Grid behavior including sizing, alignment, flow, and spacing.
 *
 * Grid Configuration:
 * - Implicit sizing: Controls how auto-generated rows/columns are sized
 * - Auto flow: Direction for placing items in implicit grid areas
 * - Alignment: Controls item and content alignment within the grid
 * - Gap: Spacing between grid items (overall, row-specific, column-specific)
 * - Overflow: How content overflow is handled
 *
 * @param gridOptions - Partial grid configuration object
 * @returns MUI sx props object for the grid container
 */
function getSxProps(gridOptions: Partial<GridOptions>): MuiSxProps {
  // Calculate gap CSS value with fallback to zero
  const gapCss = gridOptions.gap ? gapValueToString(gridOptions.gap) : "0px";

  return {
    // Implicit grid track sizing for auto-generated columns
    gridAutoColumns:
      gridOptions.implicitColumnUnits == null
        ? "auto" // Browser default: size to content
        : gridUnitValueToString(gridOptions.implicitColumnUnits),

    // Implicit grid track sizing for auto-generated rows
    gridAutoRows:
      gridOptions.implicitRowUnits == null
        ? "auto" // Browser default: size to content
        : gridUnitValueToString(gridOptions.implicitRowUnits),

    // Direction for auto-placement of grid items
    gridAutoFlow: gridOptions.autoFlow ?? "row", // Default: row-wise placement

    // Container overflow behavior
    overflow: gridOptions.overflow ?? "visible", // Default: don't clip content

    // Individual item alignment within their grid areas
    justifyItems: gridOptions.justifyItems ?? "stretch", // Horizontal alignment
    alignItems: gridOptions.alignItems ?? "stretch", // Vertical alignment

    // Grid content alignment within the container
    justifyContent: gridOptions.justifyContent ?? "start", // Horizontal content alignment
    alignContent: gridOptions.alignContent ?? "start", // Vertical content alignment

    // Grid gap configuration with fallbacks
    gap: gapCss, // Overall gap for both rows and columns
    rowGap: gridOptions.rowGap ? gapValueToString(gridOptions.rowGap) : gapCss,
    columnGap: gridOptions.columnGap
      ? gapValueToString(gridOptions.columnGap)
      : gapCss,
  };
}

/**
 * Props for the TopContainer component
 *
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 */
type MainProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  layoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs>; // Layout with absolute CSS coordinates
  gridOptionsOverride?: Partial<GridOptions>; // Optional grid behavior overrides
  children?: React.ReactNode; // Child elements to render in the grid
};

/**
 * CSS Grid Container Component
 *
 * Creates the main CSS Grid container with responsive track definitions and
 * configurable grid options. This component establishes the grid context
 * for all child nodes.
 *
 * Key Features:
 * - Responsive grid template columns/rows based on layout dimensions
 * - Flexible track sizing with minmax() for optimal responsiveness
 * - Configurable grid options (gaps, alignment, auto-sizing)
 * - Full width constraint with overflow protection
 *
 * Grid Template Strategy:
 * - Columns: Use 1fr tracks with minmax(0, 1fr) for equal distribution and shrinking
 * - Rows: Use auto-sizing with minmax(min-content, auto) for content-driven height
 *
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 * @param props - Component props including layout and grid options
 * @returns Rendered CSS Grid container
 */
function TopContainer<
  sectionIDs extends SectionIDs,
  blockIDs extends BlocksIDs
>({
  layoutAbsolute,
  gridOptionsOverride,
  children,
}: MainProps<sectionIDs, blockIDs>) {
  // Convert grid options to MUI sx props
  const gridOptionsResolved: MuiSxProps = getSxProps(gridOptionsOverride || {});

  return (
    <Box
      sx={{
        display: "grid",

        // Container sizing constraints
        // 🔒 Hard clamp to parent width to prevent overflow
        width: "100%", // Fill available width
        maxWidth: "100%", // Never exceed parent width
        minWidth: 0, // Allow shrinking below natural minimum
        boxSizing: "border-box", // Include padding/border in width

        // Responsive grid template definitions
        // 🔒 Allow tracks to shrink using minmax(0, 1fr)
        gridTemplateColumns: {
          xs: `repeat(${layoutAbsolute.gridDimensions.columns.xs}, minmax(0, 1fr))`,
          sm: `repeat(${layoutAbsolute.gridDimensions.columns.sm}, minmax(0, 1fr))`,
          md: `repeat(${layoutAbsolute.gridDimensions.columns.md}, minmax(0, 1fr))`,
          lg: `repeat(${layoutAbsolute.gridDimensions.columns.lg}, minmax(0, 1fr))`,
          xl: `repeat(${layoutAbsolute.gridDimensions.columns.xl}, minmax(0, 1fr))`,
        },

        // Row templates with content-driven sizing
        gridTemplateRows: {
          xs: `repeat(${layoutAbsolute.gridDimensions.rows.xs}, minmax(min-content, auto))`,
          sm: `repeat(${layoutAbsolute.gridDimensions.rows.sm}, minmax(min-content, auto))`,
          md: `repeat(${layoutAbsolute.gridDimensions.rows.md}, minmax(min-content, auto))`,
          lg: `repeat(${layoutAbsolute.gridDimensions.rows.lg}, minmax(min-content, auto))`,
          xl: `repeat(${layoutAbsolute.gridDimensions.rows.xl}, minmax(min-content, auto))`,
        },

        // Apply configured grid options (gaps, alignment, etc.)
        ...gridOptionsResolved,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Props for the main GridCssMuiRenderer component
 *
 * @template sectionID - Union type of valid section identifiers
 * @template blockID - Union type of valid block/box identifiers
 * @template LA - Layout type extending LayoutAbsolute
 */
export type GridCssMuiRendererProps<
  sectionID extends SectionIDs,
  blockID extends BlocksIDs,
  LA extends LayoutAbsolute<sectionID, blockID>
> = {
  layoutAbsolute: LA; // Layout with absolute CSS coordinates
  diagnostics: DiagnosticEntry[]; // Array to collect errors and warnings
  layoutRendering?: LayoutRenderingOverride<sectionID, blockID>; // Optional custom rendering overrides
  gridOptionsOverride?: Partial<GridOptions>; // Optional grid behavior configuration
};

/**
 * Internal type for managing box rendering data during processing
 *
 * Combines box identification, coordinates, and rendering configuration
 * into a single object for efficient processing.
 */
type BoxRenderer<sectionID extends SectionIDs, blockID extends BlocksIDs> = {
  sectionId: sectionID; // Parent section identifier
  boxId: blockID; // Box identifier within section
  coordinate: BPs<CSSCoordinates>; // CSS coordinates for all breakpoints
  content: NodeRenderConfig<sectionID, blockID>; // Rendering configuration
};

/**
 * Dummy CSS coordinates for initialization
 *
 * Used as placeholder values during node processing before real
 * coordinates are assigned. Zero values indicate uninitialized state.
 */
const dummyCSSCoordinates: CSSCoordinates = {
  gridColumnStart: 0,
  gridColumnEnd: 0,
  gridRowStart: 0,
  gridRowEnd: 0,
};

/**
 * Extract keys from a Partial Record type
 *
 * Type-safe utility for getting object keys when some properties may be undefined.
 * Used for iterating over box collections where some boxes may not exist.
 *
 * @param obj - Partial record with potentially missing keys
 * @returns Array of present keys with correct typing
 */
function partialRecordKeys<K extends string, V>(
  obj: Partial<Record<K, V>>
): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Extract keys from a complete Record type
 *
 * Type-safe utility for getting object keys when all properties are present.
 * Used for iterating over section collections.
 *
 * @param obj - Record with all keys present
 * @returns Array of keys with correct typing
 */
function recordKeys<K extends string, V>(obj: Record<K, V>): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Fallback CSS coordinates for error recovery
 *
 * Used when a box is missing coordinates for a breakpoint. Places the box
 * in a minimal 1x1 grid area at position (1,1) to prevent layout breakage.
 */
const fallbackCSSCoordinates: CSSCoordinates = {
  gridColumnStart: 1, // Start at first column
  gridColumnEnd: 2, // End after first column (1 column wide)
  gridRowStart: 1, // Start at first row
  gridRowEnd: 2, // End after first row (1 row tall)
};
 
/**
 * Main Grid CSS MUI Renderer Component
 *
 * Renders a complete CSS Grid layout using Material-UI components. This is the primary
 * entry point for converting layout definitions into rendered UI components.
 *
 * Processing Flow:
 * 1. Extract and process all boxes from all sections across all breakpoints
 * 2. Build node registry with coordinates and rendering configurations
 * 3. Handle missing coordinates with error reporting and fallbacks
 * 4. Render CSS Grid container with positioned child nodes
 *
 * Error Handling:
 * - Missing breakpoint data: Reports errors and skips processing
 * - Missing box coordinates: Reports errors and applies fallback positioning
 * - Malformed data: Graceful degradation with diagnostic reporting
 *
 * @template sectionID - Union type of valid section identifiers
 * @template blockID - Union type of valid block/box identifiers
 * @template LA - Layout type extending LayoutAbsolute
 * @param props - Component props including layout, rendering overrides, and options
 * @returns Rendered CSS Grid layout with positioned nodes
 */
export function GridCssMuiRenderer<
  sectionID extends SectionIDs,
  blockID extends BlocksIDs,
  LA extends LayoutAbsolute<sectionID, blockID>
>({
  layoutAbsolute,
  layoutRendering,
  diagnostics,
  gridOptionsOverride,
}: GridCssMuiRendererProps<sectionID, blockID, LA>) {
  // Registry for all nodes to be rendered, indexed by unique key
  const nodes: Record<string, BoxRenderer<sectionID, blockID>> = {};

  // Extract all section IDs for processing
  const sectionIds = recordKeys(layoutAbsolute.sections);

  // PHASE 1: Process all sections and breakpoints to build node registry
  // This creates a comprehensive map of all boxes with their coordinates and rendering config
  for (const sectionId of sectionIds) {
    // Process each responsive breakpoint for this section
    for (const bp of BREAKPOINTS) {
      // Get box coordinates for this section at this breakpoint
      const boxesAtBP = layoutAbsolute.sections[sectionId].coordinates[bp];

      // Validate breakpoint data exists (should always be present per type, but check runtime)
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

      // Extract all box IDs for this breakpoint
      const boxIds = partialRecordKeys(boxesAtBP);

      // Process each box in this section at this breakpoint
      for (const boxId of boxIds) {
        const crd = boxesAtBP[boxId];

        // Validate box coordinates exist
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

        // Create unique node identifier for registry
        const nodeKey = `${String(sectionId)}::${String(boxId)}`;

        // Resolve rendering configuration with safe fallbacks
        // Check for custom rendering override, otherwise use default empty renderer
        const resolved: NodeRenderConfig<sectionID, blockID> =
          (layoutRendering?.[sectionId]?.[bp]?.[boxId] as
            | NodeRenderConfig<sectionID, blockID>
            | undefined) ?? {
            contentRenderer: () => <></>, // Empty fragment as fallback
            view: {}, // Empty view options as fallback
          };

        // Initialize node entry if this is the first time we've seen this box
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
              xl: dummyCSSCoordinates,
            },
            content: resolved, // Use resolved rendering configuration
          };
        } else {
          // Node already exists from processing another breakpoint
          // Keep first content configuration unless policy is "latest wins"
          if (!nodes[nodeKey].content) nodes[nodeKey].content = resolved;
        }

        // Set coordinates for this specific breakpoint
        nodes[nodeKey].coordinate[bp] = crd;
      }
    }
  }

  // PHASE 2: Repair missing coordinates for all registered nodes
  // Some nodes may be missing coordinates for certain breakpoints
  for (const nodeKey of Object.keys(nodes)) {
    const node = nodes[nodeKey];

    // Check each breakpoint for missing/invalid coordinates
    for (const bp of BREAKPOINTS) {
      const crd = node.coordinate[bp];

      // Check if coordinates are still dummy values (all zeros indicate unset)
      if (
        crd.gridColumnStart === 0 &&
        crd.gridColumnEnd === 0 &&
        crd.gridRowStart === 0 &&
        crd.gridRowEnd === 0
      ) {
        // Generate error message for missing coordinates
        const message = `Box "${String(node.boxId)}" in section "${String(
          node.sectionId
        )}" is missing coordinates for breakpoint "${bp}". Recovering with default coordinates.`;

        // Report the issue and apply fallback coordinates
        diagnostics.push(
          makeError(
            "GridCssMuiRenderer",
            GRID_ERROR_CODE.MISSING_COORDINATES,
            message,
            {
              details: { sectionId: node.sectionId, boxId: node.boxId, bp },
            }
          )
        );

        // Apply fallback coordinates to prevent layout breakage
        node.coordinate[bp] = fallbackCSSCoordinates;
      }
    }
  }

  // PHASE 3: Render the complete layout
  // Create CSS Grid container with all positioned nodes
  return (
    <TopContainer
      layoutAbsolute={layoutAbsolute}
      gridOptionsOverride={gridOptionsOverride}
    >
      {/* Render each node using DefaultNodeRender component */}
      {Object.entries(nodes).map(([nodeKey, node]) => (
        <DefaultNodeRender
          key={nodeKey} // Unique React key for efficient updates
          cssCoordinateBPs={node.coordinate} // Responsive CSS Grid coordinates
          section={node.sectionId} // Section identifier
          boxId={node.boxId} // Box identifier
          content={node.content} // Rendering configuration
        />
      ))}
    </TopContainer>
  );
}
