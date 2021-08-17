import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import styles from './navigation.module.scss';

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
        name: 'auto-desk-lift',
        url: '/auto-desk-lift',
        subSections: [],
      },
      {
        name: 'bookcase-light',
        url: '/bookcase-light',
        subSections: [],
      },
      {
        name: 'lantern-light',
        url: '/lantern-light',
        subSections: [],
      },
    ],
  },
  {
    name: 'SD Software',
    url: '/sd-software',
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
  return (
    <div className={styles.navigation}>
      {navs.map((nav) => {
        if (nav.subSections.length > 0) return <RenderDropDown key={nav.name} nav={nav} />;
        else
          return (
            <Link key={nav.name} href={nav.url}>
              <a className={styles.navText}>{nav.name}</a>
            </Link>
          );
      })}
    </div>
  );
}

function RenderDropDown({ nav }: { nav: NavSection }) {
  return (
    <li className={styles.dropdownContainer}>
      <div className={styles.textContainer}>
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
        <Link href={nav.url}>
          <a className={styles.navText}>{nav.name}</a>
        </Link>
      </div>
      <ul className={styles.dropdownMenu}>
        {nav.subSections.map((sub, i) => (
          <li key={sub.name} className={styles.dropdownItem}>
            <Link href={nav.url + sub.url}>
              <a className={styles.navText}>{sub.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
