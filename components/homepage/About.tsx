import clsx from "clsx";
import Image from "next/image";
import { UnderlineSVG } from "../UnderlineSVG";

export function About() {
  return (
    <div id="about" className={clsx("bg-black", "flex", "flex-col", "items-center")}>
      <div className={clsx("pl-0", "md:pl-16", "md:max-w-6xl", "md:w-full")}>
        <div
          className={clsx(
            "group",
            "inline-block",
            "text-[#c0c0c0]",
            "font-extrabold",
            "text-4xl",
            "md:text-5xl",
            "mt-12",
            "md:mt-16",
          )}
        >
          <h1>ABOUT</h1>
          <UnderlineSVG />
        </div>
      </div>
      <div className={clsx("lg:max-w-6xl", "lg:w-full")}>
        <div
          className={clsx(
            "flex",
            "flex-col",
            "md:flex-row",
            "items-center",
            "md:items-start",
            "pt-16",
            "md:pt-24",
            "px-10",
            "sm:px-16",
          )}
        >
          <div className={clsx("pt-2", "max-w-[12rem]", "mb-8", "min-w-[10rem]")}>
            <Image
              src={"/imgs/me-slovakia.jpg"}
              alt="A profile picture showing my face"
              width={500}
              height={0}
            />
          </div>

          <div className={clsx("pl-0", "md:pl-16")}>
            <h2 className={clsx("text-lg", "font-semibold", "mb-1")}>About me</h2>
            <p className={clsx("text-sm", "md:text-base")}>
              Hello! I&apos;m passionate about programming, woodworking, tinkering with electronics,
              and drumming. Currently, I&apos;m completing my Master&apos;s degree in Game and Media
              Technology at Utrecht University, after a cum laude Bachelor&apos;s degree in Computer
              Science.
            </p>
            <h2 className={clsx("text-lg", "font-semibold", "mt-6", "mb-1")}>Professional Path</h2>
            {/* <br /> */}
            <p className={clsx("text-sm", "md:text-base")}>
              I&apos;ve gained work experience at companies like Achmea and Riskquest, where I
              worked as a developer within talented teams. My contributions spanned both frontend
              and backend development. Mastering various languages and tools, including Next.js,
              React.js, C++, C#, Python, and Go.
            </p>
          </div>
        </div>
        <div
          className={clsx("flex", "flex-col", "md:flex-row", "pt-6", "pb-16", "px-10", "sm:px-16")}
        >
          <div className={clsx("pr-0", "md:pr-16")}>
            <h2 className={clsx("text-lg", "font-semibold", "mb-1")}>Passion Beyond the Screen</h2>
            {/* <br /> */}
            <p className={clsx("text-sm", "md:text-base")}>
              While my academic focus is on Computer Science, my curiosity extends beyond code. I
              had a year break from Computer Science where I attended the Hout- en
              Meubeleringscollege to follow my woodworking ambitions. I have an interest in topics
              like electronic prototyping, 3D modeling, and art that combines technology with
              aspects from nature. Think about the innovative creations by{" "}
              <a
                href="https://studiodrift.com"
                className={clsx("underline", "hover:text-blue-300")}
                target="_blank"
              >
                Studio Drift
              </a>{" "}
              and{" "}
              <a
                href="https://www.studioroosegaarde.net/projects"
                className={clsx("underline", "hover:text-blue-300")}
                target="_blank"
              >
                Studio Roosegaarde
              </a>
              . I have build projects featuring Arduinos, Raspberry Pi&apos;s and LED&apos;s
              combined with materials nature has to offer like wood and dandelion seeds.
            </p>
            <h2 className={clsx("text-lg", "font-semibold", "mt-6", "mb-1")}>Free Time</h2>
            {/* <br /> */}
            <p className={clsx("text-sm", "md:text-base")}>
              I find joy in woodworking, aikido, and drumming. In my free time, you&apos;ll have
              good chance finding me crafting wooden spoons or baking homemade bread. Playing the
              drums and hiking are my sources for relaxation and inspiration.
            </p>
          </div>
          <div className={clsx("pt-4", "hidden", "md:block", "min-w-[10rem]")}>
            <Image
              src={"/imgs/me-drumming.jpeg"}
              alt="A profile picture showing me drumming"
              width={1100}
              height={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
