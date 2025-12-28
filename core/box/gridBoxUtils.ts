import { copyCoordinate } from "../../geometry/coordinatesUtils";
import { Coordinate } from "../../geometry/coordinateTypes";
import { GridBox } from "./gridBoxTypes";


/** 
 * Creates a normalized {@link GridBox} from an origin and a diagonal vector.
 *
 * @remarks
 * - This function does not attach the box to any global grid; the coordinates
 *   are interpreted in an abstract local reference system.
 * - `origin` is treated as a position for the bottom-left corner.
 * - `diagonal` is treated as a size/extent vector; its components are made
 *   non-negative so that the resulting box has a well-defined width and height.
 *
 * @param origin - Bottom-left corner of the box in local coordinates.
 * @param diagonal - Vector from `origin` toward the opposite corner. Its `x`
 * and `y` components may be negative on input; they are converted to absolute
 * values during normalization.
 *
 * @returns A normalized {@link GridBox} where `diagonal.x` and `diagonal.y`
 * are guaranteed to be non-negative.
 */
export const makeGridBox = (origin: Coordinate, diagonal: Coordinate): GridBox => {
    const org = copyCoordinate(origin);
    const diag = copyCoordinate(diagonal);

    diag.x = Math.abs(diag.x);
    diag.y = Math.abs(diag.y);

    return {
        origin: org,
        diagonal: diag,
        _normalized: 'GridBox',
    };
};

/**
 * Creates a deep copy of an existing {@link GridBox}.
 *
 * @remarks
 * The returned box preserves the `_normalized` brand and assumes that the
 * input already satisfies the `GridBox` invariants.
 *
 * @param box - The box to copy.
 * @returns A new {@link GridBox} with copied `origin` and `diagonal`.
 */
export const copyGridBox = (box: GridBox): GridBox => {
    return {
        origin: copyCoordinate(box.origin),
        diagonal: copyCoordinate(box.diagonal),
        _normalized: 'GridBox',
    };
};











