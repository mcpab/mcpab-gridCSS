/**
 * @fileoverview Templates module index
 * Re-exports layout identifiers and pre-defined layout catalog
 * @module Templates
 */

// Export all layout identifier types
export type {
  Rows,
  SectionIDs,
  Cards,
  BlocksIDs,
  NodeID,
} from './layoutIDs';

// Export all layout catalog types and utilities
export type {
  CatalogEntries,
  LayoutsEntries,
  LayoutsCatalog,
} from './layoutsCatalog';

export {
  getCatalogCategoryKeys,
  getLayoutKeysForCategory,
  getLayoutFromCatalog,
} from './layoutsCatalog';