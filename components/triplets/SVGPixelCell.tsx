import clsx from "clsx";
import { useState, useCallback, Dispatch, SetStateAction, memo } from "react";

export type SVGPixelCellProps = {
    i: number;
    j: number;
    cellSize: number;
    value: number;
    onChange?: (value: number) => void;
    onMouseDown?: (enabling: boolean) => void;
    onMouseEnter?: (mouseIsDown: boolean) => void;
    allowHalfCells?: boolean;
    padding?: boolean;
    debug?: boolean;
    lightTheme?: boolean;
};

export const MemoizedSVGPixelCell = memo(SVGPixelCell);
export function SVGPixelCell(props: SVGPixelCellProps) {
    const { i, j, cellSize, value, onChange } = props;
    const [hoveringMiddle, setHoveringMiddle] = useState(false);
    const [hoveringTopRight, setHoveringTopRight] = useState(false);
    const [hoveringTopLeft, setHoveringTopLeft] = useState(false);
    const [hoveringBottomRight, setHoveringBottomRight] = useState(false);
    const [hoveringBottomLeft, setHoveringBottomLeft] = useState(false);

    const x = cellSize * i;
    const y = cellSize * j;

    const padding = props.padding ? 1 : 0;

    const baseColor = props.lightTheme ? "fill-black" : "fill-gray-200";
    const bgColor = props.lightTheme ? "fill-gray-100" : "fill-gray-700";

    const getClassName = useCallback(
        (areaIndex: number, hovering: boolean) =>
            clsx(
                baseColor,
                hovering
                    ? props.lightTheme
                        ? "opacity-60"
                        : "opacity-100"
                    : value === areaIndex
                    ? props.lightTheme
                        ? "opacity-100"
                        : "opacity-60"
                    : "opacity-0",
            ),
        [value, props.lightTheme, baseColor],
    );

    const getMouseEvents = useCallback(
        (areaIndex: number, setHovering: Dispatch<SetStateAction<boolean>>) =>
            onChange
                ? {
                      onMouseDown: () => onChange(value === areaIndex ? 0 : areaIndex),
                      onMouseEnter: () => setHovering(true),
                      onMouseLeave: () => setHovering(false),
                  }
                : {},
        [value, onChange],
    );

    return (
        <g
            onMouseDown={() => props.onMouseDown && props.onMouseDown(!value)}
            onMouseEnter={(e) => props.onMouseEnter && props.onMouseEnter(e.buttons === 1)}
        >
            <rect
                className={clsx(bgColor, "opacity-60")}
                x={x}
                y={y}
                width={cellSize - padding}
                height={cellSize - padding}
            />
            <rect
                className={getClassName(1, hoveringMiddle)}
                x={x}
                y={y}
                width={cellSize - padding}
                height={cellSize - padding}
            />

            {props.allowHalfCells && (
                <>
                    <path
                        d={`M ${x} ${y} 
                    V ${y + cellSize - padding} 
                    L ${x + cellSize - padding} ${y}
                    H ${x}`}
                        className={getClassName(2, hoveringTopLeft)}
                    />
                    <path
                        d={`M ${x + cellSize - padding} ${y} 
                    V ${y + cellSize - padding} 
                    L ${x} ${y}
                    H ${x + cellSize - padding}`}
                        className={getClassName(3, hoveringTopRight)}
                    />
                    <path
                        d={`M ${x + cellSize - padding} ${y + cellSize - padding} 
                    V ${y} 
                    L ${x} ${y + cellSize - padding}
                    H ${x + cellSize - padding}`}
                        className={getClassName(4, hoveringBottomRight)}
                    />
                    <path
                        d={`M ${x} ${y + cellSize - padding} 
                    V ${y} 
                    L ${x + cellSize - padding} ${y + cellSize - padding}
                    H ${x}`}
                        className={getClassName(5, hoveringBottomLeft)}
                    />

                    <path
                        d={`M ${x} ${y} 
                    V ${y + cellSize * 0.33} 
                    L ${x + cellSize * 0.33} ${y}
                    H ${x}`}
                        className={clsx("fill-transparent")}
                        {...getMouseEvents(2, setHoveringTopLeft)}
                    />
                    <path
                        d={`M ${x + cellSize - padding} ${y} 
                    V ${y + cellSize * 0.33} 
                    L ${x + cellSize * 0.66 - padding} ${y}
                    H ${x + cellSize - padding}`}
                        className={clsx("fill-transparent")}
                        {...getMouseEvents(3, setHoveringTopRight)}
                    />
                    <path
                        d={`M ${x + cellSize - padding} ${y + cellSize - padding} 
                    V ${y + cellSize * 0.66 - padding} 
                    L ${x + cellSize * 0.66 - padding} ${y + cellSize - padding}
                    H ${x + cellSize - padding}`}
                        className={clsx("fill-transparent")}
                        {...getMouseEvents(4, setHoveringBottomRight)}
                    />
                    <path
                        d={`M ${x} ${y + cellSize - padding} 
                    V ${y + cellSize * 0.66 - padding} 
                    L ${x + cellSize * 0.33} ${y + cellSize - padding} 
                    H ${x}`}
                        className={clsx("fill-transparent")}
                        {...getMouseEvents(5, setHoveringBottomLeft)}
                    />
                </>
            )}

            {props.allowHalfCells ? (
                <path
                    d={`M ${x + cellSize * 0.33} ${y} 
                    H ${x + cellSize * 0.66 - padding}
                    L ${x + cellSize - padding} ${y + cellSize * 0.33}
                    V ${y + cellSize * 0.66 - padding}
                    L ${x + cellSize * 0.66 - padding} ${y + cellSize - padding}
                    H ${x + cellSize * 0.33}
                    L ${x} ${y + cellSize * 0.66 - padding}
                    V ${y + cellSize * 0.33}
                    L ${x + cellSize * 0.33} ${y} `}
                    className={clsx("fill-transparent")}
                    {...getMouseEvents(1, setHoveringMiddle)}
                />
            ) : (
                <rect
                    className={clsx("fill-transparent")}
                    x={x}
                    y={y}
                    width={cellSize - padding}
                    height={cellSize - padding}
                    {...getMouseEvents(1, setHoveringMiddle)}
                />
            )}
        </g>
    );
}
