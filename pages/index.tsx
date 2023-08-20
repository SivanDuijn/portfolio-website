import { Inter } from "next/font/google";
import clsx from "clsx";
import { Welcome } from "@/components/homepage/Welcome";
import { ProjectsOverview } from "@/components/homepage/ProjectsOverview";
import { About } from "@/components/homepage/About";
import { Contact } from "@/components/homepage/Contact";
import { Footer } from "@/components/homepage/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={clsx("bg-black", "text-white", inter.className)}>
      <Welcome />
      <ProjectsOverview />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
