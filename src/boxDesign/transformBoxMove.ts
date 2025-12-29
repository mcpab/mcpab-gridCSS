/**
 * Transform Box Move Engine
 * 
 * This module provides the core transformation engine that applies box movement and alignment
 * transformations to grid layouts. It processes transformation configurations across all
 * responsive breakpoints and applies them using a pluggable transformation factory.
 * 
 * Supported Transformations:
 * - moveTo: Position box at specific coordinates
 * - moveBy: Translate box by offset amounts
 * - alignToX/alignToY: Align box to specific coordinate
 * - alignAllToX/alignAllToY: Align multiple boxes to same coordinate
 * - stackVertically/stackHorizontally: Arrange boxes in stacks
 * 
 * The engine is type-safe and provides comprehensive error handling with detailed
 * diagnostic reporting for transformation failures.
 */

// Grid box type definitions
import { GridBox } from "../box/gridBoxTypes";

// Box transformation configuration types
import { BoxTransformations } from "../boxLayout";

// Transformation function interfaces and type definitions
import { 
  BoxMovesFunctions,      // Factory interface for transformation functions
  BoxMovesProps,          // Union type of all transformation properties
  TransformationIDs,      // Valid transformation identifier types
  BoxMovesPropsObject,    // Object mapping transformation IDs to properties
  transformationIDs,      // Runtime array of valid transformation IDs
  BoxMoveToProps          // Specific properties for moveTo transformation
} from "../boxTransformations";

// Responsive breakpoint types and constants
import { BPs, BREAKPOINTS } from "../breakpoints";

// Error handling and diagnostic utilities
import { DiagnosticEntry, makeError, GRID_ERROR_CODE } from "../gridErrorShape";

// Node identifier types
import { NodeID } from "../templates";


/**
 * Apply box movement transformations across all responsive breakpoints
 * 
 * This is the main transformation engine that processes box transformation configurations
 * and applies them to grid layouts. It handles multiple transformation types and provides
 * comprehensive error handling and diagnostic reporting.
 * 
 * Processing Flow:
 * 1. Iterate through each responsive breakpoint (xs, sm, md, lg, xl)
 * 2. For each breakpoint, process all configured transformations in sequence
 * 3. Validate transformation types and apply using the transformation factory
 * 4. Report errors and constraint violations through diagnostics
 * 
 * @template BoxID - Type extending NodeID for box identifiers
 * @param transformationFactory - Factory providing transformation function implementations
 * @param boxTransformations - Configuration of transformations per breakpoint
 * @param gridBoxes - Grid boxes to transform, organized by breakpoint
 * @param diagnostics - Array to collect errors and warnings during processing
 */
export const transformBoxMove = <BoxID extends NodeID>(
    transformationFactory: BoxMovesFunctions<BoxID>,
    boxTransformations: BoxTransformations<BoxID>,
    gridBoxes: BPs<Partial<Record<BoxID, GridBox>>>,
    diagnostics: DiagnosticEntry[]) => {


    // Process transformations for each responsive breakpoint
    BREAKPOINTS.forEach(bp => {

        // Skip breakpoints that have no transformation configurations
        if (!(bp in boxTransformations)) {
            return; // no transformations for this breakpoint
        }

        // Get transformation array for current breakpoint
        const transformationsAtBp: Array<BoxMovesProps<BoxID>> | undefined = boxTransformations[bp];

        // Skip if no transformations are defined for this breakpoint
        if (!transformationsAtBp) {
            return; // nothing to do
        }

        // Process each transformation in sequence for this breakpoint
        // Order matters: transformations are applied sequentially and may depend on previous results
        transformationsAtBp.forEach(tx => {

            const tr: BoxMovesProps<BoxID> = tx;

            // Extract transformation type from the transformation object
            // Each transformation object has exactly one key indicating its type
            const txID: TransformationIDs<BoxID> = Object.keys(tr)[0] as keyof BoxMovesPropsObject<BoxID>;

            // Validate that the transformation type is recognized
            if (!transformationIDs.includes(txID)) {
                // unknown transformation ID
                diagnostics.push(makeError('transformBoxMove',
                    GRID_ERROR_CODE.UNKNOWN_TRANSFORMATION,
                    `Unknown transformation key: ${txID}`));
                return;
            }

            // Apply the appropriate transformation based on its type
            // Each case handles a specific transformation type with proper type casting
            switch (txID) {
                case "moveTo":
                    // Move box to absolute coordinates
                    // console.log('Applying moveTo transformation', tr);
                    {
                        const propsMove = (tr as { moveTo: BoxMoveToProps<BoxID> }).moveTo;
                        
                        // Apply the moveTo transformation using the factory
                        let result = transformationFactory.moveTo({
                            boxprops: propsMove,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `moveTo transformation failed for box ${JSON.stringify(propsMove)}`));
                        }
                    }
                    break;
                case "moveBy":
                    // Move box by relative offset amounts
                    // console.log('Applying moveBy transformation', tr);
                    {
                        const propsMoveBy = (tr as { moveBy: any }).moveBy;
                        
                        // Apply the moveBy transformation using the factory
                        let result = transformationFactory.moveBy({
                            boxprops: propsMoveBy,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `moveBy transformation failed for box ${JSON.stringify(propsMoveBy)}`));
                        }
                    }
                    break;
                case "alignToY":
                    // Align box to specific Y coordinate
                    // console.log('Applying alignToY transformation', tr);
                    {
                        const propsAlignY = (tr as { alignToY: any }).alignToY;
                        
                        // Apply the alignToY transformation using the factory
                        let result = transformationFactory.alignToY({
                            boxprops: propsAlignY,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignToY transformation failed for box ${JSON.stringify(propsAlignY)}`));
                        }
                    }

                    break;
                case "alignToX":
                    // Align box to specific X coordinate
                    // console.log('Applying alignToX transformation', tr);
                    {
                        const propsAlignX = (tr as { alignToX: any }).alignToX;
                        
                        // Apply the alignToX transformation using the factory
                        let result = transformationFactory.alignToX({
                            boxprops: propsAlignX,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignToX transformation failed for box ${JSON.stringify(propsAlignX)}`));
                        }
                    }

                    break;
                case "alignAllToY":
                    // Align multiple boxes to the same Y coordinate
                    // console.log('Applying alignAllToY transformation', tr);
                    {
                        const propsAlignAllY = (tr as { alignAllToY: any }).alignAllToY;
                        
                        // Apply the alignAllToY transformation using the factory
                        let result = transformationFactory.alignAllToY({
                            boxprops: propsAlignAllY,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignAllToY transformation failed for box ${JSON.stringify(propsAlignAllY)}`));
                        }
                    }
                    break;
                case "alignAllToX":
                    // Align multiple boxes to the same X coordinate
                    // console.log('Applying alignAllToX transformation', tr);
                    {
                        const propsAlignAllX = (tr as { alignAllToX: any }).alignAllToX;
                        
                        // Apply the alignAllToX transformation using the factory
                        let result = transformationFactory.alignAllToX({
                            boxprops: propsAlignAllX,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `alignAllToX transformation failed for box ${JSON.stringify(propsAlignAllX)}`));
                        }
                    }

                    break;
                case "stackVertically":
                    // Arrange boxes in a vertical stack (one above the other)
                    // console.log('Applying stackVertically transformation', tr);
                    {
                        const propsStackV = (tr as { stackVertically: any }).stackVertically;
                        
                        // Apply the stackVertically transformation using the factory
                        let result = transformationFactory.stackVertically({
                            boxprops: propsStackV,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `stackVertically transformation failed for box ${JSON.stringify(propsStackV)}`));
                        }
                    }
                    break;
                case "stackHorizontally":
                    // Arrange boxes in a horizontal stack (side by side)
                    // console.log('Applying stackHorizontally transformation', tr);
                    {
                        const propsStackH = (tr as { stackHorizontally: any }).stackHorizontally;
                        
                        // Apply the stackHorizontally transformation using the factory
                        let result = transformationFactory.stackHorizontally({
                            boxprops: propsStackH,
                            boxes: gridBoxes[bp],
                            diagnostics: diagnostics
                        });

                        // Report failure if transformation couldn't be applied
                        if (!result) {
                            diagnostics.push(makeError('transformBoxMove',
                                GRID_ERROR_CODE.CONSTRAINT_VIOLATION,
                                `stackHorizontally transformation failed for box ${JSON.stringify(propsStackH)}`));
                        }
                    }
                    break;

                default:
                    // TypeScript exhaustiveness checking: this should never be reached
                    // If we get here, there's a transformation ID that wasn't handled above
                    diagnostics.push(makeError('transformBoxMove',
                        GRID_ERROR_CODE.UNKNOWN_TRANSFORMATION,
                        `Unhandled transformation key: ${txID}`));

                    // TypeScript exhaustiveness check - this will cause a compile error
                    // if any transformation cases are missing from the switch statement
                    const _exhaustive: never = txID;
                    break;

            }
        }); // End of transformations loop for current breakpoint

    }); // End of breakpoints loop

    // Transformation processing complete
    // All configured transformations have been applied across all breakpoints
    // Any errors or constraint violations have been reported through diagnostics

}

