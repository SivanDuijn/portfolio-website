import clsx from "clsx";
import P5CircuitText from "../p5CircuitText/p5CircuitText";
import { JumblingText } from "../textJumbler/JumblingText";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";
import { useMemo } from "react";
import { UnderlineSVG } from "../UnderlineSVG";

export function Welcome() {
  const isSmallScreen = useIsSmallScreen();

  const links = useMemo(
    () => [
      {
        url: "#projects",
        title: "Projects",
        description:
          "Explore projects I've worked on, related to woodworking, electronics and programming.",
      },
      // {
      //   url: "#work",
      //   title: "Work",
      //   description: "Gain insights into my professional background.",
      // },
      {
        url: "#about",
        title: "About",
        description: "Delve deeper into my persona and interests.",
      },
      {
        url: "#contact",
        title: "Get in Touch",
        description: "Find out how to best contact me.",
      },
    ],
    []
  );

  return (
    <div
      id="top"
      className={clsx(
        "flex",
        "min-h-screen",
        "flex-col",
        "items-center",
        "justify-between",
        "p-10",
        "pt-12",
        "sm:p-24",
        "m-0",
        "relative",
        "overflow-x-hidden"
      )}
    >
      <div
        className={clsx(
          "absolute",
          "backgroundColorShadowSkyBlue",
          "backgroundColorShadowBlue"
        )}
      ></div>

      <div className={clsx("z-10")}>
        <P5CircuitText text={"Welcome"} fontSize={isSmallScreen ? 50 : 80} />
      </div>

      <JumblingText
        initialText=""
        changeInto={[
          "My name is Sivan Duijn",
          "Take a look around",
          "Make yourself at home",
          "Grab a coffee or tea",
          "Sit back and enjoy!",
          "•͡˘㇁•͡˘",
          "ʕ·͡ᴥ·ʔ",
          "	ʕノ•ᴥ•ʔノ ︵ ┻━┻",
          "╭(ʘ̆~◞౪◟~ʘ̆)╮",
          "(◕ᴥ◕ʋ)",
        ]}
        repeat
        className={clsx(
          "mb-16",
          "font-mono",
          "text-xl",
          "sm:text-3xl",
          "font-extrabold",
          "z-10"
        )}
      />

      <div
        className={clsx(
          "flex",
          "z-10",
          "flex-col",
          "lg:flex-row",
          "justify-around",
          "text-center",
          "lg:text-left",
          "lg:max-w-5xl",
          "lg:w-full",
          "mb-8",
          "lg:m-0"
        )}
      >
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className={clsx(
              "group",
              "max-w-[16rem]",
              "rounded-lg",
              "border",
              "border-transparent",
              "px-5",
              "py-2",
              "lg:py-4"
            )}
          >
            <div>
              <h2
                className={clsx(
                  "inline-block",
                  "mb-3",
                  "text-xl",
                  "lg:text-2xl",
                  "font-semibold"
                )}
              >
                {link.title}
                {/* <span
                  className={clsx(
                    "inline-block",
                    "transition-transform",
                    "group-hover:translate-x-1",
                    "motion-reduce:transform-none"
                  )}
                >
                  -&gt;
                </span> */}
                <UnderlineSVG
                  className="mt-0"
                  hover
                  widthRatio={1}
                  extraLengthLeft={-2}
                  r={5}
                  cx={-10}
                  cy={-8}
                  strokeWidth={2}
                  color="#999"
                />
              </h2>
              <p
                className={clsx(
                  "m-0",
                  "max-w-[30ch]",
                  "text-sm",
                  "opacity-50",
                  "hidden",
                  "lg:block"
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
  );
}
