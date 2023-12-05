import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { TiltOnlyBigScreen } from "../TiltOnlyBigScreen";

export type ProjectCardProps = {
  title: string;
  index: number;
  imgUrl: string;
  url: string;
  className?: string;
};

export function ProjectCard(props: ProjectCardProps) {
  return (
    <div className={clsx("flex", "justify-center")}>
      <TiltOnlyBigScreen className={clsx(props.className)}>
        <Link href={props.url}>
          <div
            className={clsx(
              "absolute",
              "block",
              "bottom-0",
              "left-28",
              "w-48",
              "md:w-56",
              "overflow-visible",
            )}
          >
            <Image
              className={clsx("object-left-bottom", "w-full", "h-auto")}
              src={`/imgs/projects/${props.imgUrl}`}
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
            <h2 className={clsx("mb-4", "max-w-[8rem]", "text-2xl", "font-extrabold")}>
              {props.title}
            </h2>
            <div className={clsx("h-1", "w-48", "mb-4", "bg-white")}></div>
            <p className={clsx("font-mono", "text-sm", "text-gray-400")}>
              {props.index.toString().padStart(2, "0")}
            </p>
            <div
              className={clsx(
                "text-gray-500",
                "-translate-x-1",
                "group-hover:translate-x-2",
                "transition",
              )}
            >
              &#8594;
            </div>
          </div>
        </Link>
      </TiltOnlyBigScreen>
    </div>
  );
}
