import { ShapePlane } from "./tripletWebWorker";

export function rotateShapePlane90(sp: ShapePlane): ShapePlane {
  const rotatedSP: ShapePlane = {
    values: Array<number>(sp.values.length).fill(0),
    h: sp.h,
    w: sp.w,
  };

  const getRotatedIndex = (i: number, j: number) => i * sp.h + (sp.h - 1 - j);

  for (let i = 0; i < sp.w; i++)
    for (let j = 0; j < sp.h; j++) {
      const originalIndex = j * sp.w + i;
      const rotatedIndex = getRotatedIndex(i, j);
      rotatedSP.values[rotatedIndex] = sp.values[originalIndex];
    }

  return rotatedSP;
}
