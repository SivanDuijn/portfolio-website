import toast from "react-hot-toast";
import { ShapePlane } from "../GridContext/reducer";

export type Triplet = {
  volume: number[];
  dims: [number, number, number];
};

export function buildTriplet(xy: ShapePlane, xz: ShapePlane, yz: ShapePlane): Triplet {
  // For now, assume shapePlanes are square and have the same dimensions!!
  if (!(xy.w == xy.h && xy.w == xz.w && xy.w == yz.w && xy.h == xz.h && xy.h == yz.h)) {
    toast.error("Input shape plane dimensions are not the same or not square");
    return { volume: [], dims: [0, 0, 0] };
  }

  const f = (sp: ShapePlane, i: number, j: number) => sp.values[j * sp.w + i];

  const xy_empty = !xy.values.some((v) => v != 0);
  const xz_empty = !xz.values.some((v) => v != 0);
  const yz_empty = !yz.values.some((v) => v != 0);

  if (xy_empty && xz_empty && yz_empty) return { volume: [], dims: [0, 0, 0] };

  const dim = xy.w;

  const volume = Array(dim * dim * dim).fill(0);
  for (let i = 0; i < dim; i++)
    for (let j = 0; j < dim; j++)
      for (let k = 0; k < dim; k++) {
        const xy_v = f(xy, i, dim - j - 1);
        const xz_v = f(xz, i, k);
        const yz_v = f(yz, dim - k - 1, dim - j - 1);

        if ((xy_v > 0 || xy_empty) && (xz_v > 0 || xz_empty) && (yz_v > 0 || yz_empty))
          volume[i + dim * (j + dim * k)] = 1;
      }

  return { volume, dims: [dim, dim, dim] };
}
