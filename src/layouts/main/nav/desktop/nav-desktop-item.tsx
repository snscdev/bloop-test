import type { CSSObject } from '@mui/material/styles';
import type { NavItemProps } from '../types';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { Iconify } from 'src/components/iconify';
import { createNavItem, navItemStyles, navSectionClasses } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function NavItem({
  title,
  path,
  /********/
  open,
  active,
  /********/
  subItem,
  hasChild,
  className,
  externalLink,
  ...other
}: NavItemProps) {
  const navItem = createNavItem({ path, hasChild, externalLink });

  const ownerState: StyledState = { open, active, variant: !subItem ? 'rootItem' : 'subItem' };

  return (
    <ItemRoot
      disableRipple
      aria-label={title}
      {...ownerState}
      {...navItem.baseProps}
      className={mergeClasses([navSectionClasses.item.root, className], {
        [navSectionClasses.state.open]: open,
        [navSectionClasses.state.active]: active,
      })}
      {...other}
    >
      <ItemTitle {...ownerState}> {title}</ItemTitle>

      {hasChild && <ItemArrow {...ownerState} icon="eva:arrow-ios-downward-fill" />}
    </ItemRoot>
  );
}

// ----------------------------------------------------------------------

type StyledState = Pick<NavItemProps, 'open' | 'active'> & {
  variant: 'rootItem' | 'subItem';
};

const shouldForwardProp = (prop: string) => !['open', 'active', 'variant', 'sx'].includes(prop);

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })<StyledState>(({ active, theme }) => {
  const rootItemStyles: CSSObject = {
    color: '#7F746A',
    ...(active && { color: '#7F746A' }),
  };

  const subItemStyles: CSSObject = {
    color: theme.vars.palette.text.secondary,
    '&:hover': { color: theme.vars.palette.text.primary },
    ...(active && { color: theme.vars.palette.text.primary }),
  };

  return {
    transition: theme.transitions.create(['color'], {
      duration: theme.transitions.duration.shorter,
    }),
    variants: [
      { props: { variant: 'rootItem' }, style: rootItemStyles },
      { props: { variant: 'subItem' }, style: subItemStyles },
    ],
  };
});

/**
 * @slot title
 */
const ItemTitle = styled('span', { shouldForwardProp })<StyledState>(({ theme }) => ({
  ...navItemStyles.title(theme),
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  letterSpacing: '-0.14px',
  variants: [
    { props: { variant: 'subItem' }, style: { fontSize: theme.typography.pxToRem(13) } },
    { props: { active: true }, style: { fontWeight: 600 } },
  ],
}));

/**
 * @slot arrow
 */
const ItemArrow = styled(Iconify, { shouldForwardProp })<StyledState>(({ theme }) => ({
  ...navItemStyles.arrow(theme),
}));
