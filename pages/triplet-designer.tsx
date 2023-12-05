import clsx from "clsx";
import Head from "next/head";
import { useCallback, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { GridProvider } from "@/components/triplets/lib/GridContext";
import {
  useGridSize,
  useShapePlane,
  useTriplet,
} from "@/components/triplets/lib/GridContext/hooks";
import { ShapePlaneEditor } from "@/components/triplets/ShapePlaneEditor";
import { TripletCanvas } from "@/components/triplets/TripletCanvas/TripletCanvas";
import characters from "../components/triplets/data/characters_all_detailed_more.json";

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

  const letterInputChanged = useCallback(
    (value: string) => {
      const chars = value.toUpperCase().split("") as ("A" | "B")[];
      const c1 = characters[chars[0]];
      const c2 = characters[chars[1]];
      const c3 = characters[chars[2]];

      const thickness = 2;

      if ((c1 || c2 || c3) && gridSize != c1[thickness].length)
        changeGridSize(c1[thickness].length);

      if (c1) setShapePlaneYZ({ grid: c1[thickness] });
      if (c2) setShapePlaneXY({ grid: c2[thickness] });
      if (c3) setShapePlaneXZ({ grid: c3[thickness] });
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
                    defaultValue={5}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [triplet, changeGridSize, gridSize],
  );
}
