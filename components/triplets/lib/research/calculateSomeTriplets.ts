import alphabetCombinations from "../../data/alphabetCombinations.json";
import characters1D from "../../data/Characters1D";
import { Triplet } from "../buildTriplet";
import { ConnectednessOptions } from "../componentLabelling";
import getBestTriplet from "../getBestTriplet";

export default function calculateSomeTriplets(
  thickness: 0 | 1 | 2,
  connectedness: ConnectednessOptions,
  range: { start: number; end: number } = { start: 0, end: 3276 }, // start inclusive, end exclusive
) {
  const triplets: Triplet[] = Array<Triplet>((range.end > 3276 ? 3276 : range.end) - range.start);

  for (let i = range.start, j = 0; i < range.end && i < 3276; i++, j++) {
    triplets[j] = getBestTriplet(
      { values: characters1D[alphabetCombinations[i][0]][thickness], w: 14, h: 14 },
      { values: characters1D[alphabetCombinations[i][1]][thickness], w: 14, h: 14 },
      { values: characters1D[alphabetCombinations[i][2]][thickness], w: 14, h: 14 },
      connectedness,
    );
  }

  return triplets;
}
