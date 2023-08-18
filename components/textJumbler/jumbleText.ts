import { getRandomInt, replaceCharAt, shuffle } from "../utils";

export function jumbleText(
  initialText: string,
  changeInto: string[],
  update: (text: string) => void,
  args?: { waitBetweenMs?: number; repeat?: boolean }
) {
  const waitBetweenMs = args?.waitBetweenMs ?? 2000;

  const jumbleInto = (
    text: string,
    toText: string,
    range: { min: number; max: number }, // range of char indices allowed to change
    unCorrectIndices: number[],
    changeIntoArr: string[],
    iteration = 0
  ) => {
    for (let i = 0; i <= (range.max - range.min) / 7; i++) {
      let randomCharCode = 64 + getRandomInt(58);
      if (randomCharCode === 64) randomCharCode = 160;
      const randomChar = String.fromCharCode(randomCharCode);
      let randomIndex = range.min + getRandomInt(range.max - range.min + 1);

      // Don't allow to change a char that belongs in toText
      // or into a whitespace on both ends
      if (
        !unCorrectIndices.includes(randomIndex) ||
        ((randomIndex === range.min || randomIndex === range.max) &&
          randomCharCode == 160)
      )
        continue;

      text = replaceCharAt(text, randomChar, randomIndex);
    }

    if (range.min === 0 && iteration % 10 == 0) {
      const i = unCorrectIndices.pop();
      if (i !== undefined) text = replaceCharAt(text, toText.charAt(i), i);
    }

    update(text);

    if (range.min > 0 && iteration % 15 == 0) {
      range.min--;
      range.max++;
    }

    if (unCorrectIndices.length !== 0)
      setTimeout(() => {
        jumbleInto(
          text,
          toText,
          range,
          unCorrectIndices,
          changeIntoArr,
          ++iteration
        );
      }, 5);
    else if (changeIntoArr.length > 0)
      setTimeout(() => {
        jumbleDown(text, { min: 0, max: text.length - 1 }, changeIntoArr);
      }, waitBetweenMs);
    else if (args?.repeat)
      setTimeout(() => {
        jumbleDown(text, { min: 0, max: text.length - 1 }, [...changeInto]);
      }, waitBetweenMs + 2000);
  };

  const jumbleDown = (
    text: string,
    range: { min: number; max: number },
    changeIntoArr: string[],
    iteration = 0
  ) => {
    for (let i = 0; i <= (range.max - range.min) / 7; i++) {
      let randomCharCode = 64 + getRandomInt(58);
      if (randomCharCode === 64) randomCharCode = 160;
      const randomChar = String.fromCharCode(randomCharCode);
      let randomIndex = range.min + getRandomInt(range.max - range.min + 1);

      text = replaceCharAt(text, randomChar, randomIndex);
    }

    if (range.max - range.min >= 0 && iteration % 15 == 0) {
      text = replaceCharAt(text, "\u00A0", range.min);
      text = replaceCharAt(text, "\u00A0", range.max);

      range.min++;
      range.max--;
    }

    update(text);

    if (range.max - range.min < 0) {
      // Done with jumbling down
      const toText = changeIntoArr.splice(0, 1)[0];
      if (!toText) return;

      const halfLength = toText.length >> 1;
      const max = halfLength;
      let min = halfLength;
      if (toText.length % 2 == 0) min--;

      toText.replace(" ", "\u00A0");
      jumbleInto(
        "\u00A0".repeat(toText.length),
        toText,
        { min, max },
        shuffle(Array.from({ length: toText.length }, (_, index) => index)),
        changeIntoArr
      );
    } else
      setTimeout(() => jumbleDown(text, range, changeIntoArr, ++iteration), 5);
  };

  setTimeout(() => {
    jumbleDown(initialText, { min: 0, max: initialText.length - 1 }, [
      ...changeInto,
    ]);
  }, waitBetweenMs);
}
