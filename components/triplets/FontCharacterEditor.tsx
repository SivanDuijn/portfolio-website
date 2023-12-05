import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";
import Button from "./atoms/Button";
import { Kernels, dilate, erode } from "./lib/morphOperations";
import { MemoizedSVGPixelCell } from "./SVGPixelCell";

export type FontCharacterEditorProps = {
  gridSize: number;
  characterName: string;
  character: number[][];
  className?: string;
  onUpdate: () => void;
  lightTheme?: boolean;
};

export const MemoizedFontCharacterEditor = memo(FontCharacterEditor);
export function FontCharacterEditor(props: FontCharacterEditorProps) {
  const cellSize = 100 / props.gridSize;

  const [showGridLines, setShowGridLines] = useState(false);
  const [character, setCharacter] = useState<number[][]>(props.character);
  useEffect(() => setCharacter(props.character), [props.character]);

  const mouseIsDownEditing = useRef<boolean>(false);

  const morphKernel = useRef<Kernels>("square");

  return (
    <>
      <div className={clsx("w-60", "relative")}>
        <p className={clsx("text-xl", "text-center")}>{props.characterName}</p>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          className={clsx("hover:cursor-pointer", "border", "border-gray-600")}
          onMouseUp={() => props.onUpdate()}
          onMouseLeave={(e) => e.buttons == 1 && props.onUpdate()}
        >
          {character.map((rows, i) =>
            rows.map((value, j) => (
              <MemoizedSVGPixelCell
                key={i * props.gridSize + j}
                cellSize={cellSize}
                i={i}
                j={j}
                value={value}
                lightTheme={props.lightTheme}
                onChange={(v) => {
                  character[i][j] = v;
                  setCharacter([...character]);
                  props.onUpdate();
                }}
                onMouseDown={(enabling) => {
                  mouseIsDownEditing.current = enabling;
                }}
                onMouseEnter={(mouseIsDown) => {
                  if (mouseIsDown) {
                    character[i][j] = mouseIsDownEditing.current ? 1 : 0;
                    setCharacter([...character]);
                  }
                }}
              />
            )),
          )}

          {showGridLines &&
            Array(props.gridSize - 1)
              .fill(0)
              .map((_, i) => {
                const offset = (i + 1) * cellSize;
                return (
                  <g key={i}>
                    <line
                      x1={offset}
                      y1={0}
                      x2={offset}
                      y2={100}
                      stroke={props.lightTheme ? "#AAAAAA" : "black"}
                      strokeWidth={0.5}
                    />
                    <line
                      x1={0}
                      y1={offset}
                      x2={100}
                      y2={offset}
                      stroke={props.lightTheme ? "#AAAAAA" : "black"}
                      strokeWidth={0.5}
                    />
                  </g>
                );
              })}
        </svg>
        <div className={clsx("absolute", "-right-7", "bottom-0")}>
          <TrashIcon
            className={clsx("w-5", "text-gray-500", "hover:text-red-600", "hover:cursor-pointer")}
            onClick={() => {
              for (let i = 0; i < character.length; i++)
                for (let j = 0; j < character.length; j++) character[i][j] = 0;
              setCharacter([...character]);
              props.onUpdate();
            }}
          />
        </div>
      </div>
      <div className={clsx("mt-6", "ml-6")}>
        <label htmlFor="countries" className={clsx("block", "font-bold")}>
          Kernel
        </label>
        <select
          id="countries"
          className={clsx(
            "border",
            "rounded-lg",
            "block",
            "px-2.5",
            "py-1.5",
            props.lightTheme ? "bg-[#5ce389]" : "bg-[#002000]",
            "border-gray-500",
            "focus:ring-gray-500",
            "focus:border-gray-500",
          )}
          onChange={(e) => {
            morphKernel.current = e.target.value as Kernels;
          }}
        >
          <option selected value="square">
            Square
          </option>
          <option value="plus">Plus</option>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
        <Button
          label="Dilate"
          className="mt-2"
          onClick={() => {
            dilate(character, morphKernel.current);
            setCharacter([...character]);
            props.onUpdate();
          }}
          lightTheme={props.lightTheme}
        />
        <Button
          label="Erode"
          className="mt-2"
          onClick={() => {
            erode(character, morphKernel.current);
            setCharacter([...character]);
            props.onUpdate();
          }}
          lightTheme={props.lightTheme}
        />
        <input
          type="checkbox"
          id="gridLines"
          onChange={(e) => setShowGridLines(e.currentTarget.checked)}
          checked={showGridLines}
          className={clsx("mt-4")}
        />
        <label htmlFor="gridLines" className={clsx("ml-2", "font-bold")}>
          Grid lines
        </label>
      </div>
    </>
  );
}
