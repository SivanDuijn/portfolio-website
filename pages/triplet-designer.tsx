import clsx from "clsx";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import NumberInput from "@/components/NumberInput";
import Button from "@/components/triplets/atoms/Button";
import characters1D from "@/components/triplets/data/characters1D.json";
import { TripletWebWorker } from "@/components/triplets/lib/tripletWebWorker";
import { Triplet, fromWasmShapePlane } from "@/components/triplets/models";
import { P5GridEditor, P5GridEditorElement } from "@/components/triplets/P5ShapePlaneEditor";
import {
  TripletCanvas,
  TripletCanvasElement,
} from "@/components/triplets/TripletCanvas/TripletCanvas";
import init, {
  ConnectednessOptions,
  ShapePlaneFillRandomness,
  get_random_shape_planes,
} from "@/modules/rust-triplet/pkg/triplet_wasm_lib";

export default function TripletDesigner() {
  const [gridSize, setGridSize] = useState(14);
  const [fillPercentage, setFillPercentage] = useState(0.5);
  const [planeEdgeWeightRatio, setPlaneEdgeWeightRatio] = useState(0.5);
  const [tripletError, setTripletError] = useState<Triplet["error"]>({
    sp1: new Set<number>(),
    sp2: new Set<number>(),
    sp3: new Set<number>(),
    totalPercentage: 0,
  });
  const [thickness, setThickness] = useState(1);

  const shapePlaneRef1 = useRef<P5GridEditorElement>(null);
  const shapePlaneRef2 = useRef<P5GridEditorElement>(null);
  const shapePlaneRef3 = useRef<P5GridEditorElement>(null);

  const letterInputRef = useRef<HTMLInputElement>(null);
  const tripletCanvasRef = useRef<TripletCanvasElement>(null);

  const tripletWebWorker = useRef<TripletWebWorker>(new TripletWebWorker());

  const letterInputChanged = useCallback(
    (value: string) => {
      const chars = value.toUpperCase().split("") as ("A" | "B")[];
      const c1 = characters1D[chars[0]];
      const c2 = characters1D[chars[1]];
      const c3 = characters1D[chars[2]];

      if ((c1 || c2 || c3) && gridSize != 14) setGridSize(14);

      if (c1) shapePlaneRef1.current?.setGrid({ values: c1[thickness], h: 14, w: 14 });
      if (c2) shapePlaneRef2.current?.setGrid({ values: c2[thickness], h: 14, w: 14 });
      if (c3) shapePlaneRef3.current?.setGrid({ values: c3[thickness], h: 14, w: 14 });
      onShapePlaneUpdated();
    },
    [gridSize, thickness],
  );
  useEffect(() => {
    if (letterInputRef.current) letterInputChanged(letterInputRef.current.value);
  }, [thickness]);

  const updateGridSize = useCallback((size: number) => {
    shapePlaneRef1.current?.setGrid({
      values: new Array(size * size).fill(0),
      w: size,
      h: size,
    });
    shapePlaneRef2.current?.setGrid({
      values: new Array(size * size).fill(0),
      w: size,
      h: size,
    });
    shapePlaneRef3.current?.setGrid({
      values: new Array(size * size).fill(0),
      w: size,
      h: size,
    });
    onShapePlaneUpdated();
    setGridSize(size);
  }, []);

  useEffect(() => {
    tripletWebWorker.current.init().then(() => onShapePlaneUpdated());
    tripletWebWorker.current.setOnFinished((triplet) => {
      if (shapePlaneRef1.current) shapePlaneRef1.current.setErrorCells(triplet.error.sp1);
      if (shapePlaneRef2.current) shapePlaneRef2.current.setErrorCells(triplet.error.sp2);
      if (shapePlaneRef3.current) shapePlaneRef3.current.setErrorCells(triplet.error.sp3);

      tripletCanvasRef.current?.setTriplet(triplet);
      setTripletError(triplet.error);
    });

    return () => {
      tripletWebWorker.current.destroy();
    };
  }, []);

  const onShapePlaneUpdated = useCallback(() => {
    if (!shapePlaneRef1.current || !shapePlaneRef2.current || !shapePlaneRef3.current) return;

    tripletWebWorker.current.buildTriplet(
      shapePlaneRef1.current.getGrid(),
      shapePlaneRef2.current.getGrid(),
      shapePlaneRef3.current.getGrid(),
      ConnectednessOptions.Volume,
    );
  }, [setTripletError]);

  const setRandomShapePlanes = useCallback(() => {
    init().then(() => {
      const sps = get_random_shape_planes(
        gridSize,
        gridSize,
        fillPercentage,
        ShapePlaneFillRandomness.NeighborWeighted,
        3,
      );
      shapePlaneRef1.current?.setGrid(fromWasmShapePlane(sps[0]));
      shapePlaneRef2.current?.setGrid(fromWasmShapePlane(sps[1]));
      shapePlaneRef3.current?.setGrid(fromWasmShapePlane(sps[2]));
      onShapePlaneUpdated();
    });
  }, [fillPercentage, gridSize]);

  const inputStyle = useMemo(
    () => ({
      input: clsx(
        "bg-gray-100",
        "border",
        "border-gray-600",
        "text-gray-900",
        "text-sm",
        "rounded-sm",
        "block",
        "font-mono",
        "max-w-[3rem]",
        "w-full",
        "px-2",
        "py-1",
      ),
      label: clsx("block", "text-md", "font-bold", "mr-1.5"),
    }),
    [],
  );

  return useMemo(
    () => (
      <div
        className={clsx(
          "flex",
          "justify-center",
          "pt-16",
          "min-h-[100svh]",
          "bg-white",
          "text-black",
        )}
      >
        <Toaster />
        <Head>
          <title>Triplet Designer</title>
        </Head>
        <TripletCanvas
          className={clsx("mx-4", "inline-block", "mt-7")} // "border-2", "border-slate-200",
          ref={tripletCanvasRef}
        />
        <div>
          <div className={clsx("grid", "grid-cols-1", "mx-4")}>
            {shadowEditor(shapePlaneRef1, "Shadow 1", onShapePlaneUpdated, tripletError.sp1.size)}
            {shadowEditor(shapePlaneRef2, "Shadow 2", onShapePlaneUpdated, tripletError.sp2.size)}
            {shadowEditor(shapePlaneRef3, "Shadow 3", onShapePlaneUpdated, tripletError.sp3.size)}
          </div>
        </div>
        <div className={clsx("flex", "flex-col", "w-44")}>
          <div className={clsx("flex", "items-center", "mt-8")}>
            <p className={inputStyle.label}>Grid size</p>
            <NumberInput value={gridSize} min={2} onChange={(v) => updateGridSize(v)} />
          </div>
          <div className={clsx("flex", "items-center", "mt-8")}>
            <label htmlFor="letters" className={clsx(inputStyle.label, "mr-3")}>
              Letters
            </label>
            <input
              ref={letterInputRef}
              type="text"
              className={inputStyle.input}
              maxLength={3}
              onChange={(e) => letterInputChanged(e.target.value)}
              defaultValue={"shg"}
            />
          </div>
          <div className={clsx("flex", "mt-1")}>
            {["thin", "normal", "bold"].map((thicknessName, i) => (
              <div
                key={thicknessName}
                className={clsx(
                  "px-1",
                  "pt-[1px]",
                  "text-xs",
                  "border",
                  "border-x-0",
                  "font-semibold",
                  i == 0 && "rounded-l border-l-[1px]",
                  i == 2 && "rounded-r border-r-[1px]",
                  i == thickness ? "bg-[#fa6e75]" : "bg-[#f6a1a5]",
                  "hover:cursor-pointer",
                  "hover:bg-[#fa6e75]",
                  "border-gray-400",
                )}
                onClick={() => setThickness(i)}
              >
                {thicknessName}
              </div>
            ))}
          </div>

          <div className={clsx("mt-10")}>
            <Button label="Random" className="ml-[29px]" onClick={setRandomShapePlanes} />
            <div className={clsx("flex", "items-center", "mt-0.5")}>
              <p className={clsx("font-bold", "mr-1.5")}>Fill ratio</p>
              <NumberInput
                value={fillPercentage}
                min={0.1}
                max={1}
                incrStep={0.1}
                decrStep={-0.1}
                disableLargeStep
                onChange={setFillPercentage}
              />
            </div>
          </div>

          <div className={clsx("mt-10")}>
            <div
              className={clsx(
                "flex",
                "justify-between",
                "text-xs",
                "font-mono",
                "mb-0",
                "translate-y-2",
                "font-bold",
              )}
            >
              <p style={{ opacity: 0.5 + (1 - planeEdgeWeightRatio) * 0.5 }}>Plane</p>
              <p style={{ opacity: 0.5 + planeEdgeWeightRatio * 0.5 }}>Edges</p>
            </div>
            <input
              type="range"
              step="any"
              defaultValue={0.5}
              min={0}
              max={1}
              className={clsx(
                "transparent",
                "mb-3",
                "h-[4px]",
                "w-full",
                "rounded",
                "cursor-pointer",
                "appearance-none",
                "border-transparent",
                "bg-red-500",
              )}
              onChange={(e) => setPlaneEdgeWeightRatio(parseFloat(e.target.value))}
            />
            <Button
              label="Remove"
              className="ml-[47px]"
              disabled={tripletError.totalPercentage > 0}
              onClick={() =>
                tripletWebWorker.current.removeCellsOfPreviousTriplet(200, planeEdgeWeightRatio, 3)
              }
            />
          </div>

          <p className={clsx("font-bold", "mt-8")}>
            Total incorrect:{" "}
            <span
              className={clsx(
                "font-mono",
                "font-semibold",
                tripletError.totalPercentage > 10 && "text-red-600",
              )}
            >
              {tripletError.totalPercentage.toFixed(0)}%
            </span>
          </p>

          <Button
            label="Export"
            className={clsx("ml-[29px]", "mt-9")}
            onClick={() => tripletCanvasRef.current?.export()}
          />
        </div>
      </div>
    ),
    [tripletError, gridSize, fillPercentage, thickness, planeEdgeWeightRatio],
  );
}

function shadowEditor(
  ref: React.RefObject<P5GridEditorElement>,
  name: string,
  onUpdate: () => void,
  nErrorCells: number,
) {
  return (
    <div className={clsx("flex", "flex-col", "items-center", "mb-3")}>
      <p className={clsx("text-center", "font-bold")}>{name}</p>
      <P5GridEditor className="border" ref={ref} width={176} onUpdate={onUpdate} />
      <p
        className={clsx(
          "font-mono",
          "text-xs",
          "text-gray-600",
          "mt-0.5",
          nErrorCells == 0 && "invisible",
        )}
      >
        <span className={clsx("text-red-500", "font-bold")}>{nErrorCells}</span> incorrect cell
        {nErrorCells == 1 ? "" : "s"}
      </p>
    </div>
  );
}
