import { q as GridNodeViewOptions, S as SectionIDs, B as BlocksIDs, s as BPs, o as CSSCoordinates, N as NodeRenderConfig } from './GridCssMuiRenderer-DXP7Idyx.cjs';
export { F as GridCssMuiRenderer, y as GridCssMuiRendererProps, z as partialRecordKeys, A as recordKeys, E as typedKeys } from './GridCssMuiRenderer-DXP7Idyx.cjs';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { Theme } from '@mui/material/styles';
import { SystemStyleObject } from '@mui/system';
import React from 'react';

type MuiTheme = Theme;
type MuiSystemStyleObject = SystemStyleObject<MuiTheme>;

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
declare function getNodeSxProps(view?: GridNodeViewOptions): MuiSystemStyleObject;
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
declare function getNodeDomProps(view?: GridNodeViewOptions): React.HTMLAttributes<HTMLElement> & DataAttributes;
/**
 * Props for the DefaultNodeRender component
 *
 * @template sectionIDs - Union type of valid section identifiers
 * @template blockIDs - Union type of valid block/box identifiers
 */
type DefaultNodeRenderProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
    section: sectionIDs;
    boxId: blockIDs;
    cssCoordinateBPs: BPs<CSSCoordinates>;
    content: NodeRenderConfig<sectionIDs, blockIDs>;
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
declare function DefaultNodeRender<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>({ section, boxId, cssCoordinateBPs, content, }: DefaultNodeRenderProps<sectionIDs, blockIDs>): react_jsx_runtime.JSX.Element;

export { DefaultNodeRender, getNodeDomProps, getNodeSxProps };
