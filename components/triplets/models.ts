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
  removedComponents: Set<number>[];
  error: {
    // A set of indices which cells are incorrect
    sp1: Set<number>;
    sp2: Set<number>;
    sp3: Set<number>;
    // The total/summed percentage of incorrect cells
    totalPercentage: number;
  };
  rotations: [number, number, number];
};
