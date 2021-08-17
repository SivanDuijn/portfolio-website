import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import styles from './layout.module.scss';

import { useRouter } from 'next/dist/client/router';
import Footer from './footer';
import Navigation from './navigation';
import P5CircuitText from '../p5-circuit-text/p5-circuit-text';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // Used to determine whether the small screen nav overlay will be shown or not
  const [showOverlay, setShowOverlay] = useState(false);
  // Use the router to underline current page nav
  const router = useRouter();

  const updateMedia = (): void => {
    setIsSmallScreen(window.innerWidth <= 630);
  };

  useEffect(() => {
    updateMedia();
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="A website featuring my personal projects and expirements."
        />
        <meta name="og:title" content={'Sivan Duijn'} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className={styles.container}>
        <div className={styles.headerContainer} onClick={() => router.push('/')}>
          <P5CircuitText />
        </div>

        <Navigation />

        <div className={styles.contentWrap}>
          <main>{children}</main>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
