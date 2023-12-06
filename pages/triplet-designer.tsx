import clsx from "clsx";
import Head from "next/head";
import { useCallback, useMemo, useRef } from "react";
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

  const tripletCanvasRef = useRef<TripletCanvasElement>(null);

  const letterInputChanged = useCallback(
    (value: string) => {
      const chars = value.toUpperCase().split("") as ("A" | "B")[];
      const c1 = characters1D[chars[0]];
      const c2 = characters1D[chars[1]];
      const c3 = characters1D[chars[2]];

      const thickness = 2;

      if ((c1 || c2 || c3) && gridSize != 14) changeGridSize(14);

      if (c1) setShapePlaneYZ({ shapePlane: { values: c1[thickness], h: 14, w: 14 } });
      if (c2) setShapePlaneXY({ shapePlane: { values: c2[thickness], h: 14, w: 14 } });
      if (c3) setShapePlaneXZ({ shapePlane: { values: c3[thickness], h: 14, w: 14 } });
    },
    [gridSize, setShapePlaneXY, setShapePlaneXZ, setShapePlaneYZ],
  );

  return useMemo(
    () => (
      <div className={clsx("flex", "flex-col", "h-full", "px-2", "pt-2")}>
        <Toaster />
        <Head>
          <title>Trip-Let Designer</title>
        </Head>
        <div className={clsx("flex", "justify-center", "items-end")}>
          <TripletCanvas
            className={clsx("border-2", "border-slate-200", "mx-2", "mt-2", "inline-block")}
            triplet={triplet}
            ref={tripletCanvasRef}
          />
          <div>
            <div className={clsx("grid", "grid-cols-3", "mx-2", "mt-2")}>
              <div className={clsx("flex", "flex-col", "items-center")}>
                <p className={clsx("text-center", "font-bold")}>yz plane</p>
                <ShapePlaneEditor className={clsx("w-52")} plane="yz" />
              </div>
              <div className={clsx("w-56")} />
              <div className={clsx("flex", "flex-col", "items-center")}>
                <p className={clsx("text-center", "font-bold")}>xy plane</p>
                <ShapePlaneEditor className={clsx("w-52")} plane="xy" />
              </div>
              <div />
              <div className={clsx("flex", "flex-col", "items-center")}>
                <p className={clsx("text-center", "font-bold")}>xz plane</p>
                <ShapePlaneEditor className={clsx("w-52")} plane="xz" />
              </div>
              <div
                className={clsx(
                  "col-span-3",
                  "flex",
                  "border-2",
                  "border-slate-200",
                  "mt-4",
                  "p-4",
                )}
              >
                <div className={clsx("max-w-[5rem]")}>
                  <label
                    htmlFor="first_name"
                    className={clsx("block", "text-md", "text-white", "font-bold", "mb-1")}
                  >
                    Grid size
                  </label>
                  <input
                    type="number"
                    id="first_name"
                    className={clsx(
                      "bg-gray-700",
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
                    )}
                    value={gridSize}
                    onChange={(e) => {
                      let newSize = parseInt(e.target.value);
                      if (isNaN(newSize) || newSize < 2) newSize = 2;
                      if (gridSize != newSize) changeGridSize(newSize);
                    }}
                  />
                </div>
                <div className={clsx("max-w-[5rem]", "ml-6")}>
                  <label
                    htmlFor="letters"
                    className={clsx("block", "text-md", "text-white", "font-bold", "mb-1")}
                  >
                    Letters
                  </label>
                  <input
                    type="text"
                    className={clsx(
                      "bg-gray-700",
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
                    )}
                    maxLength={3}
                    onChange={(e) => letterInputChanged(e.target.value)}
                  />
                </div>
                <div className={clsx("ml-6", "mt-7")}>
                  <Button label="Export" onClick={() => tripletCanvasRef.current?.export()} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [triplet, changeGridSize, gridSize],
  );
}
