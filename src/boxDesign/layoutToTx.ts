
/**
 * @fileoverview Layout to transformation converter for CSS Grid layout system.
 * Transforms abstract layout definitions into concrete grid transformations with positioning data.
 * Handles the conversion from layout specifications to executable grid configurations across breakpoints.
 * @module LayoutToTx
 */

import { GridBox } from '../box/gridBoxTypes';
 
import {
 
  BPSGridBoxes,
  GridBoxesAndTx,
  Layout,
  LayoutWithTx,
 
} from '../boxLayout/boxLayoutTypes';
import { BREAKPOINTS } from '../breakpoints';
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from '../gridErrorShape';
import { getDefaultTheme } from '../layoutTheme/defaultLayoutTheme';
import { ThemeForLayout } from '../layoutTheme/layoutThemeTypes';
import { BlocksIDs , SectionIDs} from '../templates';

 

/**
 * Extracts section keys that are actually present in the layout at runtime.
 * Provides both runtime and type safety by filtering based on value existence rather than just key presence.
 * This prevents processing of undefined or null sections that might exist as keys but have no content.
 * 
 * Key behaviors:
 * - Filters by VALUE existence, not just key presence
 * - Runtime-safe boundary checking prevents null reference errors
 * - Type-safe return maintains compile-time guarantees
 * - Handles dynamic layout structures where sections may be conditionally defined
 * 
 * @template L - The layout type to extract section keys from
 * @param layout - The layout object to extract present section keys from
 * @returns Array of section IDs that have actual content (not null/undefined)
 * 
 * @example
 * ```typescript
 * const layout = {
 *   header: { block_1: { spanX: 2, spanY: 1 } },
 *   main: null, // This section will be filtered out
 *   footer: { block_2: { spanX: 1, spanY: 1 } }
 * };
 * 
 * const presentSections = layoutSectionKeysPresent(layout);
 * // Returns: ['header', 'footer'] (main is excluded)
 * ```
 */
export function layoutSectionKeysPresent<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(layout: Layout<sectionIDS, blockIDS>): Array<sectionIDS> {
  return Object.keys(layout).filter((k) => (layout as any)[k] != null) as Array<sectionIDS>;
}

/**
 * Runtime type guard to validate that a string matches the BlocksIDs pattern.
 * Ensures that only properly formatted block identifiers are processed, preventing
 * issues with malformed or unexpected keys that might exist in dynamic layouts.
 * 
 * Block IDs must follow the pattern 'block_' followed by additional characters.
 * This function acts as a runtime safety net for type checking that can't be
 * enforced at compile time when dealing with dynamic object keys.
 * 
 * @param k - The string to validate as a BlocksID
 * @returns True if the string is a valid BlocksID, false otherwise
 * 
 * @example
 * ```typescript
 * isBlocksID('block_1'); // true
 * isBlocksID('block_header'); // true
 * isBlocksID('section_1'); // false
 * isBlocksID('invalid'); // false
 * 
 * // Usage in filtering
 * const keys = Object.keys(someObject);
 * const blockKeys = keys.filter(isBlocksID);
 * ```
 */
export function isBlocksID(k: string): k is BlocksIDs {
  return k.startsWith('block_');
}

/**
 * Extracts block keys that are actually present within a specific section of a layout.
 * Provides type-safe access to blocks within a section, ensuring that the returned
 * block IDs are valid for the specific layout and section combination.
 * 
 * Key features:
 * - Layout-bound generics tie L and S to actual runtime arguments
 * - No free-floating generic parameters that could cause type mismatches
 * - Runtime filtering ensures only valid block IDs are returned
 * - Type safety guarantees that returned IDs exist in the specified section
 * 
 * This function is essential for the transformation pipeline as it ensures
 * that only blocks that actually exist in the layout are processed for grid conversion.
 * 
 * @template L - The layout type (inferred from the layout parameter)
 * @template Sec - The section type (inferred from the section parameter, constrained to valid sections in L)
 * @param layout - The complete layout object
 * @param section - The section key to extract block keys from
 * @returns Array of block IDs that exist within the specified section
 * 
 * @example
 * ```typescript
 * const layout = {
 *   header: { block_1: { spanX: 2, spanY: 1 }, block_2: { spanX: 1, spanY: 1 } },
 *   main: { block_3: { spanX: 4, spanY: 2 } }
 * };
 * 
 * const headerBlocks = layoutBlockKeysPresent(layout, 'header');
 * // Returns: ['block_1', 'block_2']
 * 
 * const mainBlocks = layoutBlockKeysPresent(layout, 'main');
 * // Returns: ['block_3']
 * ```
 */
export function layoutBlockKeysPresent<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(
  layout: Layout<sectionIDS, blockIDS>,
  section: sectionIDS,
): Array<blockIDS> {
  const blocks = layout[section];
  if (!blocks) return [];

  return Object.keys(blocks).filter(isBlocksID) as Array<blockIDS>;
}

/**
 * Converts an abstract layout definition into a concrete layout with transformations and grid boxes.
 * This is the main transformation function that processes layout specifications and generates
 * executable grid configurations for all breakpoints using the provided or default theme.
 * 
 * Processing pipeline:
 * 1. Applies default theme if none provided
 * 2. Extracts present sections from the layout
 * 3. For each section, extracts present blocks
 * 4. For each block at each breakpoint, resolves box spans to concrete GridBox coordinates
 * 5. Applies section and layout-level transformations
 * 6. Collects diagnostic information for any issues encountered
 * 
 * Error handling:
 * - Missing sections are logged and skipped
 * - Missing box spans are logged and skipped
 * - Diagnostic entries provide detailed error information for debugging
 * - Process continues despite individual failures to maximize valid output
 * 
 * @template L - The layout type being processed
 * @param layout - The abstract layout definition to convert
 * @param diagnostic - Array to collect diagnostic information and errors
 * @param theme - Optional theme for customizing the conversion process (uses default if not provided)
 * @returns Complete layout with transformations and positioned grid boxes for all breakpoints
 * 
 * @example
 * ```typescript
 * const layout = {
 *   header: { block_1: { spanX: 4, spanY: 1 }, block_2: { spanX: 2, spanY: 1 } },
 *   main: { block_3: { spanX: 6, spanY: 4 } }
 * };
 * 
 * const diagnostics: DiagnosticEntry[] = [];
 * const layoutWithTx = layoutToTx(layout, diagnostics);
 * 
 * // Result contains:
 * // - layoutWithTx.sections[sectionId].gridBoxes[breakpoint][blockId] = GridBox
 * // - layoutWithTx.sections[sectionId].transformations = section-level transforms
 * // - layoutWithTx.transformations = layout-level transforms
 * 
 * // Check for any issues
 * if (diagnostics.length > 0) {
 *   console.log('Processing issues:', diagnostics);
 * }
 * ```
 */
export function layoutToTx<sectionIDS extends SectionIDs, blockIDS extends BlocksIDs>(
  layout: Layout<sectionIDS, blockIDS>,
  diagnostic: DiagnosticEntry[],
  theme?: ThemeForLayout<sectionIDS, blockIDS>,
): LayoutWithTx<sectionIDS, blockIDS> {
  //
  if (!theme) {
    theme = getDefaultTheme(layout);
  }

  let layoutWithTx = {} as LayoutWithTx<sectionIDS, blockIDS>;

  layoutWithTx.sections = {} as Record<sectionIDS, GridBoxesAndTx<blockIDS>>;
  layoutWithTx.transformations = theme.layoutTransforms(layout);

  const sectionsIDS = layoutSectionKeysPresent(layout);

  for (const sectionID of sectionsIDS) {
    //
    const section = layout[sectionID];

    if (!section) {
      diagnostic.push(
        makeError(
          'layoutToTx',
          GRID_ERROR_CODE.NO_SECTION_ID,
          `Section ${sectionID} has no boxes defined in layout. Skipping layoutToTx for this section.`,
        ),
      );

      continue;
    }

    layoutWithTx.sections[sectionID] = {} as GridBoxesAndTx<blockIDS>;

    layoutWithTx.sections[sectionID].gridBoxes = {} as BPSGridBoxes<blockIDS>;
    layoutWithTx.sections[sectionID].transformations = theme.sectionBoxTransforms(
      sectionID,
      layout,
    );

    BREAKPOINTS.forEach((bp) => {
      //
      layoutWithTx.sections[sectionID].gridBoxes[bp] = {} as Partial<Record<blockIDS, GridBox>>;

      for (const boxID of layoutBlockKeysPresent(layout, sectionID)) {
        const boxSpan = section[boxID];

        if (!boxSpan) {
          diagnostic.push(
            makeError(
              'layoutToTx',
              GRID_ERROR_CODE.BOX_SPAN_MISSING,
              `Box ${boxID} in section ${sectionID} has no box span defined in layout. Skipping layoutToTx for this box.`,
            ),
          );
          continue;
        }

        layoutWithTx.sections[sectionID].gridBoxes[bp][boxID] = theme.resolveBoxSpan(
          sectionID,
          boxID,
          layout,
          boxSpan,
          bp,
        );
      }
    });
  }

  return layoutWithTx;
}

// Examples extracted from documentation comments above

// Example 1: layoutSectionKeysPresent usage
// const layoutExample1 = {
//   header: { block_1: { spanX: 2, spanY: 1 } },
//   main: null, // This section will be filtered out
//   footer: { block_2: { spanX: 1, spanY: 1 } }
// } as const satisfies Layout;

// const presentSections = layoutSectionKeysPresent(layoutExample1);
// Returns: ['header', 'footer'] (main is excluded)

// Example 2: isBlocksID usage
const isValidBlock1 = isBlocksID('block_1'); // true
const isValidBlock2 = isBlocksID('block_header'); // true
const isValidBlock3 = isBlocksID('section_1'); // false
const isValidBlock4 = isBlocksID('invalid'); // false

// Usage in filtering
const someObject = { block_1: 'valid', section_1: 'invalid', block_2: 'valid', other: 'invalid' };
const keys = Object.keys(someObject);
const blockKeys = keys.filter(isBlocksID);

// Example 3: layoutBlockKeysPresent usage
const layoutExample3 = {
  header: { block_1: { spanX: 2, spanY: 1 }, block_2: { spanX: 1, spanY: 1 } },
  main: { block_3: { spanX: 4, spanY: 2 } }
} as const satisfies Layout<'header' | 'main', 'block_1' | 'block_2' | 'block_3'>;

const headerBlocks = layoutBlockKeysPresent(layoutExample3, 'header');
// Returns: ['block_1', 'block_2']

const mainBlocks = layoutBlockKeysPresent(layoutExample3, 'main');
// Returns: ['block_3']

// Example 4: layoutToTx usage
const layoutExample4 = {
  header: { block_1: { spanX: 4, spanY: 1 }, block_2: { spanX: 2, spanY: 1 } },
  main: { block_3: { spanX: 6, spanY: 4 } }
} as const satisfies Layout<'header' | 'main', 'block_1' | 'block_2' | 'block_3'>;

const diagnostics: DiagnosticEntry[] = [];
const layoutWithTx = layoutToTx(layoutExample4, diagnostics);

// Result contains:
// - layoutWithTx.sections[sectionId].gridBoxes[breakpoint][blockId] = GridBox
// - layoutWithTx.sections[sectionId].transformations = section-level transforms
// - layoutWithTx.transformations = layout-level transforms

// Check for any issues
if (diagnostics.length > 0) {
  console.log('Processing issues:', diagnostics);
}
