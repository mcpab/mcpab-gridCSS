'use client';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';
import { NodeRenderConfig } from '../../core/boxLayout/boxLayoutTypes';
import { BPs } from '../../core/breakpoints';
import { CSSCoordinates } from '../../core/gridNodeTypes';
import { GridNodeViewOptions } from '../../core/nodeViewOptions';
import { BlocksIDs, SectionIDs } from '../../templates/layoutIDs';

const visuallyHiddenStyle: SystemStyleObject<Theme> = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'visible',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export function getNodeSxProps(view?: GridNodeViewOptions): SystemStyleObject<Theme> {
  const v = view ?? {};

  const minWidth0 = v.minWidth0 ?? true;
  const minHeight0 = v.minHeight0 ?? true;

  return {
    ...(minWidth0 ? { minWidth: 0 } : {}),
    ...(minHeight0 ? { minHeight: 0 } : {}),

    justifySelf: v.justifySelf ?? 'stretch',
    alignSelf: v.alignSelf ?? 'stretch',

    ...(v.zIndex != null ? { zIndex: v.zIndex } : {}),
    pointerEvents: v.pointerEvents ?? 'auto',

    ...(v.visibility === 'hidden' ? { visibility: 'hidden' } : {}),
    ...(v.visibility === 'visuallyHidden' ? visuallyHiddenStyle : {}),
  };
}

export function getNodeDomProps(view?: GridNodeViewOptions): React.HTMLAttributes<HTMLElement> {
  const v = view ?? {};
  const aria = v.aria ?? {};

  const domProps: React.HTMLAttributes<HTMLElement> & Record<string, string> = {};

  if (aria.role) domProps.role = aria.role;
  if (aria.label) domProps['aria-label'] = aria.label;
  if (aria.labelledBy) domProps['aria-labelledby'] = aria.labelledBy;
  if (aria.describedBy) domProps['aria-describedby'] = aria.describedBy;

  if (v.dataAttrs) {
    for (const [k, val] of Object.entries(v.dataAttrs)) {
      const key = k.startsWith('data-') ? k : `data-${k}`;
      domProps[key] = String(val);
    }
  }

  return domProps;
}

type DefaultNodeRenderProps<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs> = {
  section: sectionIDs;
  boxId: blockIDs;
  cssCoordinateBPs: BPs<CSSCoordinates>;
  content: NodeRenderConfig<sectionIDs, blockIDs>;
};

export function DefaultNodeRender<sectionIDs extends SectionIDs, blockIDs extends BlocksIDs>({
  section,
  boxId,
  cssCoordinateBPs,
  content,
}: DefaultNodeRenderProps<sectionIDs, blockIDs>) {
  const nodeSx = getNodeSxProps(content.view);
  const domProps = getNodeDomProps(content.view);

  const theme = useTheme();

  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const upXl = useMediaQuery(theme.breakpoints.up('xl'));

  const bp = upXl ? 'xl' : upLg ? 'lg' : upMd ? 'md' : upSm ? 'sm' : 'xs';

  return (
    <Box
      {...domProps}
      sx={{
        // Good page-layout defaults:
        boxSizing: 'border-box',
        position: 'relative', // helps absolutely-positioned children anchor to the node
        overflow: 'visible', // don't clip by default (clipping should be opt-in via view later)
        minWidth: 0, // allow content to shrink below its minimum width by default
        minHeight: 0, // allow content to shrink below its minimum height by default

        // Grid placement (responsive)
        gridColumnStart: {
          xs: cssCoordinateBPs.xs.gridColumnStart,
          sm: cssCoordinateBPs.sm.gridColumnStart,
          md: cssCoordinateBPs.md.gridColumnStart,
          lg: cssCoordinateBPs.lg.gridColumnStart,
          xl: cssCoordinateBPs.xl.gridColumnStart,
        },
        gridColumnEnd: {
          xs: cssCoordinateBPs.xs.gridColumnEnd,
          sm: cssCoordinateBPs.sm.gridColumnEnd,
          md: cssCoordinateBPs.md.gridColumnEnd,
          lg: cssCoordinateBPs.lg.gridColumnEnd,
          xl: cssCoordinateBPs.xl.gridColumnEnd,
        },
        gridRowStart: {
          xs: cssCoordinateBPs.xs.gridRowStart,
          sm: cssCoordinateBPs.sm.gridRowStart,
          md: cssCoordinateBPs.md.gridRowStart,
          lg: cssCoordinateBPs.lg.gridRowStart,
          xl: cssCoordinateBPs.xl.gridRowStart,
        },
        gridRowEnd: {
          xs: cssCoordinateBPs.xs.gridRowEnd,
          sm: cssCoordinateBPs.sm.gridRowEnd,
          md: cssCoordinateBPs.md.gridRowEnd,
          lg: cssCoordinateBPs.lg.gridRowEnd,
          xl: cssCoordinateBPs.xl.gridRowEnd,
        },

        // View-driven overrides (minWidth0/minHeight0, alignSelf/justifySelf, zIndex, pointerEvents, visibility, etc.)
        ...nodeSx,
      }}
    >
      {content.contentRenderer
        ? content.contentRenderer({ sectionId: section, bp, boxId, coords: cssCoordinateBPs[bp] })
        : null}
    </Box>
  );
}
