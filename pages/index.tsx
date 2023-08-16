import { Inter } from "next/font/google";
import P5CircuitText from "@/components/p5-circuit-text/p5-circuit-text";
import clsx from "clsx";
import { useMemo } from "react";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const links = useMemo(
    () => [
      {
        url: "#projects",
        title: "Projects",
        description:
          "Explore projects I've worked on, related to woodworking, electronics and programming.",
      },
      {
        url: "#top",
        title: "Work",
        description: "Gain insights into my professional background.",
      },
      {
        url: "",
        title: "About",
        description: "Delve deeper into my persona and interests",
      },
      {
        url: "",
        title: "Get in Touch",
        description: "Find out how to best contact me.",
      },
    ],
    []
  );

  return (
    <main className={clsx(inter.className)}>
      <div
        id="top"
        className={clsx(
          "flex",
          "min-h-screen",
          "flex-col",
          "items-center",
          "justify-between",
          "p-24",
          "m-0"
        )}
      >
        <div
          className={clsx(
            "absolute",
            "after:absolute",
            "after:content-['']",
            "after:w-[700px]",
            "after:h-[320px]",
            "after:rounded-full",
            "after:rotate-[176deg]",
            "after:blur-[200px]",
            "after:opacity-25",
            "after:-translate-x-1/2",
            "after:-translate-y-16",
            "after:bg-gradient-conic",
            "after:from-[#0141ff]/40",
            "after:to-sky-600"
          )}
        ></div>

        <div className={clsx("z-10")}>
          <P5CircuitText text="Welcome" fontSize={80} />
        </div>

        <p className={clsx("text-3xl", "font-extrabold")}>
          My name is Sivan Duijn
        </p>

        <div
          className={clsx(
            "grid",
            "lg:grid-cols-4",
            "text-center",
            "lg:text-left",
            "lg:max-w-5xl",
            "lg:w-full"
          )}
        >
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className={clsx(
                "group",
                "rounded-lg",
                "border",
                "border-transparent",
                "px-5",
                "py-4",
                "transition-colors",
                "hover:border-neutral-700",
                "hover:bg-neutral-800/30"
              )}
            >
              <div>
                <h2 className={clsx("mb-3", "text-2xl", "font-semibold")}>
                  {link.title}{" "}
                  <span
                    className={clsx(
                      "inline-block",
                      "transition-transform",
                      "group-hover:translate-x-1",
                      "motion-reduce:transform-none"
                    )}
                  >
                    -&gt;
                  </span>
                </h2>
                <p
                  className={clsx(
                    "m-0",
                    "max-w-[30ch]",
                    "text-sm",
                    "opacity-50"
                  )}
                >
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
        <a
          href="#projects"
          className={clsx(
            "absolute",
            "group",
            "right-0",
            "bottom-0",
            "w-16",
            "h-24",
            "flex",
            "justify-center",
            "items-center",
            "bg-gradient-to-t",
            "from-sky-900/50",
            "font-serif",
            "text-3xl",
            "text-gray-400"
          )}
        >
          <span className={clsx("group-hover:translate-y-2", "transition")}>
            &#8595;
          </span>
        </a>
      </div>

      {/* PROJECTS */}
      <div id="projects" className={clsx("bg-[#111111]", "p-24")}>
        <div
          className={clsx("flex", "flex-col", "justify-center", "items-center")}
        >
          <Tilt
            perspective={500}
            glareMaxOpacity={0}
            tiltMaxAngleX={13}
            tiltMaxAngleY={13}
            className={clsx("cursor-pointer")}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className={clsx(
                "absolute",
                "block",
                "bottom-0",
                "left-28",
                "w-56",
                "overflow-visible"
              )}
            >
              <Image
                className={clsx("object-left-bottom", "w-full", "h-auto")}
                src="/imgs/projects/chinese-lantern/thumbnail.jpeg"
                width={0}
                height={0}
                sizes="100vw"
                // layout="fill"
                // objectFit="contain"
                alt={""}
              />
            </div>
            <div
              className={clsx("group", "p-8")}
              style={{
                transform: "translateZ(20px)",
              }}
            >
              <h2
                className={clsx(
                  "mb-4",
                  "max-w-[8rem]",
                  "text-2xl",
                  "font-extrabold"
                )}
              >
                Chinese Lantern Lamp
              </h2>
              <div className={clsx("h-1", "w-48", "mb-4", "bg-white")}></div>
              <p className={clsx("font-mono", "text-sm", "text-gray-400")}>
                00
              </p>
              <div
                className={clsx(
                  "text-gray-500",
                  "-translate-x-1",
                  "group-hover:translate-x-2",
                  "transition"
                )}
              >
                &#8594;
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </main>
  );
}
