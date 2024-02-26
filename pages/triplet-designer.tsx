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
  const [weightAmplifier, setWeightAmplifier] = useState(8);
  const [planeEdgeWeightRatio, setPlaneEdgeWeightRatio] = useState(0.7);
  // const [pageIsLoaded, setPageIsLoaded] = useState(false);
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
    // setPageIsLoaded(true);

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
      <div className={clsx("min-h-[100svh]", "bg-white", "text-black")}>
        <Toaster
          toastOptions={{
            style: {
              boxShadow: "-1px 1px black",
              border: "1px solid black",
              paddingTop: 5,
              paddingBottom: 5,
            },
          }}
          containerStyle={{ top: 6 }}
        />
        <Head>
          <title>Triplet Designer</title>
        </Head>
        <p
          style={{
            textShadow: "-1px 1px 1px black",
            WebkitTextStroke: "2px black",
            color: "#6fdcf0",
          }}
          className={clsx(
            "font-sarabun",
            "font-extrabold",
            "italic",
            "text-5xl",
            "pt-10",
            "px-10",
            "md:text-7xl",
            "w-full",
            "text-center",
          )}
        >
          TRIPLET DESIGNER
        </p>
        <div className={clsx("flex", "justify-center", "mt-8")}>
          <div className="relative">
            <TripletCanvas
              className={clsx("mx-4", "inline-block", "mt-7")} // "border-2", "border-slate-200",
              ref={tripletCanvasRef}
            />
            {/* <div
              // style={{
              //   transform: `translateY(${pageIsLoaded ? 10000 : 0}px)`,
              //   transition: "transform ease-in 3.5s 0.1s",
              // }}
              className={clsx("absolute", "bg-white", "top-0", "left-0", "h-full", "w-full")}
            ></div> */}
          </div>
          <div
            // style={{
            //   transform: `translateX(${pageIsLoaded ? 0 : 10000}px)`,
            //   transition: "transform ease-out 1s",
            // }}
            className={clsx(
              "grid",
              "grid-cols-1",
              "mx-4",
              "px-6",
              "pt-4",
              "pb-1",
              "border",
              "border-black",
              "rounded-lg",
              "shadow-md",
            )}
          >
            {shadowEditor(shapePlaneRef1, "Shadow 1", onShapePlaneUpdated, tripletError.sp1.size)}
            {shadowEditor(shapePlaneRef2, "Shadow 2", onShapePlaneUpdated, tripletError.sp2.size)}
            {shadowEditor(shapePlaneRef3, "Shadow 3", onShapePlaneUpdated, tripletError.sp3.size)}
          </div>
          <div className={clsx("w-52", "flex", "flex-col", "items-center")}>
            <div
              // style={{
              //   transform: `translateX(${pageIsLoaded ? 0 : 10000}px)`,
              //   transition: "transform 1s ease-out 0.1s",
              // }}
              className={clsx(
                "flex",
                "flex-col",
                "items-center",
                "shadow-md",
                "px-6",
                "pt-4",
                "pb-6",
                "w-full",
                "border",
                "border-black",
                "rounded-lg",
              )}
            >
              <p className={clsx("font-bold", "text-center", "font-sarabun", "italic", "text-lg")}>
                Shadow Definition
              </p>
              <div className={clsx("flex", "items-center", "mt-6")}>
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
                  autoComplete="off"
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
              <div className={clsx("flex", "items-center", "mt-6")}>
                <p className={inputStyle.label}>Grid size</p>
                <NumberInput value={gridSize} min={2} onChange={(v) => updateGridSize(v)} />
              </div>

              <div className={clsx("flex", "items-center", "mt-5")}>
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
              <Button label="Random" className="mt-1  " onClick={setRandomShapePlanes} />

              <p className={clsx("text-xs", "font-bold", "mt-4")}>
                <span
                  className={clsx(
                    "font-mono",
                    "font-semibold",
                    tripletError.totalPercentage > 5 && "text-red-600",
                  )}
                >
                  {tripletError.totalPercentage.toFixed(2)}
                </span>
                % impossible
              </p>
            </div>

            <div
              // style={{
              //   transform: `translateX(${pageIsLoaded ? 0 : 10000}px)`,
              //   transition: "transform 1s ease-out 0.16s",
              // }}
              className={clsx(
                "flex",
                "flex-col",
                "items-center",
                "shadow-md",
                "mt-4",
                "px-6",
                "pt-4",
                "pb-6",
                "w-full",
                "border",
                "border-black",
                "rounded-lg",
              )}
            >
              <p className={clsx("font-bold", "text-center", "font-sarabun", "italic", "text-lg")}>
                Modify Triplet
              </p>
              <div className={clsx("flex", "items-center", "mt-3")}>
                <p className={clsx("text-sm", "font-semibold", "mr-1.5")}>Weight amp.</p>
                <NumberInput
                  value={weightAmplifier}
                  min={1}
                  max={15}
                  disableLargeStep
                  onChange={setWeightAmplifier}
                />
              </div>
              <div
                className={clsx(
                  "flex",
                  "justify-between",
                  "mt-2",
                  "text-xs",
                  "font-mono",
                  "mb-1.5",
                  "w-full",
                  "font-bold",
                )}
              >
                <p style={{ opacity: 0.5 + (1 - planeEdgeWeightRatio) * 0.5 }}>Plane</p>
                <p style={{ opacity: 0.5 + planeEdgeWeightRatio * 0.5 }}>Edges</p>
              </div>
              <input
                type="range"
                step="any"
                defaultValue={0.7}
                min={0}
                max={1}
                className={clsx(
                  "transparent",
                  "mb-4",
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
                label="Remove cubes"
                onClick={() =>
                  tripletWebWorker.current.removeCellsOfPreviousTriplet(
                    100,
                    planeEdgeWeightRatio,
                    weightAmplifier,
                  )
                }
              />
            </div>

            <div
              // style={{
              //   transform: `translateX(${pageIsLoaded ? 0 : 10000}px)`,
              //   transition: "transform 1s ease-out 0.21s",
              // }}
              className={clsx(
                "flex",
                "flex-col",
                "items-center",
                "shadow-md",
                "mt-4",
                "px-6",
                "pt-4",
                "pb-6",
                "w-full",
                "border",
                "border-black",
                "rounded-lg",
              )}
            >
              <p className={clsx("font-bold", "text-center", "font-sarabun", "italic", "text-lg")}>
                Export Triplet
              </p>

              <Button
                label="Export"
                className={clsx("mt-4")}
                onClick={() => tripletCanvasRef.current?.export()}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    [
      tripletError,
      gridSize,
      fillPercentage,
      thickness,
      planeEdgeWeightRatio,
      weightAmplifier,
      // pageIsLoaded,
    ],
  );
}

function shadowEditor(
  ref: React.RefObject<P5GridEditorElement>,
  name: string,
  onUpdate: () => void,
  nErrorCells: number,
) {
  return (
    <div className={clsx("flex", "flex-col", "items-center")}>
      <p className={clsx("text-center", "font-bold")}>{name}</p>
      <P5GridEditor ref={ref} width={176} onUpdate={onUpdate} />
      <p
        className={clsx(
          "font-mono",
          "text-xs",
          "text-gray-600",
          "mt-0.5",
          "mb-1.5",
          nErrorCells == 0 && "invisible",
        )}
      >
        <span className={clsx("text-red-500", "font-bold")}>{nErrorCells}</span> incorrect cell
        {nErrorCells == 1 ? "" : "s"}
      </p>
    </div>
  );
}
