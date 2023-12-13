import toast from "react-hot-toast";
import { ShapePlane } from "../GridContext/reducer";
import { Triplet, buildTriplet } from "./buildTriplet";
import { rotateShapePlane90 } from "./rotateShapePlane90";

/** Picks the best triplet out of all 90 deg rotated shape plane combinations.
 * That means, the triplet with the lowest error score.
 * And if possible the triplet where the least number of planes are rotated.
 */
export default function getBestTriplet(xy: ShapePlane, xz: ShapePlane, yz: ShapePlane): Triplet {
  // For now, shapePlanes must be square and have the same dimensions!!
  if (!(xy.w == xy.h && xy.w == xz.w && xy.w == yz.w && xy.h == xz.h && xy.h == yz.h)) {
    toast.error("Input shape plane dimensions are not the same or not square");
    return { volume: [], dims: [0, 0, 0], error: { xy: 0, xz: 0, yz: 0, sum: 0 } };
  }

  const triplet: Triplet = {
    volume: Array<number>(xy.h * xy.h * xy.h).fill(0),
    dims: [xy.h, xy.h, xy.h],
    error: { xy: 0, xz: 0, yz: 0, sum: 0 },
  };

  let minError: Triplet["error"] = { xy: 0, xz: 0, yz: 0, sum: Number.MAX_VALUE };
  let bestTripletVolume: number[] = [];

  const xyRotated: ShapePlane[] = [xy];
  const xzRotated: ShapePlane[] = [xz];
  const yzRotated: ShapePlane[] = [yz];
  for (let i = 0; i < 3; i++) {
    xyRotated.push(rotateShapePlane90(xyRotated[i]));
    xzRotated.push(rotateShapePlane90(xzRotated[i]));
    yzRotated.push(rotateShapePlane90(yzRotated[i]));
  }

  for (let xyRot = 0; xyRot < 4; xyRot++) {
    for (let xzRot = 0; xzRot < 4; xzRot++) {
      for (let yzRot = 0; yzRot < 4; yzRot++) {
        buildTriplet(xyRotated[xyRot], xzRotated[xzRot], yzRotated[yzRot], triplet);
        if (triplet.error.sum < minError.sum) {
          if (triplet.error.sum == 0) return triplet;
          minError = { ...triplet.error };
          bestTripletVolume = [...triplet.volume];
        }

        buildTriplet(xzRotated[xzRot], xyRotated[xyRot], yzRotated[yzRot], triplet);
        if (triplet.error.sum < minError.sum) {
          if (triplet.error.sum == 0) return triplet;
          minError = { ...triplet.error };
          bestTripletVolume = [...triplet.volume];
        }
      }
    }
  }

  triplet.error = minError;
  triplet.volume = bestTripletVolume;

  return triplet;
}
