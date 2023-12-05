import modelClasses from "./../data/classes.json";
import modelNormStats from "./../data/normalization_stats.json";
import { ModelState } from "./contexts/reducer";

export default function GetModelStats(
  modelName: string,
  mesh: THREE.Mesh,
): ModelState["modelStats"] {
  const normStats = (modelNormStats as any)[modelName];
  modelName = modelName.replace("_processed", "");
  const modelClass = (modelClasses as any)[modelName];
  return {
    className: modelClass ? modelClass : undefined,
    nVertices: mesh.geometry.getAttribute("position").count,
    nFaces: mesh.geometry.index ? mesh.geometry.index.count / 3 : undefined,
    ...(normStats
      ? {
          distBarycenterToOrigin: normStats.position,
          boundingBoxSize: normStats.aabbSize,
          angleX: normStats.angleX,
          angleY: normStats.angleY,
          angleZ: normStats.angleZ,
          totalAngle: normStats.totalAngle,
          totalFlip: normStats.totalFlip,
        }
      : {}),
  };
}
