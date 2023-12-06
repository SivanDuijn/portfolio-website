import { createContext, ReactElement, useReducer, Dispatch, useMemo } from "react";
import { GridActions, GridState, ShapePlane, gridReducer } from "./reducer";

const initGridSize = 5;

export function getEmptyShapePlane(width: number, height: number): ShapePlane {
  return { w: width, h: height, values: Array(width * height).fill(0) };
}
export function getEmptyShapePlanes(width: number, height: number) {
  return {
    xyShapePlane: getEmptyShapePlane(width, height),
    yzShapePlane: getEmptyShapePlane(width, height),
    xzShapePlane: getEmptyShapePlane(width, height),
  };
}

const initialState: GridState = {
  gridSize: initGridSize,
  ...getEmptyShapePlanes(initGridSize, initGridSize),
};

export const GridContext = createContext<{
  state: GridState;
  dispatch: Dispatch<GridActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const GridProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(gridReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>;
};
