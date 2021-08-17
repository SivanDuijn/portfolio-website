import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
// import Layout from '../components/layout/layout';
import React, { ReactElement, ReactNode } from 'react';

import { NextPage } from 'next';
import Layout from '../components/layout/layout';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available, else use the default layout
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
export default MyApp;
