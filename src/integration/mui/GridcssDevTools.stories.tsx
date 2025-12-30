// stories/gridcss/GridcssDevTools.stories.tsx
import type { Story } from '@ladle/react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { layoutToTx, CSSLayout } from '../../boxDesign';
import { Layout, LayoutRenderingOverride } from '../../boxLayout';
import { BREAKPOINTS } from '../../breakpoints';
import { DiagnosticEntry } from '../../gridErrorShape';
import { CatalogEntries, getCatalogCategoryKeys, getLayoutKeysForCategory, getLayoutFromCatalog } from '../../templates';
import { GridCssMuiRenderer } from './GridCssMuiRenderer';
 

 

/**
 * Option A boundary:
 * - UI state is string/string
 * - runtime-validate category + entry
 * - return a safe AnyBBEntry (with a stable fallback)
 * - all casts live ONLY in here
 */
function includes<T extends string>(
  arr: readonly T[],
  x: string,
): x is T {
  return (arr as readonly string[]).includes(x);
}

function resolveCatalogSelection(
  categoryRaw: string,
  layoutRaw: string,
  fallbackCategory: CatalogEntries = "primary20",
) {
  const categoryKeys = getCatalogCategoryKeys();

  const category: CatalogEntries = includes(categoryKeys, categoryRaw)
    ? categoryRaw
    : fallbackCategory;

  const layoutKeys = getLayoutKeysForCategory(category);

  const layoutKey =
    includes(layoutKeys as readonly string[] as any, layoutRaw)
      ? (layoutRaw as typeof layoutKeys[number])
      : layoutKeys[0];

  return {
    category,
    layoutKey,
    categoryKeys,         // typed
    layoutKeys,           // typed for this category
  };
}

function NodesPanel({ layoutAbsolute }: { layoutAbsolute: any }) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Layout Sections & Boxes
      </Typography>
      <Stack spacing={1}>
        {Object.entries(layoutAbsolute.sections).map(([sectionId, section]) => (
          <Box key={sectionId} sx={{ p: 1, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="caption" fontWeight="bold">
              {sectionId}
            </Typography>
            {Object.keys((section as any).coordinates).map((bp: string) => (
              <Box key={bp} sx={{ ml: 1, mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  @{bp}: {Object.keys((section as any).coordinates[bp]).join(', ')}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function CoordsPanel({ layoutAbsolute }: { layoutAbsolute: any }) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Grid Coordinates
      </Typography>
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {Object.entries(layoutAbsolute.sections).map(([sectionId, section]) => (
          <Box key={sectionId} sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
              {sectionId}
            </Typography>
            {Object.entries((section as any).coordinates).map(([bp, coords]) => (
              <Box key={bp} sx={{ ml: 1, mb: 1 }}>
                <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
                  @{bp}
                </Typography>
                {Object.entries(coords as any).map(([boxId, coord]: [string, any]) => (
                  <Box key={boxId} sx={{ ml: 1, fontSize: 11, fontFamily: 'monospace' }}>
                    {boxId}: col({coord.gridColumnStart}-{coord.gridColumnEnd}) row(
                    {coord.gridRowStart}-{coord.gridRowEnd})
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function GridJsonPanel({ layoutAbsolute }: { layoutAbsolute: any }) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Layout JSON
      </Typography>
      <Box
        sx={{
          maxHeight: 400,
          overflow: 'auto',
          bgcolor: 'grey.50',
          p: 1,
          borderRadius: 1,
          border: 1,
          borderColor: 'grey.300',
        }}
      >
        <pre
          style={{
            fontSize: 11,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {JSON.stringify(layoutAbsolute, null, 2)}
        </pre>
      </Box>
    </Box>
  );
}

export const DevTools: Story = () => {
  const [categoryRaw, setCategoryRaw] = React.useState<string>("primary20");
  const [layoutRaw, setLayoutRaw] = React.useState<string>("page_band");
  const [tab, setTab] = React.useState(0);

  const { category, layoutKey, categoryKeys, layoutKeys } = resolveCatalogSelection(
    categoryRaw,
    layoutRaw,
  );

  // keep UI strings in sync if user selected invalid keys
  React.useEffect(() => {
    if (categoryRaw !== category) setCategoryRaw(category);
    if (layoutRaw !== String(layoutKey)) setLayoutRaw(String(layoutKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, layoutKey]);

  const diagnostics: DiagnosticEntry[] = [];

  // 1) get Layout (cloned) from catalog
  const layout: Layout = getLayoutFromCatalog(category, layoutKey );

  // 2) Layout -> LayoutWithTx (theme optional)
  const layoutWithTx = layoutToTx(layout, diagnostics /*, theme? */);

  // 3) LayoutWithTx -> LayoutAbsolute
  const layoutAbsolute = CSSLayout({ layoutWithTx, diagnostics });

  // optional: build per-node content overlays
  const layoutRendering: LayoutRenderingOverride<any, any> = {};

  for (const sectionId of Object.keys(layoutAbsolute.sections)) {
    layoutRendering[sectionId as any] = {} as any;

    for (const bp of BREAKPOINTS) {
      (layoutRendering as any)[sectionId][bp] = {} as any;

      const boxesAtBp = (layoutAbsolute.sections as any)[sectionId].coordinates[bp];
      if (!boxesAtBp) continue;

      for (const boxId of Object.keys(boxesAtBp)) {
        const coords = boxesAtBp[boxId];
        if (!coords) continue;

        (layoutRendering as any)[sectionId][bp][boxId] = {
          contentRenderer: ({ sectionId, bp, boxId, coords }: any) => (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "rgba(100, 181, 246, 0.3)",
                border: "2px solid rgba(25, 118, 210, 0.7)",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                textAlign: "center",
                gap: 1,
              }}
            >
              <div>
                <strong>
                  {String(sectionId)}_{String(boxId)} @ {bp}
                </strong>
              </div>
              <div>
                origin:[{coords.gridColumnStart}, {coords.gridRowStart}]
                <br />
                diagonal: [{coords.gridColumnEnd - coords.gridColumnStart},{" "}
                {coords.gridRowEnd - coords.gridRowStart}]
              </div>
            </Box>
          ),
        };
      }
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
      <Box sx={{ px: 2 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" gutterBottom>
                GridCSS DevTools
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Category: <code>{String(category)}</code> | Layout:{" "}
                <code>{String(layoutKey)}</code>
              </Typography>
            </Box>

            <Divider />

            <Box display="flex" flexDirection="row" gap={4}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Select category
                </Typography>
                <Select
                  size="small"
                  value={categoryRaw}
                  onChange={(e) => setCategoryRaw(e.target.value as string)}
                >
                  {categoryKeys.map((k) => (
                    <MenuItem key={k} value={k}>
                      <Typography component="span">{k}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Select layout
                </Typography>
                <Select
                  size="small"
                  value={layoutRaw}
                  onChange={(e) => setLayoutRaw(e.target.value as string)}
                >
                  {layoutKeys.map((k) => (
                    <MenuItem key={k} value={k}>
                      <Typography component="span">{k}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 2, minWidth: 0 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Grid preview
                </Typography>

                <GridCssMuiRenderer
                  layoutAbsolute={layoutAbsolute as any}
                  diagnostics={diagnostics}
                  layoutRendering={layoutRendering as any}
                />
              </Box>

              <Box sx={{ flex: 1.5, minWidth: 0 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Inspector
                </Typography>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
                  <Tab label="Nodes" />
                  <Tab label="Coords" />
                  <Tab label="Grid JSON" />
                  <Tab label="Diagnostics" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
                  {tab === 0 && <NodesPanel layoutAbsolute={layoutAbsolute} />}
                  {tab === 1 && <CoordsPanel layoutAbsolute={layoutAbsolute} />}
                  {tab === 2 && <GridJsonPanel layoutAbsolute={layoutAbsolute} />}
                  {tab === 3 && <DiagnosticsPanel diagnostics={diagnostics} />}
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};


function DiagnosticsPanel({
    diagnostics,
}: {
    diagnostics: readonly DiagnosticEntry[] | undefined;
}) {
    if (!diagnostics || diagnostics.length === 0) {
        return (
            <Typography variant="body2" color="success.main">
                ✔ No diagnostics. Layout looks clean.
            </Typography>
        );
    }

    // Check what properties the diagnostics actually have
    console.log("Diagnostics structure:", diagnostics);

    const warnings = diagnostics.filter((d) => d.severity === "warning");
    const errors = diagnostics.filter((d) => d.severity === "error");
    const info = diagnostics.filter((d) => d.severity === "info");

    const renderDiagnostic = (d: DiagnosticEntry, i: number, color: string, bgColor: string) => (
        <Box
            key={i}
            sx={{
                p: 1,
                borderRadius: 1,
                border: "1px dashed",
                borderColor: color,
                bgcolor: bgColor,
                fontSize: 12,
            }}
        >
            <Typography variant="caption" fontWeight="bold" sx={{ color }}>
                {d.issue.code}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {d.issue.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Origin: {String(d.origin)}
                {d.issue.elementId ? ` | Element: ${d.issue.elementId}` : ''}
            </Typography>
        </Box>
    );

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                {errors.length > 0 && (
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="error.main" gutterBottom>
                            Errors ({errors.length})
                        </Typography>
                        <Stack spacing={1}>
                            {errors.map((e, i) => renderDiagnostic(e, i, "error.main", "error.50"))}
                        </Stack>
                    </Box>
                )}

                {warnings.length > 0 && (
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="warning.main" gutterBottom>
                            Warnings ({warnings.length})
                        </Typography>
                        <Stack spacing={1}>
                            {warnings.map((w, i) => renderDiagnostic(w, i, "warning.main", "warning.50"))}
                        </Stack>
                    </Box>
                )}

                {info.length > 0 && (
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="info.main" gutterBottom>
                            Info ({info.length})
                        </Typography>
                        <Stack spacing={1}>
                            {info.map((inf, i) => renderDiagnostic(inf, i, "info.main", "info.50"))}
                        </Stack>
                    </Box>
                )}
            </Stack>

            {/* Show all diagnostics if we have them but they don't fit standard categories */}
            {warnings.length === 0 && errors.length === 0 && info.length === 0 && diagnostics.length > 0 && (
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        All Diagnostics ({diagnostics.length})
                    </Typography>
                    <Stack spacing={1}>
                        {diagnostics.map((d, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "grey.400",
                                    bgcolor: "grey.50",
                                    fontSize: 12,
                                }}
                            >
                                <Typography variant="caption" fontWeight="bold">
                                    {d.issue?.code || d.severity || 'Unknown'}
                                </Typography>
                                <div>{d.issue?.message || 'No message available'}</div>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}