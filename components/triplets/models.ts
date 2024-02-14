import { ShapePlane as WasmShapePlane } from "@/modules/rust-triplet/pkg/triplet_wasm_lib";

export type ShapePlane = {
  values: number[];
  w: number;
  h: number;
};

export function fromWasmShapePlane(wasmSP: WasmShapePlane): ShapePlane {
  return {
    w: wasmSP.w,
    h: wasmSP.h,
    values: Array.from(wasmSP.get_js_values()),
  };
}

export type Triplet = {
  volume: number[];
  dims: [number, number, number];
  error: {
    xy: number;
    xz: number;
    yz: number;
    sum: number;
    xyWrongCells: number[];
    xzWrongCells: number[];
    yzWrongCells: number[];
  };
};
