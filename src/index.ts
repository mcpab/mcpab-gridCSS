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
 *   layout: myLayout,
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
export * from './boxDesign';
export * from "./boxLayout";    

// Box positioning and transformation functions
export * from './boxTransformations';

// Grid system types and definitions
export * from './box';

export * from './gridNodeTypes';

export * from './gridOptionsTypes';

export * from './nodeViewOptions';

// Template and identifier types
export * from './templates';

// Breakpoint system
export * from './breakpoints';
 
// Error handling and diagnostics
export * from './gridErrorShape';

// Geometry utilities
export * from './geometry';
 
// CSS value utilities
  export * from './cssStringify';

// Layout themes
export * from './layoutTheme';

// General utilities
export * from './utils';

// Framework integrations (re-export from submodules)
export * from './integration/mui';

/**
 * Submodule exports for specific integrations
 * 
 * Import these directly for framework-specific functionality:
 * 
 * - `'mcpab-gridcss/mui'` - Material-UI integration
 * - `'mcpab-gridcss/geometry'` - Advanced geometry operations
 * - `'mcpab-gridcss/templates'` - Layout template utilities
 */