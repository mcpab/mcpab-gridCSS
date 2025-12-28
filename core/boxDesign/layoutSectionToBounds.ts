import { BlocksIDs, SectionIDs } from "../../templates/layoutIDs";
import { GridBox } from "../box/gridBoxTypes";
import { makeGridBox } from "../box/gridBoxUtils";
import { BPSGridBoxes, LayoutSectionBounds, LayoutSectionLocal } from "../boxLayout/boxLayoutTypes";
import { BREAKPOINTS } from "../breakpoints";
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from "../gridErrorShape";

function layoutSectionKeys<sectionIDs extends SectionIDs>(
  sections: Partial<Record<sectionIDs, unknown>>,
): sectionIDs[] {
  return Object.keys(sections).filter(
    (k) => sections[k as sectionIDs] != null,
  ) as Array<sectionIDs>;
}

export function layoutSectionToBounds<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>(
    layoutSectionLocal: LayoutSectionLocal<sectionIDs, blockIDs>, diagnostics: DiagnosticEntry[]):
    LayoutSectionBounds<sectionIDs, blockIDs> {


    let layoutSectionBounds: LayoutSectionBounds<sectionIDs, blockIDs> = {} as LayoutSectionBounds<sectionIDs, blockIDs>;

    layoutSectionBounds.sections = layoutSectionLocal.sections;

    layoutSectionBounds.boundingBoxes = {
        xs: {} as Record<sectionIDs, GridBox>,
        sm: {} as Record<sectionIDs, GridBox>,
        md: {} as Record<sectionIDs, GridBox>,
        lg: {} as Record<sectionIDs, GridBox>,
        xl: {} as Record<sectionIDs, GridBox>,
    };

    layoutSectionBounds.transformations = layoutSectionLocal.transformations;

    const sectionIds = layoutSectionKeys(layoutSectionLocal.sections);

    BREAKPOINTS.forEach(bp => {

        for (const sectionId of sectionIds) {

            let boundPerSection: GridBox;

            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            let gridBoxes:BPSGridBoxes<blockIDs> = layoutSectionLocal.sections[sectionId];

            const boxesAtBp = gridBoxes[bp];
 
            let foundAnyBox = false;

            for (const boxId in boxesAtBp) {

                const box = boxesAtBp[boxId];

                if (!box) {
                    continue;
                }

                minX = Math.min(minX, box.origin.x);
                maxX = Math.max(maxX, box.origin.x + box.diagonal.x);
                minY = Math.min(minY, box.origin.y);
                maxY = Math.max(maxY, box.origin.y + box.diagonal.y);

                foundAnyBox = true;

            }

            if (!foundAnyBox) {
                diagnostics.push(makeError('layoutSectionToBounds',
                    GRID_ERROR_CODE.MISSING_BOX,
                    `No boxes found for section ${sectionId} at breakpoint ${bp}. Returning empty bounding box.`));
                boundPerSection = makeGridBox({ x: 0, y: 0 }, { x: 0, y: 0 });
                layoutSectionBounds.boundingBoxes[bp][sectionId] = boundPerSection;
                continue;
            }

            boundPerSection = makeGridBox({
                x: minX,
                y: minY
            }, {
                x: maxX - minX,
                y: maxY - minY
            });

            layoutSectionBounds.boundingBoxes[bp][sectionId] = boundPerSection;

        }



    });


    return layoutSectionBounds;

}



