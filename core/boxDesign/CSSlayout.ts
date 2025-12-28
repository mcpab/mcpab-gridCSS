import { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';
import {
  BlocksInLayoutWithTx,
  LayoutAbsolute,
  LayoutSectionBounds,
  LayoutWithTx,
  SectionsInLayoutWithTx,
} from '../boxLayout/boxLayoutTypes';
import { BREAKPOINTS } from '../breakpoints';
import { DiagnosticEntry, GRID_ERROR_CODE, makeError, makeWarning } from '../gridErrorShape';
import { CSSCoordinates } from '../gridNodeTypes';
import { layoutSectionBtoAbsolute } from './layoutSectionBtoAbsolute';
import { layoutSectionToBounds } from './layoutSectionToBounds';
import { layoutTxToSectionLocal } from './layoutTxToSectionLocal';

function layoutSectionKeys<sectionIDs extends SectionIDs>(
  sections: Partial<Record<sectionIDs, unknown>>,
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null,
  ) as Array<sectionIDs>;
}
type GridDiagnostic = {
  overlapPolicy?: 'allow' | 'warn' | 'error';
  breakpoints?: readonly (typeof BREAKPOINTS)[number][];
};

type CSSLayoutProps<L extends LayoutWithTx<SectionIDs, BlocksIDs>> = {
  layoutWithTx: L;
  diagnostics: DiagnosticEntry[];
  gridDiagnostic?: GridDiagnostic;
};

export function CSSLayout<L extends LayoutWithTx<any, any>>({
  layoutWithTx,
  diagnostics,
  gridDiagnostic = { overlapPolicy: 'allow', breakpoints: BREAKPOINTS },
}: CSSLayoutProps<L>): LayoutAbsolute<SectionsInLayoutWithTx<L>, BlocksInLayoutWithTx<L>> {
  //
  const layoutSectionLocal = layoutTxToSectionLocal(layoutWithTx, diagnostics);

  const layoutSecBonds = layoutSectionToBounds(layoutSectionLocal, diagnostics);

  const layoutSecAbs = layoutSectionBtoAbsolute(layoutSecBonds, diagnostics);
  const overlapPolicy = gridDiagnostic.overlapPolicy || 'allow';
  const breakpoints = gridDiagnostic.breakpoints || BREAKPOINTS;

  // we check overlap of sections boxes if needed
  if (overlapPolicy !== 'allow') {
    checkSectionsOverlap<SectionsInLayoutWithTx<L>, BlocksInLayoutWithTx<L>>(
      layoutSecAbs,
      diagnostics,
      overlapPolicy,
      breakpoints,
    );
  }

  return layoutSecAbs;
}

type OverlapRect = {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
};

type OverlapRef<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  sectionId: sectionIDs;
  boxId: blockIDs;
  rect: OverlapRect;
};

type OverlapDetails<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  bp: (typeof BREAKPOINTS)[number];
  a: OverlapRef<sectionIDs, blockIDs>;
  b: OverlapRef<sectionIDs, blockIDs>;
  pairKey: string;
};

type BoxWithMeta<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  id: string;
  bp: (typeof BREAKPOINTS)[number];
  sectionId: sectionIDs;
  boxId: blockIDs;
  coords: CSSCoordinates;
};

export function recordKeys<K extends string, V>(obj: Record<K, V>): K[] {
  return Object.keys(obj) as K[];
}

export function partialRecordKeys<K extends string, V>(obj: Partial<Record<K, V>>): K[] {
  return Object.keys(obj) as K[];
}

function overlaps(a: CSSCoordinates, b: CSSCoordinates): boolean {
  return (
    a.gridColumnStart < b.gridColumnEnd &&
    b.gridColumnStart < a.gridColumnEnd &&
    a.gridRowStart < b.gridRowEnd &&
    b.gridRowStart < a.gridRowEnd
  );
}

export function checkSectionsOverlap<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(
  layoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[],
  overlapPolicy: 'warn' | 'error',
  breakpoints: readonly (typeof BREAKPOINTS)[number][],
) {
  const sectionIds = recordKeys(layoutAbsolute.sections);

  for (const bp of breakpoints) {
    const boxesByBp: BoxWithMeta<sectionIDs, blockIDs>[] = [];

    for (const sectionId of sectionIds) {
      const sectionBoxes = layoutAbsolute.sections[sectionId].coordinates[bp];
      if (!sectionBoxes) continue;

      const boxIds = partialRecordKeys(sectionBoxes);

      for (const boxId of boxIds) {
        const crd = sectionBoxes[boxId];
        if (!crd) continue;

        boxesByBp.push({
          id: `${bp}::${sectionId}::${boxId}`,
          bp,
          sectionId,
          boxId,
          coords: crd,
        });
      }
    }

    for (let i = 0; i < boxesByBp.length; i++) {
      const a = boxesByBp[i];

      for (let j = i + 1; j < boxesByBp.length; j++) {
        const b = boxesByBp[j];

        if (!overlaps(a.coords, b.coords)) continue;

        const details: OverlapDetails<sectionIDs, blockIDs> = {
          bp,
          a: {
            sectionId: a.sectionId,
            boxId: a.boxId,
            rect: {
              colStart: a.coords.gridColumnStart,
              colEnd: a.coords.gridColumnEnd,
              rowStart: a.coords.gridRowStart,
              rowEnd: a.coords.gridRowEnd,
            },
          },
          b: {
            sectionId: b.sectionId,
            boxId: b.boxId,
            rect: {
              colStart: b.coords.gridColumnStart,
              colEnd: b.coords.gridColumnEnd,
              rowStart: b.coords.gridRowStart,
              rowEnd: b.coords.gridRowEnd,
            },
          },
          pairKey: `${a.id}__${b.id}`,
        };

        const message = `Boxes ${a.id} and ${b.id} are overlapping.`;

        diagnostics.push(
          overlapPolicy === 'warn'
            ? makeWarning('CSSLayout', GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED, message, {
                details,
              })
            : makeError('CSSLayout', GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED, message, {
                details,
              }),
        );
      }
    }
  }
}
