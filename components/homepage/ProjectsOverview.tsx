import clsx from "clsx";
import { ProjectCard } from "./ProjectCard";
import { UnderlineSVG } from "../UnderlineSVG";

export function ProjectsOverview() {
  return (
    <div
      id="projects"
      className={clsx("bg-[#141414]", "flex", "flex-col", "items-center")}
    >
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
            "md:mt-16"
          )}
        >
          <h1>PROJECTS</h1>
          <UnderlineSVG />
        </div>
      </div>
      <div className={clsx("md:max-w-6xl", "md:w-full")}>
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
            "md:grid-cols-2",
            "grid-cols-1",
            "items-end",
            "space-y-20",
            "py-0",
            "mr-8",
            "md:py-20",
            "mt-16",
            "md:mt-6",
            "mb-16",
            "md:my-16"
          )}
        >
          <ProjectCard
            index={0}
            title={"Physalis Glow Light"}
            imgUrl={"chinese-lantern/thumbnail.jpeg"}
            url={"chinese-lantern-lamp"}
          />
          <ProjectCard
            index={1}
            title={"Flock Lights"}
            imgUrl={"flock-lights/thumbnail.jpeg"}
            url={"flock-lights"}
          />
          <ProjectCard
            index={2}
            title={"Book Glow Shelf"}
            imgUrl={"book-glow-shelf/thumbnail.jpg"}
            url={"book-glow-shelf"}
          />
          <ProjectCard
            index={3}
            title={"Dandelion Glow"}
            imgUrl={"dandelion-glow/thumbnail.jpeg"}
            url={"dandelion-glow"}
          />
        </div>
      </div>
    </div>
  );
}
