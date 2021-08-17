import react, { ReactElement } from 'react';
import Head from 'next/head';

import Layout from '../components/layout/layout';
import styles from '../styles/pages/home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Sivan Duijn</title>
      </Head>
      <div className={styles.container}>
        <h1>Welkom</h1>
      </div>
    </>
  );
}

// Example how to use a specified layout.
Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
