import { ProjectContainer } from "@/components/ProjectContainer";
import clsx from "clsx";
import Image from "next/image";

export default function ChineseLanterLamp() {
  return (
    <ProjectContainer
      index={0}
      title="Physalis Glow Light"
      thumbnailUrl="/imgs/projects/chinese-lantern/thumbnail.jpeg"
    >
      <div
        className={clsx("flex", "flex-col-reverse", "items-center", "md:block")}
      >
        <Image
          className={clsx("float-right", "ml-0", "md:ml-8", "mb-4", "mt-2")}
          src="/imgs/projects/chinese-lantern/physalis-alkekengi.jpg"
          alt="Physalis alkekengi"
          width={300}
          height={300}
        />
        <p className={clsx("text-justify")}>
          A decorative mood light made from the seed shells of the chinese
          lantern plant (Physalis alkekengi). It uses copper wire from a
          microwave, orange LED&apos;s and a piece of birch wood for the trunk.
          In this piece of birch wood an Arduino nano is hidden as the brains
          for this lamp. A simple switch is provided to turn the lamp on and of.
          There are two lighting modes, one were all lanterns are on, and one
          where they slowly fade in and out.
          <br />
          <br />
          On this Arduino nano an algorithm runs that lights the lantern shells
          one by one. The idea is that when a lantern is ignited and while its
          light intensity increases, its range expands as well. When another
          lantern comes within this range, it is ignited. So they light each
          other in a sense. This did not quite work out the way I hoped for, but
          maybe with a lot more lights it will have a better effect.
        </p>
      </div>
      <div className={clsx("flex", "justify-center", "mt-6", "md:mt-16")}>
        <iframe
          className={clsx("max-w-xs", "sm:max-w-none")}
          width="560"
          height="315"
          src="https://www.youtube.com/embed/RR_TjZPsRRY?si=3y-wGHZOn7BK3UB5"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className={clsx("flex", "mt-8", "justify-center")}>
        <Image
          src="/imgs/projects/chinese-lantern/in-daylight.jpg"
          alt="Physalis glow light in daylight"
          width={300}
          height={300}
        />
      </div>
    </ProjectContainer>
  );
}
