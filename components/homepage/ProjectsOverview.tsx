import clsx from "clsx";
import { ProjectCard } from "./ProjectCard";
import { UnderlineSVG } from "../UnderlineSVG";

export function ProjectsOverview() {
  return (
    <div
      id="projects"
      className={clsx("bg-[#0e0e0e]", "flex", "justify-center")}
    >
      <div className={clsx("lg:max-w-6xl", "lg:w-full")}>
        <div
          className={clsx(
            "inline-block",
            "text-[#282828]",
            "font-extrabold",
            "text-5xl",
            "md:text-7xl",
            "md:ml-16",
            "mt-8"
          )}
        >
          <p>PROJECTS</p>
          <UnderlineSVG />
        </div>
        {/* <div
          className={clsx(
            "inline-block",
            "relative",
            "text-[#474747]",
            "font-extrabold",
            "text-3xl",
            "md:text-5xl",
            "md:ml-28",
            "mt-8"
          )}
        >
          <p>LAMPS</p>
          <UnderlineSVG />
        </div> */}

        <div
          className={clsx(
            "grid",
            "lg:grid-cols-2",
            "grid-cols-1",
            "items-end",
            "py-24",
            "mt-16"
          )}
        >
          <ProjectCard
            index={0}
            title={"Chinese Lantern Lamp"}
            imgUrl={"chinese-lantern/thumbnail.jpeg"}
          />
          <ProjectCard
            index={1}
            title={"Flock Lights"}
            imgUrl={"flock-lights/thumbnail.jpeg"}
          />
        </div>
      </div>
    </div>
  );
}
