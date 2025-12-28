import { getOrigin } from '../../geometry/coordinateAlgebra';
import { NodeID } from '../../templates/layoutIDs';
import { GridBox } from '../box/gridBoxTypes';
import { makeGridBox } from '../box/gridBoxUtils';
import {
  BlockIDSFromSectionAndLayout,
  BoxSpan,
  BoxTransformations,
  Layout,
  SectionsIDSFromLayout,
} from '../boxLayout/boxLayoutTypes';
import { BREAKPOINTS } from '../breakpoints';
import { GridOptions } from '../gridOptionsTypes';
import { GridNodeViewOptions } from '../nodeViewOptions';
import { ThemeForLayout } from './layoutThemeTypes';

/**
 * Good boring defaults for CSS Grid items.
 * - minWidth0/minHeight0 prevent overflow caused by min-size:auto
 * - stretch fills the grid area by default
 */

export const DEFAULT_GRID_NODE_VIEW_OPTIONS = {
  minWidth0: true,
  minHeight0: true,
  justifySelf: 'stretch',
  alignSelf: 'stretch',
  pointerEvents: 'auto',
  dataAttrs: {},
  aria: {},
  visibility: 'visible',
} as const satisfies Required<
  Pick<
    GridNodeViewOptions,
    | 'minWidth0'
    | 'minHeight0'
    | 'justifySelf'
    | 'alignSelf'
    | 'pointerEvents'
    | 'dataAttrs'
    | 'aria'
    | 'visibility'
  >
>;
/**
 * Resolve a node's options by applying defaults.
 * Keeps typing shallow and avoids generic hierarchies.
 */

export function resolveGridNodeViewOptions(opts?: GridNodeViewOptions): {
  zIndex?: number;
  minWidth0: boolean;
  minHeight0: boolean;
  justifySelf: 'start' | 'end' | 'center' | 'stretch';
  alignSelf: 'start' | 'end' | 'center' | 'stretch';
  pointerEvents: 'auto' | 'none';
  dataAttrs: Record<string, string>;
  aria: {
    role?: string;
    label?: string;
    labelledBy?: string;
    describedBy?: string;
  };
  visibility: 'visible' | 'hidden' | 'visuallyHidden';
} {
  return {
    ...DEFAULT_GRID_NODE_VIEW_OPTIONS,
    ...opts,
    // ensure these objects are always present even if caller passes undefined
    dataAttrs: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS.dataAttrs, ...(opts?.dataAttrs ?? {}) },
    aria: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS.aria, ...(opts?.aria ?? {}) },
  };
}
/**
 * “Good boring defaults” for a CSS Grid container.
 * Notes:
 * - autoFlow: "row" matches the common DOM→grid flow expectation
 * - overflow: "visible" avoids clipping unless you opt-in
 * - items: stretch so children fill their grid area by default
 * - content: start so the grid tracks pack from the top/left (less surprising)
 * - implicit tracks: 1fr is a reasonable default for auto tracks in most app layouts
 * - gaps: default 0; you can add spacing intentionally (and avoid height surprises)
 */

export const DEFAULT_GRID_OPTIONS = {
  implicitRowUnits: { value: 1, unit: 'fr' },
  implicitColumnUnits: { value: 1, unit: 'fr' },

  overflow: 'visible',
  autoFlow: 'row',

  justifyItems: 'stretch',
  alignItems: 'stretch',

  justifyContent: 'start',
  alignContent: 'start',

  gap: { value: 0, unit: 'px' },
  rowGap: { value: 0, unit: 'px' },
  columnGap: { value: 0, unit: 'px' },
} as const satisfies GridOptions;
/**
 * Resolve grid options by applying defaults.
 * Shallow, predictable, SSR-safe.
 */

export function resolveGridOptions(opts?: Partial<GridOptions>): GridOptions {
  return {
    ...DEFAULT_GRID_OPTIONS,
    ...opts,
  };
}

export const DefaultTransformationsResponsiveRows = {
  xs: [{ stackVertically: {} }],
  sm: [{ stackHorizontally: {} }],
  md: [{ stackHorizontally: {} }],
  lg: [{ stackHorizontally: {} }],
  xl: [{ stackHorizontally: {} }],
} as const satisfies BoxTransformations<NodeID>;

export const DefaultTransformationsResponsiveColumns = {
  xs: [{ stackVertically: {} }],
  sm: [{ stackVertically: {} }],
  md: [{ stackVertically: {} }],
  lg: [{ stackVertically: {} }],
  xl: [{ stackVertically: {} }],
} as const satisfies BoxTransformations<NodeID>;

export const getDefaultTheme = <L extends Layout>(layout: L) => {
  const theme = {
    //
    resolveBoxSpan: <S extends SectionsIDSFromLayout<L>>(
      section: S,
      boxId: BlockIDSFromSectionAndLayout<L, S>,
      layout: L,
      span: BoxSpan,
      bp: (typeof BREAKPOINTS)[number],
    ) => {
      let dx = span.spanX;
      let dy = span.spanY;

      if (bp === 'xs') {
        // in xs, all boxes are full width
        dx = 1;
      }
      const gridBox: GridBox = makeGridBox(getOrigin(), { x: dx, y: dy });
      return gridBox;
    },
    sectionBoxTransforms: <S extends SectionsIDSFromLayout<L>>(section: S, layout: L) => {
      return DefaultTransformationsResponsiveRows;
    },
    layoutTransforms: (layout: L) => {
      return DefaultTransformationsResponsiveColumns;
    },
    gridNodeOptions: { ...DEFAULT_GRID_NODE_VIEW_OPTIONS },
    gridOptions: { ...DEFAULT_GRID_OPTIONS },
  } satisfies ThemeForLayout<L>;

  return theme;
};
