import { Triplet } from "./buildTriplet";

type ConnectednessOptions = "volume" | "edge" | "vertex";

/** Alters the triplet in such a way that only the largest component is left.
 * Removes other component that are smaller (or the same).
 *
 * @param connectedness Check for connecteness for either volume, edge or vertex.
 * Volume means faces need to be connected, edge means edges ...
 */
export function removeSmallerComponents(triplet: Triplet, connectedness: ConnectednessOptions) {
  const { components } = getTripletComponents(triplet, connectedness);

  const largestComponentSize = Math.max(...components.map((c) => c.length));

  // Remove all components that are not the largest from the triplet
  components.forEach((indices) => {
    if (indices.length == largestComponentSize) return;
    indices.forEach((index) => (triplet.volume[index] = 0));
  });
}

/** Applies connected component labeling to a triplet.
 * @param connectedness - Check for connecteness for either volume, edge or vertex.
 * Volume means faces need to be connected, edge means edges ...
 *
 * @returns An array containing labels for each voxel and a list of indices for each component.
 */
export function getTripletComponents(triplet: Triplet, connectedness: ConnectednessOptions) {
  const labels = Array<number>(triplet.volume.length).fill(0);
  let currentLabel = 1;

  // Store the indices of each component
  const components: number[][] = [];

  // Go through all voxels
  for (let i = 0; i < triplet.dims[0]; i++)
    for (let j = 0; j < triplet.dims[1]; j++)
      for (let k = 0; k < triplet.dims[2]; k++) {
        const index = i + triplet.dims[0] * (j + triplet.dims[1] * k);
        // If a voxel is on and not labeled yet, do depth first search for neighboring voxels and label them as well
        if (triplet.volume[index] && labels[index] == 0) {
          const componentIndices: number[] = [];
          dfs(triplet, labels, i, j, k, currentLabel, componentIndices, connectedness);
          // Add the indices of this component to the list of indices
          components.push(componentIndices);

          currentLabel++;
        }
      }

  return { labels, components };
}

function dfs(
  triplet: Triplet,
  labels: number[],
  i: number,
  j: number,
  k: number,
  currentLabel: number,
  componentIndices: number[],
  connectedness: ConnectednessOptions,
) {
  const index = i + triplet.dims[0] * (j + triplet.dims[1] * k);

  if (
    triplet.volume[index] &&
    labels[index] == 0 &&
    0 <= i && // Out of bounds checks follow
    i < triplet.dims[0] &&
    0 <= j &&
    j < triplet.dims[1] &&
    0 <= k &&
    k < triplet.dims[2]
  ) {
    labels[index] = currentLabel;
    componentIndices.push(index);

    // Explore neighbors
    dfs(triplet, labels, i + 1, j, k, currentLabel, componentIndices, connectedness);
    dfs(triplet, labels, i - 1, j, k, currentLabel, componentIndices, connectedness);
    dfs(triplet, labels, i, j + 1, k, currentLabel, componentIndices, connectedness);
    dfs(triplet, labels, i, j - 1, k, currentLabel, componentIndices, connectedness);
    dfs(triplet, labels, i, j, k + 1, currentLabel, componentIndices, connectedness);
    dfs(triplet, labels, i, j, k - 1, currentLabel, componentIndices, connectedness);

    if (connectedness == "edge" || connectedness == "vertex") {
      dfs(triplet, labels, i + 1, j + 1, k, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i + 1, j, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i, j + 1, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j - 1, k, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i, j - 1, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i + 1, j - 1, k, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j + 1, k, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i + 1, j, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i, j + 1, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i, j - 1, k + 1, currentLabel, componentIndices, connectedness);
    }

    if (connectedness == "vertex") {
      dfs(triplet, labels, i + 1, j + 1, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i + 1, j - 1, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i + 1, j + 1, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i + 1, j - 1, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j + 1, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j - 1, k + 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j + 1, k - 1, currentLabel, componentIndices, connectedness);
      dfs(triplet, labels, i - 1, j - 1, k - 1, currentLabel, componentIndices, connectedness);
    }
  }
}
