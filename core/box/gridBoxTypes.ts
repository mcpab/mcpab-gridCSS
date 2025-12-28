import { Coordinate } from "../../geometry/coordinateTypes"


// This is the basic box type used in the grid system
// A grid box is an abstract element, that, for now, does not exist in any reference system, or, better to say, 
// will exist in a local reference system with other boxes.
/**
 * A normalized rectangular box in an abstract local grid.
 *
 * @remarks
 * - `GridBox` is purely geometric and lives in a local reference system shared
 *   with other boxes; it is not tied to any CSS or pixel space.
 * - `origin` is the bottom-left corner of the box in that local coordinate system. 
 * - `diagonal` is a vector (extent) from `origin` to the opposite corner, not the
 *   absolute position of that corner.
 * - The box is considered “normalized” if its `diagonal` components are
 *   non-negative; this is tracked by the `_normalized` brand.
 */
export type GridBox = {
    /**
     * Bottom-left corner of the box in local coordinates.
     * Interpreted as a position, not a size.
     */
    origin: Coordinate;

    /**
     * Non-negative extent of the box from `origin` to the opposite corner.
     *
     * @remarks
     * - Interpreted as a width/height vector: the opposite corner can be
     *   derived as `origin + diagonal` (component-wise).
     * - After normalization, both `diagonal.x` and `diagonal.y` are ≥ 0.
     */
    diagonal: Coordinate;

    /**
     * Brand tag indicating that this box has been created or normalized
     * by a trusted constructor (such as {@link makeGridBox}) and satisfies
     * the `GridBox` invariants.
     */
    readonly _normalized: 'GridBox';
};
/**
 * Named reference points on a {@link GridBox}.
 *
 * @remarks
 * These anchors are defined in the same abstract local coordinate system as
 * the box itself and are derived from the box's `origin` (bottom-left corner)
 * and `diagonal` (extent vector):
 *
 * - `bottomLeft`  – the box's origin.
 * - `bottomRight` – the point horizontally at `origin.x + diagonal.x` and
 *   vertically at `origin.y`.
 * - `topLeft`     – the point horizontally at `origin.x` and vertically at
 *   `origin.y + diagonal.y`.
 * - `topRight`    – the point at `origin + diagonal` (component-wise).
 * - `center`      – the point at the geometric center of the box, i.e.
 *   `origin + diagonal / 2` (component-wise).
 */
export type Anchor = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'center';

/**
 * Function signature for computing the position of an anchor point on a
 * {@link GridBox}.
 *
 * @remarks
 * - The returned coordinate is expressed in the same abstract local reference
 *   system as the `GridBox`.
 * - Implementations may return `undefined` for degenerate boxes (e.g. zero
 *   width or height) or for anchors that cannot be computed under specific
 *   policies.
 *
 * @param box - The target {@link GridBox} whose anchor position should be computed.
 * @param boxAnchor - The anchor on the box to locate.
 * @returns The coordinate of the requested anchor in local space, or
 * `undefined` if the position cannot be determined.
 */
export type GridBoxPointPosition = (box: GridBox, boxAnchor: Anchor) => Coordinate | undefined;

