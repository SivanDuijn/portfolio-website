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
} from "@/modules/rust-triplet/pkg/triplet_wasm";

export default function RandomShapePlanesViewer() {
  const wasmReady = useRef(false);
  const [gridSize, setGridSize] = useState(14);
  const [fillPercentage, setFillPercentage] = useState(0.5);
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
    <div className={clsx("min-h-[100svh]")}>
      <Head>
        <title>Random Shapeplanes</title>
        {/* <meta name="theme-color" content="#ffffff" /> */}
      </Head>
      <div className={clsx("flex", "flex-col", "items-center", "space-y-8", "pt-4")}>
        <div className={clsx("flex", "items-center")}>
          <p className={clsx("font-bold", "mr-2")}>Grid size</p>
          <NumberInput value={gridSize} min={2} max={100} onChange={(v) => setGridSize(v)} />
          <p className={clsx("font-bold", "ml-8", "mr-2")}>Grid size</p>
          <NumberInput
            value={fillPercentage}
            min={0.1}
            max={1}
            incrStep={0.1}
            decrStep={-0.1}
            disableLargeStep
            onChange={(v) => setFillPercentage(v)}
          />
        </div>
        <Button label="Refresh" className="mb-32" onClick={refresh} />
        <div className={clsx("grid", "grid-cols-5")}>
          {editorRefs.current.map((r, i) => (
            <P5GridEditor
              key={i}
              ref={(el) => {
                editorRefs.current[i] = el;
              }}
              className={clsx("m-6")}
              width={175}
              noInteraction
            />
          ))}
        </div>
      </div>
    </div>
  );
}
