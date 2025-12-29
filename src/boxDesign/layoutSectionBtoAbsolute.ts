/**
 * Layout Section Bounds to Absolute
 * 
 * This module converts layout sections with bounding boxes to absolute CSS grid coordinates.
 * It performs coordinate transformations to position sections and their contained boxes
 * in absolute CSS grid coordinates, handling responsive breakpoints and ensuring
 * all coordinates are positive (≥1) as required by CSS Grid specification.
 * 
 * The transformation process involves:
 * 1. Converting box positions from local to relative-to-bounding-box coordinates
 * 2. Positioning bounding boxes at (1,1) and applying transformations
 * 3. Converting relative positions back to absolute coordinates
 * 4. Normalizing all coordinates to ensure they are ≥1
 */

// Grid box type definitions
import { GridBox } from '../box/gridBoxTypes';

// Layout structure types for absolute positioning and transformations
import {
  BoxesCoordinates,
  BoxTransformations,
  LayoutAbsolute,
  LayoutSectionBounds,
} from '../boxLayout/boxLayoutTypes';

// Default transformation configurations
import { DefaultBoxTransformations } from '../boxTransformations/defaultBoxTransformations';

// Responsive breakpoint definitions and types
import { BPs, BREAKPOINTS } from '../breakpoints';

// Coordinate manipulation utilities
import { subtractCoordinates, addCoordinates, Coordinate } from '../geometry';

// Error handling and diagnostic utilities
import { DiagnosticEntry, GRID_ERROR_CODE, makeWarning } from '../gridErrorShape';

// CSS coordinate type definitions
import { CSSCoordinates } from '../gridNodeTypes';

// Template identifiers for sections and blocks
import { SectionIDs, BlocksIDs } from '../templates';

// Box transformation utilities
import { transformBoxMove } from './transformBoxMove';

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
  sections: Partial<Record<sectionIDs, unknown>>,
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null,
  ) as Array<sectionIDs>;
}

/**
 * Convert layout sections with bounding boxes to absolute CSS grid coordinates
 * 
 * This function performs a complex coordinate transformation process to convert
 * sections with bounded layouts into absolute CSS grid coordinates. The process
 * ensures all coordinates are valid for CSS Grid (≥1) and properly positioned.
 * 
 * Transformation steps:
 * 1. Convert box origins from absolute to relative-to-bounding-box coordinates
 * 2. Position all bounding boxes at (1,1) as starting reference point
 * 3. Apply any configured transformations to bounding boxes
 * 4. Convert box coordinates back to absolute positions
 * 5. Calculate grid dimensions and normalize coordinates to positive values
 * 
 * @template sectionIDs - Type representing the available section identifiers
 * @template blockIDs - Type representing the available block/box identifiers
 * @param layoutSectionBounds - Layout with sections and their calculated bounding boxes
 * @param diagnostics - Array to collect any errors or warnings during processing
 * @returns Layout with absolute CSS grid coordinates for all sections and boxes
 */
export function layoutSectionBtoAbsolute<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(
  layoutSectionBounds: LayoutSectionBounds<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[],
): LayoutAbsolute<sectionIDs, blockIDs> {
  // Initialize the result object that will contain absolute coordinates
  let LayoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs> = {} as LayoutAbsolute<
    sectionIDs,
    blockIDs
  >;

  // Get default transformation settings (baseline transformations)
  let defaultBoxTransformations = DefaultBoxTransformations();

  // Use custom transformations if provided, otherwise use empty object
  let transformations: BoxTransformations<sectionIDs> = layoutSectionBounds.transformations
    ? layoutSectionBounds.transformations
    : ({} as BoxTransformations<sectionIDs>);

  // Extract valid section IDs for processing
  const sections = layoutSectionKeys(layoutSectionBounds.sections);

  // PHASE 1: Transform box origins to be relative to their bounding box origin
  // This converts absolute positions within sections to displacement vectors
  // from the section's bounding box origin
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sections) {
      // Get the bounding box for this section at this breakpoint
      const boundBox: GridBox = layoutSectionBounds.boundingBoxes[bp][sectionId as sectionIDs];

      // Get all boxes within this section at this breakpoint
      const localBoxes = layoutSectionBounds.sections[sectionId as sectionIDs][bp];
      if (!localBoxes) {
        continue;
      }
      
      // Convert each box's absolute position to relative position
      for (const boxId in localBoxes) {
        const box = localBoxes[boxId as blockIDs];
        if (!box) {
          continue;
        }

        // Subtract bounding box origin to get displacement from bounding box origin
        // Example: if box is at (5,3) and bounding box origin is at (2,1),
        // the relative position becomes (3,2)
        box.origin = subtractCoordinates(box.origin, boundBox.origin);
      }
    }
  });

  // PHASE 2: Position all bounding boxes at standard reference point (1,1)
  // This creates a common starting point before applying transformations
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sections) {
      const boundBox: GridBox = layoutSectionBounds.boundingBoxes[bp][sectionId];

      // Move the bounding box origin to (1,1) - CSS Grid's minimum valid coordinate
      boundBox.origin = { x: 1, y: 1 };
    }
  });

  // PHASE 3: Apply transformations to bounding boxes
  // This positions the bounding boxes according to configured transformations
  // (e.g., stacking, spacing, alignment rules)
  transformBoxMove<sectionIDs>(
    defaultBoxTransformations,
    transformations,
    layoutSectionBounds.boundingBoxes,
    diagnostics,
  );

  // PHASE 4: Convert box coordinates back to absolute positions
  // Now that bounding boxes are in their final absolute positions,
  // we can calculate the final absolute positions of all boxes
  BREAKPOINTS.forEach((bp) => {
    const localGridBoxesPerBp = layoutSectionBounds.boundingBoxes[bp];

    for (const sectionId of sections) {
      // Get the transformed bounding box (now in absolute CSS coordinates)
      const boundBox: GridBox = localGridBoxesPerBp[sectionId];

      // Process all boxes within this section
      const localBoxes = layoutSectionBounds.sections[sectionId][bp];
      if (!localBoxes) {
        continue;
      }
      
      for (const boxId in localBoxes) {
        const box = localBoxes[boxId as blockIDs];
        if (!box) {
          continue;
        }

        // Add the bounding box origin to the relative position to get absolute position
        // Example: if box displacement is (3,2) and bounding box origin is at (10,5),
        // the final absolute position becomes (13,7)
        box.origin = addCoordinates(box.origin, boundBox.origin);
      }
    }
  });

  // Initialize grid dimensions structure for storing calculated grid size
  LayoutAbsolute.gridDimensions = {
    rows: {} as BPs<number>,
    columns: {} as BPs<number>,
  };

  // PHASE 5: Calculate overall grid dimensions for each breakpoint
  // Find the maximum extents of all bounding boxes to determine grid size
  BREAKPOINTS.forEach((bp) => {
    const localGridBoxesPerBp = layoutSectionBounds.boundingBoxes[bp];

    let maxRow = 0;  // Maximum row coordinate across all sections
    let maxCol = 0;  // Maximum column coordinate across all sections

    // Examine each section's bounding box to find overall extents
    for (const sectionId of sections) {
      const boundBox: GridBox = localGridBoxesPerBp[sectionId as sectionIDs];

      // Calculate the far edges of this bounding box
      const boxMaxRow = boundBox.origin.y + boundBox.diagonal.y;  // Bottom edge
      const boxMaxCol = boundBox.origin.x + boundBox.diagonal.x;  // Right edge

      // Update global maximums
      if (boxMaxRow > maxRow) {
        maxRow = boxMaxRow;
      }
      if (boxMaxCol > maxCol) {
        maxCol = boxMaxCol;
      }
    }

    // Set grid dimensions (subtract 1 because CSS Grid is 1-indexed)
    // Ensure minimum dimensions of 1x1
    LayoutAbsolute.gridDimensions.rows[bp] = Math.max(1, maxRow - 1);
    LayoutAbsolute.gridDimensions.columns[bp] = Math.max(1, maxCol - 1);
  });

  // PHASE 6: Convert all box positions to CSS coordinate format
  // Initialize sections structure to hold CSS coordinates
  LayoutAbsolute.sections = {} as Record<sectionIDs, BoxesCoordinates<blockIDs>>;

  // Track minimum coordinates across all breakpoints to ensure positivity
  // CSS Grid requires all coordinates to be ≥1
  let minCoordinate: BPs<Coordinate> = {
    xs: { x: Infinity, y: Infinity },
    sm: { x: Infinity, y: Infinity },
    md: { x: Infinity, y: Infinity },
    lg: { x: Infinity, y: Infinity },
    xl: { x: Infinity, y: Infinity },
  };

  // Process each section to convert box coordinates to CSS format
  for (const sectionId of sections) {
    // Initialize coordinate structure for this section
    let crd: BoxesCoordinates<blockIDs> = {} as BoxesCoordinates<blockIDs>;
    crd.coordinates = {} as BPs<Partial<Record<blockIDs, CSSCoordinates>>>;

    // Process each breakpoint
    BREAKPOINTS.forEach((bp) => {
      crd.coordinates[bp] = {} as Partial<Record<blockIDs, CSSCoordinates>>;

      // Get all boxes for this section at this breakpoint
      let boxesatBp: Partial<Record<blockIDs, GridBox>> =
        layoutSectionBounds.sections[sectionId][bp];

      if (!boxesatBp) {
        return;
      }
      
      // Convert each box to CSS coordinates and track minimums
      for (const boxId in boxesatBp) {
        const box = boxesatBp[boxId as blockIDs];
        if (!box) {
          continue;
        }

        // Convert GridBox to CSS grid coordinates
        let coord: CSSCoordinates = getCSSCoordinates(box);
        crd.coordinates[bp][boxId as blockIDs] = coord;

        // Track minimum coordinates to detect negative values
        if (coord.gridColumnStart < minCoordinate[bp].x) {
          minCoordinate[bp].x = coord.gridColumnStart;
        }

        if (coord.gridRowStart < minCoordinate[bp].y) {
          minCoordinate[bp].y = coord.gridRowStart;
        }
      }
    });

    // Store the coordinate data for this section
    LayoutAbsolute.sections[sectionId] = crd;
  }

  // PHASE 7: Normalize coordinates to ensure all values are ≥1
  // CSS Grid specification requires positive coordinates starting from 1
  BREAKPOINTS.forEach((bp) => {
    // Handle empty grid case
    if (minCoordinate[bp].x === Infinity && minCoordinate[bp].y === Infinity) {
      diagnostics.push(
        makeWarning(
          'layoutSectionBtoAbsolute',
          GRID_ERROR_CODE.EMPTY_GRID,
          `Empty grid at breakpoint ${bp}. Setting minimal dimensions`,
        ),
      );
      // Set minimum valid grid dimensions
      LayoutAbsolute.gridDimensions.columns[bp] = 1;
      LayoutAbsolute.gridDimensions.rows[bp] = 1;
      return;
    }
    
    // Calculate displacement needed to make all coordinates ≥1
    let dx = 0;  // Horizontal displacement
    let dy = 0;  // Vertical displacement

    // Calculate displacement needed to normalize negative coordinates
    if (minCoordinate[bp].x < 1) {
      dx = 1 - minCoordinate[bp].x;  // Amount to shift right
    }
    if (minCoordinate[bp].y < 1) {
      dy = 1 - minCoordinate[bp].y;  // Amount to shift down
    }

    // Skip normalization if no displacement needed
    if (dx === 0 && dy === 0) {
      return;
    }

    // Adjust grid dimensions to account for the displacement
    LayoutAbsolute.gridDimensions.columns[bp] += dx;
    LayoutAbsolute.gridDimensions.rows[bp] += dy;

    // Log the normalization for diagnostic purposes
    diagnostics.push(
      makeWarning(
        'layoutSectionBtoAbsolute',
        GRID_ERROR_CODE.GRID_NORMALIZED_TO_POSITIVE_LINES,
        `Grid normalized to positive values at bp ${bp}`,
      ),
    );

    // Apply displacement to all coordinates
    for (const sectionId of sections) {
      let coordinates: Partial<Record<blockIDs, CSSCoordinates>> =
        LayoutAbsolute.sections[sectionId].coordinates[bp];

      if (!coordinates) {
        continue;
      }
      
      // Shift each box's coordinates by the calculated displacement
      for (const boxId in coordinates) {
        let coordinate = coordinates[boxId];

        if (!coordinate) {
          continue;
        }

        // Apply horizontal and vertical shifts to all coordinate values
        coordinate.gridColumnEnd += dx;    // Right edge
        coordinate.gridColumnStart += dx;  // Left edge
        coordinate.gridRowStart += dy;     // Top edge
        coordinate.gridRowEnd += dy;       // Bottom edge
      }
    }
  });

  // Return the complete layout with absolute CSS coordinates
  return LayoutAbsolute;
}

/**
 * Convert a GridBox to CSS Grid coordinates
 * 
 * Transforms a GridBox (with origin and diagonal) into CSS Grid coordinate format
 * (with explicit start and end positions for rows and columns).
 * 
 * @param box - GridBox with origin point and diagonal vector
 * @returns CSS coordinates with start/end positions for grid placement
 */
function getCSSCoordinates(box: GridBox): CSSCoordinates {
  return {
    // Column positioning: start at origin X, end at origin X + width
    gridColumnStart: box.origin.x,
    gridColumnEnd: box.origin.x + box.diagonal.x,

    // Row positioning: start at origin Y, end at origin Y + height
    gridRowStart: box.origin.y,
    gridRowEnd: box.origin.y + box.diagonal.y,
  };
}
