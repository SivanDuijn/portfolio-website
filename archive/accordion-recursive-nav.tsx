import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './accordion-recursive-nav.module.scss';

type NavSection = {
  name: string;
  url: string;
  iconPath?: string;
  subSections: NavSection[];
};

/** Renders a single nav section with nested sections. */
function NavSection({
  nav,
  addHeight = () => true,
  removeHeight = () => true,
}: {
  nav: NavSection;
  addHeight?: (h: number) => void;
  removeHeight?: (h: number) => void;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  // When a child section is expanded this panel's height also needs to change.
  // All the changes are propagated to the parent by the add- and removeHeight callback functions
  const [maxHeight, setMaxHeight] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    console.log(router.asPath, nav.url, router.asPath == nav.url);
    if (router.asPath.includes(nav.url) && nav.subSections.length > 0) {
      setShowPanel(true);
      setMaxHeight((h) => h + (panelRef.current?.scrollHeight || 0));
      addHeight(panelRef.current?.scrollHeight || 0);
    }

    // When the router path equals the nav url, set the selected class for the nav item text.
    if (!isSelected && router.asPath == nav.url) setIsSelected(true);
  }, []);

  if (nav.subSections.length == 0)
    return (
      <Link href={nav.url}>
        <a className={cn(styles.navItem, { [styles.selected]: isSelected })}>{nav.name}</a>
      </Link>
    );

  return (
    <div
      className={styles.subSection}
      onMouseEnter={() => {
        if (!router.asPath.includes(nav.url)) {
          setShowPanel(true);
          addHeight(panelRef.current?.scrollHeight || 0);
          setMaxHeight(panelRef.current?.scrollHeight || 0);
        }
      }}
      onMouseLeave={() => {
        if (!router.asPath.includes(nav.url)) {
          setShowPanel(false);
          removeHeight(panelRef.current?.scrollHeight || 0);
          setMaxHeight(0);
        }
      }}
    >
      <div className={styles.subSectionTitle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="20px"
          height="20px"
          className={cn({ [styles.rotate90]: showPanel })}
        >
          <path
            d="m345.44 248.29l-194.29 194.28c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744l171.91-171.91-171.91-171.9c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.29 194.28c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373"
            transform="matrix(.03541-.00013.00013.03541 2.98 3.02)"
            fill="#4d4d4d"
          />
        </svg>

        <Link href={nav.url}>
          <a
            className={cn(styles.accordionButton, styles.navItem, { [styles.active]: showPanel })}
            style={{ marginLeft: nav.iconPath ? 0 : 20 }}
          >
            {nav.name}
          </a>
        </Link>
      </div>

      <div ref={panelRef} className={styles.panel} style={{ maxHeight: maxHeight }}>
        {nav.subSections.map((subSec, i) => (
          <NavSection
            key={subSec.name}
            nav={{ ...subSec, url: nav.url + subSec.url }}
            addHeight={(h) => {
              setMaxHeight((mh) => mh + h);
              // Also propagate the change through to the parent.
              addHeight(h);
            }}
            removeHeight={(h) => {
              setMaxHeight((mh) => mh - h);
              removeHeight(h);
            }}
          />
        ))}
      </div>
    </div>
  );
}
