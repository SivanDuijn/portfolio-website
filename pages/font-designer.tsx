import {
  ArrowDownOnSquareIcon,
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import { MemoizedFontCharacterEditor } from "@/components/triplets/FontCharacterEditor";
import { MemoizedFontCharacterViewer } from "@/components/triplets/FontCharacterViewer";

const gridSize = 14;

export default function FontDesigner() {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [characters, setCharacters] = useState(createEmptyFont());
  const [selectedCharacter, setSelectedCharacter] = useState<PossibleCharacters>("A");
  const [selectedVersion, setSelectedVersion] = useState(0);

  const onCharacterUpdate = useCallback(() => {
    characters[selectedCharacter][selectedVersion] = [
      ...characters[selectedCharacter][selectedVersion],
    ];
    setCharacters({ ...characters });
  }, [characters, selectedCharacter, selectedVersion]);

  const exportCharacters = useCallback(() => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(characters),
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "characters.json";

    link.click();
  }, [characters]);

  const importButtonClicked = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const importInputRef = useRef<HTMLInputElement>(null);
  const importCharacters = useCallback(() => {
    if (!importInputRef.current?.files) return;
    const file = importInputRef.current.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const json = e.target?.result;
      if (typeof json != "string") return;
      const chars = JSON.parse(json);
      if (chars) setCharacters(chars);
    };
    fileReader.readAsText(file, "UTF-8");
  }, []);

  return (
    <div
      className={clsx(
        "flex",
        "px-2",
        "h-[100svh]",
        "pt-2",
        "justify-center",
        isLightTheme && "bg-white text-black",
      )}
      style={{ fontFamily: "'Courier Prime', sans-serif, monospace" }}
    >
      <Head>
        <title>Font Designer</title>
      </Head>
      <div className={clsx("flex", "flex-col", "items-center", "max-w-[70rem]", "relative")}>
        <p
          className={clsx(
            "absolute",
            "left-0",
            "top-2",
            "text-xs",
            "text-gray-400",
            isLightTheme ? "hover:text-gray-800" : "hover:text-gray-100",
            "cursor-pointer",
          )}
          onClick={() => setIsLightTheme(!isLightTheme)}
        >
          theme
        </p>
        <div className={clsx("grid", "grid-cols-3")}>
          <div>
            <div className={clsx("mt-6", "mr-6", "float-right")}>
              <input
                type="file"
                id="file"
                ref={importInputRef}
                style={{ display: "none" }}
                accept="application/JSON"
                onChange={importCharacters}
              />
              <Button
                label="Import"
                icon={ArrowDownOnSquareIcon}
                onClick={importButtonClicked}
                darkTheme={!isLightTheme}
                className="mt-4"
              />
              <Button
                label="Export"
                icon={ArrowUpOnSquareIcon}
                onClick={exportCharacters}
                darkTheme={!isLightTheme}
                className="mt-4"
              />
            </div>
          </div>
          <MemoizedFontCharacterEditor
            gridSize={gridSize}
            characterName={selectedCharacter}
            character={characters[selectedCharacter][selectedVersion]}
            onUpdate={onCharacterUpdate}
            lightTheme={isLightTheme}
          />
        </div>
        <div className={clsx("mt-8", "flex")}>
          {characters[selectedCharacter].map((c, i) => (
            <div key={selectedCharacter + i} className="relative">
              {i < characters[selectedCharacter].length - 1 && (
                <ArrowSmallRightIcon
                  title="Copy this character to the right"
                  className={clsx(
                    "w-4",
                    "absolute",
                    "-top-3",
                    "right-2",
                    "text-gray-700",
                    "hover:text-gray-300",
                    "hover:cursor-pointer",
                  )}
                  onClick={() => {
                    // Copy this character to the right
                    const rightC = characters[selectedCharacter][i + 1];
                    for (let x = 0; x < c.length; x++)
                      for (let y = 0; y < c.length; y++) rightC[x][y] = c[x][y];
                    characters[selectedCharacter][i + 1] = [...rightC];
                    setCharacters({ ...characters });
                  }}
                />
              )}
              {i > 0 && (
                <ArrowSmallLeftIcon
                  title="Copy this character to the left"
                  className={clsx(
                    "w-4",
                    "absolute",
                    "-top-3",
                    "left-2",
                    "text-gray-700",
                    "hover:text-gray-300",
                    "hover:cursor-pointer",
                  )}
                  onClick={() => {
                    // Copy this character to the left
                    const leftC = characters[selectedCharacter][i - 1];
                    for (let x = 0; x < c.length; x++)
                      for (let y = 0; y < c.length; y++) leftC[x][y] = c[x][y];
                    characters[selectedCharacter][i - 1] = [...leftC];
                    setCharacters({ ...characters });
                  }}
                />
              )}
              <div onClick={() => setSelectedVersion(i)}>
                <MemoizedFontCharacterViewer
                  placeholder={selectedCharacter}
                  className={clsx("w-24", "m-1", "cursor-pointer")}
                  character={c}
                  lightTheme={isLightTheme}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={clsx("flex", "flex-wrap", "mt-4", "justify-center")}>
          {Object.entries(characters).map(([cn, c]) => (
            <div key={cn} onClick={() => setSelectedCharacter(cn as PossibleCharacters)}>
              <MemoizedFontCharacterViewer
                placeholder={cn}
                className={clsx("w-24", "m-2", "cursor-pointer")}
                character={c[selectedVersion]}
                lightTheme={isLightTheme}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const emptyCharacter = (): number[][] =>
  Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0));

const allCharacters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

type PossibleCharacters = typeof allCharacters[number];

const createEmptyFont = () => ({
  A: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  B: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  C: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  D: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  E: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  F: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  G: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  H: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  I: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  J: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  K: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  L: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  M: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  N: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  O: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  P: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  Q: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  R: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  S: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  T: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  U: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  V: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  W: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  X: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  Y: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
  Z: [emptyCharacter(), emptyCharacter(), emptyCharacter()],
});
