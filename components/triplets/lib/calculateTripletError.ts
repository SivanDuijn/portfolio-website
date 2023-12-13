import { ShapePlane } from "../GridContext/reducer";
import { Triplet } from "./buildTriplet";

export default function calculateTripletError(
  triplet: Triplet,
  xy: ShapePlane,
  xz: ShapePlane,
  yz: ShapePlane,
): asserts triplet is Triplet {
  // Used for calculating the error
  const xyShadowPlane = Array<number>(xy.values.length).fill(0);
  const xzShadowPlane = Array<number>(xz.values.length).fill(0);
  const yzShadowPlane = Array<number>(yz.values.length).fill(0);

  for (let i = 0; i < triplet.dims[0]; i++)
    for (let j = 0; j < triplet.dims[1]; j++)
      for (let k = 0; k < triplet.dims[2]; k++) {
        const v = triplet.volume[i + triplet.dims[0] * (j + triplet.dims[1] * k)];
        if (v) {
          // TODO: these are probably not the right triplet.dims[], works rn because we assume square and same dimension shape planes
          xyShadowPlane[(triplet.dims[0] - j - 1) * triplet.dims[0] + i] = 1;
          xzShadowPlane[k * triplet.dims[1] + i] = 1;
          yzShadowPlane[
            (triplet.dims[0] - j - 1) * triplet.dims[0] + (triplet.dims[1] - k - 1)
          ] = 1;
        }
      }

  const calcError = (shapePlane: number[], shadowPlane: number[]) =>
    shapePlane.reduce((error, v, i) => (shadowPlane[i] != v ? error + 1 : error), 0) /
    shapePlane.length;

  const xyError = calcError(xy.values, xyShadowPlane);
  const xzError = calcError(xz.values, xzShadowPlane);
  const yzError = calcError(yz.values, yzShadowPlane);
  const sum = xyError + xzError + yzError;

  triplet.error = { xy: xyError, xz: xzError, yz: yzError, sum };
}
