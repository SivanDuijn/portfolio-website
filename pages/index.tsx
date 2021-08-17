import react from 'react';
import Head from 'next/head';

import Layout from '../components/layout/layout';
import styles from '../styles/pages/home.module.scss';

export default function Home() {
  return (
    // <Layout isHomePage>
    <>
      <Head>
        <title>Sivan Duijn</title>
      </Head>
      <div className={styles.container}>
        <h1>Welkom</h1>
      </div>
    </>
  );
  {
    /* </Layout> */
  }
}
