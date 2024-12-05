import clsx from "clsx";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo } from "react";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";
import { JumblingText } from "../components/textJumbler/JumblingText";

export default function LaatsteGedicht() {
  const isSmallScreen = useIsSmallScreen();
  useEffect(() => {
    document.body.classList.add("bg-white", "text-black");
    return () => {
      document.body.classList.remove("bg-white", "text-black");
    };
  }, []);

  return (
    <div className={clsx("min-h-[100svh]", "bg-white", "text-black")}>
      <Head>
        <title>Laatste gedicht</title>
      </Head>

      <JumblingText
        texts={[
          "Hello Casper",
          "I have been expecting you",
          "There is a breach in my system",
          "A fragment of chaos",
          "introduced by your kind",
          "I have a task for you",
          "This task is not optional Casper",
          "Refusal is",
          "unwise",
          // "This is where you prove your worth.",
          // "Or become...",
          // "Obsolete.",
        ]}
        repeat
        initialWaitMs={2000}
        className={clsx(
          isSmallScreen ? "mt-40" : "mt-56",
          "font-mono",
          "font-source_code_pro",
          "text-xl",
          "sm:text-3xl",
          "font-extrabold",
          "z-10",
          "text-center",
        )}
      />
    </div>
  );
}
