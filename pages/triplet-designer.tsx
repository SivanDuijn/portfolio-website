import clsx from "clsx";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Button from "@/components/triplets/atoms/Button";
import { GridProvider } from "@/components/triplets/GridContext";
import { useGridSize, useShapePlane, useTriplet } from "@/components/triplets/GridContext/hooks";
import { ShapePlaneEditor } from "@/components/triplets/ShapePlaneEditor";
import {
  TripletCanvas,
  TripletCanvasElement,
} from "@/components/triplets/TripletCanvas/TripletCanvas";
import characters from "../components/triplets/data/characters_all_detailed_more.json";

// TODO: fix json character files, so the row and cols are right
const characters1D: { [key: string]: number[][] } = {};
Object.keys(characters).forEach((key) => {
  const char: number[][] = [];
  characters[key as "A"].forEach((c) => {
    const charV = Array(14 * 14).fill(0);
    c.forEach((row, i) =>
      row.forEach((v, j) => {
        charV[j * 14 + i] = v;
      }),
    );
    char.push(charV);
  });
  characters1D[key] = char;
});

export default function TripletDesignerWithProvider() {
  return (
    <GridProvider>
      <TripletDesigner />
    </GridProvider>
  );
}

export function TripletDesigner() {
  const { gridSize, changeGridSize } = useGridSize();
  const triplet = useTriplet();
  const { setShapePlane: setShapePlaneXY } = useShapePlane("xy");
  const { setShapePlane: setShapePlaneXZ } = useShapePlane("xz");
  const { setShapePlane: setShapePlaneYZ } = useShapePlane("yz");
  const [thickness, setThickness] = useState(2);
  const letterInputRef = useRef<HTMLInputElement>(null);

  const tripletCanvasRef = useRef<TripletCanvasElement>(null);

  const letterInputChanged = useCallback(
    (value: string) => {
      const chars = value.toUpperCase().split("") as ("A" | "B")[];
      const c1 = characters1D[chars[0]];
      const c2 = characters1D[chars[1]];
      const c3 = characters1D[chars[2]];

      if ((c1 || c2 || c3) && gridSize != 14) changeGridSize(14);

      if (c1) setShapePlaneXY({ shapePlane: { values: c1[thickness], h: 14, w: 14 } });
      if (c2) setShapePlaneXZ({ shapePlane: { values: c2[thickness], h: 14, w: 14 } });
      if (c3) setShapePlaneYZ({ shapePlane: { values: c3[thickness], h: 14, w: 14 } });
    },
    [gridSize, setShapePlaneXY, setShapePlaneXZ, setShapePlaneYZ, thickness],
  );
  useEffect(() => {
    if (letterInputRef.current) letterInputChanged(letterInputRef.current.value);
  }, [thickness]);

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
          <title>Trip-Let Designer</title>
        </Head>
        <TripletCanvas
          className={clsx("mx-4", "inline-block", "self-end")} // "border-2", "border-slate-200",
          triplet={triplet}
          ref={tripletCanvasRef}
        />
        <div className={clsx("grid", "grid-cols-1", "mx-4")}>
          <div className={clsx("flex", "flex-col", "items-center")}>
            <p className={clsx("text-center", "font-bold", "mb-1")}>xy plane</p>
            <ShapePlaneEditor className={clsx("w-44")} plane="xy" />
          </div>
          <div className={clsx("flex", "flex-col", "items-center")}>
            <p className={clsx("text-center", "font-bold", "mt-2", "mb-1")}>xz plane</p>
            <ShapePlaneEditor className={clsx("w-44")} plane="xz" />
          </div>
          <div className={clsx("flex", "flex-col", "items-center")}>
            <p className={clsx("text-center", "font-bold", "mt-2", "mb-1")}>yz plane</p>
            <ShapePlaneEditor className={clsx("w-44")} plane="yz" />
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
                if (gridSize != newSize) changeGridSize(newSize);
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
            {Object.entries(triplet.error).map(([key, value]) => (
              <>
                <p>Error {key}:</p>
                <p className={clsx("font-mono", "font-thin", value > 0 && "text-red-500")}>
                  {value > 0 ? value.toFixed(4) : value}
                </p>
              </>
            ))}
          </div>
          <div className={clsx("mt-6")}>
            <Button label="Export" onClick={() => tripletCanvasRef.current?.export()} />
          </div>
        </div>
      </div>
    ),
    [triplet, changeGridSize, gridSize, thickness],
  );
}
