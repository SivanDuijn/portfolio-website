import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { P5GridEditor, P5GridEditorElement } from "@/components/triplets/P5ShapePlaneEditor";

export default function P5Editor() {
  const [showGrid, setShowGrid] = useState(false);
  const p5SPEditorRef = useRef<P5GridEditorElement>(null);
  const [gridSize, setGridSize] = useState(10);

  useEffect(() => {
    p5SPEditorRef.current?.setGrid({
      values: new Array(gridSize * gridSize).fill(0),
      w: gridSize,
      h: gridSize,
    });
  }, [gridSize]);

  return (
    <div className={clsx("flex", "flex-col", "mt-10", "items-center", "space-y-2")}>
      <P5GridEditor
        ref={p5SPEditorRef}
        className={clsx("border-2", "border-gray-300")}
        width={300}
        grid={{ values: new Array(gridSize * gridSize).fill(0), w: gridSize, h: gridSize }}
        showGridLines={showGrid}
      />
      <button onClick={() => setShowGrid(!showGrid)}>showGrid</button>
      <button onClick={() => p5SPEditorRef.current?.erase()}>erase</button>
      <button onClick={() => setGridSize(gridSize + 1)}>bigger</button>
      <button onClick={() => setGridSize(gridSize - 1)}>smaller</button>
    </div>
  );
}
