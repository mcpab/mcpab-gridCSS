import { renderToStaticMarkup } from "react-dom/server";
import { LayoutAbsolute } from "../../../core/boxLayout/boxLayoutTypes";
import { BREAKPOINTS } from "../../../core/breakpoints";
import { DiagnosticEntry, GRID_ERROR_CODE } from "../../../core/gridErrorShape";
import { GridCssMuiRenderer } from "../GridCssMuiRenderer";
import * as React from "react";
 

// IMPORTANT: mock DefaultNodeRender BEFORE importing GridCssMuiRenderer
const defaultNodeRenderMock = jest.fn((props: any) => {
  // Return something SSR-renderable
  return React.createElement("div", {
    "data-testid": "node",
    "data-section": String(props.section),
    "data-box": String(props.boxId),
    "data-xs": `${props.cssCoordinateBPs.xs.gridColumnStart},${props.cssCoordinateBPs.xs.gridColumnEnd},${props.cssCoordinateBPs.xs.gridRowStart},${props.cssCoordinateBPs.xs.gridRowEnd}`,
    "data-md": `${props.cssCoordinateBPs.md.gridColumnStart},${props.cssCoordinateBPs.md.gridColumnEnd},${props.cssCoordinateBPs.md.gridRowStart},${props.cssCoordinateBPs.md.gridRowEnd}`,
  });
});

jest.mock("../DefaultNodeRender", () => ({
  DefaultNodeRender: (props: any) => defaultNodeRenderMock(props),
}));

// Now import the renderer (after mock)
 
type BP = (typeof BREAKPOINTS)[number];
type CSSCoordinates = {
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
};

function mkAbs(): LayoutAbsolute<"main" | "footer", "block_1" | "block_2"> {
  const emptyBp = {} as Partial<Record<"block_1" | "block_2", CSSCoordinates>>;

  return {
    gridDimensions: {
      rows: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
      columns: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    sections: {
      main: {
        coordinates: {
          xs: {
            block_1: { gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 2 },
            block_2: { gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 },
          },
          sm: emptyBp,
          md: {
            block_1: { gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2 },
            block_2: { gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 2, gridRowEnd: 3 },
          },
          lg: emptyBp,
          xl: emptyBp,
        },
      },
      footer: {
        coordinates: {
          xs: {
            block_1: { gridColumnStart: 1, gridColumnEnd: 3, gridRowStart: 3, gridRowEnd: 4 },
          },
          sm: {} as any,
          md: {} as any,
          lg: {} as any,
          xl: {} as any,
        },
      },
    },
  };
}

describe("GridCssMuiRenderer (SSR/Jest-only)", () => {
  beforeEach(() => {
    defaultNodeRenderMock.mockClear();
  });

  test("renders one node per (section, box) pair", () => {
    const layoutAbsolute = mkAbs();
    const diagnostics: DiagnosticEntry[] = [];

    const element = React.createElement(GridCssMuiRenderer as any, {
      layoutAbsolute,
      diagnostics,
      gridOptionsOverride: {},
    });

    renderToStaticMarkup(element);

    // main: block_1, block_2 ; footer: block_1 => 3 nodes total
    expect(defaultNodeRenderMock).toHaveBeenCalledTimes(3);

    const ids = defaultNodeRenderMock.mock.calls.map(([props]) => {
      return `${props.section}::${props.boxId}`;
    });

    expect(new Set(ids).size).toBe(3);
  });

  test("merges bp coordinates into one node (xs + md)", () => {
    const layoutAbsolute = mkAbs();
    const diagnostics: DiagnosticEntry[] = [];

    renderToStaticMarkup(
      React.createElement(GridCssMuiRenderer as any, {
        layoutAbsolute,
        diagnostics,
        gridOptionsOverride: {},
      }),
    );

    const call = defaultNodeRenderMock.mock.calls.find(([props]) => {
      return props.section === "main" && props.boxId === "block_1";
    });

    expect(call).toBeTruthy();
    const props = call![0];

    expect(props.cssCoordinateBPs.xs).toEqual({
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 2,
    });

    expect(props.cssCoordinateBPs.md).toEqual({
      gridColumnStart: 1,
      gridColumnEnd: 3,
      gridRowStart: 1,
      gridRowEnd: 2,
    });
  });

  test("missing md coordinate triggers fallback + diagnostic", () => {
    const layoutAbsolute = mkAbs();
    delete (layoutAbsolute.sections.main.coordinates.md as any).block_2;

    const diagnostics: DiagnosticEntry[] = [];

    renderToStaticMarkup(
      React.createElement(GridCssMuiRenderer as any, {
        layoutAbsolute,
        diagnostics,
        gridOptionsOverride: {},
      }),
    );

    expect(
      diagnostics.some((d: any) => d.issue?.code === GRID_ERROR_CODE.MISSING_COORDINATES),
    ).toBe(true);

    const call = defaultNodeRenderMock.mock.calls.find(([props]) => {
      return props.section === "main" && props.boxId === "block_2";
    });

    const props = call![0];
    expect(props.cssCoordinateBPs.md).toEqual({
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 2,
    });
  });

  test("layoutRendering override is selected for a specific (section,bp,box)", () => {
    const layoutAbsolute = mkAbs();
    const diagnostics: DiagnosticEntry[] = [];

    const layoutRendering: any = {
      main: {
        xs: {
          block_1: {
            view: { zIndex: 999 },
            contentRenderer: () => React.createElement("span", null, "X"),
          },
        },
      },
    };

    renderToStaticMarkup(
      React.createElement(GridCssMuiRenderer as any, {
        layoutAbsolute,
        diagnostics,
        layoutRendering,
        gridOptionsOverride: {},
      }),
    );

    const call = defaultNodeRenderMock.mock.calls.find(([props]) => {
      return props.section === "main" && props.boxId === "block_1";
    });

    const props = call![0];
    expect(props.content.view).toEqual({ zIndex: 999 });
    expect(typeof props.content.contentRenderer).toBe("function");
  });
});
