/**
 * @fileoverview Box Transformations module index
 * Re-exports all box transformation types, properties, and default implementations
 * @module BoxTransformations
 */

// Export all types and constants from box transformation properties
export type {
  BoxPropBase,
  BoxMoveToProps,
  BoxMoveByProps,
  BoxAlignYProps,
  BoxAlignXProps,
  BoxProps,
  BoxMovesPropsObject,
  TransformationIDs,
  BoxMovesProps,
  AllBoxMovesProps,
  BoxMovesFunctionsProps,
  BoxMovesFunctions,
} from './boxTransformationsProps';

export {
  transformationIDs,
} from './boxTransformationsProps';

// Export default transformation implementations
export {
  DefaultBoxTransformations,
} from './defaultBoxTransformations';