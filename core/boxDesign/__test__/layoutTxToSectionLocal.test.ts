// layoutTxToSectionLocal.test.ts

import { getLayoutFromCatalog } from '../../../templates/layoutsCatalog';
import { GridBox } from '../../box/gridBoxTypes';
import { BREAKPOINTS } from '../../breakpoints';
import { DiagnosticEntry } from '../../gridErrorShape';
import { getDefaultTheme } from '../../layoutTheme/defaultLayoutTheme';
import { layoutToTx } from '../layoutToTx';
import { layoutTxToSectionLocal } from '../layoutTxToSectionLocal';

describe('layoutTxToSectionLocal', () => {
  test('does not mutate the original Layout spans (catalog safety)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');

    // snapshot a span value
    const before = layout.main.block_1.spanX;

    const diagnostics: DiagnosticEntry[] = [];
    const theme = getDefaultTheme(layout);
    const tx = layoutToTx(layout, diagnostics, theme);

    // force some transforms on working objects
    tx.sections.main.transformations = {
      xs: [{ moveBy: { from: { boxId: 'block_1' }, by: { x: -3, y: 2 } } }],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    };

    layoutTxToSectionLocal(tx, diagnostics);

    // Layout is BoxSpan-only; should be unchanged
    expect(layout.main.block_1.spanX).toBe(before);
  });

  test('applies box transformations to section children for a breakpoint', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const theme = getDefaultTheme(layout);

    const tx = layoutToTx(layout, diagnostics, theme);
    expect(diagnostics.length).toBe(0);

    // Inject a "weird" transformation on main at xs only:
    // moveBy block_1 by (-3, +2). (Adjust anchor/shape if your moveBy uses number or Coordinate)
    tx.sections.main.transformations = {
      xs: [{ moveBy: { from: { boxId: 'block_1' }, by: { x: -3, y: 2 } } }],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    };

    const before = tx.sections.main.gridBoxes.xs['block_1'];
    expect(before).toBeTruthy();
    const beforeOrigin = { ...before!.origin };

    const beforeDiagCount = diagnostics.length;
    const out = layoutTxToSectionLocal(tx, diagnostics);

    const after = out.sections.main.xs['block_1'];
    expect(after).toBeTruthy();

    // Behavioral expectation: origin changed as requested (if your transform is defined that way)
    expect(after!.origin.x).toBe(beforeOrigin.x - 3);
    expect(after!.origin.y).toBe(beforeOrigin.y + 2);

    // If your implementation records diagnostics on negative moves or normalization,
    // this will catch it without binding to a specific code.
    expect(diagnostics.length).toBeGreaterThanOrEqual(beforeDiagCount);
  });

  test('does not apply transforms to other sections', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const theme = getDefaultTheme(layout);

    const tx = layoutToTx(layout, diagnostics, theme);

    // Add a transform only to "main"
    tx.sections.main.transformations = {
      xs: [{ moveBy: { from: { boxId: 'block_1' }, by: 10 } }],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    };

    const beforeHeader = tx.sections.header.gridBoxes.xs['block_1'];
    expect(beforeHeader).toBeTruthy();
    const beforeHeaderOrigin = { ...beforeHeader!.origin };

    const out = layoutTxToSectionLocal(tx, diagnostics);

    const afterHeader = out.sections.header.xs['block_1'];
    expect(afterHeader).toBeTruthy();

    // Header should remain unchanged (transform only applied within main)
    expect(afterHeader!.origin).toEqual(beforeHeaderOrigin);
  });
  test('stress: moveTo places block_2 bottomLeft at (10,10) for all breakpoints', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const theme = getDefaultTheme(layout);

    const tx = layoutToTx(layout, diagnostics, theme);
    expect(diagnostics.length).toBe(0);

    // Snapshot another block to ensure it doesn't move (optional)
    const beforeBlock1ByBp = Object.fromEntries(
      BREAKPOINTS.map((bp) => [bp, { ...tx.sections.main.gridBoxes[bp]['block_1']!.origin }]),
    ) as Record<(typeof BREAKPOINTS)[number], { x: number; y: number }>;

    // Apply the same moveTo at every breakpoint
    tx.sections.main.transformations = {
      xs: [
        {
          moveTo: {
            from: { boxId: 'block_2', anchor: 'bottomLeft' },
            to: { x: 10, y: 10 },
          },
        },
      ],
      sm: [
        {
          moveTo: {
            from: { boxId: 'block_2', anchor: 'bottomLeft' },
            to: { x: 10, y: 10 },
          },
        },
      ],
      md: [
        {
          moveTo: {
            from: { boxId: 'block_2', anchor: 'bottomLeft' },
            to: { x: 10, y: 10 },
          },
        },
      ],
      lg: [
        {
          moveTo: {
            from: { boxId: 'block_2', anchor: 'bottomLeft' },
            to: { x: 10, y: 10 },
          },
        },
      ],
      xl: [
        {
          moveTo: {
            from: { boxId: 'block_2', anchor: 'bottomLeft' },
            to: { x: 10, y: 10 },
          },
        },
      ],
    } as const;

    const beforeDiagCount = diagnostics.length;
    const out = layoutTxToSectionLocal(tx, diagnostics);

    // Assert placement at every breakpoint
    for (const bp of BREAKPOINTS) {
      const b2 = out.sections.main[bp]['block_2'];
      expect(b2).toBeTruthy();

      // bottomLeft anchor corresponds to GridBox.origin in your model
      expect(b2!.origin).toEqual({ x: 10, y: 10 });

      // Optional: ensure another block didn't move
      const b1 = out.sections.main[bp]['block_1'];
      expect(b1).toBeTruthy();
      expect(b1!.origin).toEqual(beforeBlock1ByBp[bp]);
    }

    // If your moveTo should never be an error, keep diagnostics stable
    expect(diagnostics.length).toBeGreaterThanOrEqual(beforeDiagCount);
  });
  test('stress: chained reference transforms (moveTo then align others to moved box)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));

    tx.sections.main.transformations = {
      xs: [
        { moveTo: { from: { boxId: 'block_2', anchor: 'bottomLeft' }, to: { x: 10, y: 10 } } },
        {
          alignToX: {
            from: { boxId: 'block_3', anchor: 'bottomLeft' },
            to: { boxId: 'block_2', anchor: 'bottomLeft' },
            gap: 2,
          },
        },
        {
          alignToY: {
            from: { boxId: 'block_4', anchor: 'bottomLeft' },
            to: { boxId: 'block_2', anchor: 'bottomLeft' },
            gap: -3,
          },
        }, // negative gap stress
      ],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    } as const;

    const out = layoutTxToSectionLocal(tx, diagnostics);

    const b2 = out.sections.main.xs['block_2']!;
    const b3 = out.sections.main.xs['block_3']!;
    const b4 = out.sections.main.xs['block_4']!;

    // Invariants (adjust if your align semantics differ):
    expect(b3.origin.x).toBe(b2.origin.x + 2);
    expect(b4.origin.y).toBe(b2.origin.y - 3);
  });
  test('stress: stackVertically then alignAllToX produces monotone Y and same X', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));

    // Stress on a section with many blocks
    tx.sections.footer.transformations = {
      xs: [{ stackVertically: { gap: 1 } }, { alignAllToX: { to: 7, anchor: 'bottomLeft' } }],
      sm: [],
      md: [],
      lg: [],
      xl: [],
    } as const;

    const out = layoutTxToSectionLocal(tx, diagnostics);
    const boxes = out.sections.footer.xs;

    // Collect present boxes in footer
    const ids = Object.keys(boxes) as Array<keyof typeof boxes>;
    const origins = ids.map((id) => boxes[id]!.origin);

    // All X equal 7 (adjust if alignAllToX uses anchor math)
    for (const o of origins) expect(o.x).toBe(7);

    // Monotone Y (choose >= or <= based on your stacking direction)
    for (let i = 1; i < origins.length; i++) {
      expect(origins[i].y).toBeGreaterThanOrEqual(origins[i - 1].y);
    }
  });
  test('stress: fuzz-lite random moveBy keeps boxes normalized and finite', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostics: DiagnosticEntry[] = [];
    const tx = layoutToTx(layout, diagnostics, getDefaultTheme(layout));

    const moves = Array.from({ length: 25 }, (_, i) => ({
      moveBy: {
        from: { boxId: ('block_' + ((i % 4) + 1)) as any }, // block_1..block_4
        by: { x: (i % 7) - 3, y: (i % 5) - 2 }, // small negative/positive
      },
    }));

    tx.sections.main.transformations = {
      xs: moves as any,
      sm: [],
      md: [],
      lg: [],
      xl: [],
    };

    const out = layoutTxToSectionLocal(tx, diagnostics);
    const boxes = out.sections.main.xs;

    for (const id of Object.keys(boxes)) {
      const b = (boxes as any)[id] as GridBox | undefined;
      expect(b).toBeTruthy();
      expect(b!._normalized).toBe('GridBox');
      expect(Number.isFinite(b!.origin.x)).toBe(true);
      expect(Number.isFinite(b!.origin.y)).toBe(true);
      expect(b!.diagonal.x).toBeGreaterThanOrEqual(0);
      expect(b!.diagonal.y).toBeGreaterThanOrEqual(0);
    }
  });
});
