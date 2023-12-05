import clsx from "clsx";
import Image from "next/image";
import { ProjectContainer } from "@/components/ProjectContainer";

export default function DandelionGlow() {
  return (
    <ProjectContainer
      index={3}
      title="Dandelion Glow"
      thumbnailUrl="/imgs/projects/dandelion-glow/thumbnail.jpeg"
    >
      <p>
        A light made from dandelion seeds, heavily inspired by{" "}
        <a
          href="https://studiodrift.com/work/dandelight/"
          className={clsx("underline", "hover:text-blue-300")}
          target="_blank"
        >
          Studio Drifts dandelight
        </a>
        . The seeds are glued to an LED and a simple switch is used for switching it on.
      </p>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "items-center",
          "space-y-8",
          "lg:space-y-0",
          "lg:flex-row",
          "lg:justify-between",
          "mt-12",
        )}
      >
        <Image
          src="/imgs/projects/dandelion-glow/thumbnail2.jpeg"
          alt="close"
          width={450}
          height={450}
        />
        <Image src="/imgs/projects/dandelion-glow/whole.jpg" alt="whole" width={450} height={450} />
      </div>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "items-center",
          "space-y-8",
          "lg:space-y-0",
          "lg:flex-row",
          "lg:justify-between",
          "mt-12",
        )}
      >
        <Image
          src="/imgs/projects/dandelion-glow/making.jpeg"
          alt="close"
          width={300}
          height={300}
        />
      </div>
    </ProjectContainer>
  );
}
