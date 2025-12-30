/**
 * @fileoverview Layout templates catalog for CSS Grid layout system.
 * Provides pre-defined layout configurations organized by categories and use cases.
 * @module LayoutsCatalog
 */

import { Layout } from "../boxLayout/boxLayoutTypes";

/**
 * Union type of all available catalog categories.
 * Extracts the top-level keys from the layouts catalog.
 */
export type CatalogEntries = keyof typeof layoutsCatalog;

/**
 * Union type of layout names within a specific catalog category.
 * Extracts the layout keys for a given category.
 * 
 * @template K - The catalog category to get layout entries for
 */
export type LayoutsEntries<K extends CatalogEntries> = keyof (typeof layoutsCatalog)[K];

/**
 * Type of the complete layouts catalog.
 * Provides type safety for the entire catalog structure.
 */
export type LayoutsCatalog = typeof layoutsCatalog;

/**
 * Retrieves all available catalog category keys.
 * Returns an array of category names for iterating through the catalog.
 * 
 * @returns Array of catalog category names
 * 
 * @example
 * ```typescript
 * const categories = getCatalogCategoryKeys();
 * // Result: ['primary20', 'secondary']
 * 
 * categories.forEach(category => {
 *   console.log(`Available category: ${category}`);
 * });
 * ```
 */
export const getCatalogCategoryKeys = (): CatalogEntries[] =>
  Object.keys(layoutsCatalog) as CatalogEntries[];

/**
 * Retrieves all layout keys for a specific catalog category.
 * Returns an array of layout names within the specified category.
 * 
 * @template K - The catalog category type
 * @param catalogKey - The category to get layouts for
 * @returns Array of layout names in the specified category
 * 
 * @example
 * ```typescript
 * const primary20Layouts = getLayoutKeysForCategory('primary20');
 * // Result: ['page_band', 'page_headerContentFooter', 'page_twoCol_10_10', ...]
 * 
 * const secondaryLayouts = getLayoutKeysForCategory('secondary');
 * // Result: ['singleCell', 'twoCells', 'sideBarAndContent', ...]
 * ```
 */
export const getLayoutKeysForCategory = <K extends CatalogEntries>(
  catalogKey: K,
): LayoutsEntries<K>[] =>
  Object.keys(layoutsCatalog[catalogKey]) as LayoutsEntries<K>[];

/**
 * Retrieves a specific layout from the catalog with type safety.
 * Returns a deep clone of the layout to prevent mutations of the original template.
 * 
 * @template K - The catalog category type
 * @template L - The layout name type within the category
 * @param catalogKey - The category containing the desired layout
 * @param layoutKey - The name of the layout to retrieve
 * @returns A deep clone of the requested layout
 * 
 * @example
 * ```typescript
 * // Get a two-column layout from primary20 category
 * const twoColLayout = getLayoutFromCatalog('primary20', 'page_twoCol_10_10');
 * 
 * // Get a simple layout from secondary category
 * const singleLayout = getLayoutFromCatalog('secondary', 'singleCell');
 * 
 * // Use in layout configuration
 * const myLayout = getLayoutFromCatalog('primary20', 'page_headerContentFooter');
 * // Safe to modify myLayout without affecting the catalog
 * ```
 */
export const getLayoutFromCatalog = <
  K extends CatalogEntries,
  L extends LayoutsEntries<K>,
>(
  catalogKey: K,
  layoutKey: L,
): LayoutsCatalog[K][L] => {
  const layout = layoutsCatalog[catalogKey][layoutKey] as LayoutsCatalog[K][L];
  return structuredClone(layout) as LayoutsCatalog[K][L];
};


/**
 * Comprehensive catalog of pre-defined layout templates.
 * Organized into categories based on grid complexity and use cases.
 * 
 * Categories:
 * - `primary20`: Layouts designed for 20-column grids, suitable for desktop/wide screens
 * - `secondary`: Simpler layouts with flexible column counts, suitable for smaller screens
 * 
 * Available layouts:
 * 
 * **Primary20 Category (20-column grid layouts):**
 * - `page_band`: Single full-width band layout
 * - `page_headerContentFooter`: Classic header-content-footer structure
 * - `page_twoCol_10_10`: Equal two-column layout (50/50 split)
 * - `page_twoCol_5_15`: Narrow sidebar with wide content (25/75 split)
 * - `page_twoCol_15_5`: Wide content with narrow sidebar (75/25 split)
 * - `page_twoCol_4_16`: Very narrow sidebar layout (20/80 split)
 * - `page_twoCol_16_4`: Maximum content with minimal sidebar (80/20 split)
 * - `page_twoCol_8_12`: Medium sidebar with main content (40/60 split)
 * - `page_twoCol_12_8`: Main content with medium sidebar (60/40 split)
 * - `page_threeCol_5_10_5`: Balanced three-column with central focus
 * - `page_docs_3_14_3`: Documentation style with narrow sidebars
 * - `page_docs_4_12_4`: Wider documentation layout
 * - `page_fourCol_5_5_5_5`: Equal four-column grid
 * - `page_dashboard_kpis_then_content`: Dashboard with KPI row and content section
 * 
 * **Secondary Category (Flexible responsive layouts):**
 * - `singleCell`: Minimal single block layout
 * - `twoCells`: Simple two equal blocks
 * - `sideBarAndContent`: Sidebar with wider content area
 * - `footerHeader5Columns`: Header/footer with 5-column content grid
 * - `footerHeader3Columns`: Header/footer with 3-column content
 * - `header2colFooter`: Header with 2-column content and footer
 * - `header3colFooter`: Header with 3-column content and footer
 * - `twoRowsOf3`: Grid with two rows of 3 columns each
 * - `twoRowsOf6`: Dense grid with two rows of 6 columns each
 * - `mixedDensityShowcase`: Progressive grid with increasing column density
 * - `featuredRow4`: 4 blocks with one double-wide featured block
 * - `featuredRow5`: 5 blocks with one double-wide featured block
 * - `featuredRow5Big`: 5 blocks with one triple-wide featured block
 * 
 * Each layout is a complete Layout configuration with sections, blocks, and span definitions.
 * All layouts use the spanX/spanY system to define block dimensions within their grid context.
 */
const layoutsCatalog = {
  /**
   * Primary20 category: Layout templates designed for 20-column grids.
   * These layouts are optimized for desktop and wide-screen displays.
   * All spanX values are calculated based on a 20-column grid system.
   */
  primary20: {
    /**
     * Single full-width band layout.
     * Contains one row with a single block spanning the full 20 columns.
     * Perfect for hero sections, banners, or simple single-content pages.
     */
    page_band: {
      row_1: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1">,

    /**
     * Classic header-content-footer layout.
     * Three-section vertical layout with full-width sections.
     * Standard pattern for most web pages and applications.
     */
    page_headerContentFooter: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      content: {
        block_1: { spanX: 20, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "content" | "footer", "block_1">,

    /**
     * Equal two-column layout (10/10 split).
     * Header and footer span full width, main content split evenly.
     * Ideal for balanced content presentation or comparison layouts.
     */
    page_twoCol_10_10: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 10, spanY: 1 },
        block_2: { spanX: 10, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Narrow sidebar with wide content (5/15 split).
     * Left sidebar takes 25% width, content area takes 75%.
     * Common for navigation + content layouts.
     */
    page_twoCol_5_15: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 5, spanY: 1 },
        block_2: { spanX: 15, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Wide content with narrow sidebar (15/5 split).
     * Content area takes 75% width, right sidebar takes 25%.
     * Useful for primary content with secondary information.
     */
    page_twoCol_15_5: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 15, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Very narrow sidebar layout (4/16 split).
     * Minimal sidebar for icons/navigation, maximum content space.
     * Suitable for app interfaces with icon-based navigation.
     */
    page_twoCol_4_16: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 4, spanY: 1 },
        block_2: { spanX: 16, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Wide content with very narrow sidebar (16/4 split).
     * Maximum content space with minimal sidebar.
     * Mirror of the 4/16 layout with sidebar on the right.
     */
    page_twoCol_16_4: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 16, spanY: 1 },
        block_2: { spanX: 4, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Medium sidebar with main content (8/12 split).
     * Sidebar takes 40% width, content takes 60%.
     * Good balance for secondary navigation and content.
     */
    page_twoCol_8_12: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 8, spanY: 1 },
        block_2: { spanX: 12, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Main content with medium sidebar (12/8 split).
     * Content takes 60% width, sidebar takes 40%.
     * Mirror of the 8/12 layout with sidebar on the right.
     */
    page_twoCol_12_8: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 12, spanY: 1 },
        block_2: { spanX: 8, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2">,

    /**
     * Balanced three-column layout (5/10/5 split).
     * Equal sidebars with wider central content area.
     * Classic layout for content with two complementary sidebars.
     */
    page_threeCol_5_10_5: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 5, spanY: 1 },
        block_2: { spanX: 10, spanY: 1 },
        block_3: { spanX: 5, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2" | "block_3">,

    /**
     * Documentation-style layout (3/14/3 split).
     * Narrow sidebars with maximum central content space.
     * Optimized for reading experiences with minimal distractions.
     */
    page_docs_3_14_3: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 3, spanY: 1 },
        block_2: { spanX: 14, spanY: 1 },
        block_3: { spanX: 3, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2" | "block_3">,

    /**
     * Wider documentation layout (4/12/4 split).
     * Slightly wider sidebars for more navigation or content options.
     * Balance between content focus and sidebar functionality.
     */
    page_docs_4_12_4: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 4, spanY: 1 },
        block_2: { spanX: 12, spanY: 1 },
        block_3: { spanX: 4, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2" | "block_3">,

    /**
     * Equal four-column layout (5/5/5/5 split).
     * Perfect symmetry with four equal content areas.
     * Ideal for feature showcases, product grids, or dashboard cards.
     */
    page_fourCol_5_5_5_5: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 5, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
        block_3: { spanX: 5, spanY: 1 },
        block_4: { spanX: 5, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "footer", "block_1" | "block_2" | "block_3" | "block_4">,

    /**
     * Dashboard layout with KPI row and content section.
     * Top row for key performance indicators (4 equal blocks).
     * Bottom section with sidebar and main content area.
     * Perfect for admin dashboards and analytics interfaces.
     */
    page_dashboard_kpis_then_content: {
      header: {
        block_1: { spanX: 20, spanY: 1 },
      },
      main: {
        block_1: { spanX: 5, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
        block_3: { spanX: 5, spanY: 1 },
        block_4: { spanX: 5, spanY: 1 },
      },
      content: {
        block_1: { spanX: 8, spanY: 1 },
        block_2: { spanX: 12, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout<"header" | "main" | "content" | "footer", "block_1" | "block_2" | "block_3" | "block_4">,
  },

  /**
   * Secondary category: Flexible layouts with adaptive column counts.
   * These layouts are designed to be more responsive and work well on various screen sizes.
   * Column counts are minimal and can be adapted to different grid systems.
   */
  secondary: {
    /**
     * Minimal single cell layout.
     * Contains one block in one row - simplest possible layout.
     * Perfect for landing pages, simple forms, or focused content.
     */
    singleCell: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1">,

    /**
     * Simple two-cell layout.
     * Two blocks side by side in equal proportions.
     * Basic building block for comparison layouts.
     */
    twoCells: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1" | "block_2">,

    /**
     * Sidebar with content layout.
     * Small sidebar (1 unit) with wider content area (5 units).
     * Responsive alternative to fixed-width sidebar layouts.
     */
    sideBarAndContent: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1" | "block_2">,

    /**
     * Header-footer layout with 5-column content.
     * Header and footer with sidebar/content split.
     * Content area has 5 equal columns for flexible organization.
     */
    footerHeader5Columns: {
      header: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
      },
      content: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
      },
    } satisfies Layout<"header" | "content" | "footer", "block_1" | "block_2" | "block_3" | "block_4" | "block_5">,

    /**
     * Simple header-content-footer with 3 columns.
     * Equal-width content columns for balanced presentation.
     * Clean and symmetric layout for basic content organization.
     */
    footerHeader3Columns: {
      header: {
        block_1: { spanX: 3, spanY: 1 },
      },
      content: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 3, spanY: 1 },
      },
    } satisfies Layout<"header" | "content" | "footer", "block_1" | "block_2" | "block_3">,

    /**
     * Header with 2-column content and footer.
     * Minimal header/footer with two-column content area.
     * Perfect for simple comparison or side-by-side content.
     */
    header2colFooter: {
      header: {
        block_1: { spanX: 1, spanY: 1 },
      },
      content: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"header" | "content" | "footer", "block_1" | "block_2">,

    /**
     * Header with 3-column content and footer.
     * Similar to header2colFooter but with three content columns.
     * Good for feature showcases or service presentations.
     */
    header3colFooter: {
      header: {
        block_1: { spanX: 1, spanY: 1 },
      },
      content: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"header" | "content" | "footer", "block_1" | "block_2" | "block_3">,

    /**
     * Two rows with 3 columns each.
     * Grid of 6 equal blocks arranged in 2 rows.
     * Perfect for feature grids, team members, or product showcases.
     */
    twoRowsOf3: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
      },
      row_2: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1" | "row_2", "block_1" | "block_2" | "block_3">,

    /**
     * Two rows with 6 columns each.
     * Dense grid of 12 equal blocks for extensive content.
     * Suitable for galleries, portfolios, or comprehensive listings.
     */
    twoRowsOf6: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
        block_6: { spanX: 1, spanY: 1 },
      },
      row_2: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
        block_6: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1" | "row_2", "block_1" | "block_2" | "block_3" | "block_4" | "block_5" | "block_6">,

    /**
     * Mixed density showcase layout.
     * Progressive grid that starts simple and becomes more complex.
     * Demonstrates increasing content density from 1 to 5 columns per row.
     * Perfect for showcasing scalability or progressive disclosure.
     */
    mixedDensityShowcase: {
      header: {
        block_1: { spanX: 1, spanY: 1 },
      },
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
      },
      row_2: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
      },
      row_3: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
      },
      row_4: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
      },
      footer: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
        block_6: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"header" | 'row_1'|'row_2'|'row_3'|'row_4'|"footer", "block_1" | "block_2" | "block_3" | "block_4" | "block_5" | "block_6">,

    /**
     * Featured row with 4 blocks (one double-wide).
     * Second block spans 2 columns for emphasis.
     * Great for highlighting featured content alongside regular items.
     */
    featuredRow4: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 2, spanY: 1 }, // featured double-wide
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1" | "block_2" | "block_3" | "block_4">,

    /**
     * Featured row with 5 blocks (one double-wide).
     * Similar to featuredRow4 but with additional content block.
     * Balances featured content with more supporting elements.
     */
    featuredRow5: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 2, spanY: 1 }, // featured double-wide
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1" | "block_2" | "block_3" | "block_4" | "block_5">,

    /**
     * Featured row with prominent triple-wide block.
     * Second block spans 3 columns for maximum emphasis.
     * Perfect for hero content with minimal supporting elements.
     */
    featuredRow5Big: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 3, spanY: 1 }, // featured triple-wide
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout<"row_1", "block_1" | "block_2" | "block_3" | "block_4" | "block_5">,
  },
};
