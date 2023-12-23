/* tslint:disable */
/* eslint-disable */
/**
* @param {ShapePlane} sp1
* @param {ShapePlane} sp2
* @param {ShapePlane} sp3
* @param {ConnectednessOptions} connectedness
* @returns {Triplet}
*/
export function get_best_triplet(sp1: ShapePlane, sp2: ShapePlane, sp3: ShapePlane, connectedness: ConnectednessOptions): Triplet;
/**
* @param {ShapePlane} sp
*/
export function test(sp: ShapePlane): void;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add(a: number, b: number): number;
/**
*/
export enum ConnectednessOptions {
  Volume = 0,
  Edge = 1,
  Vertex = 2,
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
  get_volume(): Int32Array;
/**
*/
  d: number;
/**
*/
  error_score: TripletErrorScore;
/**
*/
  h: number;
/**
*/
  w: number;
}
/**
*/
export class TripletErrorScore {
  free(): void;
/**
* @returns {number}
*/
  sum(): number;
/**
*/
  sp1: number;
/**
*/
  sp2: number;
/**
*/
  sp3: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_tripleterrorscore_free: (a: number) => void;
  readonly __wbg_get_tripleterrorscore_sp1: (a: number) => number;
  readonly __wbg_set_tripleterrorscore_sp1: (a: number, b: number) => void;
  readonly __wbg_get_tripleterrorscore_sp2: (a: number) => number;
  readonly __wbg_set_tripleterrorscore_sp2: (a: number, b: number) => void;
  readonly __wbg_get_tripleterrorscore_sp3: (a: number) => number;
  readonly __wbg_set_tripleterrorscore_sp3: (a: number, b: number) => void;
  readonly tripleterrorscore_sum: (a: number) => number;
  readonly __wbg_triplet_free: (a: number) => void;
  readonly __wbg_get_triplet_w: (a: number) => number;
  readonly __wbg_set_triplet_w: (a: number, b: number) => void;
  readonly __wbg_get_triplet_h: (a: number) => number;
  readonly __wbg_set_triplet_h: (a: number, b: number) => void;
  readonly __wbg_get_triplet_d: (a: number) => number;
  readonly __wbg_set_triplet_d: (a: number, b: number) => void;
  readonly __wbg_get_triplet_error_score: (a: number) => number;
  readonly __wbg_set_triplet_error_score: (a: number, b: number) => void;
  readonly triplet_get_volume: (a: number) => number;
  readonly get_best_triplet: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly test: (a: number) => void;
  readonly add: (a: number, b: number) => number;
  readonly __wbg_shapeplane_free: (a: number) => void;
  readonly __wbg_get_shapeplane_w: (a: number) => number;
  readonly __wbg_set_shapeplane_w: (a: number, b: number) => void;
  readonly __wbg_get_shapeplane_h: (a: number) => number;
  readonly __wbg_set_shapeplane_h: (a: number, b: number) => void;
  readonly shapeplane_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
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
