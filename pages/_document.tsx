import clsx from "clsx";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className={clsx("scroll-smooth")}>
      <Head />
      <body className={clsx("bg-black", "text-white")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
