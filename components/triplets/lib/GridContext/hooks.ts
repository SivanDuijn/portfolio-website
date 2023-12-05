/* eslint-disable no-console */
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChangeGridSizeAction, ChangePlaneGridAction, GridActionKind } from "./reducer";
import { GridContext } from ".";

export function useGridSize() {
  const { state, dispatch } = useContext(GridContext);
  const changeGridSize = (size: ChangeGridSizeAction["payload"]) =>
    dispatch({ type: GridActionKind.ChangeGridSize, payload: size });

  return { gridSize: state.gridSize, changeGridSize };
}

export function useShapePlane(plane: "xy" | "xz" | "yz") {
  const { state, dispatch } = useContext(GridContext);
  const changeShapePlane = (args: Omit<ChangePlaneGridAction["payload"], "plane">) =>
    dispatch({ type: GridActionKind.ChangePlaneGrid, payload: { ...args, plane } });

  const resetShapePlane = () => dispatch({ type: GridActionKind.ResetPlaneGrid, payload: plane });

  return {
    shapePlane:
      plane === "xy"
        ? state.xyShapePlane
        : plane === "xz"
        ? state.xzShapePlane
        : state.yzShapePlane,
    changeShapePlane,
    resetShapePlane,
  };
}

export function useTriplet() {
  const { shapePlane: xyShapePlane } = useShapePlane("xy");
  const { shapePlane: xzShapePlane } = useShapePlane("xz");
  const { shapePlane: yzShapePlane } = useShapePlane("yz");
  const [triplet, setTriplet] = useState<number[][][]>([]);

  useEffect(() => {
    fetch("/api//create-triplet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xy: xyShapePlane, xz: xzShapePlane, yz: yzShapePlane }),
    }).then((res) =>
      res
        .json()
        .then((result: { status: string; message?: string; triplet: number[][][] }) => {
          if (result.status == "Success" || result.status == "Empty input")
            setTriplet(result.triplet);
          else {
            toast.error("Something went wrong with building the triplet: " + result.status);
            console.log(result);
          }
        })
        .catch((reason) => {
          toast.error("Something went wrong with building the triplet: " + reason);
          console.log(reason);
        }),
    );
  }, [xyShapePlane, xzShapePlane, yzShapePlane]);

  return triplet;
}
