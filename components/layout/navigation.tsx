import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';

import styles from './navigation.module.scss';
import { useRouter } from 'next/dist/client/router';

/** A type for a navigation section with a tree-like structure. */
type NavSection = {
  name: string;
  url: string;
  subSections: NavSection[];
};
/** All the navs for the website. */
const navs: NavSection[] = [
  {
    name: 'projects',
    url: '/projects',
    subSections: [
      {
        name: 'Auto stand desk',
        url: '/auto-stand-desk',
        subSections: [],
      },
      {
        name: 'Bookcase light',
        url: '/bookcase-light',
        subSections: [],
      },
      {
        name: 'Lantern light',
        url: '/lantern-light',
        subSections: [],
      },
    ],
  },
  {
    name: 'SiSoftware',
    url: '/si-software',
    subSections: [],
  },
  {
    name: 'about',
    url: '/about',
    subSections: [],
  },
];

/** Renders the navigation accordion menu. */
export default function Navigation() {
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const smallScreenSize = 600;

  const updateMedia = (): void => {
    setIsSmallScreen(window.innerWidth <= smallScreenSize);
  };

  useEffect(() => {
    updateMedia();
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const renderNav = () => {
    if (isSmallScreen)
      return (
        <div className={styles.smallNav}>
          {navs.map((nav) => (
            <div key={nav.name} className={styles.smallNavItemContainer}>
              <NavItemSmallScreen nav={nav} />
            </div>
          ))}
        </div>
      );
    else
      return (
        <div className={styles.bigNav}>
          {navs.map((nav) => {
            if (nav.subSections.length > 0)
              return <RenderDropDownNavItem key={nav.name} nav={nav} routerPath={router.asPath} />;
            else
              return (
                <NavLink key={nav.name} name={nav.name} url={nav.url} currentPath={router.asPath} />
              );
          })}
        </div>
      );
  };

  return (
    <nav className={styles.navigation} role={'navigation'}>
      {renderNav()}
    </nav>
  );
}

function RenderDropDownNavItem({ nav, routerPath }: { nav: NavSection; routerPath: string }) {
  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.textContainer}>
        <ArrowToRightIcon />
        <NavLink name={nav.name} url={nav.url} currentPath={routerPath} />
      </div>
      <ul className={styles.dropdownMenu}>
        {nav.subSections.map((sub, i) => (
          <NavLink
            key={sub.name}
            name={sub.name}
            url={nav.url + sub.url}
            currentPath={routerPath}
          />
        ))}
      </ul>
    </div>
  );
}

// --- SMALL SCREEN NAV ---
/** Renders a single nav section with nested sections for small screens. */
function NavItemSmallScreen({ nav }: { nav: NavSection }) {
  const [panelShown, setPanelShown] = useState(false);

  // When a child section is expanded this panel's height also needs to change.
  // All the changes are propagated to the parent by the add- and removeHeight callback functions
  const [maxHeight, setMaxHeight] = useState(0);

  const panelRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  if (nav.subSections.length == 0)
    return <NavLink name={nav.name} url={nav.url} currentPath={router.asPath} />;
  else
    return (
      <div className={cn(styles.subSectionItem, { [styles.subSectionShown]: panelShown })}>
        <div
          className={cn(styles.subSectionTitle, {
            [styles.selected]: router.asPath.includes(nav.url),
          })}
          onClick={() => {
            setMaxHeight(panelShown ? 0 : panelRef.current?.scrollHeight || 0);
            setPanelShown(!panelShown);
          }}
        >
          <NavLink name={nav.name} url={nav.url} currentPath={router.asPath} />
          <ArrowToRightIcon />
        </div>

        <ul ref={panelRef} className={styles.panel} style={{ maxHeight: maxHeight }}>
          {nav.subSections.map((subSec, i) => (
            <NavItemSmallScreen key={subSec.name} nav={{ ...subSec, url: nav.url + subSec.url }} />
          ))}
        </ul>
      </div>
    );
}

// --- UTILITY COMPONENTS ---
function ArrowToRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      width="20px"
      height="20px"
      className={styles.arrowIcon}
    >
      <path
        d="m345.44 248.29l-194.29 194.28c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744l171.91-171.91-171.91-171.9c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.29 194.28c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373"
        transform="matrix(.03541-.00013.00013.03541 2.98 3.02)"
        fill="#4d4d4d"
      />
    </svg>
  );
}

function NavLink({ name, url, currentPath }: { name: string; url: string; currentPath: string }) {
  return (
    <li className={styles.navItem} onClick={(e) => e.stopPropagation()}>
      <Link href={url}>
        <a className={cn(styles.navText, { [styles.selected]: currentPath.includes(url) })}>
          {name}
        </a>
      </Link>
    </li>
  );
}
