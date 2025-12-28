import { GridBox } from '../box/gridBoxTypes';
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

export type ThemeForLayout<L extends Layout> = {
  //
  resolveBoxSpan: <S extends SectionsIDSFromLayout<L>>(
    section: S,
    boxId: BlockIDSFromSectionAndLayout<L, S>,
    layout: L,
    span: BoxSpan,
    bp: (typeof BREAKPOINTS)[number],
  ) => GridBox;

  /** Default box-level transforms applied inside every section unless overridden. */
  sectionBoxTransforms: <S extends SectionsIDSFromLayout<L>>(
    section: S,
    layout: L,
  ) => BoxTransformations<BlockIDSFromSectionAndLayout<L, S>>;

  /** Default section-level transforms (how sections stack) unless overridden. */
  layoutTransforms: (layout: L) => BoxTransformations<SectionsIDSFromLayout<L>>;

  gridNodeOptions: GridNodeViewOptions;

  gridOptions: GridOptions;
};
