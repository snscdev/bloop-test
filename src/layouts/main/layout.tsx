'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { FooterProps } from './footer';
import type { NavMainProps } from './nav/types';
import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from '../core';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { usePathname } from 'src/routes/hooks';

import { useScrollSpy } from 'src/hooks/use-scroll-spy';

import { Logo } from 'src/components/logo';

import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { CartButton } from './nav/cart-button';
import { UserMenuButton } from './nav/user-menu-button';
import { MobileNavBar } from './nav/mobile/mobile-nav-bar';
import { ShopMenuDropdown } from './nav/shop-menu-dropdown';
import { navData as mainNavData } from '../nav-config-main';
import { ProductProgressBar } from './nav/product-progress-bar';
import { ProductStickyNavbar } from './nav/product-sticky-navbar';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps['data'];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: MainLayoutProps) {
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isProductPage = pathname.startsWith('/producto/');

  const navData = slotProps?.nav?.data ?? mainNavData;

  // Scroll spy for product pages
  // Offset ajustado: sticky navbar (54px) + progress bar (48px) = 102px
  const { activeSection, isScrolled } = useScrollSpy({
    sectionIds: ['step-0', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5'],
    offset: 110,
    throttle: 100,
  });

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Logo */}
          <Logo isSingle={false} />
        </>
      ),
      centerArea: (
        <>
          {/** @slot Shop menu dropdown - Desktop only */}
          <ShopMenuDropdown
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
            })}
          />
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData.filter((item) => item.title !== 'Comprar')}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
            })}
          />
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/** @slot User menu button */}
          <UserMenuButton />

          {/** @slot Cart button */}
          <CartButton />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={{
          ...slotProps?.header?.slotProps,
          container: {
            maxWidth: false,
            disableGutters: true,
            sx: {
              maxWidth: 1280,
              minHeight: 54,
              height: 54,
              borderRadius: '40px',
              border: '1px solid #F4F3F2',
              background: '#F8F8F8',
              backdropFilter: 'blur(15.6px)',
              px: 7,
              mx: 'auto',
              mt: 2,
            },
          },
        }}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          '&::before': { display: 'none' },
          '&::after': { display: 'none' },
          display: { xs: 'none', md: 'block' },
          // Ocultar navbar original cuando aparecen las sticky en páginas de producto
          ...(isProductPage &&
            isScrolled && {
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease-in-out',
            }),
          ...slotProps?.header?.sx,
        }}
      />
    );
  };

  const renderFooter = () =>
    isHomePage ? (
      <HomeFooter sx={slotProps?.footer?.sx} />
    ) : (
      <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />
    );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <>
      {/* Mobile NavBar - Solo visible en mobile */}
      <MobileNavBar data={navData} layoutQuery={layoutQuery} />

      {/* Product Sticky Navbar - Solo para páginas de producto */}
      {isProductPage && <ProductStickyNavbar isVisible={isScrolled} />}

      {/* Product Progress Bar - Solo para páginas de producto */}
      {isProductPage && <ProductProgressBar activeSection={activeSection} isVisible={isScrolled} />}

      <LayoutSection
        /** **************************************
         * @Header
         *************************************** */
        headerSection={renderHeader()}
        /** **************************************
         * @Footer
         *************************************** */
        footerSection={renderFooter()}
        /** **************************************
         * @Styles
         *************************************** */
        cssVars={cssVars}
        sx={sx}
      >
        {renderMain()}
      </LayoutSection>
    </>
  );
}
