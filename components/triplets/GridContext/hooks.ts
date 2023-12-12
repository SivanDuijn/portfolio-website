import { useCallback, useContext, useEffect, useState } from "react";
import { Triplet } from "../lib/buildTriplet";
import getBestTriplet from "../lib/getBestTriplet";
import {
  ChangeGridSizeAction,
  GridActionKind,
  ChangeShapePlaneAction,
  SetShapePlaneAction,
} from "./reducer";
import { GridContext } from ".";

export function useGridSize() {
  const { state, dispatch } = useContext(GridContext);
  const changeGridSize = useCallback(
    (size: ChangeGridSizeAction["payload"]) =>
      dispatch({ type: GridActionKind.ChangeGridSize, payload: size }),
    [],
  );

  return { gridSize: state.gridSize, changeGridSize };
}

export function useShapePlane(plane: "xy" | "xz" | "yz") {
  const { state, dispatch } = useContext(GridContext);
  const changeShapePlane = useCallback(
    (args: Omit<ChangeShapePlaneAction["payload"], "plane">) =>
      dispatch({ type: GridActionKind.ChangeShapePlane, payload: { ...args, plane } }),
    [plane],
  );
  const setShapePlane = useCallback(
    (args: Omit<SetShapePlaneAction["payload"], "plane">) =>
      dispatch({ type: GridActionKind.SetShapePlane, payload: { ...args, plane } }),
    [plane],
  );

  const resetShapePlane = useCallback(
    () => dispatch({ type: GridActionKind.ResetShapePlane, payload: plane }),
    [plane],
  );

  return {
    shapePlane:
      plane === "xy"
        ? state.xyShapePlane
        : plane === "xz"
        ? state.xzShapePlane
        : state.yzShapePlane,
    setShapePlane,
    changeShapePlane,
    resetShapePlane,
  };
}

export function useTriplet() {
  const { shapePlane: xyShapePlane } = useShapePlane("xy");
  const { shapePlane: xzShapePlane } = useShapePlane("xz");
  const { shapePlane: yzShapePlane } = useShapePlane("yz");
  const [triplet, setTriplet] = useState<Triplet>({
    volume: [],
    dims: [0, 0, 0],
    error: { xy: 0, xz: 0, yz: 0, sum: 0 },
  });

  useEffect(
    () => setTriplet(getBestTriplet(xyShapePlane, xzShapePlane, yzShapePlane)),
    [xyShapePlane.values, xzShapePlane.values, yzShapePlane.values],
  );

  // useEffect(() => {
  //   fetch("https://174.138.106.40:15881/create-triplet", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ xy: xyShapePlane, xz: xzShapePlane, yz: yzShapePlane }),
  //   }).then((res) =>
  //     res
  //       .json()
  //       .then((result: { status: string; message?: string; triplet: number[][][] }) => {
  //         if (result.status == "Success" || result.status == "Empty input")
  //           setTriplet(result.triplet);
  //         else {
  //           toast.error("Something went wrong with building the triplet: " + result.status);
  //           console.log(result);
  //         }
  //       })
  //       .catch((reason) => {
  //         toast.error("Something went wrong with building the triplet..");
  //         console.log(reason);
  //       }),
  //   );
  // }, [xyShapePlane, xzShapePlane, yzShapePlane]);

  return triplet;
}
