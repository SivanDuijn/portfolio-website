import clsx from "clsx";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import NumberInput from "@/components/NumberInput";
import Button from "@/components/triplets/atoms/Button";
import { fromWasmShapePlane } from "@/components/triplets/models";
import { P5GridEditor, P5GridEditorElement } from "@/components/triplets/P5ShapePlaneEditor";
import init, {
  ShapePlaneFillRandomness,
  get_random_shape_planes,
} from "@/modules/rust-triplet/pkg/triplet_wasm_lib";

const labelClassname = clsx(
  "absolute",
  "origin-top-left",
  "-rotate-90",
  "bottom-0",
  "-left-4",
  "font-mono",
  "font-bold",
);

export default function RandomShapePlanesViewer() {
  const wasmReady = useRef(false);
  const [gridSize, setGridSize] = useState(14);
  const [fillPercentage, setFillPercentage] = useState(0.7);
  const [darkTheme, setDarkTheme] = useState(false);
  const editorRefs = useRef<(P5GridEditorElement | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    init().then(() => {
      wasmReady.current = true;
      refresh();

      // get_random_shape_planes(14, 14, fillPercentage, 200);
    });
  }, []);

  const getRandomShapePlanes = useCallback(
    (randomness: ShapePlaneFillRandomness, amount: number) =>
      get_random_shape_planes(gridSize, gridSize, fillPercentage, randomness, amount),
    [gridSize, fillPercentage],
  );

  const refresh = useCallback(() => {
    if (!wasmReady.current) return;

    let sps = getRandomShapePlanes(ShapePlaneFillRandomness.Fully, 5);
    sps.forEach((sp, i) => editorRefs.current[i]?.setGrid(fromWasmShapePlane(sp)));
    sps = getRandomShapePlanes(ShapePlaneFillRandomness.OptimalEdgesConnect, 5);
    sps.forEach((sp, i) => editorRefs.current[i + 5]?.setGrid(fromWasmShapePlane(sp)));
    sps = getRandomShapePlanes(ShapePlaneFillRandomness.NeighborWeighted, 5);
    sps.forEach((sp, i) => editorRefs.current[i + 10]?.setGrid(fromWasmShapePlane(sp)));
  }, [getRandomShapePlanes]);

  useEffect(() => {
    refresh();
  }, [gridSize, fillPercentage]);

  return (
    <div className={clsx("min-h-[100svh]", !darkTheme && "bg-white text-black")}>
      <Head>
        <title>Random Shapeplanes</title>
        {/* <meta name="theme-color" content="#ffffff" /> */}
      </Head>
      <div className={clsx("flex", "flex-col", "items-center", "space-y-6", "pt-4", "relative")}>
        <p
          className={clsx(
            "absolute",
            "left-40",
            "top-10",
            "text-xs",
            "text-gray-400",
            darkTheme ? "hover:text-gray-100" : "hover:text-gray-800",
            "font-mono",
            "cursor-pointer",
          )}
          onClick={() => setDarkTheme((v) => !v)}
        >
          theme
        </p>
        <div className={clsx("flex", "items-center")}>
          <p className={clsx("font-bold", "mr-2")}>Grid size</p>
          <NumberInput
            darkTheme={darkTheme}
            value={gridSize}
            min={2}
            max={100}
            onChange={(v) => setGridSize(v)}
          />
          <p className={clsx("font-bold", "ml-8", "mr-2")}>Fill %</p>
          <NumberInput
            value={fillPercentage}
            min={0.1}
            max={1}
            incrStep={0.1}
            decrStep={-0.1}
            disableLargeStep
            onChange={setFillPercentage}
            darkTheme={darkTheme}
          />
        </div>
        <Button darkTheme={darkTheme} label="Refresh" onClick={refresh} />
        <div className={clsx("grid", "grid-cols-5", "gap-8")}>
          {editorRefs.current.map((_, i) => (
            <div key={i} className="relative">
              {i == 0 && <p className={labelClassname}>Fully random</p>}
              {i == 5 && <p className={clsx(labelClassname)}>Connect edges</p>}
              {i == 10 && (
                <p style={{ bottom: -40 }} className={clsx(labelClassname)}>
                  Neighbour weighted
                </p>
              )}
              <P5GridEditor
                ref={(el) => {
                  editorRefs.current[i] = el;
                }}
                className={clsx("m-4", "border-2", "border-gray-300", "h-[178.5px]")}
                width={175}
                noInteraction
                darkTheme={darkTheme}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
