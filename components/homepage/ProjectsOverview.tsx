import clsx from "clsx";
import { TiltOnlyBigScreen } from "../TiltOnlyBigScreen";
import Image from "next/image";
import { useMemo } from "react";

export function ProjectsOverview() {
  const projects = useMemo(
    () => [
      {
        title: "Chinese Lantern Lamp",
        imgUrl: "chinese-lantern/thumbnail.jpeg",
      },
      {
        title: "Flock Lights",
        imgUrl: "flock-lights/thumbnail.jpeg",
      },
    ],
    []
  );

  return (
    <div
      id="projects"
      className={clsx("bg-[#0e0e0e]", "flex", "justify-center")}
    >
      <div className={clsx("lg:max-w-6xl", "lg:w-full")}>
        <p
          className={clsx(
            "text-[#282828]",
            "font-extrabold",
            "text-5xl",
            "md:text-7xl",
            "md:pl-16",
            "pt-8"
          )}
        >
          PROJECTS
        </p>

        <div
          className={clsx(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "space-y-32",
            "py-24",
            "pr-16"
          )}
        >
          {projects.map((project, i) => (
            <TiltOnlyBigScreen
              key={project.title}
              className={clsx("cursor-pointer")}
            >
              <div
                className={clsx(
                  "absolute",
                  "block",
                  "bottom-0",
                  "left-28",
                  "w-48",
                  "md:w-56",
                  "overflow-visible"
                )}
              >
                <Image
                  className={clsx("object-left-bottom", "w-full", "h-auto")}
                  src={`/imgs/projects/${project.imgUrl}`}
                  width={0}
                  height={0}
                  sizes="100vw"
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
                  {project.title}
                </h2>
                <div className={clsx("h-1", "w-48", "mb-4", "bg-white")}></div>
                <p className={clsx("font-mono", "text-sm", "text-gray-400")}>
                  {i.toString().padStart(2, "0")}
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
            </TiltOnlyBigScreen>
          ))}
        </div>
      </div>
    </div>
  );
}
