
/**
 * @fileoverview Layout identifier types for CSS Grid layout system.
 * Defines standardized naming conventions for layout sections, blocks, and elements.
 * @module LayoutIDs
 */

/**
 * Numeric range type for generating numbered identifiers.
 * Constrains numbers to 1-10 range for consistent naming patterns.
 * Used as suffixes in template literal types for creating numbered IDs.
 */
type nb = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Row identifiers for grid layout systems.
 * Generates numbered row identifiers from `row_1` to `row_10`.
 * Used for organizing content into horizontal sections.
 * 
 * @example
 * ```typescript
 * const firstRow: Rows = "row_1";
 * const lastRow: Rows = "row_10";
 * ```
 */
export type Rows = `row_${nb}`;

/**
 * Section identifiers for major layout areas.
 * Defines semantic names for common website sections plus numbered alternatives.
 * Combines semantic section names with numbered sections and rows for flexibility.
 * 
 * Includes:
 * - Common semantic sections: header, nav, main, aside, content, footer
 * - Marketing sections: hero, banner, cta (call-to-action) 
 * - Generic sections: sidebar
 * - Numbered sections: section_1 through section_10
 * - Row sections: row_1 through row_10
 * 
 * @example
 * ```typescript
 * const headerSection: SectionIDs = "header";
 * const customSection: SectionIDs = "section_5";
 * const topRow: SectionIDs = "row_1";
 * ```
 */
export type SectionIDs = `header` | 'nav' | 'main' | 'aside' | 'content' |
  'footer' | 'hero' | 'banner' | 'sidebar' | 'cta' | `section_${nb}` | Rows;

/**
 * Card identifiers for card-based layout components.
 * Generates numbered card identifiers from `card_1` to `card_10`.
 * Used for organizing repeating content elements like product cards, articles, etc.
 * 
 * @example
 * ```typescript
 * const firstCard: Cards = "card_1";
 * const productCard: Cards = "card_3";
 * ```
 */
export type Cards = `card_${nb}`;

/**
 * Block identifiers for layout building blocks.
 * Generates numbered block identifiers from `block_1` to `block_10`.
 * Used for organizing content within sections into discrete blocks.
 * 
 * @example
 * ```typescript
 * const mainBlock: BlocksIDs = "block_1";
 * const sidebarBlock: BlocksIDs = "block_2";
 * ```
 */
export type BlocksIDs = `block_${nb}`;

/**
 * Union type of all possible node identifiers in the layout system.
 * Combines all section, card, and block identifiers into a single type.
 * This is the primary identifier type used throughout the layout system
 * for referencing any element in the grid.
 * 
 * @example
 * ```typescript
 * const headerNode: NodeID = "header";
 * const cardNode: NodeID = "card_1";
 * const blockNode: NodeID = "block_1";
 * 
 * // Use in functions that work with any layout element
 * function processNode(nodeId: NodeID) {
 *   // Handle any type of layout node
 * }
 * ```
 */
export type NodeID = SectionIDs | Cards | BlocksIDs;
