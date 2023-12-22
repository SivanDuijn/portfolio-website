import { useCallback, useContext, useEffect, useState } from "react";
import init, {
  ConnectednessOptions,
  ShapePlane,
  get_best_triplet,
} from "@/modules/rust-triplet/pkg/wasm_test";
import { Triplet } from "../lib/buildTriplet";
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

  useEffect(() => {
    init().then(() => {
      const sp1: ShapePlane = new ShapePlane(
        new Int32Array(xyShapePlane.values),
        xyShapePlane.w,
        xyShapePlane.h,
      );
      const sp2: ShapePlane = new ShapePlane(
        new Int32Array(xzShapePlane.values),
        xzShapePlane.w,
        xzShapePlane.h,
      );
      const sp3: ShapePlane = new ShapePlane(
        new Int32Array(yzShapePlane.values),
        yzShapePlane.w,
        yzShapePlane.h,
      );
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

      setTriplet(triplet);
    });

    // setTriplet(getBestTriplet(xyShapePlane, xzShapePlane, yzShapePlane));
  }, [xyShapePlane.values, xzShapePlane.values, yzShapePlane.values]);

  return triplet;
}
