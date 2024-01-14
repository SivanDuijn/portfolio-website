import { ShapePlane, Triplet } from "../models";
import calculateTripletError from "./calculateTripletError";
import { ConnectednessOptions, removeSmallerComponents } from "./componentLabelling";

/** Generate a triplet, assumes square shape planes with same dimensions!! */
export function buildTriplet(
  xy: ShapePlane,
  xz: ShapePlane,
  yz: ShapePlane,
  triplet?: Triplet,
  connectedness: ConnectednessOptions = "volume",
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

        const index = i + dim * (j + dim * k);

        if ((xy_v > 0 || xy_empty) && (xz_v > 0 || xz_empty) && (yz_v > 0 || yz_empty))
          t.volume[index] = 1;
        else t.volume[index] = 0;
      }

  // Remove smaller components
  removeSmallerComponents(t, connectedness);
  // Calculate error
  calculateTripletError(t, xy, xz, yz);

  return t;
}
