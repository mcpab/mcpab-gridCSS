/**
 * @fileoverview Box layout type definitions for the CSS Grid layout system.
 * Provides comprehensive type safety for grid layouts, sections, blocks,
 *  and responsive transformations. The code examples in this file dont all compile. Please refer to the
 * examples in the end of the file for working examples.
 * @module BoxLayoutTypes
 */

import { GridBox } from "../../src/box/gridBoxTypes";
import { BoxMovesProps } from "../boxTransformations/boxTransformationsProps";
import { BPs, Breakpoint } from "../breakpoints";
import { CSSCoordinates } from "../gridNodeTypes";
import { GridNodeViewOptions } from "../nodeViewOptions";
import { SectionIDs, BlocksIDs, NodeID } from "../templates/layoutIDs";

/**
 * Defines the grid span dimensions for a box element.
 * Specifies how many grid columns and rows a box should occupy.
 *
 * @example
 * ```typescript
 * // A box that spans 2 columns and 3 rows
 * const largeBox: BoxSpan = { spanX: 2, spanY: 3 };
 *
 * // A single cell box
 * const singleBox: BoxSpan = { spanX: 1, spanY: 1 };
 *
 * // A horizontal banner (4 columns, 1 row)
 * const banner: BoxSpan = { spanX: 4, spanY: 1 };
 * ```
 */
export type BoxSpan = { spanX: number; spanY: number };

/**
 * The basic layout structure of the design system.
 * Maps section IDs to their contained blocks with span configurations.
 * Uses partial records to allow flexible, incomplete layout definitions.
 *
 * @example
 * ```typescript
 * const layout: Layout = {
 *   header: {
 *     block_1: { spanX: 2, spanY: 1 },
 *     block_2: { spanX: 6, spanY: 1 }
 *   },
 *   main: {
 *     block_1: { spanX: 2, spanY: 4 },
 *     block_2: { spanX: 4, spanY: 4 }
 *   },
 *   footer: {
 *     block_1: { spanX: 8, spanY: 1 }
 *   }
 * };
 * ```
 */
// export type Layout = Partial<
//   Record<SectionIDs, Partial<Record<BlocksIDs, BoxSpan>>>
// >;

export type Layout<
  sectionIDs extends SectionIDs,
  blockIDs extends BlocksIDs
> =  Partial< Record<sectionIDs,  Partial<Record<blockIDs, BoxSpan>>>>;

// /**
//  * Extracts all section IDs that are present in a specific layout.
//  * Provides type-safe access to only the sections that exist in the layout.
//  *
//  * @template E - The layout type to extract section IDs from
//  *
//  * @example
//  * ```typescript
//  * const myLayout = {
//  *   header: { block_1: { spanX: 1, spanY: 1 } },
//  *   footer: { block_2: { spanX: 1, spanY: 1 } }
//  * } satisfies Layout;
//  *
//  * type MySections = SectionsIDSFromLayout<typeof myLayout>;  // 'header' | 'footer'
//  * ```
//  */
// export type SectionsIDSFromLayout<E extends Layout> = Extract<
//   keyof E,
//   SectionIDs
// >;

// /**
//  * Extracts all block IDs from a specific section within a layout.
//  * Provides type-safe access to blocks that exist in a particular section.
//  *
//  * @template E - The layout type
//  * @template S - The section ID within the layout
//  *
//  * @example
//  * ```typescript
//  * const layout = {
//  *   header: {
//  *     block_1: { spanX: 1, spanY: 1 },
//  *     block_3: { spanX: 3, spanY: 1 }
//  *   }
//  * } satisfies Layout;
//  *
//  * type HeaderBlocks = BlockIDSFromSectionAndLayout<typeof layout, 'header'>;
//  * // Result: 'block_1' | 'block_3'
//  * ```
//  */
// export type BlockIDSFromSectionAndLayout<
//   E extends Layout,
//   S extends SectionsIDSFromLayout<E>
// > = Extract<keyof NonNullable<E[S]>, BlocksIDs>;

// /**
//  * Creates a union type of all block IDs from all sections in a layout.
//  * Useful for operations that need to reference any block across the entire layout.
//  *
//  * @template E - The layout type to extract all block IDs from
//  *
//  * @example
//  * ```typescript
//  * const layout = {
//  *   header: { block_1: { spanX: 1, spanY: 1 }, block_2: { spanX: 2, spanY: 1 } },
//  *   main: { block_3: { spanX: 1, spanY: 3 }, block_4: { spanX: 3, spanY: 3 } }
//  * } satisfies Layout;
//  *
//  * type AllBlocks = UnionBlockIDSfromLayout<typeof layout>;
//  * // Result: 'block_1' | 'block_2' | 'block_3' | 'block_4'
//  * ```
//  */
// export type UnionBlockIDSfromLayout<E extends Layout> = Extract<
//   {
//     [S in SectionsIDSFromLayout<E>]: Extract<
//       keyof NonNullable<E[S]>,
//       BlocksIDs
//     >;
//   }[SectionsIDSFromLayout<E>],
//   BlocksIDs
// >;

/**
 * Box transformations configuration across breakpoints.
 * Defines all possible transformations that can be applied to boxes in the layout.
 * Each breakpoint can have multiple transformation operations applied in sequence.
 *
 * @template BoxId - The type of box identifiers that can be transformed
 *
 * @example
 * ```typescript
 * const transformations: BoxTransformations<'block_1' | 'block_2'> = {
 *   xs: [
 *     { moveTo: { from: { boxId: 'block_1', anchor: 'bottomLeft' }, to: { x: 1, y: 1 } } },
 *     { moveBy: { from: { boxId: 'block_2' }, by: { x: 10, y: 20 } } }
 *   ],
 *   md: [
 *     { moveTo: { from: { boxId: 'block_2', anchor: 'topRight' }, to: { x: 5, y: 3 } } }
 *   ],
 *   lg: [
 *     { stackVertically: {} },
 *     { moveBy: { from: { boxId: 'block_1' }, by: { x: 0, y: 50 } } }
 *   ],
 *   xl: [
 *     { stackHorizontally: {} }
 *   ],
 *   sm: [
 *     { moveBy: { from: { boxId: 'block_2' }, by: { x: 25, y: 0 } } }
 *   ]
 * };
 * ```
 */
export type BoxTransformations<BoxId extends NodeID> = BPs<
  Array<BoxMovesProps<BoxId>>
>;

/**
 * Grid boxes configuration across breakpoints.
 * Maps block IDs to their GridBox configurations for each responsive breakpoint.
 *
 * @template BlockIDs - The union type of block identifiers
 *
 * @example
 * ```typescript
 * const boxes: BPSGridBoxes<'block_1' | 'block_2'> = {
 *   xs: {
 *     'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *   },
 *   md: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   },
 *   lg: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   },
 *   xl: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   },
 *   sm: {
 *     'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *     'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *   }
 * };
 * ```
 */
export type BPSGridBoxes<BlockIDs extends NodeID> = BPs<
  Partial<Record<BlockIDs, GridBox>>
>;

/**
 * Combines grid boxes with optional transformations.
 * Represents a complete grid section with its boxes and potential transformations.
 *
 * @template BlockIDs - The union type of block identifiers in this section
 *
 * @example
 * ```typescript
 * const boxes: GridBoxesAndTx<'block_1' | 'block_2'> = {
 *   gridBoxes: {
 *     xs: {
 *       'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *     },
 *     md: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     },
 *     lg: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     },
 *     xl: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     },
 *     sm: {
 *       'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *       'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *     }
 *   },
 * *     xs: [{
 *       moveTo: { from: { boxId: 'block_1', anchor: 'bottomLeft' }, to: { x: 1, y: 1 } }
 *     }],
 *     md: [{
 *       moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *     }],
 *     lg: [{
 *       moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *     }],
 *     sm: [
 *       { moveBy: { from: { boxId: 'block_2' }, by: { x: 50, y: 100 } } }
 *     ],
 *     xl: [{
 *       moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *     }]
 *   }
 * };
 * ```
 */

export type GridBoxesAndTx<BlockIDs extends NodeID> = {
  gridBoxes: BPSGridBoxes<BlockIDs>;
  transformations?: BoxTransformations<BlockIDs>;
};

/**
 * Complete layout with grid boxes and transformations.
 * The fundamental layout structure that includes both static grid definitions
 * and dynamic transformations that can modify the layout at runtime.
 *
 * @template sectionIDs - Union type of section identifiers
 * @template blockIDs - Union type of block identifiers
 *
 * @example
 * ```typescript
 * const layoutWithTxExample: LayoutWithTx<'header' | 'main' | 'footer', 'block_1' | 'block_2'> = {
 *   sections: {
 *     header: {
 *       gridBoxes: {
 *         xs: {
 *           'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *         },
 *         md: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         lg: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         xl: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         sm: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         }
 *       },
 *       transformations: {
 *         xs: [{
 *           moveTo: { from: { boxId: 'block_1', anchor: 'bottomLeft' }, to: { x: 1, y: 1 } }
 *         }],
 *         md: [{
 *           moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *         }],
 *         lg: [{
 *           moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *         }],
 *         sm: [
 *           { moveBy: { from: { boxId: 'block_2' }, by: { x: 50, y: 100 } } }
 *         ],
 *         xl: [{
 *           moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 3, y: 0 } }
 *         }]
 *       }
 *     },
 *     main: {
 *       gridBoxes: {
 *         xs: {
 *           'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *         },
 *         md: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         lg: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         xl: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         sm: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         }
 *       }
 *     },
 *     footer: {
 *       gridBoxes: {
 *         xs: {
 *           'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 6 }, _normalized: 'GridBox' },
 *         },
 *         md: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         lg: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         xl: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         },
 *         sm: {
 *           'block_1': { origin: { x: 2, y: 0 }, diagonal: { x: 6, y: 8 }, _normalized: 'GridBox' },
 *           'block_2': { origin: { x: 0, y: 0 }, diagonal: { x: 2, y: 8 }, _normalized: 'GridBox' },
 *         }
 *       }
 *     }
 *   },
 *   transformations: {
 *     xs: [{ stackVertically: {} }],
 *     sm: [{ stackHorizontally: {} }],
 *     md: [{ stackHorizontally: {} }],
 *     lg: [{ stackHorizontally: {} }],
 *     xl: [{ stackHorizontally: {} }],
 *   }
 * };
 * ```
 */
export type LayoutWithTx<
  sectionIDs extends SectionIDs,
  blockIDs extends BlocksIDs
> = {
  sections: Record<sectionIDs, GridBoxesAndTx<blockIDs>>;
  transformations?: BoxTransformations<sectionIDs>;
};

/**
 * Extracts all section IDs from a LayoutWithTx type.
 * Provides type-safe access to sections that exist in a specific layout with transformations.
 *
 * @template L - The LayoutWithTx type to extract section IDs from
 *
 * @example
 * ```typescript
 * type MyLayout = LayoutWithTx<'header' | 'main', 'block_1' | 'block_2'>;
 * type MySections = SectionsInLayoutWithTx<MyLayout>; // 'header' | 'main'
 * ```
 */
// export type SectionsInLayoutWithTx<L extends LayoutWithTx<any, any>> =
//   keyof L["sections"] & SectionIDs;
/**
 * Extracts all block IDs from a LayoutWithTx type.
 * Creates a union of all block IDs that exist across all sections in the layout.
 *
 * @template L - The LayoutWithTx type to extract block IDs from
 *
 * @example
 * ```typescript
 * type MyLayout = LayoutWithTx<'header' | 'main', 'block_1' | 'block_2' | 'block_3'>;
 * type MyBlocks = BlocksInLayoutWithTx<MyLayout>; // 'block_1' | 'block_2' | 'block_3'
 * ```
 */
// export type BlocksInLayoutWithTx<L extends LayoutWithTx<any, any>> = {
//   [S in keyof L["sections"]]: keyof NonNullable<L["sections"][S]> & BlocksIDs;
// }[keyof L["sections"]];

// =============================================================================
// Layout Processing Types
// =============================================================================

/**
 * Layout after applying transformations to section children.
 * Contains local grid boxes per section with relative coordinates within each section.
 * This is an intermediate processing stage where transformations have been applied
 * to individual blocks, but sections still maintain their own local coordinate systems.
 *
 * @template SectionID - The union type of section identifiers
 * @template BlockIDs - The union type of block identifiers
 *
 * @example
 * ```typescript
 * const localLayout: LayoutSectionLocal<'header' | 'main', 'block_1' | 'block_2'> = {
 *   sections: {
 *     header: {
 *       xs: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 4, y: 2 }, _normalized: 'GridBox' },
 *         'block_2': { origin: { x: 4, y: 0 }, diagonal: { x: 8, y: 2 }, _normalized: 'GridBox' },
 *       },
 *       md: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 6, y: 2 }, _normalized: 'GridBox' },
 *         'block_2': { origin: { x: 6, y: 0 }, diagonal: { x: 12, y: 2 }, _normalized: 'GridBox' },
 *       }
 *     },
 *     main: {
 *       xs: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 8, y: 6 }, _normalized: 'GridBox' },
 *       },
 *       md: {
 *         'block_1': { origin: { x: 0, y: 0 }, diagonal: { x: 12, y: 8 }, _normalized: 'GridBox' },
 *       }
 *     }
 *   },
 *   transformations: {
 *     xs: [{ stackVertically: {} }],
 *     md: [{ stackHorizontally: {} }]
 *   }
 * };
 * ```
 */
export type LayoutSectionLocal<
  SectionID extends SectionIDs,
  BlockIDs extends BlocksIDs
> = {
  sections: Record<SectionID, BPSGridBoxes<BlockIDs>>;
  transformations?: BoxTransformations<SectionID>;
};

/**
 * Layout with bounding boxes for each section.
 * Children boxes are still in relative grid coordinates within their sections,
 * but bounding boxes define the overall container dimensions for each section.
 * This is used for calculating section positioning in the global layout.
 *
 * @template SectionID - The union type of section identifiers
 * @template BlockIDs - The union type of block identifiers
 *
 */

export type LayoutSectionBounds<
  SectionID extends SectionIDs,
  BlockIDs extends BlocksIDs
> = {
  sections: Record<SectionID, BPSGridBoxes<BlockIDs>>;
  boundingBoxes: BPs<Record<SectionID, GridBox>>;
  transformations?: BoxTransformations<SectionID>;
};

/**
 * Box coordinates in CSS units (pixels, percentages, etc.).
 * Represents the final positioning of boxes after all transformations and
 * coordinate system conversions have been applied.
 * 
 * @template BlockIDs - The union type of block identifiers
  
 */
export type BoxesCoordinates<BlockIDs extends NodeID> = {
  coordinates: BPs<Partial<Record<BlockIDs, CSSCoordinates>>>;
};

/**
 * Final layout with absolute CSS coordinates.
 * Represents the complete processed layout where all boxes have been positioned
 * in absolute CSS units. This is the final output used for rendering.
 *
 * @template SectionID - The union type of section identifiers
 * @template BlockIDs - The union type of block identifiers
 *
 */
export type LayoutAbsolute<
  SectionID extends SectionIDs,
  BlockIDs extends BlocksIDs
> = {
  gridDimensions: {
    rows: BPs<number>;
    columns: BPs<number>;
  };
  sections: Record<SectionID, BoxesCoordinates<BlockIDs>>;
};

// =============================================================================
// Rendering Types
// =============================================================================

/**
 * Context provided to node renderers.
 * Contains all the information needed to render a specific block at a specific breakpoint.
 *
 * @template sectionID - The section identifier type
 * @template blockIDs - The block identifier type
 * @template BP - The breakpoint type (defaults to all breakpoints)
 *
 * @example
 * ```typescript
 * const renderContext: NodeRenderCtx<'header', 'block_1', 'md'> = {
 *   sectionId: 'header',
 *   bp: 'md',
 *   boxId: 'block_1',
 *   coords: {
 *     left: '0px',
 *     top: '0px',
 *     width: '50%',
 *     height: '100px'
 *   }
 * };
 *
 * // Usage in a renderer
 * function MyRenderer(ctx: NodeRenderCtx<'header', 'block_1'>) {
 *   return (
 *     <div style={{
 *       position: 'absolute',
 *       left: ctx.coords.left,
 *       top: ctx.coords.top,
 *       width: ctx.coords.width,
 *       height: ctx.coords.height
 *     }}>
 *       Content for {ctx.sectionId} - {ctx.boxId} at {ctx.bp}
 *     </div>
 *   );
 * }
 * ```
 */
export type NodeRenderCtx<
  sectionID extends SectionIDs,
  blockIDs extends BlocksIDs,
  BP extends Breakpoint = Breakpoint
> = {
  sectionId: sectionID;
  bp: BP;
  boxId: blockIDs;
  coords: CSSCoordinates;
};

/**
 * Configuration for rendering individual nodes.
 * Allows customization of both content and visual styling for specific blocks.
 *
 * @template sectionID - The section identifier type
 * @template blockIDs - The block identifier type
 *
 * @example
 * ```typescript
 * const renderConfig: NodeRenderConfig<'header', 'block_1' | 'block_2'> = {
 *   contentRenderer: (ctx) => {
 *     if (ctx.boxId === 'block_1') {
 *       return <h1>Header Title</h1>;
 *     }
 *     if (ctx.boxId === 'block_2') {
 *       return <nav>Navigation Menu</nav>;
 *     }
 *     return null;
 *   },
 *   view: {
 *     showGridLines: true,
 *     showBoxLabels: true,
 *     highlightOnHover: true,
 *     debugInfo: {
 *       showCoordinates: true,
 *       showBreakpoint: true
 *     }
 *   }
 * };
 * ```
 */
export type NodeRenderConfig<
  sectionID extends SectionIDs,
  blockIDs extends BlocksIDs
> = {
  contentRenderer?: (
    ctx: NodeRenderCtx<sectionID, blockIDs>
  ) => React.ReactNode;
  view?: GridNodeViewOptions;
};

/**
 * Rendering overrides for customizing layout appearance.
 * Allows selective customization of rendering behavior for specific sections,
 * breakpoints, and blocks. All levels are optional, providing fine-grained control.
 *
 * @template sectionID - The section identifier type
 * @template blockIDs - The block identifier type
 *
 * @example
 * ```typescript
 * const renderOverrides: LayoutRenderingOverride<'header' | 'main', 'block_1' | 'block_2'> = {
 *   // Override header section only
 *   header: {
 *     // Only for medium and large breakpoints
 *     md: {
 *       // Only for block_1
 *       block_1: {
 *         contentRenderer: (ctx) => <h1>Custom Header</h1>,
 *         view: {
 *           showGridLines: false,
 *           backgroundColor: '#f0f0f0'
 *         }
 *       }
 *     },
 *     lg: {
 *       block_1: {
 *         contentRenderer: (ctx) => <h1>Large Screen Header</h1>
 *       },
 *       block_2: {
 *         view: {
 *           highlightOnHover: true
 *         }
 *       }
 *     }
 *   },
 *   // Main section overrides
 *   main: {
 *     xs: {
 *       block_1: {
 *         contentRenderer: (ctx) => <div>Mobile Content</div>
 *       }
 *     }
 *   }
 * };
 * ```
 */
export type LayoutRenderingOverride<
  sectionID extends SectionIDs,
  blockIDs extends BlocksIDs
> = Partial<{
  [S in sectionID]: Partial<{
    [BP in Breakpoint]: Partial<
      Record<blockIDs, NodeRenderConfig<sectionID, blockIDs>>
    >;
  }>;
}>;

type SEC<L extends Layout<any, any>> = Extract<keyof L, SectionIDs>;
type BLK<L extends Layout<any, any>, S extends SEC<L>> =
  Extract<keyof NonNullable<L[S]>, BlocksIDs>;

export type LayoutRenderOverrideFor<L extends Layout<any, any>> = Partial<{
  [S in SEC<L>]: Partial<{
    [BP in Breakpoint]: Partial<{
      [B in BLK<L, S>]: NodeRenderConfig<S, B>;
    }>;
  }>;
}>;


// =============================================================================
// Compilation Test Examples
// =============================================================================

// BoxSpan examples
// A box that spans 2 columns and 3 rows
const largeBox: BoxSpan = { spanX: 2, spanY: 3 };

// A single cell box
const singleBox: BoxSpan = { spanX: 1, spanY: 1 };

// A horizontal banner (4 columns, 1 row)
const banner: BoxSpan = { spanX: 4, spanY: 1 };

// Layout examples
const layout: Layout<"header" | "main" | "footer", "block_1" | "block_2"> = {
  header: {
    block_1: { spanX: 2, spanY: 1 },
    block_2: { spanX: 6, spanY: 1 },
  },
  main: {
    block_1: { spanX: 2, spanY: 4 },
    block_2: { spanX: 4, spanY: 4 },
  },
  footer: {
    block_1: { spanX: 8, spanY: 1 },
  },
};

// SectionsIDSFromLayout examples
const myLayout = {
  header: { block_1: { spanX: 1, spanY: 1 } },
  footer: { block_2: { spanX: 1, spanY: 1 } },
} satisfies Layout<"header" | "footer", "block_1" | "block_2">;



// BlockIDSFromSectionAndLayout examples
const layoutForBlocks = {
  header: {
    block_1: { spanX: 1, spanY: 1 },
    block_3: { spanX: 3, spanY: 1 },
  },
} satisfies Layout<"header", "block_1" | "block_3">;

 
// Result: 'block_1' | 'block_3'

// UnionBlockIDSfromLayout examples
const layoutForUnion = {
  header: { block_1: { spanX: 1, spanY: 1 }, block_2: { spanX: 2, spanY: 1 } },
  main: { block_3: { spanX: 1, spanY: 3 }, block_4: { spanX: 3, spanY: 3 } },
} satisfies Layout<"header" | "main", "block_1" | "block_2" | "block_3" | "block_4">;

 
// BoxTransformations examples
const transformations: BoxTransformations<"block_1" | "block_2"> = {
  xs: [
    {
      moveTo: {
        from: { boxId: "block_1", anchor: "bottomLeft" },
        to: { x: 1, y: 1 },
      },
    },
    { moveBy: { from: { boxId: "block_2" }, by: { x: 10, y: 20 } } },
  ],
  md: [
    {
      moveTo: {
        from: { boxId: "block_2", anchor: "topRight" },
        to: { x: 5, y: 3 },
      },
    },
  ],
  lg: [
    { stackVertically: {} },
    { moveBy: { from: { boxId: "block_1" }, by: { x: 0, y: 50 } } },
  ],
  xl: [{ stackHorizontally: {} }],
  sm: [{ moveBy: { from: { boxId: "block_2" }, by: { x: 25, y: 0 } } }],
};

// BPSGridBoxes examples
const boxes: BPSGridBoxes<"block_1" | "block_2"> = {
  xs: {
    block_1: {
      origin: { x: 0, y: 0 },
      diagonal: { x: 4, y: 6 },
      _normalized: "GridBox",
    },
  },
  md: {
    block_1: {
      origin: { x: 2, y: 0 },
      diagonal: { x: 6, y: 8 },
      _normalized: "GridBox",
    },
    block_2: {
      origin: { x: 0, y: 0 },
      diagonal: { x: 2, y: 8 },
      _normalized: "GridBox",
    },
  },
  lg: {
    block_1: {
      origin: { x: 2, y: 0 },
      diagonal: { x: 6, y: 8 },
      _normalized: "GridBox",
    },
    block_2: {
      origin: { x: 0, y: 0 },
      diagonal: { x: 2, y: 8 },
      _normalized: "GridBox",
    },
  },
  xl: {
    block_1: {
      origin: { x: 2, y: 0 },
      diagonal: { x: 6, y: 8 },
      _normalized: "GridBox",
    },
    block_2: {
      origin: { x: 0, y: 0 },
      diagonal: { x: 2, y: 8 },
      _normalized: "GridBox",
    },
  },
  sm: {
    block_1: {
      origin: { x: 2, y: 0 },
      diagonal: { x: 6, y: 8 },
      _normalized: "GridBox",
    },
    block_2: {
      origin: { x: 0, y: 0 },
      diagonal: { x: 2, y: 8 },
      _normalized: "GridBox",
    },
  },
};

// GridBoxesAndTx examples
const boxesWithTx: GridBoxesAndTx<"block_1" | "block_2"> = {
  gridBoxes: {
    xs: {
      block_1: {
        origin: { x: 0, y: 0 },
        diagonal: { x: 4, y: 6 },
        _normalized: "GridBox",
      },
    },
    md: {
      block_1: {
        origin: { x: 2, y: 0 },
        diagonal: { x: 6, y: 8 },
        _normalized: "GridBox",
      },
      block_2: {
        origin: { x: 0, y: 0 },
        diagonal: { x: 2, y: 8 },
        _normalized: "GridBox",
      },
    },
    lg: {
      block_1: {
        origin: { x: 2, y: 0 },
        diagonal: { x: 6, y: 8 },
        _normalized: "GridBox",
      },
      block_2: {
        origin: { x: 0, y: 0 },
        diagonal: { x: 2, y: 8 },
        _normalized: "GridBox",
      },
    },
    xl: {
      block_1: {
        origin: { x: 2, y: 0 },
        diagonal: { x: 6, y: 8 },
        _normalized: "GridBox",
      },
      block_2: {
        origin: { x: 0, y: 0 },
        diagonal: { x: 2, y: 8 },
        _normalized: "GridBox",
      },
    },
    sm: {
      block_1: {
        origin: { x: 2, y: 0 },
        diagonal: { x: 6, y: 8 },
        _normalized: "GridBox",
      },
      block_2: {
        origin: { x: 0, y: 0 },
        diagonal: { x: 2, y: 8 },
        _normalized: "GridBox",
      },
    },
  },
  transformations: {
    xs: [
      {
        moveTo: {
          from: { boxId: "block_1", anchor: "bottomLeft" },
          to: { x: 1, y: 1 },
        },
      },
    ],
    md: [
      {
        moveTo: {
          from: { boxId: "block_2", anchor: "bottomLeft" },
          to: { x: 3, y: 0 },
        },
      },
    ],
    lg: [
      {
        moveTo: {
          from: { boxId: "block_2", anchor: "bottomLeft" },
          to: { x: 3, y: 0 },
        },
      },
    ],
    sm: [{ moveBy: { from: { boxId: "block_2" }, by: { x: 50, y: 100 } } }],
    xl: [
      {
        moveTo: {
          from: { boxId: "block_2", anchor: "bottomLeft" },
          to: { x: 3, y: 0 },
        },
      },
    ],
  },
};

// LayoutWithTx examples
const layoutWithTxExample: LayoutWithTx<
  "header" | "main" | "footer",
  "block_1" | "block_2"
> = {
  sections: {
    header: {
      gridBoxes: {
        xs: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 4, y: 6 },
            _normalized: "GridBox",
          },
        },
        md: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        lg: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        xl: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        sm: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
      },
      transformations: {
        xs: [
          {
            moveTo: {
              from: { boxId: "block_1", anchor: "bottomLeft" },
              to: { x: 1, y: 1 },
            },
          },
        ],
        md: [
          {
            moveTo: {
              from: { boxId: "block_2", anchor: "bottomLeft" },
              to: { x: 3, y: 0 },
            },
          },
        ],
        lg: [
          {
            moveTo: {
              from: { boxId: "block_2", anchor: "bottomLeft" },
              to: { x: 3, y: 0 },
            },
          },
        ],
        sm: [{ moveBy: { from: { boxId: "block_2" }, by: { x: 50, y: 100 } } }],
        xl: [
          {
            moveTo: {
              from: { boxId: "block_2", anchor: "bottomLeft" },
              to: { x: 3, y: 0 },
            },
          },
        ],
      },
    },
    main: {
      gridBoxes: {
        xs: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 4, y: 6 },
            _normalized: "GridBox",
          },
        },
        md: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        lg: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        xl: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        sm: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
      },
    },
    footer: {
      gridBoxes: {
        xs: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 4, y: 6 },
            _normalized: "GridBox",
          },
        },
        md: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        lg: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        xl: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
        sm: {
          block_1: {
            origin: { x: 2, y: 0 },
            diagonal: { x: 6, y: 8 },
            _normalized: "GridBox",
          },
          block_2: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 2, y: 8 },
            _normalized: "GridBox",
          },
        },
      },
    },
  },
  transformations: {
    xs: [{ stackVertically: {} }],
    sm: [{ stackHorizontally: {} }],
    md: [{ stackHorizontally: {} }],
    lg: [{ stackHorizontally: {} }],
    xl: [{ stackHorizontally: {} }],
  },
};

// LayoutSectionLocal examples
const localLayout: LayoutSectionLocal<
  "header" | "main",
  "block_1" | "block_2"
> = {
  sections: {
    header: {
      xs: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 4, y: 2 },
          _normalized: "GridBox",
        },
        block_2: {
          origin: { x: 4, y: 0 },
          diagonal: { x: 8, y: 2 },
          _normalized: "GridBox",
        },
      },
      md: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 6, y: 2 },
          _normalized: "GridBox",
        },
        block_2: {
          origin: { x: 6, y: 0 },
          diagonal: { x: 12, y: 2 },
          _normalized: "GridBox",
        },
      },
      lg: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 6, y: 2 },
          _normalized: "GridBox",
        },
        block_2: {
          origin: { x: 6, y: 0 },
          diagonal: { x: 12, y: 2 },
          _normalized: "GridBox",
        },
      },
      xl: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 6, y: 2 },
          _normalized: "GridBox",
        },
        block_2: {
          origin: { x: 6, y: 0 },
          diagonal: { x: 12, y: 2 },
          _normalized: "GridBox",
        },
      },
      sm: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 6, y: 2 },
          _normalized: "GridBox",
        },
        block_2: {
          origin: { x: 6, y: 0 },
          diagonal: { x: 12, y: 2 },
          _normalized: "GridBox",
        },
      },
    },
    main: {
      xs: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 8, y: 6 },
          _normalized: "GridBox",
        },
      },
      md: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 12, y: 8 },
          _normalized: "GridBox",
        },
      },
      lg: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 12, y: 8 },
          _normalized: "GridBox",
        },
      },
      xl: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 12, y: 8 },
          _normalized: "GridBox",
        },
      },
      sm: {
        block_1: {
          origin: { x: 0, y: 0 },
          diagonal: { x: 12, y: 8 },
          _normalized: "GridBox",
        },
      },
    },
  },
  transformations: {
    xs: [{ stackVertically: {} }],
    md: [{ stackHorizontally: {} }],
    lg: [{ stackHorizontally: {} }],
    xl: [{ stackHorizontally: {} }],
    sm: [{ stackHorizontally: {} }],
  },
};

// NodeRenderCtx examples
const renderContext: NodeRenderCtx<"header", "block_1", "md"> = {
  sectionId: "header",
  bp: "md",
  boxId: "block_1",
  coords: {
    gridColumnEnd: 1,
    gridColumnStart: 0,
    gridRowEnd: 2,
    gridRowStart: 0,
  },
};

// NodeRenderConfig examples
const renderConfig: NodeRenderConfig<"header", "block_1" | "block_2"> = {
  contentRenderer: (ctx) => {
    if (ctx.boxId === "block_1") {
      return "<h1>Header Title</h1>";
    }
    if (ctx.boxId === "block_2") {
      return "<nav>Navigation Menu</nav>";
    }
    return null;
  },
  view: {
    alignSelf: "center",
  },
};

// LayoutRenderingOverride examples
const renderOverrides: LayoutRenderingOverride<
  "header" | "main",
  "block_1" | "block_2"
> = {
  // Override header section only
  header: {
    // Only for medium and large breakpoints
    md: {
      // Only for block_1
      block_1: {
        contentRenderer: (ctx) => "<h1>Custom Header</h1>",
        view: {
          justifySelf: "center",
        },
      },
    },
    lg: {
      block_1: {
        contentRenderer: (ctx) => "<h1>Large Screen Header</h1>",
      },
      block_2: {
        view: {
          alignSelf: "end",
        },
      },
    },
  },
  // Main section overrides
  main: {
    xs: {
      block_1: {
        contentRenderer: (ctx) => "<div>Mobile Content</div>",
      },
    },
  },
};
