import { NodeID, SectionIDs } from "../../templates/layoutIDs";
import { GridBox } from "../box/gridBoxTypes";
import { BoxTransformations } from "../boxLayout/boxLayoutTypes";
import { BoxMovesProps, BoxMovesPropsObject, BoxMoveToProps, BoxMovesFunctions } from "../boxTransformations/boxTransformationsProps";
import { BPs, BREAKPOINTS } from "../breakpoints";
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from "../gridErrorShape";
import { transformationIDs, TransformationIDs } from "../boxTransformations/boxTransformationsProps";

//export type BoxTransformations<BoxId extends NodeID> = BPs<Array<SingleBoxMoveProps<BoxId>>>;
export const transformBoxMove = <BoxID extends NodeID>(
    transformationFactory: BoxMovesFunctions<BoxID>,
    boxTransformations: BoxTransformations<BoxID>,
    gridBoxes: BPs<Partial<Record<BoxID, GridBox>>>,
    diagnostics: DiagnosticEntry[]) => {


    BREAKPOINTS.forEach(bp => {

        if (!(bp in boxTransformations)) {
            return; // no transformations for this breakpoint
        }

        const transformationsAtBp: Array<BoxMovesProps<BoxID>> | undefined = boxTransformations[bp];

        if (!transformationsAtBp) {
            return; // nothing to do
        }

 

        // we have now the transformations for this bp
        // looping through each transformation
        transformationsAtBp.forEach(tx => {

            const tr: BoxMovesProps<BoxID> = tx;

            // now we need to identify the transformation type
            const txID: TransformationIDs<BoxID> = Object.keys(tr)[0] as keyof BoxMovesPropsObject<BoxID>;

            if (!transformationIDs.includes(txID)) {
                // unknown transformation ID
                diagnostics.push(makeError('transformBoxMove',
                    GRID_ERROR_CODE.UNKNOWN_TRANSFORMATION,
                    `Unknown transformation key: ${txID}`));
                return;
            }

            switch (txID) {
                case "moveTo":
                    // console.log('Applying moveTo transformation', tr);
                    {
                        const propsMove = (tr as { moveTo: BoxMoveToProps<BoxID> }).moveTo;
                        
                        let result = transformationFactory.moveTo({
                            boxprops: propsMove,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `moveTo transformation failed for box ${JSON.stringify(propsMove)}`));
                        }
                    }
                    break;
                case "moveBy":
                    // console.log('Applying moveBy transformation', tr);
                    {
                        const propsMoveBy = (tr as { moveBy: any }).moveBy;
                        let result = transformationFactory.moveBy({
                            boxprops: propsMoveBy,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `moveBy transformation failed for box ${JSON.stringify(propsMoveBy)}`));
                        }
                    }
                    break;
                case "alignToY":
                    // console.log('Applying alignToY transformation', tr);
                    {
                        const propsAlignY = (tr as { alignToY: any }).alignToY;
                        let result = transformationFactory.alignToY({
                            boxprops: propsAlignY,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignToY transformation failed for box ${JSON.stringify(propsAlignY)}`));
                        }
                    }

                    break;
                case "alignToX":
                    // console.log('Applying alignToX transformation', tr);
                    {
                        const propsAlignX = (tr as { alignToX: any }).alignToX;
                        let result = transformationFactory.alignToX({
                            boxprops: propsAlignX,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignToX transformation failed for box ${JSON.stringify(propsAlignX)}`));
                        }
                    }

                    break;
                case "alignAllToY":
                    // console.log('Applying alignAllToY transformation', tr);
                    {
                        const propsAlignAllY = (tr as { alignAllToY: any }).alignAllToY;
                        let result = transformationFactory.alignAllToY({
                            boxprops: propsAlignAllY,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignAllToY transformation failed for box ${JSON.stringify(propsAlignAllY)}`));
                        }
                    }
                    break;
                case "alignAllToX":
                    // console.log('Applying alignAllToX transformation', tr);
                    {
                        const propsAlignAllX = (tr as { alignAllToX: any }).alignAllToX;
                        let result = transformationFactory.alignAllToX({
                            boxprops: propsAlignAllX,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignAllToX transformation failed for box ${JSON.stringify(propsAlignAllX)}`));
                        }
                    }

                    break;
                case "stackVertically":
                    // console.log('Applying stackVertically transformation', tr);
                    {
                        const propsStackV = (tr as { stackVertically: any }).stackVertically;
                        let result = transformationFactory.stackVertically({
                            boxprops: propsStackV,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `stackVertically transformation failed for box ${JSON.stringify(propsStackV)}`));
                        }
                    }
                    break;
                case "stackHorizontally":
                    // console.log('Applying stackHorizontally transformation', tr);
                    {
                        const propsStackH = (tr as { stackHorizontally: any }).stackHorizontally;
                        let result = transformationFactory.stackHorizontally({
                            boxprops: propsStackH,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `stackHorizontally transformation failed for box ${JSON.stringify(propsStackH)}`));
                        }
                    }
                    break;

                default:
                    // ✅ If we ever get here, TypeScript will error
                    diagnostics.push(makeError('transformBoxMove',
                        GRID_ERROR_CODE.UNKNOWN_TRANSFORMATION,
                        `Unhandled transformation key: ${txID}`));

                    //  
                    const _exhaustive: never = txID;
                    break;

            }
        });

    });




}

