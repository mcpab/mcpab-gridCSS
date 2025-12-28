import { addCoordinates, subtractCoordinates } from '../../geometry/coordinateAlgebra';
import { Coordinate } from '../../geometry/coordinateTypes';
import { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';
import { GridBox } from '../box/gridBoxTypes';
import {
  BoxesCoordinates,
  BoxTransformations,
  LayoutAbsolute,
  LayoutSectionBounds,
} from '../boxLayout/boxLayoutTypes';
import { DefaultBoxTransformations } from '../boxTransformations/defaultBoxTransformations';
import { BPs, BREAKPOINTS } from '../breakpoints';
import { DiagnosticEntry, GRID_ERROR_CODE, makeWarning } from '../gridErrorShape';
import { CSSCoordinates } from '../gridNodeTypes';
import { transformBoxMove } from './transformBoxMove';

function layoutSectionKeys<sectionIDs extends SectionIDs>(
  sections: Partial<Record<sectionIDs, unknown>>,
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null,
  ) as Array<sectionIDs>;
}

export function layoutSectionBtoAbsolute<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(
  layoutSectionBounds: LayoutSectionBounds<sectionIDs, blockIDs>,
  diagnostics: DiagnosticEntry[],
): LayoutAbsolute<sectionIDs, blockIDs> {
  let LayoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs> = {} as LayoutAbsolute<
    sectionIDs,
    blockIDs
  >;

  let defaultBoxTransformations = DefaultBoxTransformations();

  let transformations: BoxTransformations<sectionIDs> = layoutSectionBounds.transformations
    ? layoutSectionBounds.transformations
    : ({} as BoxTransformations<sectionIDs>);

  const sections = layoutSectionKeys(layoutSectionBounds.sections);

  // before transforming the boxes, we need to transform the origins
  // of the boxes in each section to displacements to the bounding box origin
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sections) {
      const boundBox: GridBox = layoutSectionBounds.boundingBoxes[bp][sectionId as sectionIDs];

      const localBoxes = layoutSectionBounds.sections[sectionId as sectionIDs][bp];
      if (!localBoxes) {
        continue;
      }
      for (const boxId in localBoxes) {
        const box = localBoxes[boxId as blockIDs];
        if (!box) {
          continue;
        }

        // adjust the origin to be relative to the bounding box origin
        // i.e. this becomes the displacement from the bounding box origin
        box.origin = subtractCoordinates(box.origin, boundBox.origin);
      }
    }
  });

  // now we place all the bounding boxes in (1,1)
  BREAKPOINTS.forEach((bp) => {
    for (const sectionId of sections) {
      const boundBox: GridBox = layoutSectionBounds.boundingBoxes[bp][sectionId];

      // move the bounding box origin to (1,1)
      boundBox.origin = { x: 1, y: 1 };
    }
  });

  // and then we perform the transformations of the bounding boxes.
  transformBoxMove<sectionIDs>(
    defaultBoxTransformations,
    transformations,
    layoutSectionBounds.boundingBoxes,
    diagnostics,
  );

  // the bounding boxes are now in absolute CSS coordinates, and in the right absolute position
  // we can now compute the absolute positions of the boxes inside each section
  BREAKPOINTS.forEach((bp) => {
    const localGridBoxesPerBp = layoutSectionBounds.boundingBoxes[bp];

    for (const sectionId of sections) {
      const boundBox: GridBox = localGridBoxesPerBp[sectionId];

      const localBoxes = layoutSectionBounds.sections[sectionId][bp];
      if (!localBoxes) {
        continue;
      }
      for (const boxId in localBoxes) {
        const box = localBoxes[boxId as blockIDs];
        if (!box) {
          continue;
        }

        // adjust the origin to be relative to the bounding box origin
        box.origin = addCoordinates(box.origin, boundBox.origin);
      }
    }
  });

  LayoutAbsolute.gridDimensions = {
    rows: {} as BPs<number>,
    columns: {} as BPs<number>,
  };

  // finally we assemble the LayoutAbsolute structure
  BREAKPOINTS.forEach((bp) => {
    const localGridBoxesPerBp = layoutSectionBounds.boundingBoxes[bp];

    let maxRow = 0;
    let maxCol = 0;

    for (const sectionId of sections) {
      const boundBox: GridBox = localGridBoxesPerBp[sectionId as sectionIDs];

      const boxMaxRow = boundBox.origin.y + boundBox.diagonal.y;
      const boxMaxCol = boundBox.origin.x + boundBox.diagonal.x;

      if (boxMaxRow > maxRow) {
        maxRow = boxMaxRow;
      }
      if (boxMaxCol > maxCol) {
        maxCol = boxMaxCol;
      }
    }

    LayoutAbsolute.gridDimensions.rows[bp] = Math.max(1, maxRow - 1);
    LayoutAbsolute.gridDimensions.columns[bp] = Math.max(1, maxCol - 1);
  });

  // computing the CSS coordinates of all boxes
  LayoutAbsolute.sections = {} as Record<sectionIDs, BoxesCoordinates<blockIDs>>;

  // Finding the minimum to make sure we are >1
  let minCoordinate: BPs<Coordinate> = {
    xs: { x: Infinity, y: Infinity },
    sm: { x: Infinity, y: Infinity },
    md: { x: Infinity, y: Infinity },
    lg: { x: Infinity, y: Infinity },
    xl: { x: Infinity, y: Infinity },
  };

  for (const sectionId of sections) {
    let crd: BoxesCoordinates<blockIDs> = {} as BoxesCoordinates<blockIDs>;

    crd.coordinates = {} as BPs<Partial<Record<blockIDs, CSSCoordinates>>>;

    BREAKPOINTS.forEach((bp) => {
      crd.coordinates[bp] = {} as Partial<Record<blockIDs, CSSCoordinates>>;

      let boxesatBp: Partial<Record<blockIDs, GridBox>> =
        layoutSectionBounds.sections[sectionId][bp];

      if (!boxesatBp) {
        return;
      }
      for (const boxId in boxesatBp) {
        const box = boxesatBp[boxId as blockIDs];
        if (!box) {
          continue;
        }

        let coord: CSSCoordinates = getCSSCoordinates(box);
        crd.coordinates[bp][boxId as blockIDs] = coord;

        if (coord.gridColumnStart < minCoordinate[bp].x) {
          minCoordinate[bp].x = coord.gridColumnStart;
        }

        if (coord.gridRowStart < minCoordinate[bp].y) {
          minCoordinate[bp].y = coord.gridRowStart;
        }
      }
    });

    LayoutAbsolute.sections[sectionId] = crd;
  }

  BREAKPOINTS.forEach((bp) => {
    if (minCoordinate[bp].x === Infinity && minCoordinate[bp].y === Infinity) {
      diagnostics.push(
        makeWarning(
          'layoutSectionBtoAbsolute',
          GRID_ERROR_CODE.EMPTY_GRID,
          `Empty grid at breakpoint ${bp}. Setting minimal dimensions`,
        ),
      );
      LayoutAbsolute.gridDimensions.columns[bp] = 1;
      LayoutAbsolute.gridDimensions.rows[bp] = 1;
      return;
    }
    let dx = 0;
    let dy = 0;

    // converting to displacement if <1
    if (minCoordinate[bp].x < 1) {
      dx = 1 - minCoordinate[bp].x;
    }
    if (minCoordinate[bp].y < 1) {
      dy = 1 - minCoordinate[bp].y;
    }

    // translate if any is not zero
    if (dx === 0 && dy === 0) {
      return;
    }

    LayoutAbsolute.gridDimensions.columns[bp] += dx;
    LayoutAbsolute.gridDimensions.rows[bp] += dy;

    diagnostics.push(
      makeWarning(
        'layoutSectionBtoAbsolute',
        GRID_ERROR_CODE.GRID_NORMALIZED_TO_POSITIVE_LINES,
        `Grid normalized to positive values at bp ${bp}`,
      ),
    );

    for (const sectionId of sections) {
      let coordinates: Partial<Record<blockIDs, CSSCoordinates>> =
        LayoutAbsolute.sections[sectionId].coordinates[bp];

      if (!coordinates) {
        continue;
      }
      for (const boxId in coordinates) {
        let coordinate = coordinates[boxId];

        if (!coordinate) {
          continue;
        }

        coordinate.gridColumnEnd += dx;
        coordinate.gridColumnStart += dx;
        coordinate.gridRowStart += dy;
        coordinate.gridRowEnd += dy;
      }
    }
  });

  return LayoutAbsolute;
}

function getCSSCoordinates(box: GridBox): CSSCoordinates {
  return {
    gridColumnStart: box.origin.x,
    gridColumnEnd: box.origin.x + box.diagonal.x,

    gridRowStart: box.origin.y,
    gridRowEnd: box.origin.y + box.diagonal.y,
  };
}
