import * as wasm from "./triplet_wasm_lib.js";

function toWasmSP(shapePlane) {
  return new wasm.ShapePlane(new Int32Array(shapePlane.values), shapePlane.w, shapePlane.h);
}

function toJSTriplet(t) {
  const sp1Error = t.get_js_error(0);
  const sp2Error = t.get_js_error(1);
  const sp3Error = t.get_js_error(2);

  // Convert removed component cubes into hashset
  const removedComponents = [];
  const wasmRemovedCubes = t.get_js_removed_component_cubes();

  let i = 0;
  t.get_js_removed_component_sizes().forEach((s) => {
    const set = new Set();
    const t = s + i;
    for (; i < t; i++) set.add(wasmRemovedCubes[i]);
    removedComponents.push(set);
  });

  return {
    volume: Array.from(t.get_js_volume()),
    dims: [t.w, t.h, t.d],
    removedComponents,
    error: {
      sp1: new Set(sp1Error),
      sp2: new Set(sp2Error),
      sp3: new Set(sp3Error),
      totalPercentage:
        ((sp1Error.length + sp2Error.length + sp3Error.length) / (t.w * t.w)) * 33.3333333333,
    },
    rotations: [t.r1, t.r2, t.r3],
  };
}

let prev_triplet;

self.onmessage = ({ data }) => {
  if (data.type == "BUILD_TRIPLETS") {
    const { shapePlanes, connectedness } = data.data;

    const triplets = [];

    shapePlanes.forEach((sp, i) => {
      const sp1 = toWasmSP(sp[0]);
      const sp2 = toWasmSP(sp[1]);
      const sp3 = toWasmSP(sp[2]);
      const t = wasm.get_best_triplet(sp1, sp2, sp3, connectedness);
      t.get_js_error(0).length;

      triplets.push(toJSTriplet(t));

      if (i > 0 && i % 100 == 0) {
        self.postMessage({ type: "TRIPLETS_PROGRESS_UPDATE", amount: 100 });
      }
    });

    self.postMessage({ type: "TRIPLETS_PROGRESS_UPDATE", amount: shapePlanes.length % 100 });
    self.postMessage({ type: "TRIPLETS_FINISHED", triplets });
  } else if (data.type == "BUILD_TRIPLET") {
    const { shapePlanes, connectedness } = data.data;

    const sp1 = toWasmSP(shapePlanes[0]);
    const sp2 = toWasmSP(shapePlanes[1]);
    const sp3 = toWasmSP(shapePlanes[2]);
    const t = wasm.get_best_triplet(sp1, sp2, sp3, connectedness);

    prev_triplet = t;

    const triplet = toJSTriplet(t);

    self.postMessage({ type: "TRIPLET_FINISHED", triplet });
  } else if (data.type == "BUILD_RANDOM_TRIPLETS") {
    const { w, h, fill_percentage, randomness, amount } = data.data;

    const triplets = [];

    for (let i = 0; i < amount; i++) {
      const sps = wasm.get_random_shape_planes(w, h, fill_percentage, randomness, 3);
      const t = wasm.get_best_triplet(sps[0], sps[1], sps[2], 0);

      triplets.push(toJSTriplet(t));

      if (i > 0 && i % 100 == 0) {
        self.postMessage({ type: "TRIPLETS_PROGRESS_UPDATE", amount: 100 });
      }
    }

    self.postMessage({ type: "TRIPLETS_PROGRESS_UPDATE", amount: amount % 100 || 100 });
    self.postMessage({ type: "TRIPLETS_FINISHED", triplets });
  } else if (data.type == "REMOVE_CELLS") {
    if (prev_triplet) {
      const { n, plane_edge_weight_ratio, weight_modifier } = data.data;

      const [
        i,
        max_i_plane,
        max_j_plane,
        max_k_plane,
        new_max_i_plane,
        new_max_j_plane,
        new_max_k_plane,
      ] = prev_triplet.remove_cells_to_minimize_same_plane(
        n,
        plane_edge_weight_ratio,
        weight_modifier,
      );

      const triplet = toJSTriplet(prev_triplet);

      self.postMessage({
        type: "REMOVE_CELLS_FINISHED",
        triplet,
        nCubesRemoved: i,
        maxNCellsPerPlane: [max_i_plane, max_j_plane, max_k_plane],
        newMaxNCellsPerPlane: [new_max_i_plane, new_max_j_plane, new_max_k_plane],
      });
      self.postMessage({
        type: "LOG_USER",
        message: i > 0 ? `Removed ${i} cube${i == 1 ? "" : "s"}!` : "Can't remove more cubes!",
        success: i > 0,
      });
    }
  } else {
    /**
     * When we receive the bytes as an `ArrayBuffer` we can use that to
     * synchronously initialize the module as opposed to asynchronously
     * via the default export. The synchronous method internally uses
     * `new WebAssembly.Module()` and `new WebAssembly.Instance()`.
     */
    wasm.initSync(data);

    self.postMessage({ type: "WASM_READY" });
  }
};

/**
 * Once the Web Worker was spawned we ask the main thread to fetch the bytes
 * for the WebAssembly module. Once fetched it will send the bytes back via
 * a `postMessage` (see above).
 */
self.postMessage({ type: "FETCH_WASM" });
