import { getPlaneGrid } from ".";

export interface GridState {
    gridSize: number;
    leftPlaneGrid: number[][];
    rightPlaneGrid: number[][];
    bottomPlaneGrid: number[][];
}

// Actions:
export enum GridActionKind {
    ChangePlaneGrid,
    ResetPlaneGrid,
    ChangeGridSize,
}

export interface ChangePlaneGridAction {
    type: GridActionKind.ChangePlaneGrid;
    payload: { plane: "left" | "right" | "bottom"; i: number; j: number; value: number };
}
export interface ChangeGridSizeAction {
    type: GridActionKind.ChangeGridSize;
    payload: GridState["gridSize"];
}
export interface ResetPlaneGridAction {
    type: GridActionKind.ResetPlaneGrid;
    payload: "left" | "right" | "bottom";
}
//

export type GridActions = ChangePlaneGridAction | ChangeGridSizeAction | ResetPlaneGridAction;

export function gridReducer(state: GridState, action: GridActions) {
    const { type, payload } = action;
    switch (type) {
        case GridActionKind.ChangePlaneGrid:
            if (payload.plane === "left") state.leftPlaneGrid[payload.i][payload.j] = payload.value;
            else if (payload.plane === "right")
                state.rightPlaneGrid[payload.i][payload.j] = payload.value;
            else if (payload.plane === "bottom")
                state.bottomPlaneGrid[payload.i][payload.j] = payload.value;

            return { ...state, leftPlaneGrid: [...state.leftPlaneGrid] };
        case GridActionKind.ChangeGridSize:
            return {
                ...state,
                ...getPlaneGrid(payload),
                gridSize: payload,
            };
        case GridActionKind.ResetPlaneGrid:
            // eslint-disable-next-line no-case-declarations
            let planeGrid = state.rightPlaneGrid;
            if (payload === "left") planeGrid = state.leftPlaneGrid;
            else if (payload === "right") planeGrid = state.rightPlaneGrid;
            else if (payload === "bottom") planeGrid = state.bottomPlaneGrid;

            planeGrid.forEach((row) => {
                for (let i = 0; i < row.length; i++) row[i] = 0;
            });

            return { ...state, leftPlaneGrid: [...state.leftPlaneGrid] };
        default:
            return state;
    }
}
