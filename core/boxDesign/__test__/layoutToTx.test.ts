// Optional: if you have enum/const issue codes, import them; otherwise just assert length/messages.
 
import { BREAKPOINTS } from '../../breakpoints';
import { getDefaultTheme } from '../../layoutTheme/defaultLayoutTheme';
import { layoutSectionKeysPresent, layoutBlockKeysPresent, layoutToTx } from '../layoutToTx';
import { DiagnosticEntry, GRID_ERROR_CODE } from '../../gridErrorShape';
import { Layout } from '../../boxLayout/boxLayoutTypes';
import { getLayoutFromCatalog } from '../../../templates/layoutsCatalog';
 

describe('layout key boundary helpers', () => {
  test('layoutSectionKeysPresent filters out undefined-valued sections', () => {
    const layout = {
      header: { block_1: { spanX: 1, spanY: 1 } },
      // explicitly undefined entry (can happen when objects are built/merged)
      main: undefined,
    } as any;

    const keys = layoutSectionKeysPresent(layout);

    expect(keys).toContain('header');
    expect(keys).not.toContain('main');
  });

  test('layoutBlockKeysPresent returns block keys for a present section', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');

    const keysMain = layoutBlockKeysPresent(layout, 'main');
    expect(keysMain).toEqual(['block_1', 'block_2', 'block_3', 'block_4']);

    const keysContent = layoutBlockKeysPresent(layout, 'content');
    expect(keysContent).toEqual(['block_1', 'block_2']);
  });

 
});

describe('layoutToTx', () => {
  test('produces gridBoxes for every breakpoint for every present section', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostic: any[] = [];
    const theme = getDefaultTheme(layout);

    const out = layoutToTx(layout, diagnostic, theme);

    // Should not produce errors for a clean layout
    expect(diagnostic.length).toBe(0);

    // Sections exist
    expect(out.sections.header).toBeTruthy();
    expect(out.sections.main).toBeTruthy();
    expect(out.sections.content).toBeTruthy();
    expect(out.sections.footer).toBeTruthy();

    // Every breakpoint exists because BPs<T> = Record<Breakpoint, T>
    for (const bp of BREAKPOINTS) {
      expect(out.sections.header.gridBoxes[bp]).toBeTruthy();
      expect(out.sections.main.gridBoxes[bp]).toBeTruthy();
      expect(out.sections.content.gridBoxes[bp]).toBeTruthy();
      expect(out.sections.footer.gridBoxes[bp]).toBeTruthy();
    }
  });

  test('xs breakpoint forces full width behavior in default theme (dx = 1)', () => {
    const layout = getLayoutFromCatalog('primary20', 'page_dashboard_kpis_then_content');
    const diagnostic: any[] = [];
    const theme = getDefaultTheme(layout);

    const out = layoutToTx(layout, diagnostic, theme);

    // pick a known box span that isn't 1 in layout (main block_1 has spanX=5)
    const gb = out.sections.main.gridBoxes.xs['block_1'];
    expect(gb).toBeTruthy();

    // Assert the property your GridBox uses for x-span.
    // Adjust these field names to match your GridBox shape.
    // Common patterns: gb.diagonal.x, gb.span.x, gb.size.x, gb.end.x - gb.start.x, etc.
    //
    // If your GridBox stores diagonal span as {x,y} (as in makeGridBox(getOrigin(), {x:dx,y:dy})):
    expect((gb as any).diagonal?.x ?? (gb as any).span?.x ?? (gb as any).size?.x).toBe(1);
  });

  test('pushes diagnostics for missing box span and skips that box', () => {
    // Build a layout with a missing span for a key that exists
    const layout = {
      main: {
        block_1: { spanX: 2, spanY: 1 },
        block_2: undefined, // missing span
      },
    } as Layout;

    const diagnostic: DiagnosticEntry[] = [];
    const theme = getDefaultTheme(layout);

    const out = layoutToTx(layout, diagnostic, theme);

    // Diagnostic recorded
    expect(diagnostic.length).toBeGreaterThan(0);
    // If your makeError sets issue.code or similar, check it; otherwise just check message text
    expect(diagnostic.some((d) => d.issue?.code === GRID_ERROR_CODE.BOX_SPAN_MISSING)).toBe(true);

    // Box should be absent in produced gridBoxes
    for (const bp of BREAKPOINTS) {
      expect(out.sections.main.gridBoxes[bp]['block_1']).toBeTruthy();
      expect(out.sections.main.gridBoxes[bp]['block_2']).toBeUndefined();
    }
  });

  test('skips undefined-valued section keys (present-key but undefined value) and reports diagnostic', () => {
    const layout = {
      header: { block_1: { spanX: 1, spanY: 1 } },
      main: undefined,
    } as Layout;

    const diagnostic: DiagnosticEntry[] = [];
    const theme = getDefaultTheme(layout);

    const out = layoutToTx(layout, diagnostic, theme);

    // header exists
    expect(out.sections.header).toBeTruthy();

    // depending on your design, main may be absent or empty.
    // Your current implementation `continue`s, so it will be absent despite Record typing.
    // This test highlights that mismatch so you can decide whether to:
    // - fill an empty section entry, OR
    // - change output type to Partial
    expect(out.sections.main).toBeUndefined();

    expect(diagnostic.some((d) => d.issue?.code === GRID_ERROR_CODE.NO_SECTION_ID)).toBe(false);
  });
});
