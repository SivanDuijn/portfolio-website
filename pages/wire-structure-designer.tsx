import clsx from "clsx";
import { useEffect, useRef } from "react";
import WSDThreeJSView from "@/components/WireStructureDesigner/WSDThreeJSView";

export default function WireStructureDesigner() {
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewGLRef = useRef<WSDThreeJSView>();

  useEffect(() => {
    viewGLRef.current = new WSDThreeJSView(threeCanvasRef.current || undefined, 900, 700);
  }, []);

  return (
    <div className={clsx("text-black", "bg-white", "min-h-[100svh]")}>
      <div className={clsx("flex", "flex-col", "justify-center", "items-center")}>
        <p
          style={{
            textShadow: "-1px 1px 1px black",
            WebkitTextStroke: "1.5px black",
            color: "pink",
          }}
          className={clsx(
            "font-roboto",
            "font-extrabold",
            "text-5xl",
            "pt-6",
            "px-10",
            "md:text-5xl",
            "w-full",
            "text-center",
            "hidden",
          )}
        >
          Wire Structure Designer
        </p>
        <canvas
          className={clsx("mt-10", "border-2", "rounded-md", "border-black")}
          ref={threeCanvasRef}
        />
      </div>
    </div>
  );
}
