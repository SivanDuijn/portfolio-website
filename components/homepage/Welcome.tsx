import clsx from "clsx";
import { useMemo } from "react";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";
import P5CircuitText from "../p5CircuitText/p5CircuitText";
import { JumblingText } from "../textJumbler/JumblingText";
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
      {
        url: "#about",
        title: "About",
        description: "More about me and my interests.",
      },
      {
        url: "#contact",
        title: "Get in Touch",
        description: "Find out how to reach me effectively.",
      },
    ],
    [],
  );

  return (
    <div
      id="top"
      className={clsx(
        "flex",
        "min-h-[100svh]",
        "flex-col",
        "items-center",
        "justify-between",
        "p-10",
        "pt-12",
        "sm:p-24",
        "m-0",
        "relative",
        "overflow-hidden",
      )}
    >
      <div
        className={clsx("absolute", "backgroundColorShadowSkyBlue", "backgroundColorShadowBlue")}
      ></div>

      <div className={clsx("z-10", isSmallScreen ? "mt-6" : "mt-16")}>
        <P5CircuitText text={"Welcome"} fontSize={isSmallScreen ? 50 : 80} />
      </div>

      <JumblingText
        texts={[
          "My name is Sivan Duijn",
          "Take a look around",
          "Enjoy!",
          "•͡˘㇁•͡˘",
          "ʕ·͡ᴥ·ʔ",
          "	ʕノ•ᴥ•ʔノ ︵ ┻━┻",
          "╭(ʘ̆~◞౪◟~ʘ̆)╮",
          "(◕ᴥ◕ʋ)",
        ]}
        repeat
        className={clsx(
          isSmallScreen ? "mb-16" : "mb-40",
          "font-mono",
          "text-xl",
          "sm:text-3xl",
          "font-extrabold",
          "z-10",
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
          "lg:m-0",
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
              "lg:py-4",
            )}
          >
            <div>
              <h2
                className={clsx("inline-block", "mb-3", "text-xl", "lg:text-2xl", "font-semibold")}
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
                  "lg:block",
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
          "text-gray-400",
        )}
      >
        <span className={clsx("group-hover:translate-y-2", "transition")}>&#8595;</span>
      </a>
    </div>
  );
}
