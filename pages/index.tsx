import react from 'react';
import Head from 'next/head';

import Layout from '../components/layout/layout';
import styles from '../styles/pages/home.module.scss';

export default function Home() {

  return (
    <Layout isHomePage>
      <Head>
        <title>Sivan Duijn</title>
      </Head>
      <h1>Hiii</h1>
    </Layout>
  );
}
