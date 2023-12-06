import { getEmptyShapePlanes } from ".";

export type ShapePlane = {
  values: number[];
  w: number;
  h: number;
};

export interface GridState {
  gridSize: number;
  xyShapePlane: ShapePlane;
  xzShapePlane: ShapePlane;
  yzShapePlane: ShapePlane;
}

// Actions:
export enum GridActionKind {
  SetShapePlane,
  ChangeShapePlane,
  ResetShapePlane,
  ChangeGridSize,
}

export interface SetShapePlaneAction {
  type: GridActionKind.SetShapePlane;
  payload: { plane: "xy" | "xz" | "yz"; shapePlane: GridState["xyShapePlane"] };
}
export interface ChangeShapePlaneAction {
  type: GridActionKind.ChangeShapePlane;
  payload: { plane: "xy" | "xz" | "yz"; i: number; value: number };
}
export interface ChangeGridSizeAction {
  type: GridActionKind.ChangeGridSize;
  payload: GridState["gridSize"];
}
export interface ResetShapePlaneAction {
  type: GridActionKind.ResetShapePlane;
  payload: "xy" | "xz" | "yz";
}
//

export type GridActions =
  | ChangeShapePlaneAction
  | ChangeGridSizeAction
  | ResetShapePlaneAction
  | SetShapePlaneAction;

export function gridReducer(state: GridState, action: GridActions) {
  const { type, payload } = action;

  let sp: ShapePlane;
  switch (type) {
    case GridActionKind.SetShapePlane:
      switch (payload.plane) {
        case "xy":
          return { ...state, xyShapePlane: payload.shapePlane };
        case "xz":
          return { ...state, xzShapePlane: payload.shapePlane };
        case "yz":
          return { ...state, yzShapePlane: payload.shapePlane };
      }
      break;
    case GridActionKind.ChangeShapePlane:
      if (payload.plane == "xy") sp = state.xyShapePlane;
      else if (payload.plane == "xz") sp = state.xzShapePlane;
      else sp = state.yzShapePlane;

      sp.values[payload.i] = payload.value;
      sp.values = [...sp.values];
      return { ...state };
    case GridActionKind.ChangeGridSize:
      return {
        ...state,
        ...getEmptyShapePlanes(payload, payload),
        gridSize: payload,
      };
    case GridActionKind.ResetShapePlane:
      if (payload == "xy") sp = state.xyShapePlane;
      else if (payload == "xz") sp = state.xzShapePlane;
      else sp = state.yzShapePlane;

      sp.values = Array(sp.values.length).fill(0);
      return { ...state };
    default:
      return state;
  }
}
