export default function getAllTripleAlphabetCombinations() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const combinations: string[][] = [];

  for (let i = 0; i < alphabet.length; i++)
    for (let j = i; j < alphabet.length; j++)
      for (let k = j; k < alphabet.length; k++)
        combinations.push([alphabet[i], alphabet[j], alphabet[k]]);

  return combinations;
}
