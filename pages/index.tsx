import clsx from "clsx";
import { Inter } from "next/font/google";
import Head from "next/head";
import { About } from "@/components/homepage/About";
import { Contact } from "@/components/homepage/Contact";
import { Footer } from "@/components/homepage/Footer";
import { ProjectsOverview } from "@/components/homepage/ProjectsOverview";
import { Welcome } from "@/components/homepage/Welcome";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={clsx("bg-black", "text-white", inter.className)}>
      <Head>
        <title>Sivan Duijn</title>
      </Head>
      <Welcome />
      <ProjectsOverview />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
