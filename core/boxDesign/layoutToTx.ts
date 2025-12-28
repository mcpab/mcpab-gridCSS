import { BlocksIDs } from '../../templates/layoutIDs';
import { GridBox } from '../box/gridBoxTypes';
import {
  BlockIDSFromSectionAndLayout,
  BPSGridBoxes,
  GridBoxesAndTx,
  Layout,
  LayoutWithTx,
  SectionsIDSFromLayout,
  UnionBlockIDSfromLayout,
} from '../boxLayout/boxLayoutTypes';
import { BREAKPOINTS } from '../breakpoints';
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from '../gridErrorShape';
import { getDefaultTheme } from '../layoutTheme/defaultLayoutTheme';
import { ThemeForLayout } from '../layoutTheme/layoutThemeTypes';

type S<L extends Layout> = SectionsIDSFromLayout<L>;
type B<L extends Layout> = UnionBlockIDSfromLayout<L>;

/**
 * Step 1: present section keys (runtime-safe + type-safe boundary)
 * Filters by VALUE existence (not by key).
 */
export function layoutSectionKeysPresent<L extends Layout>(layout: L): Array<S<L>> {
  return Object.keys(layout).filter((k) => (layout as any)[k] != null) as Array<S<L>>;
}

/**
 * Optional: runtime guard for BlocksIDs shape.
 * Keeps you honest if weird keys leak in.
 */
export function isBlocksID(k: string): k is BlocksIDs {
  return k.startsWith('block_');
}

/**
 * Step 2: layout-bound block keys (ties L + S to the actual layout + section argument)
 * This is the key change: L is inferred from `layout`, S from `section`.
 * No free-floating generics.
 */
export function layoutBlockKeysPresent<L extends Layout, Sec extends S<L>>(
  layout: L,
  section: Sec,
): Array<BlockIDSFromSectionAndLayout<L, Sec>> {
  const blocks = layout[section];
  if (!blocks) return [];

  return Object.keys(blocks).filter(isBlocksID) as Array<BlockIDSFromSectionAndLayout<L, Sec>>;
}

export function layoutToTx<L extends Layout>(
  layout: L,
  diagnostic: DiagnosticEntry[],
  theme?: ThemeForLayout<L>,
): LayoutWithTx<S<L>, B<L>> {
  //
  if (!theme) {
    theme = getDefaultTheme(layout);
  }

  let layoutWithTx = {} as LayoutWithTx<S<L>, B<L>>;

  layoutWithTx.sections = {} as Record<S<L>, GridBoxesAndTx<B<L>>>;
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

    layoutWithTx.sections[sectionID] = {} as GridBoxesAndTx<B<L>>;

    layoutWithTx.sections[sectionID].gridBoxes = {} as BPSGridBoxes<B<L>>;
    layoutWithTx.sections[sectionID].transformations = theme.sectionBoxTransforms(
      sectionID,
      layout,
    );

    BREAKPOINTS.forEach((bp) => {
      //
      layoutWithTx.sections[sectionID].gridBoxes[bp] = {} as Partial<Record<B<L>, GridBox>>;

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
