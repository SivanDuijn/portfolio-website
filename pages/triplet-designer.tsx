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
    xyWrongCells: [],
    xzWrongCells: [],
    yzWrongCells: [],
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
      if (shapePlaneRef1.current) {
        shapePlaneRef1.current.setErrorCells(triplet.error.xyWrongCells);
      }
      if (shapePlaneRef2.current) {
        shapePlaneRef2.current.setErrorCells(triplet.error.xzWrongCells);
      }
      if (shapePlaneRef3.current) {
        shapePlaneRef3.current.setErrorCells(triplet.error.yzWrongCells);
      }
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
            <div className={clsx("flex", "flex-col", "items-center")}>
              <p className={clsx("text-center", "font-bold", "mb-1")}>Shadow 1</p>
              <P5GridEditor
                className="border"
                ref={shapePlaneRef1}
                width={176}
                onUpdate={onShapePlaneUpdated}
              />
            </div>
            <div className={clsx("flex", "flex-col", "items-center")}>
              <p className={clsx("text-center", "font-bold", "mt-0.5", "mb-1")}>Shadow 2</p>
              <P5GridEditor
                className="border"
                ref={shapePlaneRef2}
                width={176}
                onUpdate={onShapePlaneUpdated}
              />
            </div>
            <div className={clsx("flex", "flex-col", "items-center")}>
              <p className={clsx("text-center", "font-bold", "mt-0.5", "mb-1")}>Shadow 3</p>
              <P5GridEditor
                className="border"
                ref={shapePlaneRef3}
                width={176}
                onUpdate={onShapePlaneUpdated}
              />
            </div>
          </div>
        </div>

        <div className={clsx("flex", "flex-col", "mx-4", "w-44")}>
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

          <div className={clsx("mt-8")}>
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

          <div className={clsx("grid", "grid-cols-2", "mt-10", "font-semibold")}>
            {["xy", "xz", "yz", "sum"].map((key) => (
              <React.Fragment key={key}>
                <p>Error {errorKeyMap[key as "xy"]}:</p>
                <p
                  className={clsx(
                    "font-mono",
                    tripletError[key as "xy"] > 0 ? "text-red-500" : "font-thin",
                  )}
                >
                  {tripletError[key as "xy"] > 0
                    ? tripletError[key as "xy"].toFixed(4)
                    : tripletError[key as "xy"]}
                </p>
              </React.Fragment>
            ))}
          </div>
          <Button
            label="Export"
            className={clsx("ml-[29px]", "mt-8")}
            onClick={() => tripletCanvasRef.current?.export()}
          />
        </div>
      </div>
    ),
    [tripletError, gridSize, fillPercentage, thickness],
  );
}
