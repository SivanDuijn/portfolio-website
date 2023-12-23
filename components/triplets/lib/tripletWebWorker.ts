import { ConnectednessOptions } from "@/modules/rust-triplet/pkg/triplet_wasm";
import { ShapePlane } from "../GridContext/reducer";
import { Triplet } from "./buildTriplet";

export default function createTripletWebWorker(
  shapePlanes: ShapePlane[][],
  connectedness: ConnectednessOptions,
  onUpdate: (amount: number) => void,
  onFinished: (triplets: Triplet[]) => void,
) {
  const worker = new Worker("./triplets/worker.js", { type: "module" });

  worker.onmessage = ({ data }) => {
    const { type } = data;

    switch (type) {
      case "FETCH_WASM": {
        // The worker wants to fetch the bytes for the module and for that we can use the `fetch` API.
        // Then we convert the response into an `ArrayBuffer` and transfer the bytes back to the worker.
        fetch("./triplets/triplet_wasm_bg.wasm")
          .then((response) => response.arrayBuffer())
          .then((bytes) => {
            worker.postMessage(bytes, [bytes]);
          });
        break;
      }
      case "LOG": {
        // eslint-disable-next-line no-console
        console.log(data.message);
        break;
      }
      case "WASM_READY": {
        worker.postMessage({
          type: "BUILD_TRIPLETS",
          data: {
            shapePlanes,
            connectedness,
          },
        });
        break;
      }
      case "TRIPLETS_PROGRESS_UPDATE": {
        onUpdate(data.amount);
        break;
      }
      case "TRIPLETS_FINISHED": {
        onFinished(data.triplets);
        worker.terminate();
        break;
      }
      default: {
        break;
      }
    }
  };
}
