import { getEmptyShapePlanes } from ".";

export interface GridState {
  gridSize: number;
  xyShapePlane: number[][];
  xzShapePlane: number[][];
  yzShapePlane: number[][];
}

// Actions:
export enum GridActionKind {
  ChangePlaneGrid,
  ResetPlaneGrid,
  ChangeGridSize,
}

export interface ChangePlaneGridAction {
  type: GridActionKind.ChangePlaneGrid;
  payload: { plane: "xy" | "xz" | "yz"; i: number; j: number; value: number };
}
export interface ChangeGridSizeAction {
  type: GridActionKind.ChangeGridSize;
  payload: GridState["gridSize"];
}
export interface ResetPlaneGridAction {
  type: GridActionKind.ResetPlaneGrid;
  payload: "xy" | "xz" | "yz";
}
//

export type GridActions = ChangePlaneGridAction | ChangeGridSizeAction | ResetPlaneGridAction;

export function gridReducer(state: GridState, action: GridActions) {
  const { type, payload } = action;
  switch (type) {
    case GridActionKind.ChangePlaneGrid:
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
    case GridActionKind.ResetPlaneGrid:
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
