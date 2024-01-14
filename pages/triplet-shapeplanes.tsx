import clsx from "clsx";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import NumberInput from "@/components/NumberInput";
import Button from "@/components/triplets/atoms/Button";
import { fromWasmShapePlane } from "@/components/triplets/models";
import { P5GridEditor, P5GridEditorElement } from "@/components/triplets/P5ShapePlaneEditor";
import init, { get_random_shape_planes } from "@/modules/rust-triplet/pkg/triplet_wasm";

export default function RandomShapePlanesViewer() {
  const wasmReady = useRef(false);
  const [gridSize, setGridSize] = useState(10);
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
  ]);

  useEffect(() => {
    init().then(() => {
      wasmReady.current = true;
      const sps = get_random_shape_planes(gridSize, gridSize, editorRefs.current.length);
      sps.forEach((sp, i) => editorRefs.current[i]?.setGrid(fromWasmShapePlane(sp)));
    });
  }, []);

  const refresh = useCallback(() => {
    if (!wasmReady.current) return;

    const sps = get_random_shape_planes(gridSize, gridSize, editorRefs.current.length);
    sps.forEach((sp, i) => editorRefs.current[i]?.setGrid(fromWasmShapePlane(sp)));
  }, [gridSize]);

  useEffect(() => {
    if (!wasmReady.current) return;

    const sps = get_random_shape_planes(gridSize, gridSize, editorRefs.current.length);
    sps.forEach((sp, i) => editorRefs.current[i]?.setGrid(fromWasmShapePlane(sp)));
  }, [gridSize]);

  return (
    <div className={clsx("min-h-[100svh]")}>
      <Head>
        <title>Random Shapeplanes</title>
        {/* <meta name="theme-color" content="#ffffff" /> */}
      </Head>
      <div className={clsx("flex", "flex-col", "items-center", "space-y-8", "pt-4")}>
        <div className={clsx("flex", "items-center")}>
          <p className={clsx("font-bold", "mr-4")}>Grid size</p>
          <NumberInput value={gridSize} min={2} max={100} onChange={(v) => setGridSize(v)} />
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
