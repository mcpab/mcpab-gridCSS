/**
 * Default Node Renderer for MUI Integration
 * 
 * This module provides the default rendering implementation for grid nodes using Material-UI
 * components. It handles responsive CSS Grid positioning, accessibility attributes, and
 * visual styling options for nodes within a grid layout system.
 * 
 * Features:
 * - Responsive CSS Grid positioning across all breakpoints
 * - Accessibility support (ARIA attributes, roles, labels)
 * - Flexible visibility controls (hidden, visually hidden)
 * - Data attributes and DOM properties management
 * - Integration with MUI theming and breakpoint system
 * - Customizable content rendering through render props
 * 
 * The renderer converts grid coordinates to CSS Grid properties and applies
 * them responsively using MUI's sx prop system.
 */

'use client';

// MUI core imports - using specific file paths for better tree shaking
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box  from '@mui/material/Box';
 import { MuiTheme } from './muiTypes';
import type { MuiSystemStyleObject } from './muiTypes';
import React from 'react';
// Internal type imports for grid system integration
import { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';  // Template identifier types
import { NodeRenderConfig } from '../../boxLayout';                   // Node rendering configuration
import { BPs } from '../../breakpoints';                              // Breakpoint types
import { CSSCoordinates } from '../../gridNodeTypes';                 // CSS Grid coordinate types
import { GridNodeViewOptions } from '../../nodeViewOptions';          // View configuration options

/**
 * CSS styles for visually hiding elements while keeping them accessible to screen readers
 * 
 * This follows the "visually hidden" pattern that hides content visually but keeps it
 * accessible to assistive technologies. Used when view.visibility is set to 'visuallyHidden'.
 * 
 * Key properties:
 * - position: absolute - Remove from normal document flow
 * - width/height: 1px - Minimal size to avoid being ignored
 * - margin: -1px - Pull back to not affect layout
 * - overflow: visible - Don't clip content
 * - clip: rect(0 0 0 0) - Legacy clipping for older browsers
 * - whiteSpace: nowrap - Prevent text wrapping
 * - border: 0 - Remove any border
 */
const visuallyHiddenStyle: MuiSystemStyleObject = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'visible',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Generate MUI sx props based on grid node view options
 * 
 * Converts GridNodeViewOptions into MUI's sx prop object, handling various
 * visual and layout properties including sizing constraints, positioning,
 * visibility, and accessibility.
 * 
 * Supported options:
 * - minWidth0/minHeight0: Allow content to shrink below natural minimum
 * - justifySelf/alignSelf: CSS Grid alignment within grid area
 * - zIndex: Stacking order control
 * - pointerEvents: Mouse interaction control
 * - visibility: Show/hide/visually-hide content
 * 
 * @param view - Optional view configuration object
 * @returns MUI sx prop object with computed styles
 */
export function getNodeSxProps(view?: GridNodeViewOptions): MuiSystemStyleObject  {
  // Use empty object as default if no view options provided
  const v = view ?? {};

  // Extract sizing constraint options with sensible defaults
  const minWidth0 = v.minWidth0 ?? true;   // Allow shrinking below min width by default
  const minHeight0 = v.minHeight0 ?? true; // Allow shrinking below min height by default

  return {
    // Apply minimum size constraints conditionally
    ...(minWidth0 ? { minWidth: 0 } : {}),
    ...(minHeight0 ? { minHeight: 0 } : {}),

    // CSS Grid alignment within the assigned grid area
    justifySelf: v.justifySelf ?? 'stretch',  // Horizontal alignment (default: fill area)
    alignSelf: v.alignSelf ?? 'stretch',      // Vertical alignment (default: fill area)

    // Stacking order control (only apply if explicitly set)
    ...(v.zIndex != null ? { zIndex: v.zIndex } : {}),
    
    // Mouse interaction control
    pointerEvents: v.pointerEvents ?? 'auto',

    // Visibility handling with different hide mechanisms
    ...(v.visibility === 'hidden' ? { visibility: 'hidden' } : {}),
    ...(v.visibility === 'visuallyHidden' ? visuallyHiddenStyle : {}),
  };
}

/**
 * Generate DOM attributes and props from grid node view options
 * 
 * Converts GridNodeViewOptions into React DOM attributes, specifically handling
 * accessibility (ARIA) attributes and custom data attributes. This ensures proper
 * semantic markup and accessibility support for grid nodes.
 * 
 * Supported features:
 * - ARIA attributes (role, label, labelledby, describedby)
 * - Custom data attributes with automatic "data-" prefixing
 * - Type-safe attribute handling
 * 
 * @param view - Optional view configuration object
 * @returns Object containing React DOM attributes
 */

type DataAttributes = Record<`data-${string}`, string>;

export function getNodeDomProps(
  view?: GridNodeViewOptions,
): React.HTMLAttributes<HTMLElement> & DataAttributes {
  const v = view ?? {};
  const aria = v.aria ?? {};

  const domProps: React.HTMLAttributes<HTMLElement> & Partial<DataAttributes> = {};

  if (aria.role) domProps.role = aria.role;
  if (aria.label) domProps["aria-label"] = aria.label;
  if (aria.labelledBy) domProps["aria-labelledby"] = aria.labelledBy;
  if (aria.describedBy) domProps["aria-describedby"] = aria.describedBy;

  if (v.dataAttrs) {
    for (const [k, val] of Object.entries(v.dataAttrs)) {
      const key = (k.startsWith("data-") ? k : `data-${k}`) as `data-${string}`;
      domProps[key] = String(val);
    }
  }

  return domProps as React.HTMLAttributes<HTMLElement> & DataAttributes;
}
/**
 * Props for the DefaultNodeRender component
 * 
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 */
type DefaultNodeRenderProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  section: sectionIDs;                    // The section this node belongs to
  boxId: blockIDs;                        // Unique identifier for this box/node
  cssCoordinateBPs: BPs<CSSCoordinates>;  // CSS Grid coordinates for all breakpoints
  content: NodeRenderConfig<sectionIDs, blockIDs>; // Rendering configuration and content
};

/**
 * Default Node Renderer Component
 * 
 * Renders a grid node using Material-UI components with full responsive CSS Grid support.
 * This component handles the conversion from grid coordinates to CSS Grid properties
 * and applies them across all responsive breakpoints.
 * 
 * Key Features:
 * - Responsive CSS Grid positioning using MUI breakpoint system
 * - Automatic breakpoint detection and coordinate application
 * - Accessibility attribute management
 * - Flexible content rendering through render props
 * - Integration with MUI theming
 * 
 * The component uses MUI's useMediaQuery to detect the current breakpoint and
 * applies the appropriate CSS Grid coordinates for that breakpoint.
 * 
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 * @param props - Component props including coordinates, content, and identifiers
 * @returns Rendered grid node as MUI Box component
 */
export function DefaultNodeRender<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>({
  section,
  boxId,
  cssCoordinateBPs,
  content,
}: DefaultNodeRenderProps<sectionIDs, blockIDs>) {
  // Generate styling and DOM properties from view configuration
  const nodeSx = getNodeSxProps(content.view);
  const domProps = getNodeDomProps(content.view);

  // Access MUI theme for breakpoint detection
  const theme = useTheme();

  // Use MUI's breakpoint system to detect current screen size
  // These hooks return true if screen is at or above the specified breakpoint
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const upXl = useMediaQuery(theme.breakpoints.up('xl'));

  // Determine current breakpoint using waterfall logic
  // Checks from largest to smallest breakpoint
  const bp = upXl ? 'xl' : upLg ? 'lg' : upMd ? 'md' : upSm ? 'sm' : 'xs';

  return (
    <Box
      {...domProps} // Apply accessibility and data attributes
      sx={{
        // Foundation styles for proper grid node behavior
        boxSizing: 'border-box',     // Include padding/border in size calculations
        position: 'relative',        // Establish positioning context for children
        overflow: 'visible',         // Don't clip content by default (opt-in clipping via view)
        minWidth: 0,                 // Allow content to shrink below natural minimum width
        minHeight: 0,                // Allow content to shrink below natural minimum height

        // Responsive CSS Grid positioning
        // Each breakpoint gets its specific grid coordinates
        gridColumnStart: {
          xs: cssCoordinateBPs.xs.gridColumnStart,
          sm: cssCoordinateBPs.sm.gridColumnStart,
          md: cssCoordinateBPs.md.gridColumnStart,
          lg: cssCoordinateBPs.lg.gridColumnStart,
          xl: cssCoordinateBPs.xl.gridColumnStart,
        },
        gridColumnEnd: {
          xs: cssCoordinateBPs.xs.gridColumnEnd,
          sm: cssCoordinateBPs.sm.gridColumnEnd,
          md: cssCoordinateBPs.md.gridColumnEnd,
          lg: cssCoordinateBPs.lg.gridColumnEnd,
          xl: cssCoordinateBPs.xl.gridColumnEnd,
        },
        gridRowStart: {
          xs: cssCoordinateBPs.xs.gridRowStart,
          sm: cssCoordinateBPs.sm.gridRowStart,
          md: cssCoordinateBPs.md.gridRowStart,
          lg: cssCoordinateBPs.lg.gridRowStart,
          xl: cssCoordinateBPs.xl.gridRowStart,
        },
        gridRowEnd: {
          xs: cssCoordinateBPs.xs.gridRowEnd,
          sm: cssCoordinateBPs.sm.gridRowEnd,
          md: cssCoordinateBPs.md.gridRowEnd,
          lg: cssCoordinateBPs.lg.gridRowEnd,
          xl: cssCoordinateBPs.xl.gridRowEnd,
        },

        // Apply view-driven style overrides
        // This includes alignment, sizing, visibility, z-index, etc.
        ...nodeSx,
      }}
    >
      {/* Render content using the provided content renderer */}
      {/* The renderer receives context about the current breakpoint and coordinates */}
      {content.contentRenderer
        ? content.contentRenderer({ 
            sectionId: section, 
            bp, 
            boxId, 
            coords: cssCoordinateBPs[bp] 
          })
        : null}
    </Box>
  );
}
