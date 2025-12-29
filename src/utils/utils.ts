
/**
 * @fileoverview Utility functions for type-safe object operations.
 * Provides type-safe alternatives to common JavaScript object operations.
 * @module Utils
 */

/**
 * Returns the keys of an object with proper type safety.
 * Provides a type-safe alternative to Object.keys() that preserves key types.
 * 
 * @template T - The object type
 * @param obj - The object to extract keys from
 * @returns Array of keys with proper typing
 * 
 * @example
 * ```typescript
 * const config = {
 *   width: 100,
 *   height: 200,
 *   visible: true
 * } as const;
 * 
 * // Type-safe keys
 * const keys = typedKeys(config); // Array<"width" | "height" | "visible">
 * 
 * // Compare with Object.keys() which returns string[]
 * const unsafeKeys = Object.keys(config); // string[]
 * 
 * // Usage in loops
 * typedKeys(config).forEach(key => {
 *   console.log(config[key]); // TypeScript knows the correct type
 * });
 * ```
 */
 export function typedKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}