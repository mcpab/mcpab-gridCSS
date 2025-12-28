import { Layout } from '../core/boxLayout/boxLayoutTypes';

export type CatalogEntries = keyof typeof layoutsCatalog;
export type LayoutsEntries<K extends CatalogEntries> = keyof (typeof layoutsCatalog)[K];
export type LayoutsCatalog = typeof layoutsCatalog;

 
export const getCatalogCategoryKeys = (): CatalogEntries[] =>
  Object.keys(layoutsCatalog) as CatalogEntries[];

export const getLayoutKeysForCategory = <K extends CatalogEntries>(
  catalogKey: K,
): LayoutsEntries<K>[] =>
  Object.keys(layoutsCatalog[catalogKey]) as LayoutsEntries<K>[];

// You already have this:
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


const layoutsCatalog = {
  primary20: {
    // Single band layout
    page_band: {
      row_1: {
        block_1: { spanX: 20, spanY: 1 },
      },
    } satisfies Layout,

    // Header content footer layout
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
    } satisfies Layout,

    // Two column layouts
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
    } satisfies Layout,

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
    } satisfies Layout,

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
    } satisfies Layout,

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
    } satisfies Layout,

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
    } satisfies Layout,

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
    } satisfies Layout,

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
    } satisfies Layout,

    // Three column layouts
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
    } satisfies Layout,

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
    } satisfies Layout,

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
    } satisfies Layout,

    // Four column layout
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
    } satisfies Layout,

    // Dashboard layout
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
    } satisfies Layout,
  },

  secondary: {
    // Single cell layout
    singleCell: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout,

    // Two cells layout
    twoCells: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout,

    // Sidebar and content layout
    sideBarAndContent: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 5, spanY: 1 },
      },
    } satisfies Layout,

    // Footer header 5 columns layout
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
    } satisfies Layout,

    // Footer header 3 columns layout
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
    } satisfies Layout,

    // Header 2col footer layout
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
    } satisfies Layout,

    // Header 3col footer layout
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
    } satisfies Layout,

    // Two rows of 3 layout
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
    } satisfies Layout,

    // Two rows of 6 layout
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
    } satisfies Layout,

    // Mixed density showcase layout
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
    } satisfies Layout,

    // Featured row layouts with mixed spans
    featuredRow4: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 2, spanY: 1 }, // featured double-wide
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout,

    featuredRow5: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 2, spanY: 1 }, // featured double-wide
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout,

    featuredRow5Big: {
      row_1: {
        block_1: { spanX: 1, spanY: 1 },
        block_2: { spanX: 3, spanY: 1 }, // featured triple-wide
        block_3: { spanX: 1, spanY: 1 },
        block_4: { spanX: 1, spanY: 1 },
        block_5: { spanX: 1, spanY: 1 },
      },
    } satisfies Layout,
  },
};
