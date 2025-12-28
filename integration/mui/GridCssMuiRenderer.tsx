import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import {
  LayoutAbsolute,
  LayoutRenderingOverride,
  NodeRenderConfig,
} from '../../core/boxLayout/boxLayoutTypes';
import { BPs, BREAKPOINTS } from '../../core/breakpoints';
import { gapValueToString, gridUnitValueToString } from '../../core/cssStringify';
import { DiagnosticEntry, GRID_ERROR_CODE, makeError } from '../../core/gridErrorShape';
import { CSSCoordinates } from '../../core/gridNodeTypes';
import { GridOptions } from '../../core/gridOptionsTypes';
import { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';
import { DefaultNodeRender } from './DefaultNodeRender';

function getSxProps(gridOptions: Partial<GridOptions>): SxProps {
  const gapCss = gridOptions.gap ? gapValueToString(gridOptions.gap) : '0px';

  return {
    gridAutoColumns:
      gridOptions.implicitColumnUnits == null
        ? 'auto'
        : gridUnitValueToString(gridOptions.implicitColumnUnits),

    gridAutoRows:
      gridOptions.implicitRowUnits == null
        ? 'auto'
        : gridUnitValueToString(gridOptions.implicitRowUnits),

    gridAutoFlow: gridOptions.autoFlow ?? 'row',
    overflow: gridOptions.overflow ?? 'visible',

    justifyItems: gridOptions.justifyItems ?? 'stretch',
    alignItems: gridOptions.alignItems ?? 'stretch',

    justifyContent: gridOptions.justifyContent ?? 'start',
    alignContent: gridOptions.alignContent ?? 'start',

    gap: gapCss,
    rowGap: gridOptions.rowGap ? gapValueToString(gridOptions.rowGap) : gapCss,
    columnGap: gridOptions.columnGap ? gapValueToString(gridOptions.columnGap) : gapCss,
  };
}

type MainProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  layoutAbsolute: LayoutAbsolute<sectionIDs, blockIDs>;
  gridOptionsOverride?: Partial<GridOptions>;
  children?: React.ReactNode;
};

function TopContainer<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>({
  layoutAbsolute,
  gridOptionsOverride,
  children,
}: MainProps<sectionIDs, blockIDs>) {
  const gridOptionsResolved: SxProps = getSxProps(gridOptionsOverride || {});

  return (
    <Box
      sx={{
        display: 'grid',

        // 🔒 hard clamp to parent width
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',

        // 🔒 allow tracks to shrink
        gridTemplateColumns: {
          xs: `repeat(${layoutAbsolute.gridDimensions.columns.xs}, minmax(0, 1fr))`,
          sm: `repeat(${layoutAbsolute.gridDimensions.columns.sm}, minmax(0, 1fr))`,
          md: `repeat(${layoutAbsolute.gridDimensions.columns.md}, minmax(0, 1fr))`,
          lg: `repeat(${layoutAbsolute.gridDimensions.columns.lg}, minmax(0, 1fr))`,
          xl: `repeat(${layoutAbsolute.gridDimensions.columns.xl}, minmax(0, 1fr))`,
        },
        gridTemplateRows: {
          xs: `repeat(${layoutAbsolute.gridDimensions.rows.xs}, minmax(min-content, auto))`,
          sm: `repeat(${layoutAbsolute.gridDimensions.rows.sm}, minmax(min-content, auto))`,
          md: `repeat(${layoutAbsolute.gridDimensions.rows.md}, minmax(min-content, auto))`,
          lg: `repeat(${layoutAbsolute.gridDimensions.rows.lg}, minmax(min-content, auto))`,
          xl: `repeat(${layoutAbsolute.gridDimensions.rows.xl}, minmax(min-content, auto))`,
        },

        // applying grid options
        ...gridOptionsResolved,
      }}
    >
      {children}
    </Box>
  );
}

export type GridCssMuiRendererProps<
  sectionID extends SectionIDs,
  blockID extends BlocksIDs,
  LA extends LayoutAbsolute<sectionID, blockID>,
> = {
  layoutAbsolute: LA;
  diagnostics: DiagnosticEntry[];
  layoutRendering?: LayoutRenderingOverride<sectionID, blockID>;
  gridOptionsOverride?: Partial<GridOptions>;
};

type BoxRenderer<sectionID extends SectionIDs, blockID extends BlocksIDs> = {
  sectionId: sectionID;
  boxId: blockID;
  coordinate: BPs<CSSCoordinates>;
  content: NodeRenderConfig<sectionID, blockID>;
};

const dummyCSSCoordinates: CSSCoordinates = {
  gridColumnStart: 0,
  gridColumnEnd: 0,
  gridRowStart: 0,
  gridRowEnd: 0,
};

export function partialRecordKeys<K extends string, V>(obj: Partial<Record<K, V>>): K[] {
  return Object.keys(obj) as K[];
}

export function recordKeys<K extends string, V>(obj: Record<K, V>): K[] {
  return Object.keys(obj) as K[];
}

const fallbackCSSCoordinates: CSSCoordinates = {
  gridColumnStart: 1,
  gridColumnEnd: 2,
  gridRowStart: 1,
  gridRowEnd: 2,
};

export function typedKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
export function GridCssMuiRenderer<
  sectionID extends SectionIDs,
  blockID extends BlocksIDs,
  LA extends LayoutAbsolute<sectionID, blockID>,
>({
  layoutAbsolute,
  layoutRendering,
  diagnostics,
  gridOptionsOverride,
}: GridCssMuiRendererProps<sectionID, blockID, LA>) {
  const nodes: Record<string, BoxRenderer<sectionID, blockID>> = {};

  const sectionIds = recordKeys(layoutAbsolute.sections);

  for (const sectionId of sectionIds) {
    for (const bp of BREAKPOINTS) {
      const boxesAtBP = layoutAbsolute.sections[sectionId].coordinates[bp];

      // With your types, boxesAtBP should always exist (Record), but guard for runtime corruption.
      if (!boxesAtBP) {
        diagnostics.push(
          makeError(
            'GridCssMuiRenderer',
            GRID_ERROR_CODE.SECTION_SHAPES_MISSING_BP,
            `Missing box shapes for section "${String(sectionId)}" at breakpoint "${bp}"`,
            { details: { sectionId, bp } },
          ),
        );
        continue;
      }

      const boxIds = partialRecordKeys(boxesAtBP);

      for (const boxId of boxIds) {
        const crd = boxesAtBP[boxId];

        if (!crd) {
          diagnostics.push(
            makeError(
              'GridCssMuiRenderer',
              GRID_ERROR_CODE.BOX_SHAPE_MISSING_BP,
              `Missing box shape for box "${String(boxId)}" in section "${String(sectionId)}" at breakpoint "${bp}"`,
              { details: { sectionId, boxId, bp } },
            ),
          );
          continue;
        }

        const nodeKey = `${String(sectionId)}::${String(boxId)}`;

        // Resolve rendering config (renderer + view) with safe fallbacks.
        const resolved: NodeRenderConfig<sectionID, blockID> = (layoutRendering?.[sectionId]?.[
          bp
        ]?.[boxId] as NodeRenderConfig<sectionID, blockID> | undefined) ?? {
          contentRenderer: () => <></>,
          view: {},
        };

        // Init node once
        if (!nodes[nodeKey]) {
          nodes[nodeKey] = {
            sectionId,
            boxId,
            coordinate: {
              xs: dummyCSSCoordinates,
              sm: dummyCSSCoordinates,
              md: dummyCSSCoordinates,
              lg: dummyCSSCoordinates,
              xl: dummyCSSCoordinates,
            },
            content: resolved,
          };
        } else {
          // If node already exists from another bp, keep first content config
          // unless you prefer "latest wins". (Pick a policy.)
          if (!nodes[nodeKey].content) nodes[nodeKey].content = resolved;
        }

        // Set coords for this breakpoint
        nodes[nodeKey].coordinate[bp] = crd;
      }
    }
  }

  // Repair missing coordinates (still runs only for nodes that exist)
  for (const nodeKey of Object.keys(nodes)) {
    const node = nodes[nodeKey];

    for (const bp of BREAKPOINTS) {
      const crd = node.coordinate[bp];

      if (
        crd.gridColumnStart === 0 &&
        crd.gridColumnEnd === 0 &&
        crd.gridRowStart === 0 &&
        crd.gridRowEnd === 0
      ) {
        const message = `Box "${String(node.boxId)}" in section "${String(
          node.sectionId,
        )}" is missing coordinates for breakpoint "${bp}". Recovering with default coordinates.`;

        diagnostics.push(
          makeError('GridCssMuiRenderer', GRID_ERROR_CODE.MISSING_COORDINATES, message, {
            details: { sectionId: node.sectionId, boxId: node.boxId, bp },
          }),
        );

        node.coordinate[bp] = fallbackCSSCoordinates;
      }
    }
  }

  return (
    <TopContainer layoutAbsolute={layoutAbsolute} gridOptionsOverride={gridOptionsOverride}>
      {Object.entries(nodes).map(([nodeKey, node]) => (
        <DefaultNodeRender
          key={nodeKey}
          cssCoordinateBPs={node.coordinate}
          section={node.sectionId}
          boxId={node.boxId}
          content={node.content}
        />
      ))}
    </TopContainer>
  );
}
