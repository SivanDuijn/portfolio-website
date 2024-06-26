/* tslint:disable */
/* eslint-disable */
/**
* @param {number} w
* @param {number} h
* @param {number} fill_percentage
* @param {ShapePlaneFillRandomness} randomness
* @param {number} amount
* @returns {(ShapePlane)[]}
*/
export function get_random_shape_planes(w: number, h: number, fill_percentage: number, randomness: ShapePlaneFillRandomness, amount: number): (ShapePlane)[];
/**
* @param {ShapePlane} sp1
* @param {ShapePlane} sp2
* @param {ShapePlane} sp3
* @param {ConnectednessOptions} connectedness
* @returns {Triplet}
*/
export function get_best_triplet(sp1: ShapePlane, sp2: ShapePlane, sp3: ShapePlane, connectedness: ConnectednessOptions): Triplet;
/**
*/
export enum ConnectednessOptions {
  Volume = 0,
  Edge = 1,
  Vertex = 2,
}
/**
*/
export enum ShapePlaneFillRandomness {
  Fully = 0,
  OptimalEdgesConnect = 1,
  NeighborWeighted = 2,
}
/**
*/
export class ShapePlane {
  free(): void;
/**
* @param {Int32Array} values
* @param {number} w
* @param {number} h
*/
  constructor(values: Int32Array, w: number, h: number);
/**
* @returns {Int32Array}
*/
  get_js_values(): Int32Array;
/**
*/
  h: number;
/**
*/
  w: number;
}
/**
*/
export class Triplet {
  free(): void;
/**
* @returns {Int32Array}
*/
  get_js_volume(): Int32Array;
/**
* @returns {Int32Array}
*/
  get_js_removed_component_cubes(): Int32Array;
/**
* @returns {Int32Array}
*/
  get_js_removed_component_sizes(): Int32Array;
/**
* @param {number} i
* @returns {Int32Array}
*/
  get_js_error(i: number): Int32Array;
/**
* @param {number} n
* @param {number} plane_edge_weight_ratio
* @param {number} weight_modifier
* @returns {Float32Array}
*/
  remove_cells_to_minimize_same_plane(n: number, plane_edge_weight_ratio: number, weight_modifier: number): Float32Array;
/**
*/
  d: number;
/**
*/
  h: number;
/**
*/
  r1: number;
/**
*/
  r2: number;
/**
*/
  r3: number;
/**
*/
  w: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_triplet_free: (a: number) => void;
  readonly __wbg_get_triplet_w: (a: number) => number;
  readonly __wbg_set_triplet_w: (a: number, b: number) => void;
  readonly __wbg_get_triplet_h: (a: number) => number;
  readonly __wbg_set_triplet_h: (a: number, b: number) => void;
  readonly __wbg_get_triplet_d: (a: number) => number;
  readonly __wbg_set_triplet_d: (a: number, b: number) => void;
  readonly __wbg_get_triplet_r1: (a: number) => number;
  readonly __wbg_set_triplet_r1: (a: number, b: number) => void;
  readonly __wbg_get_triplet_r2: (a: number) => number;
  readonly __wbg_set_triplet_r2: (a: number, b: number) => void;
  readonly __wbg_get_triplet_r3: (a: number) => number;
  readonly __wbg_set_triplet_r3: (a: number, b: number) => void;
  readonly triplet_get_js_volume: (a: number) => number;
  readonly triplet_get_js_removed_component_cubes: (a: number) => number;
  readonly triplet_get_js_removed_component_sizes: (a: number) => number;
  readonly triplet_get_js_error: (a: number, b: number) => number;
  readonly triplet_remove_cells_to_minimize_same_plane: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly get_random_shape_planes: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly get_best_triplet: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_shapeplane_free: (a: number) => void;
  readonly __wbg_get_shapeplane_w: (a: number) => number;
  readonly __wbg_set_shapeplane_w: (a: number, b: number) => void;
  readonly __wbg_get_shapeplane_h: (a: number) => number;
  readonly __wbg_set_shapeplane_h: (a: number, b: number) => void;
  readonly shapeplane_new: (a: number, b: number, c: number, d: number) => number;
  readonly shapeplane_get_js_values: (a: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
