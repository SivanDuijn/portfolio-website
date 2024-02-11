import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import dynamic from "next/dynamic";
import * as p5 from "p5";
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";

const Sketch = dynamic(import("react-p5"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div>Loading...</div>,
});

type Grid = {
  values: number[];
  w: number;
  h: number;
};

export type P5GridEditorProps = {
  width: number;
  onUpdate?: (grid: Grid) => void;
  grid?: Grid;
  showGridLines?: boolean;
  noInteraction?: boolean;
  darkTheme?: boolean;
  className?: string;
};

export interface P5GridEditorElement {
  setGrid: (grid: Grid) => void;
  erase: () => void;
  getGrid: () => Grid;
}

// const onColor = 200;
// const offColor = 50;
// const hoverOnColor = onColor + 30;
// const hoverOffColor = offColor + 30;
const lightTheme = {
  onColor: 120,
  offColor: 255,
  hoverOnColor: 140,
  hoverOffColor: 225,
};

const darkTheme = {
  onColor: 200,
  offColor: 50,
  hoverOnColor: 230,
  hoverOffColor: 80,
};

// eslint-disable-next-line react/display-name
export const P5GridEditor = React.memo(
  React.forwardRef<P5GridEditorElement, P5GridEditorProps>((props, ref) => {
    const grid = useRef<Grid>(props.grid || { values: new Array(14 * 14).fill(0), w: 14, h: 14 });
    const showGrid = useRef(props.showGridLines);
    const cellSize = useRef(props.width / grid.current.w);

    const mouseInCell = useRef<{ i: number; j: number } | undefined>(undefined);
    const mousePressedCellValue = useRef<number | undefined>(undefined);

    const p5Ref = useRef<p5>();

    const color = useRef(props.darkTheme ? darkTheme : lightTheme);

    useEffect(() => {
      color.current = props.darkTheme ? darkTheme : lightTheme;
      redraw();
    }, [props.darkTheme]);

    useImperativeHandle(
      ref,
      () => ({
        erase,
        setGrid: (newShapePlane) => {
          grid.current = newShapePlane;
          if (props.onUpdate) props.onUpdate(grid.current);

          cellSize.current = props.width / grid.current.w;
          redraw();
        },
        getGrid: () => grid.current,
      }),
      [grid.current],
    );

    useEffect(() => {
      showGrid.current = props.showGridLines;
      redraw();
    }, [props.showGridLines]);

    const erase = useCallback(() => {
      grid.current.values.fill(0);
      if (props.onUpdate) props.onUpdate(grid.current);
      redraw();
    }, []);

    const redraw = useCallback(() => {
      if (!p5Ref.current) return;
      const p = p5Ref.current;
      for (let i = 0; i < grid.current.w; i++)
        for (let j = 0; j < grid.current.h; j++)
          drawRect(i, j, getSPValue(i, j) ? color.current.onColor : color.current.offColor);
      p.redraw();
    }, []);

    const getSPValue = useCallback(
      (i: number, j: number) => grid.current.values[i + j * grid.current.w],
      [],
    );
    const setSPValue = useCallback((i: number, j: number, value: number) => {
      grid.current.values[i + j * grid.current.w] = value;
    }, []);

    const drawRect = useCallback((i: number, j: number, color: number) => {
      if (!p5Ref.current) return;
      const p = p5Ref.current;
      p.push();
      p.fill(color);
      p.noStroke();

      let x = i * cellSize.current;
      let y = j * cellSize.current;
      const halfCellSize = cellSize.current / 2;
      const above = p.get(x + halfCellSize, y - halfCellSize)[0];
      const below = p.get(x + halfCellSize, y + halfCellSize * 3)[0];
      const left = p.get(x - halfCellSize, y + halfCellSize)[0];
      const right = p.get(x + halfCellSize * 3, y + halfCellSize)[0];

      const offset = 0.5;
      let width = cellSize.current;
      let height = cellSize.current;
      if (above == color) {
        y -= offset;
        height += offset;
      }
      if (below == color) height += offset;
      if (left == color) {
        x -= offset;
        width += offset;
      }
      if (right == color) width += offset;

      p.rect(x, y, width, height);

      p.pop();
    }, []);

    const setup = useCallback((p: p5, canvasParentRef: Element) => {
      p.createCanvas(props.width, props.width).parent(canvasParentRef);
      p5Ref.current = p;
      p.noLoop();
      p.mouseMoved = () => {
        if (props.noInteraction) return;
        if (p.mouseX < 0 || p.mouseX > props.width || p.mouseY < 0 || p.mouseY > props.width) {
          if (mouseInCell.current) {
            // Remove the current hovered cell
            drawRect(
              mouseInCell.current.i,
              mouseInCell.current.j,
              getSPValue(mouseInCell.current.i, mouseInCell.current.j)
                ? color.current.onColor
                : color.current.offColor,
            );
            p.redraw();
            mouseInCell.current = undefined;
          }
          return;
        }

        const i = Math.floor(p.mouseX / cellSize.current);
        const j = Math.floor(p.mouseY / cellSize.current);

        if (mouseInCell.current) {
          if (mouseInCell.current.i != i || mouseInCell.current.j != j) {
            // Mouse hovered in new cell
            // First put previous hovered back in original color
            drawRect(
              mouseInCell.current.i,
              mouseInCell.current.j,
              getSPValue(mouseInCell.current.i, mouseInCell.current.j)
                ? color.current.onColor
                : color.current.offColor,
            );
            mouseInCell.current = { i, j };
            drawRect(
              i,
              j,
              getSPValue(i, j) ? color.current.hoverOnColor : color.current.hoverOffColor,
            );
            p.redraw();
          }
        } else {
          // Mouse hovered in cell
          mouseInCell.current = { i, j };
          drawRect(
            i,
            j,
            getSPValue(i, j) ? color.current.hoverOnColor : color.current.hoverOffColor,
          );
          p.redraw();
        }
      };
      p.mouseDragged = () => {
        if (
          props.noInteraction ||
          p.mouseButton != "left" ||
          mousePressedCellValue.current == undefined
        )
          return;

        const i = Math.floor(p.mouseX / cellSize.current);
        const j = Math.floor(p.mouseY / cellSize.current);

        const cellValue = getSPValue(i, j);
        if (cellValue != mousePressedCellValue.current) {
          setSPValue(i, j, mousePressedCellValue.current);
        }
        p.mouseMoved();
        return false;
      };
      p.mousePressed = () => {
        if (props.noInteraction || p.mouseButton != "left" || !mouseInCell.current) return;
        const { i, j } = mouseInCell.current;
        const cellValue = getSPValue(i, j);
        const newCellValue = cellValue ? 0 : 1;
        setSPValue(i, j, newCellValue);
        drawRect(i, j, cellValue ? color.current.hoverOffColor : color.current.hoverOnColor);
        mousePressedCellValue.current = newCellValue;
        // if (props.onUpdate) props.onUpdate(grid.current);
        return false;
      };
      p.mouseReleased = () => {
        if (
          props.noInteraction ||
          p.mouseButton != "left" ||
          mousePressedCellValue.current == undefined
        )
          return;
        mousePressedCellValue.current = undefined;
        if (props.onUpdate) props.onUpdate(grid.current);
        return false;
      };

      p.background(color.current.offColor);
      p.fill(color.current.onColor);
      p.noStroke();
      for (let i = 0; i < grid.current.w; i++)
        for (let j = 0; j < grid.current.h; j++) {
          if (getSPValue(i, j))
            p.rect(
              i * cellSize.current,
              j * cellSize.current,
              cellSize.current + 0.5,
              cellSize.current + 0.5,
            );
        }
    }, []);
    const draw = useCallback((p: p5) => {
      if (showGrid.current) {
        p.noFill();
        p.stroke(0);
        p.strokeWeight(2);
        for (let i = cellSize.current; i < props.width; i += cellSize.current)
          p.line(i, 0, i, props.width);
        for (let j = cellSize.current; j < props.width; j += cellSize.current)
          p.line(0, j, props.width, j);
      }
    }, []);

    const sketchComponent = useMemo(() => <Sketch setup={setup} draw={draw} />, []);

    return (
      <div className={clsx("relative")}>
        <div
          className={clsx(
            "inline-block",
            !props.noInteraction && "hover:cursor-pointer",
            props.className,
          )}
        >
          {sketchComponent}
        </div>
        {!props.noInteraction && (
          <div className={clsx("absolute", "-top-6", "right-1")}>
            <TrashIcon
              className={clsx(
                "w-5",
                "text-gray-500",
                "hover:text-red-600",
                "hover:cursor-pointer",
                "active:text-red-700",
              )}
              onClick={erase}
            />
          </div>
        )}
      </div>
    );
  }),
);
