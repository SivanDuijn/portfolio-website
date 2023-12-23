import * as wasm from "./triplet_wasm.js";

self.onmessage = ({ data }) => {
  if (data.type == "LOG") {
    self.postMessage({ type: "LOG", message: data });
  } else if (data.type == "BUILD_TRIPLETS") {
    const { shapePlanes, connectedness } = data.data;

    const triplets = [];

    shapePlanes.forEach((sp, i) => {
      const sp1 = new wasm.ShapePlane(new Int32Array(sp[0].values), sp[0].w, sp[0].h);
      const sp2 = new wasm.ShapePlane(new Int32Array(sp[1].values), sp[1].w, sp[1].h);
      const sp3 = new wasm.ShapePlane(new Int32Array(sp[2].values), sp[2].w, sp[2].h);
      const t = wasm.get_best_triplet(sp1, sp2, sp3, connectedness);

      triplets.push({
        volume: Array.from(t.get_volume()),
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
