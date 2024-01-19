import {
  ConnectednessOptions,
  ShapePlaneFillRandomness,
} from "@/modules/rust-triplet/pkg/triplet_wasm";
import { ShapePlane, Triplet } from "../models";

export class TripletWebWorker {
  private worker: Worker | undefined = undefined;
  public wasmLoaded = false;

  private onFinished: (triplet: Triplet) => void = () => true;
  private onProgressUpdate: (amount: number) => void = () => true;
  private onMultipleFinished: (triplets: Triplet[]) => void = () => true;

  public setOnFinished(onFinished: (triplet: Triplet) => void) {
    this.onFinished = onFinished;
  }
  public setOnProgressUpdate(onProgressUpdate: (amount: number) => void) {
    this.onProgressUpdate = onProgressUpdate;
  }
  public setOnMultipleFinished(onMultipleFinished: (triplets: Triplet[]) => void) {
    this.onMultipleFinished = onMultipleFinished;
  }

  public buildTriplet(
    sp1: ShapePlane,
    sp2: ShapePlane,
    sp3: ShapePlane,
    connectedness: ConnectednessOptions,
  ) {
    if (!this.wasmLoaded) return;
    this.worker?.postMessage({
      type: "BUILD_TRIPLET",
      data: {
        shapePlanes: [sp1, sp2, sp3],
        connectedness,
      },
    });
  }

  public buildMultipleTriplets(shapePlanes: ShapePlane[][], connectedness: ConnectednessOptions) {
    if (!this.wasmLoaded) return;
    this.worker?.postMessage({
      type: "BUILD_TRIPLETS",
      data: {
        shapePlanes,
        connectedness,
      },
    });
  }

  public buildRandomTriplets(
    w: number,
    h: number,
    fill_percentage: number,
    randomness: ShapePlaneFillRandomness,
    amount: number,
  ) {
    if (!this.wasmLoaded) return;
    this.worker?.postMessage({
      type: "BUILD_RANDOM_TRIPLETS",
      data: { w, h, fill_percentage, randomness, amount },
    });
  }

  public destroy() {
    this.worker?.terminate();
  }

  public init(): Promise<boolean> {
    return new Promise((resolve) => {
      this.worker = new Worker("./triplets/worker.js", { type: "module" });
      this.worker.onmessage = ({ data }) => {
        const { type } = data;

        switch (type) {
          case "FETCH_WASM": {
            // The worker wants to fetch the bytes for the module and for that we can use the `fetch` API.
            // Then we convert the response into an `ArrayBuffer` and transfer the bytes back to the worker.
            fetch("./triplets/triplet_wasm_bg.wasm")
              .then((response) => response.arrayBuffer())
              .then((bytes) => {
                this.worker?.postMessage(bytes, [bytes]);
              });
            break;
          }
          case "TRIPLETS_PROGRESS_UPDATE": {
            this.onProgressUpdate(data.amount);
            break;
          }
          case "TRIPLET_FINISHED": {
            this.onFinished(data.triplet);
            break;
          }
          case "TRIPLETS_FINISHED": {
            this.onMultipleFinished(data.triplets);
            break;
          }
          case "WASM_READY": {
            this.wasmLoaded = true;
            resolve(true);
            break;
          }
          default: {
            break;
          }
        }
      };
    });
  }
}
