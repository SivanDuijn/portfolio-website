import * as wasm from "./triplet_wasm.js";

function toWasmSP(shapePlane) {
  return new wasm.ShapePlane(new Int32Array(shapePlane.values), shapePlane.w, shapePlane.h);
}

self.onmessage = ({ data }) => {
  if (data.type == "BUILD_TRIPLETS") {
    const { shapePlanes, connectedness } = data.data;

    const triplets = [];

    shapePlanes.forEach((sp, i) => {
      const sp1 = toWasmSP(sp[0]);
      const sp2 = toWasmSP(sp[1]);
      const sp3 = toWasmSP(sp[2]);
      const t = wasm.get_best_triplet(sp1, sp2, sp3, connectedness);

      triplets.push({
        volume: Array.from(t.get_js_volume()),
        dims: [t.w, t.h, t.d],
        error: {
          xy: t.error_score.sp1,
          xz: t.error_score.sp2,
          yz: t.error_score.sp3,
          sum: t.error_score.sp1 + t.error_score.sp2 + t.error_score.sp3,
        },
      });

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

    const triplet = {
      volume: Array.from(t.get_js_volume()),
      dims: [t.w, t.h, t.d],
      error: {
        xy: t.error_score.sp1,
        xz: t.error_score.sp2,
        yz: t.error_score.sp3,
        sum: t.error_score.sp1 + t.error_score.sp2 + t.error_score.sp3,
      },
    };

    self.postMessage({ type: "TRIPLET_FINISHED", triplet });
  } else if (data.type == "BUILD_RANDOM_TRIPLETS") {
    const { w, h, fill_percentage, randomness, amount } = data.data;

    const triplets = [];

    for (let i = 0; i < amount; i++) {
      const sps = wasm.get_random_shape_planes(w, h, fill_percentage, randomness, 3);
      const t = wasm.get_best_triplet(sps[0], sps[1], sps[2], 0);

      triplets.push({
        volume: Array.from(t.get_js_volume()),
        dims: [t.w, t.h, t.d],
        error: {
          xy: t.error_score.sp1,
          xz: t.error_score.sp2,
          yz: t.error_score.sp3,
          sum: t.error_score.sp1 + t.error_score.sp2 + t.error_score.sp3,
        },
      });

      if (i > 0 && i % 100 == 0) {
        self.postMessage({ type: "TRIPLETS_PROGRESS_UPDATE", amount: 100 });
      }
    }

    self.postMessage({ type: "TRIPLETS_PROGRESS_UPDATE", amount: amount % 100 || 100 });
    self.postMessage({ type: "TRIPLETS_FINISHED", triplets });
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
