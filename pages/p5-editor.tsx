import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import { P5GridEditor, P5GridEditorElement } from "@/components/triplets/P5ShapePlaneEditor";

export default function P5Editor() {
  const [showGrid, setShowGrid] = useState(false);
  const p5SPEditorRef = useRef<P5GridEditorElement>(null);
  const [gridSize, setGridSize] = useState(10);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    p5SPEditorRef.current?.setGrid({
      values: new Array(gridSize * gridSize).fill(0),
      w: gridSize,
      h: gridSize,
    });
  }, [gridSize]);

  return (
    <div
      className={clsx(
        "flex",
        "flex-col",
        "pt-10",
        "items-center",
        "space-y-2",
        "min-h-[100svh]",
        !darkTheme && "bg-white",
      )}
    >
      <P5GridEditor
        ref={p5SPEditorRef}
        className={clsx("border-2", "border-gray-300")}
        width={300}
        showGridLines={showGrid}
        darkTheme={darkTheme}
      />
      <Button label="Show grid" darkTheme={darkTheme} onClick={() => setShowGrid(!showGrid)} />
      <Button label="Bigger" darkTheme={darkTheme} onClick={() => setGridSize(gridSize + 1)} />
      <Button label="Smaller" darkTheme={darkTheme} onClick={() => setGridSize(gridSize - 1)} />
      <Button
        label={`${darkTheme ? "Light" : "Dark"} theme`}
        darkTheme={darkTheme}
        onClick={() => setDarkTheme((value) => !value)}
      />
    </div>
  );
}
