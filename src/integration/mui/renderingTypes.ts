import type React from 'react';
import type {
  Layout,
  NodeRenderCtx,
  NodeViewConfig,
} from '../../boxLayout';
import type { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';

/**
 * MUI/React rendering configuration for individual nodes.
 *
 * The core box layout package only describes layout and view data. This adapter
 * type adds the React render callback used by the MUI renderer.
 */
export type NodeRenderConfig<
  sectionID extends SectionIDs,
  blockIDs extends BlocksIDs
> = NodeViewConfig & {
  contentRenderer?: (
    ctx: NodeRenderCtx<sectionID, blockIDs>
  ) => React.ReactNode;
};

/**
 * MUI/React rendering overrides for specific sections and blocks.
 */
export type LayoutRenderingOverride<
  sectionID extends SectionIDs,
  blockIDs extends BlocksIDs
> = Partial<Record<sectionID, Partial<Record<blockIDs, NodeRenderConfig<sectionID, blockIDs>>>>>;

type SEC<L extends Layout<any, any>> = Extract<keyof L, SectionIDs>;
type BLK<L extends Layout<any, any>, S extends SEC<L>> =
  Extract<keyof NonNullable<L[S]>, BlocksIDs>;

export type LayoutRenderOverrideFor<L extends Layout<any, any>> = Partial<{
  [S in SEC<L>]: Partial<
    Partial<{
      [B in BLK<L, S>]: NodeRenderConfig<S, B>;
    }>> }>;
