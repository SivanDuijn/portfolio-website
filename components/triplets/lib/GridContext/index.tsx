import { createContext, ReactElement, useReducer, Dispatch, useMemo } from "react";
import { GridActions, GridState, gridReducer } from "./reducer";

const initGridSize = 5;

const empty2DList = (size: number) =>
  Array(size)
    .fill([])
    .map(() => Array(size).fill(0));
export function getEmptyShapePlanes(gridSize: number) {
  return {
    xyShapePlane: empty2DList(gridSize),
    yzShapePlane: empty2DList(gridSize),
    xzShapePlane: empty2DList(gridSize),
  };
}

const initialState: GridState = {
  gridSize: initGridSize,
  ...getEmptyShapePlanes(initGridSize),
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
