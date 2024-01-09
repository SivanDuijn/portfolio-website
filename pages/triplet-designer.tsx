import clsx from "clsx";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Button from "@/components/triplets/atoms/Button";
import characters1D from "@/components/triplets/data/characters1D.json";
import { Triplet } from "@/components/triplets/lib/buildTriplet";
import { P5GridEditor, P5GridEditorElement } from "@/components/triplets/P5ShapePlaneEditor";
import {
  TripletCanvas,
  TripletCanvasElement,
} from "@/components/triplets/TripletCanvas/TripletCanvas";
import init, {
  ConnectednessOptions,
  ShapePlane,
  get_best_triplet,
} from "@/modules/rust-triplet/pkg/triplet_wasm";

const errorKeyMap = {
  xy: 1,
  xz: 2,
  yz: 3,
  sum: "sum",
};

export default function TripletDesigner() {
  const [gridSize, setGridSize] = useState(14);
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

  const onShapePlaneUpdated = useCallback(() => {
    init().then(() => {
      if (!shapePlaneRef1.current || !shapePlaneRef2.current || !shapePlaneRef3.current) return;
      const sp1Grid = shapePlaneRef1.current.getGrid();
      const sp1: ShapePlane = new ShapePlane(new Int32Array(sp1Grid.values), sp1Grid.w, sp1Grid.h);
      const sp2Grid = shapePlaneRef2.current.getGrid();
      const sp2: ShapePlane = new ShapePlane(new Int32Array(sp2Grid.values), sp2Grid.w, sp2Grid.h);
      const sp3Grid = shapePlaneRef3.current.getGrid();
      const sp3: ShapePlane = new ShapePlane(new Int32Array(sp3Grid.values), sp3Grid.w, sp3Grid.h);
      const t = get_best_triplet(sp1, sp2, sp3, ConnectednessOptions.Volume);

      const triplet: Triplet = {
        volume: Array.from(t.get_volume()),
        dims: [t.w, t.h, t.d],
        error: {
          xy: t.error_score.sp1,
          xz: t.error_score.sp2,
          yz: t.error_score.sp3,
          sum: t.error_score.sp1 + t.error_score.sp2 + t.error_score.sp3,
        },
      };

      tripletCanvasRef.current?.setTriplet(triplet);
      setTripletError(triplet.error);
    });
  }, [setTripletError]);

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
          <div className={clsx("max-w-[5rem]")}>
            <label htmlFor="first_name" className={clsx(inputStyle.label)}>
              Grid size
            </label>
            <input
              type="number"
              id="first_name"
              className={inputStyle.input}
              value={gridSize}
              onChange={(e) => {
                let newSize = parseInt(e.target.value);
                if (isNaN(newSize) || newSize < 2) newSize = 2;
                if (gridSize != newSize) updateGridSize(newSize);
              }}
            />
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
            <Button label="Export" onClick={() => tripletCanvasRef.current?.export()} />
          </div>
        </div>
      </div>
    ),
    [tripletError, gridSize, thickness],
  );
}
