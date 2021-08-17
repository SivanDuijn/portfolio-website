/** Custom 404 page, served when a file is not found. */

import styles from '../styles/pages/404.module.scss';

export default function Custom404() {
  return (
    <div className={styles.container}>
      <h1>⚡ - Oops!</h1>
      <p>We can&apos;t seem to find the page you are looking for.</p>
      <p>This page does not exist or is currently being constructed.</p>
    </div>
  );
}
