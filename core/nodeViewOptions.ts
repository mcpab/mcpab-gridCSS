/**
 * @fileoverview Grid node view configuration options for styling and behavior.
 * Provides comprehensive options for configuring individual grid node appearance and interaction.
 * @module NodeViewOptions
 */

/**
 * Configuration options for individual grid node view properties and behavior.
 * All properties are optional, allowing for flexible node-specific customization.
 * 
 * @example
 * ```typescript
 * const nodeOptions: GridNodeViewOptions = {
 *   // Layering and positioning
 *   zIndex: 10,
 *   justifySelf: 'center',
 *   alignSelf: 'stretch',
 *   
 *   // Size constraints
 *   minWidth0: true,   // Prevent min-width: auto overflow
 *   minHeight0: true,  // Prevent min-height: auto overflow
 *   
 *   // Interaction
 *   pointerEvents: 'auto',
 *   visibility: 'visible',
 *   
 *   // HTML attributes
 *   dataAttrs: { 
 *     testid: 'grid-item',
 *     role: 'article' 
 *   },
 *   
 *   // Accessibility
 *   aria: {
 *     role: 'main',
 *     label: 'Primary content area',
 *     labelledBy: 'section-heading'
 *   }
 * };
 * ```
 */
export type GridNodeViewOptions = Partial<{
  /** CSS z-index value for layering control */
  zIndex: number;
  /** Whether to set min-width: 0 to prevent overflow from content */
  minWidth0: boolean;
  /** Whether to set min-height: 0 to prevent overflow from content */
  minHeight0: boolean;
  /** CSS justify-self: Horizontal alignment within the grid area */
  justifySelf: 'start' | 'end' | 'center' | 'stretch';
  /** CSS align-self: Vertical alignment within the grid area */
  alignSelf: 'start' | 'end' | 'center' | 'stretch';
  /** CSS pointer-events: Whether the element can be the target of pointer events */
  pointerEvents: 'auto' | 'none';
  /** HTML data attributes to be applied to the element */
  dataAttrs: Record<string, string>;
  /** ARIA accessibility attributes for screen readers and assistive technology */
  aria: {
    /** ARIA role attribute */
    role?: string;
    /** ARIA label for accessibility */
    label?: string;
    /** ID of element that labels this element */
    labelledBy?: string;
    /** ID of element that describes this element */
    describedBy?: string;
  };
  /** Visibility state: visible, hidden, or visually hidden (accessible but not visible) */
  visibility: 'visible' | 'hidden' | 'visuallyHidden';
}>;
