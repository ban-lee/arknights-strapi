import { createStyles, Navbar } from '@mantine/core';
import { lessThanSmall } from '@/utils/media-query';
import { Navigation } from '@/components/navigation';
import { SiteLogoVertical } from '@/components/site-logo';

const useStyles = createStyles((theme) => ({
  navbar: {
    background: '#872A08',
    height: '100%',
    minHeight: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 0,

    [`@media ${lessThanSmall(theme)}`]: {
      display: 'none',
    },
  },
}));

export function Sidebar() {
  const { classes } = useStyles();
  return (
    <>
      <Navbar
        className={classes.navbar}
        width={{ md: 300 }}
        withBorder={false}
      >
        <Navbar.Section
          pt={24}
          pb={36}
        >
          <SiteLogoVertical />
        </Navbar.Section>
        <Navbar.Section>
          <Navigation />
        </Navbar.Section>
      </Navbar>
    </>
  );
}
