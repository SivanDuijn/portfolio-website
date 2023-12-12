import { ShapePlane } from "../GridContext/reducer";

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

  const f = (sp: ShapePlane, i: number, j: number) => sp.values[j * sp.w + i];

  const xy_empty = !xy.values.some((v) => v != 0);
  const xz_empty = !xz.values.some((v) => v != 0);
  const yz_empty = !yz.values.some((v) => v != 0);

  if (xy_empty && xz_empty && yz_empty) return t;

  // Used for calculating the error
  const xyShadowPlane = Array<number>(xy.values.length).fill(0);
  const xzShadowPlane = Array<number>(xz.values.length).fill(0);
  const yzShadowPlane = Array<number>(yz.values.length).fill(0);

  for (let i = 0; i < dim; i++)
    for (let j = 0; j < dim; j++)
      for (let k = 0; k < dim; k++) {
        const xy_v = f(xy, i, dim - j - 1);
        const xz_v = f(xz, i, k);
        const yz_v = f(yz, dim - k - 1, dim - j - 1);

        if ((xy_v > 0 || xy_empty) && (xz_v > 0 || xz_empty) && (yz_v > 0 || yz_empty)) {
          t.volume[i + dim * (j + dim * k)] = 1;
          xyShadowPlane[(dim - j - 1) * dim + i] = 1;
          xzShadowPlane[k * dim + i] = 1;
          yzShadowPlane[(dim - j - 1) * dim + (dim - k - 1)] = 1;
        } else t.volume[i + dim * (j + dim * k)] = 0;
      }

  // Calculate error
  t.error.xy = errorInShadowPlane(xy.values, xyShadowPlane);
  t.error.xz = errorInShadowPlane(xz.values, xzShadowPlane);
  t.error.yz = errorInShadowPlane(yz.values, yzShadowPlane);
  t.error.sum = t.error.xy + t.error.xz + t.error.yz;

  return t;

  // return {
  //   volume,
  //   dims: [dim, dim, dim],
  //   error: { xy: xyError, xz: xzError, yz: yzError, sum: xyError + xzError + yzError },
  // };
}

function errorInShadowPlane(shapePlane: number[], shadowPlane: number[]) {
  return (
    shapePlane.reduce((error, v, i) => (shadowPlane[i] != v ? error + 1 : error), 0) /
    shapePlane.length
  );
}
