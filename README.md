# @mcpab/gridcss

A comprehensive TypeScript library for creating responsive CSS Grid layouts with transformation support, multiple UI framework integrations, and robust error handling. Designed for complex grid-based user interfaces with precise positioning and responsive behavior.

[![npm version](https://badge.fury.io/js/@mcpab%2Fgridcss.svg)](https://www.npmjs.com/package/@mcpab/gridcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Key Features

- **🎯 Responsive CSS Grid Generation**: Multi-breakpoint layout definitions with automatic responsive behavior
- **🔧 Box Transformations**: Powerful positioning, alignment, and stacking operations
- **🎨 UI Framework Integration**: Built-in Material-UI components with extensible architecture
- **🛡️ Type Safety**: Full TypeScript support with comprehensive type definitions
- **🔍 Error Handling**: Detailed diagnostics and graceful error recovery
- **📦 Modular Architecture**: Clean API with optional submodules for specific needs

## 📦 Installation

```bash
pnpm add github:mcpab/mcpab-gridCSS#v0.1.0 <-- or latest tag
```

For Material-UI integration:

```bash
npm install @mcpab/gridcss @mui/material @mui/system
```

## 🚀 Quick Start

### Basic Layout Processing

```typescript
import { CSSLayout } from "@mcpab/gridcss";

// Define your layout with transformations
const layoutWithTxExample: LayoutWithTx<
  "header" | "main",
  "block_1" | "block_2"
> = {
  sections: {
    header: {
      gridBoxes: {
        xs: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 100, y: 50 },
            _normalized: "GridBox",
          },
        },
        md: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 200, y: 50 },
            _normalized: "GridBox",
          },
        },
        lg: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 300, y: 50 },
            _normalized: "GridBox",
          },
        },
        sm: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 150, y: 50 },
            _normalized: "GridBox",
          },
        },
        xl: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 400, y: 50 },
            _normalized: "GridBox",
          },
        },
      } as BPSGridBoxes<"block_1" | "block_2">,
      transformations: {
        xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg: [{ stackHorizontally: { gap: 30 } }],
        sm: [{ stackHorizontally: { gap: 15 } }],
        xl: [{ stackHorizontally: { gap: 40 } }],
      },
    },
    main: {
      gridBoxes: {
        xs: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 100, y: 50 },
            _normalized: "GridBox",
          },
        },
        md: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 200, y: 50 },
            _normalized: "GridBox",
          },
        },
        lg: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 300, y: 50 },
            _normalized: "GridBox",
          },
        },
        sm: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 150, y: 50 },
            _normalized: "GridBox",
          },
        },
        xl: {
          block_1: {
            origin: { x: 0, y: 0 },
            diagonal: { x: 400, y: 50 },
            _normalized: "GridBox",
          },
        },
      } as BPSGridBoxes<"block_1" | "block_2">,
      transformations: {
        xs: [{ stackHorizontally: {} }],
        md: [{ stackHorizontally: { gap: 20 } }],
        lg: [{ stackHorizontally: { gap: 30 } }],
        sm: [{ stackHorizontally: { gap: 15 } }],
        xl: [{ stackHorizontally: { gap: 40 } }],
      },
    },
  },
  transformations: {
    xs: [{ stackHorizontally: {} }],
    md: [{ stackHorizontally: { gap: 20 } }],
    lg: [{ stackHorizontally: { gap: 30 } }],
    sm: [{ stackHorizontally: { gap: 15 } }],
    xl: [{ stackHorizontally: { gap: 40 } }],
  },
};
// Process layout into CSS Grid coordinates
const result = CSSLayout({
  layoutWithTx: myLayout,
  diagnostics: [],
  gridDiagnostic: { overlapPolicy: "warn" },
});
```

### Material-UI Integration

```tsx
import { GridCssMuiRenderer } from "@mcpab/gridcss/mui";

function MyGridLayout() {
  const [diagnostics, setDiagnostics] = useState([]);

  return (
    <GridCssMuiRenderer
      layoutAbsolute={result}
      diagnostics={diagnostics}
      layoutRendering={{
        header: {
          xs: {
            myBox: {
              contentRenderer: ({ boxId, coords }) => <div>Header Content</div>,
              view: {
                alignSelf: "center",
                justifySelf: "stretch",
              },
            },
          },
        },
      }}
      gridOptionsOverride={{
        gap: "16px",
        justifyItems: "stretch",
      }}
    />
  );
}
```

## 📖 Core Concepts

### Layout Structure

The library uses a hierarchical structure:

```
Layout
├── Sections (logical groupings)
│   └── Boxes (individual elements)
└── Transformations (positioning rules)
    └── Per-breakpoint rules
```

### Transformation Pipeline

1. **Layout with Transformations** → Apply positioning rules
2. **Section Local Coordinates** → Calculate relative positions
3. **Section Bounds** → Determine bounding rectangles
4. **Absolute Coordinates** → Convert to CSS Grid coordinates

### Responsive Breakpoints

Built-in support for standard responsive breakpoints:

- `xs`: Extra small screens
- `sm`: Small screens (≥600px)
- `md`: Medium screens (≥900px)
- `lg`: Large screens (≥1200px)
- `xl`: Extra large screens (≥1536px)

## 🔧 Available Transformations

### Positioning

```typescript
{ moveTo: { box: 'myBox', position: { x: 2, y: 3 } } }
{ moveBy: { box: 'myBox', offset: { x: 1, y: -1 } } }
```

### Alignment

```typescript
{ alignToX: { box: 'myBox', target: 'otherBox' } }
{ alignToY: { boxes: ['box1', 'box2'], coordinate: 5 } }
{ alignAllToX: { boxes: ['box1', 'box2', 'box3'], coordinate: 2 } }
```

### Stacking

```typescript
{ stackVertically: { boxes: ['header', 'content', 'footer'], spacing: 1 } }
{ stackHorizontally: { boxes: ['nav', 'main', 'aside'] } }
```

## 🎨 Material-UI Integration

### Custom Node Rendering

```tsx
import { getNodeSxProps, getNodeDomProps } from "@mcpab/gridcss/mui";

const customRenderer = ({ boxId, coords, sectionId }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>Content for {boxId}</CardContent>
    </Card>
  );
};
```

### Grid Options

```typescript
const gridOptions = {
  gap: "24px",
  justifyItems: "center",
  alignItems: "stretch",
  overflow: "auto",
  implicitColumnUnits: { value: 1, unit: "fr" },
};
```

## 📚 API Reference

### Core Functions

#### `CSSLayout(props)`

Main transformation pipeline function.

**Parameters:**

- `layoutWithTx`: Layout definition with transformations
- `diagnostics`: Array to collect errors and warnings
- `gridDiagnostic?`: Validation options (overlap policy, breakpoints)

**Returns:** `LayoutAbsolute` with CSS Grid coordinates

### Material-UI Components

#### `<GridCssMuiRenderer />`

Main grid renderer component.

**Props:**

- `layoutAbsolute`: Processed layout with absolute coordinates
- `diagnostics`: Error/warning collection array
- `layoutRendering?`: Custom content renderers per box
- `gridOptionsOverride?`: Grid behavior configuration

#### `<DefaultNodeRender />`

Default node rendering component with CSS Grid positioning.

### Utility Functions

#### `getNodeSxProps(view?)`

Converts view options to MUI sx props.

#### `getNodeDomProps(view?)`

Converts view options to DOM attributes.

## 🔍 Error Handling

The library provides comprehensive error detection:

```typescript
const diagnostics = [];
const result = CSSLayout({
  layoutWithTx: myLayout,
  diagnostics,
  gridDiagnostic: {
    overlapPolicy: "error", // 'allow' | 'warn' | 'error'
    breakpoints: ["xs", "md", "xl"], // specific breakpoints to validate
  },
});

// Check for issues
diagnostics.forEach((diagnostic) => {
  console.log(`${diagnostic.level}: ${diagnostic.message}`);
});
```

## 🛠️ Advanced Usage

### Custom Transformations

```typescript
import { transformBoxMove } from "@mcpab/gridcss";

// Create custom transformation factory
let transformations: Array<BoxMovesProps<"block_1" | "aside">> = [
  {
    moveTo: {
      from: {
        boxId: "aside",
        anchor: "center",
      },
      to: {
        boxId: "block_1",
        anchor: "topLeft",
      },
    },
  },
  {
    moveBy: {
      from: {
        boxId: "aside",
      },
      by: {
        x: 100,
        y: 200,
      },
    },
  },
  {
    moveTo: {
      from: {
        boxId: "aside",
        anchor: "center",
      },
      to: {
        boxId: "block_1",
        anchor: "topLeft",
      },
    },
  },
];
```

### Template System

```typescript
import { layoutsCatalog } from "@mcpab/gridcss/templates";

// Use predefined layouts
const dashboardLayout = layoutsCatalog.dashboard;
const blogLayout = layoutsCatalog.blog;
```

## 🧪 Examples

Check out the `/examples` directory for complete implementation examples:

- **Basic Grid Layout**: Simple responsive layout
- **Dashboard Interface**: Complex multi-section dashboard
- **Blog Layout**: Article layout with sidebar
- **Custom Transformations**: Advanced positioning examples

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/mcpab-gridcss.git
cd mcpab-gridcss

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build package
pnpm build

# Run examples
pnpm dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://mcpab-gridcss.docs.com)
- [Examples](https://mcpab-gridcss-examples.com)
- [NPM Package](https://www.npmjs.com/package/@mcpab/gridcss)
- [GitHub Issues](https://github.com/your-username/mcpab-gridcss/issues)

## 🙏 Acknowledgments

Built with:

- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Material-UI](https://mui.com/) for React component integration
- [tsup](https://tsup.egoist.dev/) for fast builds
- [Vitest](https://vitest.dev/) for testing

---

Made with ❤️ for the CSS Grid community
