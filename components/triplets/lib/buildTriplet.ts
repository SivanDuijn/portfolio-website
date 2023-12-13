import { ShapePlane } from "../GridContext/reducer";
import calculateTripletError from "./calculateTripletError";
import removeSmallerComponents from "./removeSmallerComponents";

export type Triplet = {
  volume: number[];
  dims: [number, number, number];
  error: { xy: number; xz: number; yz: number; sum: number };
};

/** Generate a triplet, assumes square shape planes with same dimensions!! */
export function buildTriplet(
  xy: ShapePlane,
  xz: ShapePlane,
  yz: ShapePlane,
  triplet?: Triplet,
): Triplet {
  let t: Triplet;
  // If triplet is defined, build triplet in place.
  if (triplet && triplet.dims[0] == xy.w) t = triplet;
  else t = { volume: [], dims: [0, 0, 0], error: { xy: 0, xz: 0, yz: 0, sum: 0 } };

  const dim = xy.w;

  const xy_empty = !xy.values.some((v) => v != 0);
  const xz_empty = !xz.values.some((v) => v != 0);
  const yz_empty = !yz.values.some((v) => v != 0);

  if (xy_empty && xz_empty && yz_empty) return t;

  for (let i = 0; i < dim; i++)
    for (let j = 0; j < dim; j++)
      for (let k = 0; k < dim; k++) {
        const xy_v = xy.values[(dim - j - 1) * xy.w + i];
        const xz_v = xz.values[k * xz.w + i];
        const yz_v = yz.values[(dim - j - 1) * yz.w + dim - k - 1];

        if ((xy_v > 0 || xy_empty) && (xz_v > 0 || xz_empty) && (yz_v > 0 || yz_empty))
          t.volume[i + dim * (j + dim * k)] = 1;
        else t.volume[i + dim * (j + dim * k)] = 0;
      }

  // Remove smaller components
  removeSmallerComponents(t, "volume");
  // Calculate error
  calculateTripletError(t, xy, xz, yz);

  return t;
}