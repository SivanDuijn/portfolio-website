import characters1D from "../../data/Characters1D";
import getBestTriplet from "../getBestTriplet";
import getAllTripleAlphabetCombinations from "./getAllAlphabetCombinations";

export default function calcualteAllTriplets() {
  const combinations = getAllTripleAlphabetCombinations();

  const triplets = (thickness: number) =>
    combinations.map((comb) => {
      return getBestTriplet(
        { values: characters1D[comb[0]][thickness], w: 14, h: 14 },
        { values: characters1D[comb[1]][thickness], w: 14, h: 14 },
        { values: characters1D[comb[2]][thickness], w: 14, h: 14 },
      );
    });

  const tripletsThin = triplets(0);
  //   const tripletsMedium = triplets(1);
  //   const tripletsBold = triplets(2);

  console.log(tripletsThin.map((t) => t.error.sum));
  //   console.log(tripletsMedium.map((t) => t.error.sum));
  //   console.log(tripletsBold.map((t) => t.error.sum));
}
