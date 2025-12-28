import { getLayoutFromCatalog } from '../../../templates/layoutsCatalog';
import { BREAKPOINTS } from '../../breakpoints';
import { DiagnosticEntry, GRID_ERROR_CODE } from '../../gridErrorShape';
import { CSSCoordinates } from '../../gridNodeTypes';
import { getDefaultTheme } from '../../layoutTheme/defaultLayoutTheme';
import { layoutSectionBtoAbsolute } from '../layoutSectionBtoAbsolute';
import { layoutSectionToBounds } from '../layoutSectionToBounds';
import { layoutToTx } from '../layoutToTx';
import { layoutTxToSectionLocal } from '../layoutTxToSectionLocal';

export function recordKeys<K extends string, V>(obj: Record<K, V>): K[] {
  return Object.keys(obj) as K[];
}

describe('layoutSectionBtoAbsolute (stress)', () => {
  test('invariant: all grid lines are >= 1 after normalization (all bps)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];

    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));
    const local = layoutTxToSectionLocal(tx, diagnostics);
    const bounds = layoutSectionToBounds(local, diagnostics);
    const abs = layoutSectionBtoAbsolute(bounds, diagnostics);
    const sectionIds = recordKeys(abs.sections);
    for (const bp of BREAKPOINTS) {
      for (const sectionId of sectionIds) {
        const coords = abs.sections[sectionId].coordinates[bp] as
          | Partial<Record<string, CSSCoordinates>>
          | undefined;
        if (!coords) continue;

        for (const boxId of Object.keys(coords)) {
          const c = coords[boxId];
          if (!c) continue;
          expect(c.gridColumnStart).toBeGreaterThanOrEqual(1);
          expect(c.gridRowStart).toBeGreaterThanOrEqual(1);
          expect(c.gridColumnEnd).toBeGreaterThanOrEqual(1);
          expect(c.gridRowEnd).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  test('invariant: every box fits inside gridDimensions (track count vs end lines)', () => {
    const layout = getLayoutFromCatalog('secondary', 'mixedDensityShowcase');
    const diagnostics: DiagnosticEntry[] = [];

    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));
    const local = layoutTxToSectionLocal(tx, diagnostics);
    const bounds = layoutSectionToBounds(local, diagnostics);
    const abs = layoutSectionBtoAbsolute(bounds, diagnostics);

    for (const bp of BREAKPOINTS) {
      const cols = abs.gridDimensions.columns[bp];
      const rows = abs.gridDimensions.rows[bp];
      const sectionIds = recordKeys(abs.sections);
      for (const sectionId of sectionIds) {
        const coords = abs.sections[sectionId].coordinates[bp] as
          | Partial<Record<string, CSSCoordinates>>
          | undefined;
        if (!coords) continue;

        // end lines should be <= tracks + 1
        for (const boxId of Object.keys(coords)) {
          const c = coords[boxId];
          if (!c) continue;

          expect(c.gridColumnStart).toBeLessThanOrEqual(cols + 1);
          expect(c.gridColumnEnd).toBeLessThanOrEqual(cols + 1);
          expect(c.gridRowStart).toBeLessThanOrEqual(rows + 1);
          expect(c.gridRowEnd).toBeLessThanOrEqual(rows + 1);
        }
      }
    }
  });

  test('stress: section-level transform moves a whole section without changing internal relative offsets', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];

    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));
    const local = layoutTxToSectionLocal(tx, diagnostics);
    const bounds = layoutSectionToBounds(local, diagnostics);

    // Move the MAIN SECTION bounding box only at xs
    bounds.transformations = {
      xs: [
        {
          moveBy: {
            from: { boxId: 'main' as any }, // sectionIDs are NodeID
            by: { x: 20, y: 30 },
          },
        },
      ],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    } as const;

    const abs = layoutSectionBtoAbsolute(bounds, diagnostics);

    const xsCoords = abs.sections.main.coordinates.xs;
    expect(xsCoords).toBeTruthy();

    // Compare relative deltas between block_1 and block_2 before/after:
    // Since abs only output is after, we assert within abs that relative offsets are consistent.
    const b1 = xsCoords['block_1']!;
    const b2 = xsCoords['block_2']!;

    const relStartDx = b2.gridColumnStart - b1.gridColumnStart;
    const relStartDy = b2.gridRowStart - b1.gridRowStart;

    // Re-run without section move and compare relative deltas (should match)
    const diagnostics2: DiagnosticEntry[] = [];
    const tx2 = layoutToTx(layout, diagnostics2, getDefaultTheme(layout));
    const local2 = layoutTxToSectionLocal(tx2, diagnostics2);
    const bounds2 = layoutSectionToBounds(local2, diagnostics2);
    const abs2 = layoutSectionBtoAbsolute(bounds2, diagnostics2);

    const xsCoords2 = abs2.sections.main.coordinates.xs;
    const b1b = xsCoords2['block_1']!;
    const b2b = xsCoords2['block_2']!;

    expect(relStartDx).toBe(b2b.gridColumnStart - b1b.gridColumnStart);
    expect(relStartDy).toBe(b2b.gridRowStart - b1b.gridRowStart);
  });

  test('stress: negative section transform triggers normalization warning (if any box goes < 1)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];

    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));
    const local = layoutTxToSectionLocal(tx, diagnostics);
    const bounds = layoutSectionToBounds(local, diagnostics);

    // Move main section far negative at xs to force normalization
    bounds.transformations = {
      xs: [
        {
          moveBy: {
            from: { boxId: 'main' as any },
            by: { x: -50, y: -50 },
          },
        },
      ],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    } as const;

    const abs = layoutSectionBtoAbsolute(bounds, diagnostics);

    // After normalization, starts should still be >= 1 (already checked elsewhere),
    // here we assert we logged a normalization warning if that’s your policy.
    expect(
      diagnostics.some(
        (d: any) => d.issue?.code === GRID_ERROR_CODE.GRID_NORMALIZED_TO_POSITIVE_LINES,
      ),
    ).toBe(true);

    // And dimensions should be at least 1 track
    expect(abs.gridDimensions.columns.xs).toBeGreaterThanOrEqual(1);
    expect(abs.gridDimensions.rows.xs).toBeGreaterThanOrEqual(1);
  });
});
