import { getLayoutFromCatalog } from '../../../templates/layoutsCatalog';
import { GridBox } from '../../box/gridBoxTypes';
import { BREAKPOINTS } from '../../breakpoints';
import { DiagnosticEntry, GRID_ERROR_CODE } from '../../gridErrorShape';
import { getDefaultTheme } from '../../layoutTheme/defaultLayoutTheme';
import { layoutSectionToBounds } from '../layoutSectionToBounds';
import { layoutToTx } from '../layoutToTx';
import { layoutTxToSectionLocal } from '../layoutTxToSectionLocal';

function computeBoundsFromBoxes(boxesAtBp: Record<string, GridBox | undefined>) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  let found = false;

  for (const k of Object.keys(boxesAtBp)) {
    const b = boxesAtBp[k];
    if (!b) continue;
    minX = Math.min(minX, b.origin.x);
    minY = Math.min(minY, b.origin.y);
    maxX = Math.max(maxX, b.origin.x + b.diagonal.x);
    maxY = Math.max(maxY, b.origin.y + b.diagonal.y);
    found = true;
  }

  if (!found) return { origin: { x: 0, y: 0 }, diagonal: { x: 0, y: 0 }, found: false };

  return {
    origin: { x: minX, y: minY },
    diagonal: { x: maxX - minX, y: maxY - minY },
    found: true,
  };
}

describe('layoutSectionToBounds', () => {
  test('computes correct bounding boxes for a real layout section (xs + md spot-check)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];

    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));
    expect(diagnostics.length).toBe(0);

    const local = layoutTxToSectionLocal(tx, diagnostics);
    const bounds = layoutSectionToBounds(local, diagnostics);

    // Spot-check two breakpoints for one section with multiple boxes
    for (const bp of ['xs', 'md'] as const) {
      const boxesAtBp = local.sections.main[bp] as Record<string, GridBox | undefined>;
      const expected = computeBoundsFromBoxes(boxesAtBp);

      const actual = bounds.boundingBoxes[bp].main;
      expect(actual).toBeTruthy();

      expect(actual.origin).toEqual(expected.origin);
      expect(actual.diagonal).toEqual(expected.diagonal);
    }
  });

  test('empty section at a breakpoint yields (0,0)-(0,0) bounding box and a diagnostic', () => {
    const diagnostics: DiagnosticEntry[] = [];

    // Minimal synthetic LayoutSectionLocal with an empty section
    const local = {
      sections: {
        main: {
          xs: {},
          sm: {},
          md: {},
          lg: {},
          xl: {},
        },
      },
      transformations: undefined,
    } as any; // keep this test focused on runtime behavior, not typing ceremony

    const out = layoutSectionToBounds(local, diagnostics);

    for (const bp of BREAKPOINTS) {
      expect(out.boundingBoxes[bp].main.origin).toEqual({ x: 0, y: 0 });
      expect(out.boundingBoxes[bp].main.diagonal).toEqual({ x: 0, y: 0 });
    }

    // Confirm we recorded at least one MISSING_BOX issue
    expect(diagnostics.some((d: any) => d.issue?.code === GRID_ERROR_CODE.MISSING_BOX)).toBe(true);
  });

  test('stress: bounding box contains every child box (xs) for mixedDensityShowcase footer', () => {
    const layout = getLayoutFromCatalog('secondary', 'mixedDensityShowcase');
    const diagnostics: DiagnosticEntry[] = [];

    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));
    const local = layoutTxToSectionLocal(tx, diagnostics);
    const out = layoutSectionToBounds(local, diagnostics);

    const bb = out.boundingBoxes.xs.footer;
    const boxesAtBp = local.sections.footer.xs as Record<string, GridBox | undefined>;

    for (const k of Object.keys(boxesAtBp)) {
      const b = boxesAtBp[k];
      if (!b) continue;

      // Containment check in your coordinate system:
      // child's origin should be >= bb.origin
      expect(b.origin.x).toBeGreaterThanOrEqual(bb.origin.x);
      expect(b.origin.y).toBeGreaterThanOrEqual(bb.origin.y);

      // child's far corner should be <= bb far corner
      const bMaxX = b.origin.x + b.diagonal.x;
      const bMaxY = b.origin.y + b.diagonal.y;
      const bbMaxX = bb.origin.x + bb.diagonal.x;
      const bbMaxY = bb.origin.y + bb.diagonal.y;

      expect(bMaxX).toBeLessThanOrEqual(bbMaxX);
      expect(bMaxY).toBeLessThanOrEqual(bbMaxY);
    }
  });

  test('stress: bounding box works with negative coordinates (xs)', () => {
    const diagnostics: DiagnosticEntry[] = [];

    const local = {
      sections: {
        main: {
          xs: {
            block_1: { origin: { x: -5, y: 2 }, diagonal: { x: 3, y: 4 }, _normalized: 'GridBox' },
            block_2: { origin: { x: 1, y: -7 }, diagonal: { x: 2, y: 2 }, _normalized: 'GridBox' },
          },
          sm: {},
          md: {},
          lg: {},
          xl: {},
        },
      },
      transformations: undefined,
    } as any;

    const out = layoutSectionToBounds(local, diagnostics);

    const bb = out.boundingBoxes.xs.main;
    expect(bb.origin).toEqual({ x: -5, y: -7 });

    // maxX = max(-5+3= -2, 1+2=3) => 3 ; minX=-5 => dx=8
    // maxY = max(2+4=6, -7+2=-5) => 6 ; minY=-7 => dy=13
    expect(bb.diagonal).toEqual({ x: 8, y: 13 });
  });

  test('stress: bounds diverge per breakpoint when only xs is transformed (compare far corner)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));

    tx.sections.main.transformations = {
      xs: [
        {
          moveTo: {
            from: { boxId: 'block_2', anchor: 'bottomLeft' },
            to: { x: 100, y: 100 },
          },
        },
      ],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    } as const;

    const local = layoutTxToSectionLocal(tx, diagnostics);
    const out = layoutSectionToBounds(local, diagnostics);

    const bbXs = out.boundingBoxes.xs.main;
    const bbMd = out.boundingBoxes.md.main;

    const xsMax = {
      x: bbXs.origin.x + bbXs.diagonal.x,
      y: bbXs.origin.y + bbXs.diagonal.y,
    };
    const mdMax = {
      x: bbMd.origin.x + bbMd.diagonal.x,
      y: bbMd.origin.y + bbMd.diagonal.y,
    };

    // xs should extend at least as far as md in both axes
    expect(xsMax.x).toBeGreaterThanOrEqual(mdMax.x);
    expect(xsMax.y).toBeGreaterThanOrEqual(mdMax.y);

    // and because we moved a box far away, at least one axis should strictly increase
    expect(xsMax.x > mdMax.x || xsMax.y > mdMax.y).toBe(true);
  });
});
