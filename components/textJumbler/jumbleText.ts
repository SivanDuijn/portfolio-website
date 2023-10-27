import { getRandomInt } from "../utils";

export function jumbleText(
  texts: string[],
  update: (text: string) => void,
  args?: { waitBetweenMs?: number; repeat?: boolean },
) {
  const waitBetweenMs = args?.waitBetweenMs ?? 2000;

  const textsArrays = texts.map((text) => Array.from(text).map((c) => (c === " " ? "\u00A0" : c)));

  const jumbleInto = (
    current: string[], // Assume same size as target, but with empty spaces
    target: string[],
    range: { min: number; max: number }, // range of char indices allowed to change
    correctIndices: Set<number>,
    remainingTargets: string[][],
    iteration = 0,
  ) => {
    for (let i = range.min; i <= range.max; i++) {
      if (correctIndices.has(i)) continue;

      if (range.min === 0 && getRandomInt(4) === 0) {
        current[i] = target[i];
        correctIndices.add(i);
      } else {
        let randomCharCode = 64 + getRandomInt(58);
        if (randomCharCode === 64) randomCharCode = 160;
        current[i] = String.fromCharCode(randomCharCode);
      }

      // if (current[i] === target[i]) correctIndices.add(i);
    }

    update(current.join(""));

    if (range.min > 0 && iteration % 2 == 0) {
      range.min--;
      range.max++;
    }

    if (correctIndices.size !== target.length)
      setTimeout(() => {
        jumbleInto(current, target, range, correctIndices, remainingTargets, ++iteration);
      }, 50);
    else if (remainingTargets.length > 0)
      setTimeout(() => {
        jumbleDown(current, { min: 0, max: current.length - 1 }, remainingTargets);
      }, waitBetweenMs);
    else if (args?.repeat)
      setTimeout(() => {
        jumbleDown(current, { min: 0, max: current.length - 1 }, [...textsArrays]);
      }, waitBetweenMs + 2000);
  };

  const jumbleDown = (
    current: string[],
    range: { min: number; max: number },
    remainingTargets: string[][],
    iteration = 0,
  ) => {
    for (let i = range.min; i <= range.max; i++) {
      let randomCharCode = 64 + getRandomInt(58);
      if (randomCharCode === 64) randomCharCode = 160;
      current[i] = String.fromCharCode(randomCharCode);
    }

    if (range.max - range.min >= 0 && iteration % 2 == 0) {
      current[range.min] = "\u00A0";
      current[range.max] = "\u00A0";

      range.min++;
      range.max--;
    }

    update(current.join(""));

    if (range.max - range.min < 0) {
      // Done with jumbling down
      const target = remainingTargets.shift();
      if (!target) return;

      const halfLength = target.length >> 1;
      const max = halfLength;
      let min = halfLength;
      if (target.length % 2 == 0) min--;

      jumbleInto(
        Array(target.length).fill("\u00A0"),
        target,
        { min, max },
        new Set<number>(),
        remainingTargets,
      );
    } else setTimeout(() => jumbleDown(current, range, remainingTargets, ++iteration), 50);
  };

  setTimeout(() => {
    jumbleDown([], { min: 1, max: 0 }, [...textsArrays]);
  }, 1000);
}
