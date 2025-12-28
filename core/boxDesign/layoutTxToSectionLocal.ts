import { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';
import { GridBox } from '../box/gridBoxTypes';
import { BoxTransformations, BPSGridBoxes, GridBoxesAndTx } from '../boxLayout/boxLayoutTypes';
import { LayoutSectionLocal, LayoutWithTx } from '../boxLayout/boxLayoutTypes';
import { DefaultBoxTransformations } from '../boxTransformations/defaultBoxTransformations';
import { BPs, BREAKPOINTS } from '../breakpoints';
import { DiagnosticEntry } from '../gridErrorShape';
import { transformBoxMove } from './transformBoxMove';

function layoutTxSectionKeys<sectionIDs extends SectionIDs>(
  sections: Partial<Record<sectionIDs, unknown>>,
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null,
  ) as Array<sectionIDs>;
}

export function layoutTxToSectionLocal<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(
  layoutTx: LayoutWithTx<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[],
): LayoutSectionLocal<sectionIDs, blockIDs> {
  ///
  ///
  const defaultBoxTransformations = DefaultBoxTransformations();

  // initialize the layoutSectionLocal structure
  let layoutSectionLocal: LayoutSectionLocal<sectionIDs, blockIDs> = {
    sections: {} as Record<sectionIDs, BPSGridBoxes<blockIDs>>,
    transformations: layoutTx.transformations
      ? layoutTx.transformations
      : ({} as BoxTransformations<sectionIDs>),
  };

  const sectionsKeys = layoutTxSectionKeys(layoutTx.sections);

  // initialize the layoutSectionLocal structure with the boxes from LayoutWithTx
  for (const sectionId of sectionsKeys) {
    ///
    layoutSectionLocal.sections[sectionId] = {} as BPSGridBoxes<blockIDs>;

    BREAKPOINTS.forEach((bp) => {
      layoutSectionLocal.sections[sectionId][bp] = layoutTx.sections[sectionId].gridBoxes[bp];
    });
  }

  //  Now we apply transformations if any
  // here we initialize the layoutSectionLocal structure
  for (const sectionId of sectionsKeys) {
    // evaluating transformations for this section
    const transformations: BoxTransformations<blockIDs> | undefined =
      layoutTx.sections[sectionId].transformations;

    if (!transformations) {
      continue; // no transformations to apply
    }

    // get the local grid boxes.
    let localGridBoxesPerBp: BPs<Partial<Record<blockIDs, GridBox>>> =
      layoutSectionLocal.sections[sectionId];

    transformBoxMove<blockIDs>(
      defaultBoxTransformations,
      transformations,
      localGridBoxesPerBp,
      diagnostics,
    );
  }

  return layoutSectionLocal;
}
