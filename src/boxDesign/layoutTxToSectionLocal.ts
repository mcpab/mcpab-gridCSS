/**
 * @fileoverview Layout transformation to section-local coordinate conversion.
 * Converts layout transformations into section-local coordinates and applies box transformations.
 * Handles the transition from layout-level coordinates to section-specific positioning.
 * @module LayoutTxToSectionLocal
 */

import { GridBox } from "../box/gridBoxTypes";
import { LayoutWithTx, LayoutSectionLocal, BPSGridBoxes, BoxTransformations } from "../boxLayout";
import { DefaultBoxTransformations } from "../boxTransformations";
import { BREAKPOINTS, BPs } from "../breakpoints";
import { DiagnosticEntry } from "../gridErrorShape";
import { SectionIDs, BlocksIDs } from "../templates";
import { transformBoxMove } from "./transformBoxMove";

/**
 * Extracts section keys that contain actual data from a layout with transformations.
 * Filters out null or undefined sections to prevent processing of empty sections.
 * This ensures that only sections with content are included in the transformation pipeline.
 * 
 * @template sectionIDs - The section ID type constrained to valid SectionIDs
 * @param sections - Partial record of sections that may contain null/undefined values
 * @returns Array of section IDs that have actual content
 * 
 * @example
 * ```typescript
 * const sections = { header: {...}, main: null, footer: {...} };
 * const keys = layoutTxSectionKeys(sections);
 * // Returns: ['header', 'footer']
 * ```
 */


function layoutTxSectionKeys<sectionIDs extends SectionIDs>(
  sections: Partial<Record<sectionIDs, unknown>>,
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null,
  ) as Array<sectionIDs>;
}

/**
 * Converts a layout with transformations into section-local coordinate space.
 * This function processes the transformation pipeline by applying section-level box transformations
 * while maintaining the layout structure in local coordinates relative to each section.
 * 
 * Processing pipeline:
 * 1. Initializes default box transformations for movement operations
 * 2. Creates section-local layout structure with grid boxes from the layout transformation
 * 3. Copies grid box data for each breakpoint to maintain positioning information
 * 4. Applies section-specific transformations using the box movement system
 * 5. Returns the final layout in section-local coordinate space
 * 
 * Key behaviors:
 * - Preserves layout-level transformations in the output structure
 * - Converts grid boxes from layout coordinates to section-relative coordinates
 * - Applies transformation functions (stacking, alignment, etc.) within each section
 * - Collects diagnostic information for any transformation issues
 * - Handles missing transformations gracefully by skipping affected sections
 * 
 * @template sectionIDs - The section identifier types for this layout
 * @template blockIDs - The block identifier types for this layout
 * @param layoutTx - Layout with transformations containing positioned grid boxes
 * @param diagnostics - Array to collect diagnostic information and errors during processing
 * @returns Layout in section-local coordinates with applied transformations
 * 
 * @example
 * ```typescript
 * const layoutWithTx: LayoutWithTx<'header' | 'main', 'block_1' | 'block_2'> = {
 *   sections: {
 *     header: {
 *       gridBoxes: { xs: { block_1: gridBox1 }, md: { block_1: gridBox1 } },
 *       transformations: { xs: [{ stackHorizontally: {} }] }
 *     }
 *   },
 *   transformations: { xs: [{ stackVertically: {} }] }
 * };
 * 
 * const diagnostics: DiagnosticEntry[] = [];
 * const sectionLocal = layoutTxToSectionLocal(layoutWithTx, diagnostics);
 * 
 * // Result contains section-relative positioned boxes with applied transformations
 * // sectionLocal.sections[sectionId][breakpoint][blockId] = transformed GridBox
 * ```
 */
export function layoutTxToSectionLocal<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(
  layoutTx: LayoutWithTx<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[],
): LayoutSectionLocal<sectionIDs, blockIDs> {
  // Initialize default box transformations for movement operations
  const defaultBoxTransformations = DefaultBoxTransformations();

  // Initialize the layoutSectionLocal structure
  let layoutSectionLocal: LayoutSectionLocal<sectionIDs, blockIDs> = {
    sections: {} as Record<sectionIDs, BPSGridBoxes<blockIDs>>,
    transformations: layoutTx.transformations
      ? layoutTx.transformations
      : ({} as BoxTransformations<sectionIDs>),
  };

  const sectionsKeys = layoutTxSectionKeys(layoutTx.sections);

  // Initialize the layoutSectionLocal structure with the boxes from LayoutWithTx
  for (const sectionId of sectionsKeys) {
    layoutSectionLocal.sections[sectionId] = {} as BPSGridBoxes<blockIDs>;

    BREAKPOINTS.forEach((bp) => {
      layoutSectionLocal.sections[sectionId][bp] = layoutTx.sections[sectionId].gridBoxes[bp];
    });
  }

  // Apply transformations if any are defined
  for (const sectionId of sectionsKeys) {
    // Evaluate transformations for this section
    const transformations: BoxTransformations<blockIDs> | undefined =
      layoutTx.sections[sectionId].transformations;

    if (!transformations) {
      continue; // No transformations to apply
    }

    // Get the local grid boxes for each breakpoint
    let localGridBoxesPerBp: BPs<Partial<Record<blockIDs, GridBox>>> =
      layoutSectionLocal.sections[sectionId];

    // Apply box movement transformations
    transformBoxMove<blockIDs>(
      defaultBoxTransformations,
      transformations,
      localGridBoxesPerBp,
      diagnostics,
    );
  }

  return layoutSectionLocal;
}

// Working examples demonstrating the layoutTxToSectionLocal functionality

// Example 1: layoutTxSectionKeys usage
const sectionsExample = { 
  header: { gridBoxes: {}, transformations: {} }, 
  main: null, 
  footer: { gridBoxes: {}, transformations: {} } 
};
const keys = layoutTxSectionKeys(sectionsExample);
// Returns: ['header', 'footer']

// Example 2: Complete layoutTxToSectionLocal usage
const layoutWithTxExample: LayoutWithTx<'header' | 'main', 'block_1' | 'block_2'> = {
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
        },
      } as BPSGridBoxes<'block_1' | 'block_2'>,
      transformations: { 
        xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg  : [{ stackHorizontally: { gap: 30 } }],
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
        },
      } as BPSGridBoxes<'block_1' | 'block_2'>,
      transformations: {
         xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg  : [{ stackHorizontally: { gap: 30 } }],
        sm: [{ stackHorizontally: { gap: 15 } }],
        xl: [{ stackHorizontally: { gap: 40 } }]
      }
    }
  },
  transformations: { 
    xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg  : [{ stackHorizontally: { gap: 30 } }],
        sm: [{ stackHorizontally: { gap: 15 } }],
        xl: [{ stackHorizontally: { gap: 40 } }]
  }
};

const diagnosticsExample: DiagnosticEntry[] = [];
const sectionLocalExample = layoutTxToSectionLocal(layoutWithTxExample, diagnosticsExample);

// Result contains section-relative positioned boxes with applied transformations
// sectionLocalExample.sections[sectionId][breakpoint][blockId] = transformed GridBox

// Check for any transformation issues
if (diagnosticsExample.length > 0) {
  console.log('Transformation issues:', diagnosticsExample);
}

// Example 3: Accessing the results
const headerXsBlocks = sectionLocalExample.sections.header.xs;
const mainMdBlocks = sectionLocalExample.sections.main.md;
const layoutLevelTransforms = sectionLocalExample.transformations;
