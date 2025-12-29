/**
 * CSS Layout Generator
 * 
 * This module orchestrates the complete transformation pipeline from layout definitions
 * with transformations to final CSS Grid coordinates. It coordinates multiple transformation
 * phases and provides optional overlap detection and validation.
 * 
 * Main pipeline:
 * 1. Convert layout transformations to local section coordinates
 * 2. Calculate bounding boxes for each section
 * 3. Transform to absolute CSS Grid coordinates
 * 4. Optionally validate for overlapping elements
 * 
 * Features:
 * - Multi-breakpoint responsive layout support
 * - Configurable overlap detection (allow/warn/error)
 * - Comprehensive diagnostic reporting
 * - Type-safe section and block ID handling
 */

// Layout type definitions for different transformation stages
import {
  BlocksInLayoutWithTx,     // Block IDs extracted from layout with transformations
  LayoutAbsolute,           // Final layout with absolute CSS coordinates
  LayoutWithTx,             // Input layout with transformation configurations
  SectionsInLayoutWithTx,   // Section IDs extracted from layout with transformations
} from "../boxLayout/boxLayoutTypes";

// Responsive breakpoint definitions
import { BREAKPOINTS } from "../breakpoints";

// Error handling and diagnostic utilities
import {
  DiagnosticEntry,
  GRID_ERROR_CODE,
  makeError,
  makeWarning,
} from "../gridErrorShape";

// CSS Grid coordinate type definitions
import { CSSCoordinates } from "../gridNodeTypes";

// Template identifiers for sections and blocks
import { BlocksIDs, SectionIDs } from "../templates";

// Transformation pipeline functions
import { layoutSectionBtoAbsolute } from "./layoutSectionBtoAbsolute";
import { layoutSectionToBounds } from "./layoutSectionToBounds";
import { layoutTxToSectionLocal } from "./layoutTxToSectionLocal";

/**
 * Configuration for grid validation and diagnostic behavior
 * 
 * @property overlapPolicy - How to handle overlapping boxes:
 *   - "allow": No overlap checking (default)
 *   - "warn": Check and report warnings for overlaps
 *   - "error": Check and report errors for overlaps
 * @property breakpoints - Which breakpoints to validate (defaults to all)
 */
type GridDiagnostic = {
  overlapPolicy?: "allow" | "warn" | "error";
  breakpoints?: readonly (typeof BREAKPOINTS)[number][];
};

/**
 * Props for the main CSSLayout function
 * 
 * @template L - Layout type extending LayoutWithTx
 * @property layoutWithTx - Input layout with transformation configurations
 * @property diagnostics - Array to collect errors and warnings
 * @property gridDiagnostic - Optional validation configuration
 */
type CSSLayoutProps<L extends LayoutWithTx<SectionIDs, BlocksIDs>> = {
  layoutWithTx: L;
  diagnostics: DiagnosticEntry[];
  gridDiagnostic?: GridDiagnostic;
};

/**
 * Main CSS Layout transformation function
 * 
 * Orchestrates the complete pipeline to transform a layout with transformations
 * into final CSS Grid coordinates. This is the primary entry point for the
 * layout transformation system.
 * 
 * Transformation Pipeline:
 * 1. layoutTxToSectionLocal - Applies transformations and converts to local coordinates
 * 2. layoutSectionToBounds - Calculates bounding boxes for each section
 * 3. layoutSectionBtoAbsolute - Converts to absolute CSS Grid coordinates
 * 4. checkSectionsOverlap - Optionally validates for overlapping elements
 * 
 * @template L - Layout type that extends LayoutWithTx
 * @param props - Configuration object containing layout, diagnostics, and validation options
 * @returns Layout with absolute CSS Grid coordinates for all sections and boxes
 */
export function CSSLayout<L extends LayoutWithTx<any, any>>({
  layoutWithTx,
  diagnostics,
  gridDiagnostic = { overlapPolicy: "allow", breakpoints: BREAKPOINTS },
}: CSSLayoutProps<L>): LayoutAbsolute<
  SectionsInLayoutWithTx<L>,
  BlocksInLayoutWithTx<L>
> {
  // Step 1: Apply transformations and convert to local section coordinates
  // This resolves all transformation rules and positions boxes within sections
  const layoutSectionLocal = layoutTxToSectionLocal(layoutWithTx, diagnostics);

  // Step 2: Calculate bounding boxes for each section across all breakpoints
  // This finds the minimum rectangle that contains all boxes in each section
  const layoutSecBonds = layoutSectionToBounds(layoutSectionLocal, diagnostics);

  // Step 3: Convert to absolute CSS Grid coordinates
  // This positions sections absolutely and ensures all coordinates are valid for CSS Grid
  const layoutSecAbs = layoutSectionBtoAbsolute(layoutSecBonds, diagnostics);
  
  // Extract diagnostic configuration with defaults
  const overlapPolicy = gridDiagnostic.overlapPolicy || "allow";
  const breakpoints = gridDiagnostic.breakpoints || BREAKPOINTS;

  // Step 4: Optional overlap detection and validation
  // Check for overlapping boxes if overlap policy is not "allow"
  if (overlapPolicy !== "allow") {
    checkSectionsOverlap<SectionsInLayoutWithTx<L>, BlocksInLayoutWithTx<L>>(
      layoutSecAbs,
      diagnostics,
      overlapPolicy,
      breakpoints
    );
  }

  return layoutSecAbs;
}

/**
 * Rectangle definition for overlap detection
 * Represents the bounds of a box in CSS Grid coordinates
 */
type OverlapRect = {
  colStart: number;  // Left edge (grid column start)
  colEnd: number;    // Right edge (grid column end)
  rowStart: number;  // Top edge (grid row start)
  rowEnd: number;    // Bottom edge (grid row end)
};

/**
 * Reference to a specific box for overlap reporting
 * Contains all information needed to identify a box in overlap scenarios
 */
type OverlapRef<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  sectionId: sectionIDs;  // Which section contains this box
  boxId: blockIDs;        // The specific box identifier
  rect: OverlapRect;      // The box's rectangular bounds
};

/**
 * Complete overlap detection result
 * Contains all details about two overlapping boxes
 */
type OverlapDetails<
  sectionIDs extends SectionIDs,
  blockIDs extends BlocksIDs
> = {
  bp: (typeof BREAKPOINTS)[number];        // Which breakpoint the overlap occurs at
  a: OverlapRef<sectionIDs, blockIDs>;     // First overlapping box
  b: OverlapRef<sectionIDs, blockIDs>;     // Second overlapping box
  pairKey: string;                         // Unique identifier for this overlap pair
};

/**
 * Box with metadata for overlap detection processing
 * Combines box coordinates with identification information
 */
type BoxWithMeta<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  id: string;                              // Composite unique identifier
  bp: (typeof BREAKPOINTS)[number];       // Breakpoint this box exists at
  sectionId: sectionIDs;                  // Parent section identifier
  boxId: blockIDs;                        // Box identifier within section
  coords: CSSCoordinates;                 // Actual CSS Grid coordinates
};

/**
 * Extract keys from a complete Record type
 * Type-safe utility for getting object keys when all properties are present
 * 
 * @param obj - Record with all keys present
 * @returns Array of keys with correct typing
 */
export function recordKeys<K extends string, V>(obj: Record<K, V>): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Extract keys from a Partial Record type
 * Type-safe utility for getting object keys when some properties may be undefined
 * 
 * @param obj - Partial record with potentially missing keys
 * @returns Array of present keys with correct typing
 */
export function partialRecordKeys<K extends string, V>(
  obj: Partial<Record<K, V>>
): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Check if two CSS Grid coordinate rectangles overlap
 * 
 * Uses the standard rectangle overlap algorithm: two rectangles overlap
 * if they overlap in both the X (column) and Y (row) dimensions.
 * 
 * For rectangles to NOT overlap, at least one of these must be true:
 * - a's left edge is at or past b's right edge
 * - b's left edge is at or past a's right edge  
 * - a's top edge is at or past b's bottom edge
 * - b's top edge is at or past a's bottom edge
 * 
 * @param a - First rectangle's CSS coordinates
 * @param b - Second rectangle's CSS coordinates
 * @returns true if rectangles overlap, false otherwise
 */
function overlaps(a: CSSCoordinates, b: CSSCoordinates): boolean {
  return (
    a.gridColumnStart < b.gridColumnEnd &&    // a's left < b's right
    b.gridColumnStart < a.gridColumnEnd &&    // b's left < a's right
    a.gridRowStart < b.gridRowEnd &&          // a's top < b's bottom
    b.gridRowStart < a.gridRowEnd             // b's top < a's bottom
  );
}

/**
 * Check for overlapping boxes across all sections and report violations
 * 
 * This function performs comprehensive overlap detection across the entire layout,
 * checking all boxes against each other within each breakpoint. It generates
 * detailed diagnostic reports for any overlaps found.
 * 
 * Algorithm:
 * 1. Flatten all boxes from all sections into a single list per breakpoint
 * 2. Compare every box against every other box (O(n²) complexity)
 * 3. For each overlap, generate detailed diagnostic information
 * 4. Add warnings or errors to diagnostics based on overlap policy
 * 
 * @template sectionIDs - Section identifier type
 * @template blockIDs - Block identifier type
 * @param layoutAbsolute - Layout with final absolute CSS coordinates
 * @param diagnostics - Array to add overlap reports to
 * @param overlapPolicy - Whether to generate warnings or errors for overlaps
 * @param breakpoints - Which breakpoints to check for overlaps
 */
export function checkSectionsOverlap<
  sectionIDs extends SectionIDs,
  blockIDs extends BlocksIDs
>(
  layoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[],
  overlapPolicy: "warn" | "error",
  breakpoints: readonly (typeof BREAKPOINTS)[number][]
) {
  // Get all section IDs for iteration
  const sectionIds = recordKeys(layoutAbsolute.sections);

  // Process each breakpoint separately
  for (const bp of breakpoints) {
    // Collect all boxes at this breakpoint into a flat list for comparison
    const boxesByBp: BoxWithMeta<sectionIDs, blockIDs>[] = [];

    // Flatten all boxes from all sections
    for (const sectionId of sectionIds) {
      const sectionBoxes = layoutAbsolute.sections[sectionId].coordinates[bp];
      if (!sectionBoxes) continue;

      const boxIds = partialRecordKeys(sectionBoxes);

      // Add each box to the flat list with metadata
      for (const boxId of boxIds) {
        const crd = sectionBoxes[boxId];
        if (!crd) continue;

        boxesByBp.push({
          id: `${bp}::${sectionId}::${boxId}`,  // Unique composite identifier
          bp,
          sectionId,
          boxId,
          coords: crd,
        });
      }
    }

    // Compare every box against every other box (pairwise comparison)
    for (let i = 0; i < boxesByBp.length; i++) {
      const a = boxesByBp[i];

      // Only compare with boxes that come after in the list to avoid duplicates
      for (let j = i + 1; j < boxesByBp.length; j++) {
        const b = boxesByBp[j];

        // Skip if boxes don't overlap
        if (!overlaps(a.coords, b.coords)) continue;

        // Create detailed overlap information for diagnostic reporting
        const details: OverlapDetails<sectionIDs, blockIDs> = {
          bp,
          a: {
            sectionId: a.sectionId,
            boxId: a.boxId,
            rect: {
              colStart: a.coords.gridColumnStart,
              colEnd: a.coords.gridColumnEnd,
              rowStart: a.coords.gridRowStart,
              rowEnd: a.coords.gridRowEnd,
            },
          },
          b: {
            sectionId: b.sectionId,
            boxId: b.boxId,
            rect: {
              colStart: b.coords.gridColumnStart,
              colEnd: b.coords.gridColumnEnd,
              rowStart: b.coords.gridRowStart,
              rowEnd: b.coords.gridRowEnd,
            },
          },
          pairKey: `${a.id}__${b.id}`,  // Unique pair identifier
        };

        const message = `Boxes ${a.id} and ${b.id} are overlapping.`;

        // Add warning or error to diagnostics based on policy
        diagnostics.push(
          overlapPolicy === "warn"
            ? makeWarning(
                "CSSLayout",
                GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
                message,
                {
                  details,
                }
              )
            : makeError(
                "CSSLayout",
                GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED,
                message,
                {
                  details,
                }
              )
        );
      }
    }
  }
}
