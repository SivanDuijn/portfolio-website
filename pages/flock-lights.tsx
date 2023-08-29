import { ProjectContainer } from "@/components/ProjectContainer";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function FlockLights() {
  return (
    <ProjectContainer
      index={1}
      title="Flock Lights"
      thumbnailUrl="/imgs/projects/flock-lights/thumbnail.jpeg"
    >
      <p>
        The concept behind this decorative lighting fixture is to depict the
        graceful movement of birds in flight. Suspended in the air are multiple
        spheres. Envision birds gracefully maneuvering through their these
        spheres. Each sphere dynamically adjusts its light intensity in response
        to the proximity of the birds.
        <br />
        <br />
        On a grander scale, with a lot more spheres, the scene could resemble a
        flock of birds. One might observe the mesmerizing spectacle of bird
        groups forming and dissolving, creating a captivating display. While
        this effect is not quite achieved at this moment, the current effect is
        still quite enchanting, evoking the sensation of something in motion
        among the spheres.
        <br />
        <br />
        The lamp itself is crafted using WS2812b individually addressable LEDs
        attached to ping pong balls. A Raspberry Pi serves as the controller for
        these LEDs the{" "}
        <Link
          href={"/flocking-simulation"}
          className={clsx("underline", "hover:text-blue-300")}
        >
          flocking simulation
        </Link>
        . The Raspberry Pi knows the coordinates of each ping pong ball, a task
        that required a bit of effort to measure. This information allows it to
        calculate the distance between each sphere and any nearby bird, thereby
        adjusting the intensity of the LEDs accordingly. The spheres are
        suspended from a bicycle wheel with rope woven between the spokes,
        forming an intriguing ceiling display.
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
          "mt-12"
        )}
      >
        <Image
          src="/imgs/projects/flock-lights/prototype.jpg"
          alt="Physalis glow light in daylight"
          width={300}
          height={300}
        />
        <Image
          src="/imgs/projects/flock-lights/daylight.jpg"
          alt="Physalis glow light in daylight"
          width={300}
          height={300}
        />
        <Image
          src="/imgs/projects/flock-lights/underside.jpg"
          alt="Physalis glow light in daylight"
          width={300}
          height={300}
        />
      </div>
      <div className={clsx("flex", "justify-center", "mt-8", "lg:mt-16")}>
        <iframe
          className={clsx(
            "max-w-[18rem]",
            "w-[354px]",
            "h-[510px]",
            "sm:h-[630px]",
            "sm:max-w-none"
          )}
          src="https://www.youtube.com/embed/acuCjHgUuus?si=jm-HfK6SpYWQ1aS3"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </ProjectContainer>
  );
}
