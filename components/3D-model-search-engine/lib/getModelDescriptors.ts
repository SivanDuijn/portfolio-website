import modelDescriptors from "./../data/feature_descriptors.json";
import { ModelState } from "./contexts/reducer";

export default function GetModelDescriptors(
  modelName?: string,
  isProcessed?: boolean,
): ModelState["modelDescriptors"] {
  if (!isProcessed || modelName == undefined) return;

  const ws = modelName.split(".");
  const name = ws[0] + "_processed." + ws[1];

  const descriptors = (modelDescriptors as any)[name];
  return descriptors;
}
