import characters from "./characters.json";

// TODO: fix json character files, so the row and cols are right
/** Takes a charactes json and fixes rotation and puts it in 1D array. */
const characters1D: { [key: string]: number[][] } = {};
Object.keys(characters).forEach((key) => {
  const char: number[][] = [];
  characters[key as "A"].forEach((c) => {
    const charV = Array(14 * 14).fill(0);
    c.forEach((row, i) =>
      row.forEach((v, j) => {
        charV[j * 14 + i] = v;
      }),
    );
    char.push(charV);
  });
  characters1D[key] = char;
});

export default characters1D;
