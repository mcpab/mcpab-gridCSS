/**
 * Layout Section To Bounds
 * 
 * This module converts layout sections with local positioning to sections with bounding boxes.
 * It calculates the minimum bounding rectangle that contains all boxes within each section
 * across different breakpoints (responsive design sizes).
 */

// Type definitions for grid boxes and their positioning
import { GridBox } from "../box/gridBoxTypes";
import { makeGridBox } from "../box/gridBoxUtils";

// Layout types for sections and their breakpoint-specific configurations
import {
  BPSGridBoxes,
  LayoutSectionBounds,
  LayoutSectionLocal,
} from "../boxLayout/boxLayoutTypes";

// Responsive breakpoint definitions (xs, sm, md, lg, xl)
import { BREAKPOINTS } from "../breakpoints";

// Error handling and diagnostic utilities
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from "../gridErrorShape";

// Template identifiers for sections and blocks
import { SectionIDs, BlocksIDs } from "../templates";

/**
 * Extract valid section IDs from a partial record of sections
 * 
 * Filters out null/undefined sections and returns only the keys
 * of sections that have actual content.
 * 
 * @param sections - Partial record of sections with potential null/undefined values
 * @returns Array of valid section IDs that have non-null content
 */
function layoutSectionKeys<sectionIDs extends SectionIDs>(
  sections: Partial<Record<sectionIDs, unknown>>
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null
  ) as Array<sectionIDs>;
}

/**
 * Convert layout sections with local positioning to sections with bounding boxes
 * 
 * This function calculates the minimum bounding rectangle (bounds) that contains all boxes
 * within each section across different responsive breakpoints. It processes each section
 * and breakpoint combination to find the smallest rectangle that encompasses all boxes.
 * 
 * @template sectionIDs - Type representing the available section identifiers
 * @template blockIDs - Type representing the available block/box identifiers
 * @param layoutSectionLocal - Layout with sections containing boxes positioned locally
 * @param diagnostics - Array to collect any errors or warnings during processing
 * @returns Layout with calculated bounding boxes for each section at each breakpoint
 */
export function layoutSectionToBounds<
  sectionIDs extends SectionIDs,
  blockIDs extends BlocksIDs
>(
  layoutSectionLocal: LayoutSectionLocal<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[]
): LayoutSectionBounds<sectionIDs, blockIDs> {
  // Initialize the result object that will contain bounding boxes for each section
  let layoutSectionBounds: LayoutSectionBounds<sectionIDs, blockIDs> =
    {} as LayoutSectionBounds<sectionIDs, blockIDs>;

  // Copy the original sections data (contains the actual box configurations)
  layoutSectionBounds.sections = layoutSectionLocal.sections;

  // Initialize bounding boxes structure for all responsive breakpoints
  // Each breakpoint will have a record of section ID -> bounding box
  layoutSectionBounds.boundingBoxes = {
    xs: {} as Record<sectionIDs, GridBox>,
    sm: {} as Record<sectionIDs, GridBox>,
    md: {} as Record<sectionIDs, GridBox>,
    lg: {} as Record<sectionIDs, GridBox>,
    xl: {} as Record<sectionIDs, GridBox>,
  };

  // Copy transformation settings from the original layout
  layoutSectionBounds.transformations = layoutSectionLocal.transformations;

  // Extract valid section IDs (filters out null/undefined sections)
  const sectionIds = layoutSectionKeys(layoutSectionLocal.sections);

  // Process each responsive breakpoint (xs, sm, md, lg, xl)
  BREAKPOINTS.forEach((bp) => {
    // Calculate bounding box for each section at this breakpoint
    for (const sectionId of sectionIds) {
      let boundPerSection: GridBox;

      // Initialize bounds tracking variables
      // Start with extreme values so first box will set initial bounds
      let minX = Infinity;  // Leftmost edge
      let minY = Infinity;  // Topmost edge
      let maxX = -Infinity; // Rightmost edge
      let maxY = -Infinity; // Bottommost edge

      // Get all grid boxes for this section
      let gridBoxes: BPSGridBoxes<blockIDs> =
        layoutSectionLocal.sections[sectionId];

      // Get boxes specific to current breakpoint
      const boxesAtBp = gridBoxes[bp];

      // Track whether we found any boxes (for error handling)
      let foundAnyBox = false;

      // Iterate through all boxes in this section at this breakpoint
      for (const boxId in boxesAtBp) {
        const box = boxesAtBp[boxId];

        // Skip null/undefined boxes
        if (!box) {
          continue;
        }

        // Update bounding box coordinates
        // box.origin = top-left corner, box.diagonal = width/height as vector
        minX = Math.min(minX, box.origin.x);                    // Left edge
        maxX = Math.max(maxX, box.origin.x + box.diagonal.x);   // Right edge (origin + width)
        minY = Math.min(minY, box.origin.y);                    // Top edge
        maxY = Math.max(maxY, box.origin.y + box.diagonal.y);   // Bottom edge (origin + height)

        foundAnyBox = true;
      }

      // Handle case where no boxes were found in this section at this breakpoint
      if (!foundAnyBox) {
        // Log diagnostic error for missing boxes
        diagnostics.push(
          makeError(
            "layoutSectionToBounds",
            GRID_ERROR_CODE.MISSING_BOX,
            `No boxes found for section ${sectionId} at breakpoint ${bp}. Returning empty bounding box.`
          )
        );
        // Create an empty bounding box as fallback
        boundPerSection = makeGridBox({ x: 0, y: 0 }, { x: 0, y: 0 });
        layoutSectionBounds.boundingBoxes[bp][sectionId] = boundPerSection;
        continue;
      }

      // Create the bounding box from calculated min/max coordinates
      boundPerSection = makeGridBox(
        {
          x: minX,  // Top-left corner X coordinate
          y: minY,  // Top-left corner Y coordinate
        },
        {
          x: maxX - minX,  // Width (right edge - left edge)
          y: maxY - minY,  // Height (bottom edge - top edge)
        }
      );

      // Store the calculated bounding box for this section at this breakpoint
      layoutSectionBounds.boundingBoxes[bp][sectionId] = boundPerSection;
    }
  });

  // Return the complete layout with calculated bounding boxes
  return layoutSectionBounds;
}
