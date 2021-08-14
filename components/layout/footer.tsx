import React from 'react';
import Link from 'next/link';
import cn from 'classnames';

import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContentWrap}>
          <section>
            <p className={styles.footerSectionTitle}>Connect with us</p>
            <Link href="/support">
              <a className={styles.footerSectionLink}>Support</a>
            </Link>
            <Link href="/partner">
              <a className={styles.footerSectionLink}>Become a partner</a>
            </Link>
            <Link href="/blog">
              <a className={styles.footerSectionLink}>Blog</a>
            </Link>
            <Link href="/news">
              <a className={styles.footerSectionLink}>News &amp; Press</a>
            </Link>
          </section>
          <section>
            <p className={styles.footerSectionTitle}>Navigation</p>
            <Link href="/">
              <a className={styles.footerSectionLink}>Home</a>
            </Link>
            <Link href="/#solutions">
              <a className={styles.footerSectionLink}>Products</a>
            </Link>
            <Link href="/#usecases">
              <a className={styles.footerSectionLink}>Use Cases</a>
            </Link>
            <Link href="/#contact">
              <a className={styles.footerSectionLink}>Contact</a>
            </Link>
            <Link href="/book-demo">
              <a className={styles.footerSectionLink}>Book a demo</a>
            </Link>
          </section>
          <section>
            <p className={styles.footerSectionTitle}>Terms &amp; Policies</p>

            <Link href="/terms-of-use">
              <a className={styles.footerSectionLink}>Terms of Use</a>
            </Link>
            <Link href="/privacy-policy">
              <a className={styles.footerSectionLink}>Privacy Policy</a>
            </Link>
            <p className={cn(styles.footerSectionTitle, styles.copyRightStatement)}>
              Copyright 2021 © Synergy Software
            </p>
          </section>
        </div>
      </div>
    </footer>
  );
}
