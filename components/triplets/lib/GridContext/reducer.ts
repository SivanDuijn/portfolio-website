import { getEmptyShapePlanes } from ".";

export interface GridState {
  gridSize: number;
  xyShapePlane: number[][];
  xzShapePlane: number[][];
  yzShapePlane: number[][];
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
  payload: { plane: "xy" | "xz" | "yz"; grid: GridState["xyShapePlane"] };
}
export interface ChangeShapePlaneAction {
  type: GridActionKind.ChangeShapePlane;
  payload: { plane: "xy" | "xz" | "yz"; i: number; j: number; value: number };
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
  switch (type) {
    case GridActionKind.SetShapePlane:
      switch (payload.plane) {
        case "xy":
          return { ...state, xyShapePlane: payload.grid };
        case "xz":
          return { ...state, xzShapePlane: payload.grid };
        case "yz":
          return { ...state, yzShapePlane: payload.grid };
      }
      break;
    case GridActionKind.ChangeShapePlane:
      switch (payload.plane) {
        case "xy":
          state.xyShapePlane[payload.i][payload.j] = payload.value;
          return { ...state, xyShapePlane: [...state.xyShapePlane] };
        case "xz":
          state.xzShapePlane[payload.i][payload.j] = payload.value;
          return { ...state, xzShapePlane: [...state.xzShapePlane] };
        case "yz":
          state.yzShapePlane[payload.i][payload.j] = payload.value;
          return { ...state, yzShapePlane: [...state.yzShapePlane] };
      }
      break;
    case GridActionKind.ChangeGridSize:
      return {
        ...state,
        ...getEmptyShapePlanes(payload),
        gridSize: payload,
      };
    case GridActionKind.ResetShapePlane:
      switch (payload) {
        case "xy":
          state.xyShapePlane.forEach((row) => {
            for (let i = 0; i < row.length; i++) row[i] = 0;
          });
          return { ...state, xyShapePlane: [...state.xyShapePlane] };
        case "xz":
          state.xzShapePlane.forEach((row) => {
            for (let i = 0; i < row.length; i++) row[i] = 0;
          });
          return { ...state, xzShapePlane: [...state.xzShapePlane] };
        case "yz":
          state.yzShapePlane.forEach((row) => {
            for (let i = 0; i < row.length; i++) row[i] = 0;
          });
          return { ...state, yzShapePlane: [...state.yzShapePlane] };
      }
      break;
    default:
      return state;
  }
}
