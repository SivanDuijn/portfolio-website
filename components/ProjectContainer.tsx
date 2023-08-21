import clsx from "clsx";
import Image from "next/image";
import { UnderlineSVG } from "./UnderlineSVG";
import { ReactNode } from "react";
import Link from "next/link";

export type ProjectContainerProps = {
  title: string;
  thumbnailUrl: string;
  index: number;
  children?: ReactNode;
};

export function ProjectContainer(props: ProjectContainerProps) {
  return (
    <div
      className={clsx(
        "bg-[#141414]",
        "w-full",
        "flex",
        "justify-center",
        "overflow-hidden",
        "min-h-screen"
      )}
    >
      <Link
        href={"/#projects"}
        className={clsx(
          "absolute",
          "group",
          "top-0",
          "left-0",
          "w-24",
          "h-16",
          "flex",
          "justify-center",
          "items-center",
          "bg-gradient-to-r",
          "from-sky-900/50",
          "font-serif",
          "text-3xl",
          "text-gray-400",
          "font-extrabold"
        )}
      >
        <span
          className={clsx("group-hover:-translate-x-2", "transition", "pb-1")}
        >
          ←
        </span>
      </Link>
      <div
        className={clsx(
          "md:max-w-6xl",
          "md:w-full",
          "px-8",
          "sm:px-16",
          "py-20",
          "sm:py-24"
        )}
      >
        <div
          className={clsx(
            "flex",
            "flex-col-reverse",
            "flex-wrap",
            "items-center",
            // "lg:items-start",
            "lg:flex-row",
            "pb-16"
          )}
        >
          <Image
            src={props.thumbnailUrl}
            width={200}
            height={200}
            alt={"Image for " + props.title}
          />
          <div>
            <div className={clsx("py-6", "pl-0", "lg:pl-16", "inline-block")}>
              <h2
                className={clsx(
                  "text-2xl",
                  "lg:text-5xl",
                  "font-extrabold",
                  "mb-4"
                )}
              >
                {props.title}
              </h2>
              <UnderlineSVG color="white" />
              <p className={clsx("font-mono", "mt-6", "text-gray-400")}>
                {props.index.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {props.children}
      </div>
    </div>
  );
}
