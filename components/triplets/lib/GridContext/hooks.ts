import { useContext } from "react";
import { ChangeGridSizeAction, ChangePlaneGridAction, GridActionKind } from "./reducer";
import { GridContext } from ".";

export function useGridSize() {
    const { state, dispatch } = useContext(GridContext);
    const changeGridSize = (size: ChangeGridSizeAction["payload"]) => {
        dispatch({ type: GridActionKind.ChangeGridSize, payload: size });
    };
    return { gridSize: state.gridSize, changeGridSize };
}

export function usePlaneGrid(plane: "left" | "right" | "bottom") {
    const { state, dispatch } = useContext(GridContext);
    const changePlaneGrid = (args: Omit<ChangePlaneGridAction["payload"], "plane">) => {
        dispatch({ type: GridActionKind.ChangePlaneGrid, payload: { ...args, plane } });
    };
    const resetPlaneGrid = () => {
        dispatch({ type: GridActionKind.ResetPlaneGrid, payload: plane });
    };
    return {
        planeGrid:
            plane === "left"
                ? state.leftPlaneGrid
                : plane === "right"
                ? state.rightPlaneGrid
                : state.bottomPlaneGrid,
        changePlaneGrid,
        resetPlaneGrid,
    };
}
