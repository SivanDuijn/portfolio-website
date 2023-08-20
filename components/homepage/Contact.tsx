import clsx from "clsx";
import { UnderlineSVG } from "../UnderlineSVG";

export function Contact() {
  return (
    <div
      id="contact"
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
          <h1>CONTACT</h1>
          <UnderlineSVG />
        </div>
      </div>

      <div
        className={clsx(
          "grid",
          "grid-cols-1",
          "lg:grid-cols-2",
          "justify-items-end",
          "lg:max-w-6xl",
          "lg:w-full",
          "p-16"
        )}
      >
        <p>
          Interested in connecting with me, discussing opportunities, or curious
          about what I can do for you? Please don&apos;t hesitate to reach out
          using any of these methods.
        </p>

        <div
          className={clsx(
            "flex",
            "justify-center",
            "w-full",
            "mt-12",
            "lg:mt-0"
          )}
        >
          <div>
            <UnderlineSVG
              className={clsx("mb-4", "rotate-180")}
              extraLengthLeft={-15}
              widthRatio={0.3}
            />
            <div className={clsx("flex", "flex-row")}>
              <div className={clsx("font-semibold", "mr-8")}>
                <p className="mb-2">LinkedIn</p>
                <p>Email</p>
              </div>
              <div>
                <a
                  href="https://www.linkedin.com/in/sivan-duijn"
                  className={clsx(
                    "underline",
                    "hover:text-blue-300",
                    "block",
                    "mb-2"
                  )}
                  target="_blank"
                >
                  linkedin.com/in/sivan-duijn
                </a>
                <a
                  href="mailto:shjduijn1997@gmail.com"
                  className={clsx("underline", "hover:text-blue-300", "block")}
                >
                  shjduijn1997@gmail.com
                </a>
              </div>
            </div>
            <UnderlineSVG
              className={clsx("mt-5")}
              widthRatio={0.3}
              extraLengthLeft={-15}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
