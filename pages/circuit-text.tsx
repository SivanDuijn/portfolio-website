import clsx from "clsx";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import P5CircuitText from "@/components/p5CircuitText/p5CircuitText";
import { ProjectContainer } from "@/components/ProjectContainer";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";

export default function CircuitText() {
  const isSmallScreen = useIsSmallScreen();
  const [text, setText] = useState("Example");
  const [debug, setDebug] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => setText(e.target.value), 400);
  }, []);

  return (
    <ProjectContainer index={7} title="Circuit Text">
      <div className={clsx("flex", "flex-col", "items-center")}>
        <div className={clsx("z-10")}>
          <P5CircuitText text={text} fontSize={isSmallScreen ? 50 : 80} debug={debug} />
        </div>
        <div className={clsx("flex", "flex-col", "space-y-1", "my-10")}>
          <div
            className={clsx(
              "flex",
              "w-full",
              "rounded",
              "border",
              "focus-within:ring-1",
              "border-slate-700",
              "focus-within:border-primary",
              "focus-within:ring-primary",
              "max-w-md",
            )}
          >
            <input
              type="text"
              id="textField"
              name="textField"
              placeholder="Your text here"
              aria-describedby="textFieldDescription"
              autoComplete="off"
              onChange={onInputChange}
              className={clsx(
                "grow",
                "p-2",
                "rounded",
                "bg-slate-800",
                "border-none",
                "focus:ring-0",
                "text-slate-50",
                "placeholder:text-slate-400",
              )}
            />
          </div>
        </div>
        <label className="relative inline-flex items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={debug}
            onChange={() => setDebug(!debug)}
          />
          <div className="w-11 h-6 rounded-full peer bg-gray-700 peer-focus:ring-4  peer-focus:ring-teal-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-teal-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-300">Debug</span>
        </label>
        {debug && (
          <p className={clsx("mt-4", "text-gray-400")}>
            Now you can see that first points along the edges of the characters are calculated. Then
            points that lie inside a character are removed. We want to minimize the chance that
            lines will collide, so we remove points that lie inside the characters. And, we shoot
            lines from each point and check if they intersect at a certain distance with other
            lines. What is left is shown as red lines.
          </p>
        )}
      </div>
    </ProjectContainer>
  );
}
