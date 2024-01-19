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
} from "@/modules/rust-triplet/pkg/triplet_wasm";

const errorKeyMap = {
  xy: 1,
  xz: 2,
  yz: 3,
  sum: "sum",
};

export default function TripletDesigner() {
  const [gridSize, setGridSize] = useState(14);
  const [fillPercentage, setFillPercentage] = useState(0.5);
  const [tripletError, setTripletError] = useState<Triplet["error"]>({
    xy: 0,
    xz: 0,
    yz: 0,
    sum: 0,
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
    setGridSize(size);
  }, []);

  useEffect(() => {
    tripletWebWorker.current.init().then(() => onShapePlaneUpdated());
    tripletWebWorker.current.setOnFinished((triplet) => {
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
    });
  }, [fillPercentage, gridSize]);

  const inputStyle = useMemo(
    () => ({
      input: clsx(
        "bg-gray-900",
        "border",
        "border-gray-600",
        "text-gray-900",
        "text-sm",
        "rounded-sm",
        "block",
        "w-full",
        "px-2",
        "py-1",
        "text-white",
      ),
      label: clsx("block", "text-md", "text-white", "font-bold", "mb-1"),
    }),
    [],
  );

  return useMemo(
    () => (
      <div className={clsx("flex", "justify-center", "mt-8")}>
        <Toaster />
        <Head>
          <title>Triplet Designer</title>
        </Head>
        <TripletCanvas
          className={clsx("mx-4", "inline-block", "mt-7")} // "border-2", "border-slate-200",
          ref={tripletCanvasRef}
        />
        <div className={clsx("grid", "grid-cols-1", "mx-4")}>
          <div className={clsx("flex", "flex-col", "items-center")}>
            <p className={clsx("text-center", "font-bold", "mb-1")}>Shadow 1</p>
            <P5GridEditor ref={shapePlaneRef1} width={176} onUpdate={onShapePlaneUpdated} />
          </div>
          <div className={clsx("flex", "flex-col", "items-center")}>
            <p className={clsx("text-center", "font-bold", "mt-0.5", "mb-1")}>Shadow 2</p>
            <P5GridEditor ref={shapePlaneRef2} width={176} onUpdate={onShapePlaneUpdated} />
          </div>
          <div className={clsx("flex", "flex-col", "items-center")}>
            <p className={clsx("text-center", "font-bold", "mt-0.5", "mb-1")}>Shadow 3</p>
            <P5GridEditor ref={shapePlaneRef3} width={176} onUpdate={onShapePlaneUpdated} />
          </div>
        </div>

        <div className={clsx("flex", "flex-col", "mx-4", "w-44")}>
          <div className={clsx("flex", "items-center")}>
            <p className={clsx(inputStyle.label, "mr-1.5")}>Grid size</p>
            <NumberInput value={gridSize} min={2} onChange={(v) => updateGridSize(v)} />
          </div>
          <div className={clsx("max-w-[5rem]", "mt-4")}>
            <label htmlFor="letters" className={inputStyle.label}>
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
          <div className={clsx("flex", "mt-2")}>
            {["thin", "normal", "bold"].map((thicknessName, i) => (
              <div
                key={thicknessName}
                className={clsx(
                  "px-1",
                  "text-xs",
                  i == 0 && "rounded-l",
                  i == 2 && "rounded-r",
                  i == thickness ? "bg-gray-700" : "bg-gray-600",
                  "hover:cursor-pointer",
                  "hover:bg-gray-700",
                )}
                onClick={() => setThickness(i)}
              >
                {thicknessName}
              </div>
            ))}
          </div>
          <div className={clsx("grid", "grid-cols-2", "mt-6", "font-semibold")}>
            {Object.entries(tripletError).map(([key, value]) => (
              <React.Fragment key={key}>
                <p>Error {errorKeyMap[key as "xy"]}:</p>
                <p className={clsx("font-mono", "font-thin", value > 0 && "text-red-500")}>
                  {value > 0 ? value.toFixed(4) : value}
                </p>
              </React.Fragment>
            ))}
          </div>
          <div className={clsx("mt-6")}>
            <Button label="Random" onClick={setRandomShapePlanes} />
            <div className={clsx("flex", "items-center", "mt-1")}>
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
          <div className={clsx("mt-6")}>
            <Button label="Export" onClick={() => tripletCanvasRef.current?.export()} />
          </div>
        </div>
      </div>
    ),
    [tripletError, gridSize, fillPercentage, thickness],
  );
}
