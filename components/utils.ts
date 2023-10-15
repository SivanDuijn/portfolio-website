export function getRandomInt(max_exclusive: number) {
  return Math.floor(Math.random() * max_exclusive);
}

export function replaceCharAt(
  str: string,
  char: string,
  index: number
): string {
  if (index > str.length - 1) return str;
  let a = str.split("");
  a[index] = char;
  return a.join("");
  // return str.substring(0, index) + char + str.substring(index + 1);
}

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
