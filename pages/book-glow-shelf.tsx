import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import { ProjectContainer } from "@/components/ProjectContainer";

export default function BookGlowShelf() {
  return (
    <ProjectContainer
      index={2}
      title="Book Glow Shelf"
      thumbnailUrl="/imgs/projects/book-glow-shelf/thumbnail.jpg"
    >
      <p>
        This is a project I started during my time at the{" "}
        <a
          href="https://www.hmcollege.nl/"
          className={clsx("underline", "hover:text-blue-300")}
          target="_blank"
        >
          Hout- en Meubeleringscollege
        </a>{" "}
        and finished properly at home. There is a LED strip at the bottom of the shelf and the idea
        is that light follows the books. So if you add a book to the shelf the light will expand to
        also highlight the spine of the newly added book. Can be controlled by two switches at the
        top. The color of the LEDs can be changed or a color cycle mode can be set.
        <br />
        <br />
        Made with WS2812b individually addressable LEDs, MDF boards and very thin veneer multiplex
        to cover the whole shelf with. Two infrared proximity sensors on both sides of the shelf are
        used to measure the distance between one side of the shelf and the books. An Arduino Nano
        uses this information to control the LEDs. It was quite tricky to get the sensors to measure
        correctly, so I had to tune them.
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
          src="/imgs/projects/book-glow-shelf/front.jpg"
          alt="front"
          width={450}
          height={450}
        />
        <Image
          src="/imgs/projects/book-glow-shelf/thumbnail.jpg"
          alt="side"
          width={450}
          height={450}
        />
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
        <Image src="/imgs/projects/book-glow-shelf/switches.jpg" alt="" width={400} height={400} />
        <Image src="/imgs/projects/book-glow-shelf/sensor.jpg" alt="" width={400} height={400} />
      </div>
      <div className={clsx("flex", "justify-center", "mt-8", "lg:mt-16")}>
        <iframe
          className={clsx(
            "max-w-[19rem]",
            "w-[600px]",
            "md:w-[728px]",
            "md:h-[409px]",
            "md:max-w-none",
          )}
          src="https://www.youtube.com/embed/-766_B8_mSs?si=lxSyOasmwEAyiQRN"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className={clsx("flex", "justify-center", "mt-8", "lg:mt-16")}>
        <div>
          <h3 className={clsx("font-semibold", "text-lg", "mb-2", "text-center")}>Prototype</h3>
          <iframe
            className={clsx(
              "max-w-[19rem]",
              "w-[600px]",
              "md:w-[728px]",
              "md:h-[409px]",
              "md:max-w-none",
            )}
            src="https://www.youtube.com/embed/hyorGcveyK8?si=XwXFdOzUx6jA376Z"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </ProjectContainer>
  );
}
