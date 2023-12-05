import { createContext, ReactElement, useReducer, Dispatch } from "react";
import { RenderMaterial } from "../../model-viewer/viewGL";
import GetTopK from "../getTopKClosest";
import { Actions, modelReducer, ModelState } from "./reducer";

const initialModel = "125.off";
const top_k = GetTopK(initialModel);

export const initialState: ModelState = {
  model: {
    name: "125.off",
    isProcessed: true,
    top_k,
  },
  renderSettings: {
    material: RenderMaterial.Flat,
    showWireframe: true,
    showVertexNormals: false,
    autoRotateEnabled: true,
    showUnitBox: true,
    showBoundingBox: true,
  },
};

export const ModelContext = createContext<{
  state: ModelState;
  dispatch: Dispatch<Actions>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const ModelProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(modelReducer, initialState);

  return <ModelContext.Provider value={{ state, dispatch }}>{children}</ModelContext.Provider>;
};
