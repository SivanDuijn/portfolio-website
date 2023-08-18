import { Inter } from "next/font/google";
import P5CircuitText from "@/components/p5CircuitText/p5CircuitText";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { JumblingText } from "@/components/textJumbler/JumblingText";
import { TiltOnlyBigScreen } from "@/components/TiltOnlyBigScreen";
import { Welcome } from "@/components/homepage/Welcome";
import { ProjectsOverview } from "@/components/homepage/ProjectsOverview";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={clsx("bg-black", "text-white", inter.className)}>
      <Welcome />
      <ProjectsOverview />
    </main>
  );
}
