import clsx from "clsx";
import Head from "next/head";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { GridProvider } from "@/components/triplets/lib/GridContext";
import { useGridSize, useTriplet } from "@/components/triplets/lib/GridContext/hooks";
import { ShapePlaneEditor } from "@/components/triplets/ShapePlaneEditor";
import { TripletCanvas } from "@/components/triplets/TripletCanvas/TripletCanvas";

export default function TripletDesignerWithProvider() {
  return (
    <GridProvider>
      <TripletDesigner />
    </GridProvider>
  );
}

export function TripletDesigner() {
  const { changeGridSize } = useGridSize();
  const triplet = useTriplet();

  return useMemo(
    () => (
      <div className={clsx("flex", "flex-col", "h-full", "px-2", "pt-2")}>
        <Toaster />
        <Head>
          <title>Trip-Let Designer</title>
        </Head>
        <div className={clsx("flex")}>
          <TripletCanvas
            className={clsx("border-2", "border-slate-200", "mx-2", "mt-2", "inline-block")}
            triplet={triplet}
          />
          <div>
            <div className={clsx("grid", "grid-cols-3", "mx-2", "mt-2")}>
              <div className={clsx("flex", "flex-col", "items-center")}>
                <p className={clsx("text-center", "font-bold")}>Left</p>
                <ShapePlaneEditor className={clsx("w-52")} plane="yz" />
              </div>
              <div className={clsx("w-56")} />
              <div className={clsx("flex", "flex-col", "items-center")}>
                <p className={clsx("text-center", "font-bold")}>Right</p>
                <ShapePlaneEditor className={clsx("w-52")} plane="xy" />
              </div>
              <div />
              <div className={clsx("flex", "flex-col", "items-center")}>
                <p className={clsx("text-center", "font-bold")}>Bottom</p>
                <ShapePlaneEditor className={clsx("w-52")} plane="xz" />
              </div>
              <div className={clsx("col-span-3", "border-2", "border-slate-200", "mt-4", "p-4")}>
                <div className={clsx("max-w-[6rem]")}>
                  <label
                    htmlFor="first_name"
                    className="block text-md text-gray-900 dark:text-white font-bold"
                  >
                    Grid size
                  </label>
                  <input
                    type="number"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={5}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      if (!isNaN(newSize)) changeGridSize(newSize);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [triplet, changeGridSize],
  );
}
