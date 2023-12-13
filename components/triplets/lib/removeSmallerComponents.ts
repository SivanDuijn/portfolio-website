import { Triplet } from "./buildTriplet";

type ConnectednessOptions = "volume" | "edge" | "vertex";

/** Alters the triplet in such a way that only the largest component is left.
 * Removes other component that are smaller (or the same).
 * Uses connected component labeling. */
export default function removeSmallerComponents(
  triplet: Triplet,
  connectedness: ConnectednessOptions = "volume",
) {
  const labels = Array<number>(triplet.volume.length).fill(0);
  let currentLabel = 1;
  let largestComponent = Number.MIN_VALUE; // The size of the largest component
  let largestComponentLabel = 1;

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
          const componentSize = dfs(
            triplet,
            labels,
            i,
            j,
            k,
            currentLabel,
            componentIndices,
            connectedness,
          );
          // Keep track of the largest component
          if (componentSize > largestComponent) {
            largestComponent = componentSize;
            largestComponentLabel = currentLabel;
          }
          // Add the indices of this component to the list of indices
          components.push(componentIndices);

          currentLabel++;
        }
      }

  // Remove all components that are not the largest from the triplet
  components.forEach((indices, i) => {
    if (i == largestComponentLabel - 1) return;
    indices.forEach((index) => (triplet.volume[index] = 0));
  });
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

  let nVisited = 0;

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
    nVisited++;

    // Explore neighbors
    nVisited +=
      dfs(triplet, labels, i + 1, j, k, currentLabel, componentIndices, connectedness) +
      dfs(triplet, labels, i - 1, j, k, currentLabel, componentIndices, connectedness) +
      dfs(triplet, labels, i, j + 1, k, currentLabel, componentIndices, connectedness) +
      dfs(triplet, labels, i, j - 1, k, currentLabel, componentIndices, connectedness) +
      dfs(triplet, labels, i, j, k + 1, currentLabel, componentIndices, connectedness) +
      dfs(triplet, labels, i, j, k - 1, currentLabel, componentIndices, connectedness);

    if (connectedness == "edge" || connectedness == "vertex") {
      nVisited +=
        dfs(triplet, labels, i + 1, j + 1, k, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i + 1, j, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i, j + 1, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j - 1, k, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i, j - 1, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i + 1, j - 1, k, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j + 1, k, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i + 1, j, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i, j + 1, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i, j - 1, k + 1, currentLabel, componentIndices, connectedness);
    }

    if (connectedness == "vertex") {
      nVisited +=
        dfs(triplet, labels, i + 1, j + 1, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i + 1, j - 1, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i + 1, j + 1, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i + 1, j - 1, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j + 1, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j - 1, k + 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j + 1, k - 1, currentLabel, componentIndices, connectedness) +
        dfs(triplet, labels, i - 1, j - 1, k - 1, currentLabel, componentIndices, connectedness);
    }
  }

  return nVisited;
}
