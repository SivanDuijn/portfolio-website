import clsx from "clsx";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className={clsx("scroll-smooth")}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={clsx("bg-black", "text-white")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
