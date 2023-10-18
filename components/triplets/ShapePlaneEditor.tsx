import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRef } from "react";
import { MemoizedSVGPixelCell } from "./SVGPixelCell";
import { useGridSize, usePlaneGrid } from "./lib/GridContext/hooks";

export type ShapePlaneEditorProps = {
    className?: string;
    plane: "left" | "right" | "bottom";
    onChange: (grid: boolean[][]) => void;
};

export const ShapePlaneEditor = (props: ShapePlaneEditorProps) => {
    const { gridSize } = useGridSize();
    const cellSize = 100 / gridSize;
    const { planeGrid, changePlaneGrid, resetPlaneGrid } = usePlaneGrid(props.plane);

    const mouseIsDownEditing = useRef<boolean>(false);

    return (
        <div className={props.className}>
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                role="img"
                className={clsx("hover:cursor-pointer")}
            >
                {planeGrid.map((rows, i) =>
                    rows.map((value, j) => (
                        <MemoizedSVGPixelCell
                            key={i * gridSize + j}
                            cellSize={cellSize}
                            i={i}
                            j={j}
                            value={value}
                            onChange={(value) => changePlaneGrid({ i, j, value })}
                            onMouseDown={(enabling) => {
                                mouseIsDownEditing.current = enabling;
                            }}
                            onMouseEnter={(mouseIsDown) => {
                                if (mouseIsDown) {
                                    changePlaneGrid({
                                        i,
                                        j,
                                        value: mouseIsDownEditing.current ? 1 : 0,
                                    });
                                }
                            }}
                            allowHalfCells
                            padding
                        />
                    )),
                )}
            </svg>
            <div className={clsx("flex", "justify-center")}>
                <TrashIcon
                    className={clsx(
                        "w-5",
                        "text-gray-500",
                        "hover:text-red-600",
                        "hover:cursor-pointer",
                    )}
                    onClick={resetPlaneGrid}
                />
            </div>
        </div>
    );
};
