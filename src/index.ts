/**
 * CSS Grid Layout System
 * 
 * A comprehensive TypeScript library for creating responsive CSS Grid layouts
 * with transformation support, multiple UI framework integrations, and robust
 * error handling. Designed for complex grid-based user interfaces with
 * precise positioning and responsive behavior.
 * 
 * ## Key Features
 * 
 * - **Responsive CSS Grid Generation**: Multi-breakpoint layout definitions
 * - **Box Transformations**: Positioning, alignment, and stacking operations  
 * - **UI Framework Integration**: Material-UI components with more planned
 * - **Type Safety**: Full TypeScript support with comprehensive type definitions
 * - **Error Handling**: Detailed diagnostics and graceful error recovery
 * - **Flexible Architecture**: Modular design supporting custom extensions
 * 
 * ## Core Modules
 * 
 * - `boxDesign`: Main transformation pipeline and layout processing
 * - `boxLayout`: Layout structure definitions and configuration types
 * - `boxTransformations`: Box positioning and alignment transformations
 * - `integration`: UI framework integrations (MUI, etc.)
 * - `geometry`: Coordinate mathematics and spatial operations
 * - `templates`: Layout templates and identifier management
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { CSSLayout } from 'mcpab-gridcss';
 * 
 * // Process a layout definition into CSS Grid coordinates
 * const result = CSSLayout({
 *   layoutWithTx: myLayout,
 *   diagnostics: [],
 *   gridDiagnostic: { overlapPolicy: 'warn' }
 * });
 * ```
 * 
 * For Material-UI integration:
 * 
 * ```typescript
 * import { GridCssMuiRenderer } from 'mcpab-gridcss/mui';
 * 
 * <GridCssMuiRenderer
 *   layoutAbsolute={result}
 *   diagnostics={diagnostics}
 * />
 * ```
 */

// Core transformation pipeline
export { CSSLayout } from './boxDesign';
export type { 
  LayoutAbsolute,
  LayoutWithTx,
  LayoutSectionBounds,
  LayoutSectionLocal,
  BoxTransformations,
  NodeRenderConfig,
  SectionsInLayoutWithTx,
  BlocksInLayoutWithTx,
  Layout
} from './boxLayout';

// Box positioning and transformation functions
export type {
  BoxMovesFunctions,
  BoxMovesProps,
  TransformationIDs,
  BoxMoveToProps
} from './boxTransformations';

// Grid system types and definitions
export type {
  GridBox
} from './box';

export type {
  CSSCoordinates
} from './gridNodeTypes';

export type {
  GridOptions
} from './gridOptionsTypes';

export type {
  GridNodeViewOptions
} from './nodeViewOptions';

// Template and identifier types
export type {
  SectionIDs,
  BlocksIDs,
  NodeID
} from './templates';

// Breakpoint system
export type {
  BPs
} from './breakpoints';
export { BREAKPOINTS } from './breakpoints';

// Error handling and diagnostics
export type {
  DiagnosticEntry
} from './gridErrorShape';
export { GRID_ERROR_CODE, makeError, makeWarning } from './gridErrorShape';

// Geometry utilities
export type {
  Coordinate
} from './geometry';
export {
  addCoordinates,
  subtractCoordinates
} from './geometry';

// CSS value utilities
export {
  gapValueToString,
  gridUnitValueToString
} from './cssStringify';

// Layout themes
export {
  getDefaultTheme 
} from './layoutTheme';

// General utilities
export {
  typedKeys
} from './utils';

// Framework integrations (re-export from submodules)
export type {
  GridCssMuiRendererProps
} from './integration/mui';

/**
 * Submodule exports for specific integrations
 * 
 * Import these directly for framework-specific functionality:
 * 
 * - `'mcpab-gridcss/mui'` - Material-UI integration
 * - `'mcpab-gridcss/geometry'` - Advanced geometry operations
 * - `'mcpab-gridcss/templates'` - Layout template utilities
 */