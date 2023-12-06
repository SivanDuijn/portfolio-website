import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useMemo, useRef } from "react";
import { useGridSize, useShapePlane } from "./GridContext/hooks";
import { MemoizedSVGPixelCell } from "./SVGPixelCell";

export type ShapePlaneEditorProps = {
  className?: string;
  plane: "xy" | "xz" | "yz";
};

export function ShapePlaneEditor(props: ShapePlaneEditorProps) {
  const { gridSize } = useGridSize();
  const cellSize = 100 / gridSize;
  const { shapePlane, changeShapePlane, resetShapePlane } = useShapePlane(props.plane);

  const mouseIsDownEditing = useRef<boolean>(false);

  return useMemo(
    () => (
      <div className={props.className}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          className={clsx("hover:cursor-pointer")}
        >
          {shapePlane.values.map((value, i) => (
            <MemoizedSVGPixelCell
              key={i * 100000 + value}
              cellSize={cellSize}
              i={i % shapePlane.w}
              j={(i / shapePlane.w) >> 0}
              value={value}
              onChange={(value) => changeShapePlane({ i, value })}
              onMouseDown={(enabling) => {
                mouseIsDownEditing.current = enabling;
              }}
              onMouseEnter={(mouseIsDown) => {
                if (mouseIsDown) {
                  changeShapePlane({
                    i,
                    value: mouseIsDownEditing.current ? 1 : 0,
                  });
                }
              }}
              padding
            />
          ))}
        </svg>
        <div className={clsx("flex", "justify-center")}>
          <TrashIcon
            className={clsx("w-5", "text-gray-500", "hover:text-red-600", "hover:cursor-pointer")}
            onClick={resetShapePlane}
          />
        </div>
      </div>
    ),
    [props.className, shapePlane, gridSize, cellSize, shapePlane.values],
  );
}
