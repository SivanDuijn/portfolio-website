import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/atoms/Button";
import CheckBox from "@/components/atoms/CheckBox";
import WSDThreeJSView from "@/components/WireStructureDesigner/WSDThreeJSView";

export default function WireStructureDesigner() {
  const searchParams = useSearchParams();

  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewGLRef = useRef<WSDThreeJSView>();

  useEffect(() => {
    viewGLRef.current = new WSDThreeJSView(threeCanvasRef.current || undefined, 900, 700);
  }, []);

  useEffect(() => {
    const treeData = searchParams.get("tree");
    if (treeData && treeData.length > 0 && viewGLRef.current) {
      viewGLRef.current.fromString(treeData);
    }
  }, [searchParams]);

  const onLanternsShowChanged = useCallback((show: boolean) => {
    if (viewGLRef.current)
      if (show) viewGLRef.current.showLanterns();
      else viewGLRef.current.hideLanterns();
  }, []);

  const onSharePressed = useCallback(() => {
    if (!viewGLRef.current) return;

    const hostName = "www.sivanduijn.com";
    // const hostName = "localhost:3000";
    const s = hostName + "/wire-structure-designer?tree=" + viewGLRef.current.toString();
    navigator.clipboard.writeText(s);
    toast.success("Copied to clipboard!");
  }, []);

  return (
    <div className={clsx("text-black", "bg-white", "min-h-[100svh]")}>
      <Toaster
        toastOptions={{
          style: {
            boxShadow: "-1px 1px black",
            border: "1px solid black",
            paddingTop: 5,
            paddingBottom: 5,
          },
        }}
        containerStyle={{ top: 25 }}
      />
      <div className={clsx("flex", "flex-col", "justify-center", "items-center")}>
        <p
          style={{
            textShadow: "-1px 1px 1px black",
            WebkitTextStroke: "1.5px black",
            color: "#dddddd",
          }}
          className={clsx(
            "font-roboto",
            "font-extrabold",
            "text-4xl",
            "pt-5",
            "px-10",
            // "md:text-4xl",
            "w-full",
            "text-center",
            // "hidden",
          )}
        >
          Wire Structure Designer
        </p>
        <div className={clsx("flex", "flex-row", "space-x-4", "font-roboto", "mt-8")}>
          <div className={clsx("w-52", "mt-6", "space-y-2")}>
            <p>
              <span className={clsx("font-bold", "text-green-700")}>Shift</span> click to add
            </p>
            <p>
              <span className={clsx("font-bold", "text-blue-700")}>Ctrl</span> click to stop
            </p>
            <p>
              <span className={clsx("font-bold", "text-red-700")}>Alt</span> click to delete
            </p>
          </div>
          <canvas className={clsx("border-2", "rounded-md", "border-black")} ref={threeCanvasRef} />
          <div className={clsx("w-52")}>
            <CheckBox
              className={clsx("mt-6")}
              label="Show lanterns"
              size="medium"
              initial={true}
              onChange={onLanternsShowChanged}
            />
            <Button className={clsx("mt-5")} label="Share" onClick={onSharePressed} />
          </div>
        </div>
      </div>
    </div>
  );
}
