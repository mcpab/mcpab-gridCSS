import { LayoutAbsolute } from "../../boxLayout/boxLayoutTypes";
import { BREAKPOINTS } from "../../breakpoints";
import { DiagnosticEntry, GRID_ERROR_CODE } from "../../gridErrorShape";
import { CSSCoordinates } from "../../gridNodeTypes";
import { checkSectionsOverlap } from "../CSSlayout";

 
type BP = (typeof BREAKPOINTS)[number];

function mkCoords(
  gridColumnStart: number,
  gridColumnEnd: number,
  gridRowStart: number,
  gridRowEnd: number,
): CSSCoordinates {
  return { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd };
}

function mkEmptyDims() {
  return {
    rows: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    columns: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
  } as const;
}

describe("checkSectionsOverlap (stress)", () => {
  test("no overlaps => no diagnostics", () => {
    const layoutAbsolute: LayoutAbsolute<"main" | "footer", "block_1" | "block_2"> = {
      gridDimensions: mkEmptyDims(),
      sections: {
        main: {
          coordinates: {
            xs: {
              block_1: mkCoords(1, 2, 1, 2),
              block_2: mkCoords(3, 4, 1, 2), // disjoint columns
            },
            sm: {},
            md: {},
            lg: {},
            xl: {},
          },
        },
        footer: {
          coordinates: {
            xs: {
              block_1: mkCoords(1, 2, 3, 4), // disjoint rows
            },
            sm: {},
            md: {},
            lg: {},
            xl: {},
          },
        },
      },
    };

    const diagnostics: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics, "warn", ["xs"]);
    expect(diagnostics.length).toBe(0);
  });

  test("simple overlap => emits warning with correct bp and code", () => {
    const layoutAbsolute: LayoutAbsolute<"main", "block_1" | "block_2"> = {
      gridDimensions: mkEmptyDims(),
      sections: {
        main: {
          coordinates: {
            xs: {
              block_1: mkCoords(1, 3, 1, 3),
              block_2: mkCoords(2, 4, 2, 4), // overlaps
            },
            sm: {},
            md: {},
            lg: {},
            xl: {},
          },
        },
      },
    };

    const diagnostics: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics, "warn", ["xs"]);

    expect(
      diagnostics.some(
        (d: any) =>
          d.issue?.code === GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED &&
          d.origin === "CSSLayout" &&
          d.issue?.details?.bp === "xs",
      ),
    ).toBe(true);
  });

  test("policy=error => emits error (not warning) on overlap", () => {
    const layoutAbsolute: LayoutAbsolute<"main", "block_1" | "block_2"> = {
      gridDimensions: mkEmptyDims(),
      sections: {
        main: {
          coordinates: {
            xs: {
              block_1: mkCoords(1, 3, 1, 3),
              block_2: mkCoords(2, 4, 2, 4), // overlaps
            },
            sm: {},
            md: {},
            lg: {},
            xl: {},
          },
        },
      },
    };

    const diagnostics: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics, "error", ["xs"]);

    // Adapt if your DiagnosticEntry shape differs; this assumes makeError sets severity="error"
    expect(diagnostics.some((d: any) => d.severity === "error")).toBe(true);
    expect(diagnostics.some((d: any) => d.issue?.code === GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED)).toBe(
      true,
    );
  });

  test("touching edges is NOT overlap (end is exclusive)", () => {
    const layoutAbsolute: LayoutAbsolute<"main", "block_1" | "block_2"> = {
      gridDimensions: mkEmptyDims(),
      sections: {
        main: {
          coordinates: {
            xs: {
              block_1: mkCoords(1, 3, 1, 3),
              block_2: mkCoords(3, 5, 1, 3), // touches at col line 3 only
            },
            sm: {},
            md: {},
            lg: {},
            xl: {},
          },
        },
      },
    };

    const diagnostics: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics, "warn", ["xs"]);
    expect(diagnostics.length).toBe(0);
  });

  test("breakpoint filtering: overlap exists only at xs; checking md yields none", () => {
    const layoutAbsolute: LayoutAbsolute<"main", "block_1" | "block_2"> = {
      gridDimensions: mkEmptyDims(),
      sections: {
        main: {
          coordinates: {
            xs: {
              block_1: mkCoords(1, 3, 1, 3),
              block_2: mkCoords(2, 4, 2, 4), // overlap at xs
            },
            md: {
              block_1: mkCoords(1, 3, 1, 3),
              block_2: mkCoords(4, 6, 1, 3), // no overlap at md
            },
            sm: {},
            lg: {},
            xl: {},
          },
        },
      },
    };

    const diagnostics: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics, "warn", ["md"]);
    expect(diagnostics.length).toBe(0);

    const diagnostics2: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics2, "warn", ["xs"]);
    expect(diagnostics2.some((d: any) => d.issue?.code === GRID_ERROR_CODE.OVERLAP_NOT_ALLOWED)).toBe(
      true,
    );
  });

  test("stress: many boxes overlap => emits multiple diagnostics with unique pairKey", () => {
    // 10 boxes all stacked on top of each other => nC2 overlaps
    const coords: Partial<Record<`block_${number}`, CSSCoordinates>> = {};
    for (let i = 1; i <= 10; i++) {
      coords[`block_${i}`] = mkCoords(1, 3, 1, 3);
    }

    const layoutAbsolute: LayoutAbsolute<"main", any> = {
      gridDimensions: mkEmptyDims(),
      sections: {
        main: {
          coordinates: {
            xs: coords,
            sm: {},
            md: {},
            lg: {},
            xl: {},
          },
        },
      },
    };

    const diagnostics: DiagnosticEntry[] = [];
    checkSectionsOverlap(layoutAbsolute, diagnostics, "warn", ["xs"]);

    // nC2 = 45 overlaps expected, unless you later dedupe
    expect(diagnostics.length).toBeGreaterThanOrEqual(45);

    const keys = diagnostics
      .map((d: any) => d.issue?.details?.pairKey)
      .filter(Boolean) as string[];

    // pair keys should be unique
    expect(new Set(keys).size).toBe(keys.length);
  });
});
