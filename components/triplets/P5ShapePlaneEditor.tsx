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
  errorCells?: Set<number>;
  showGridLines?: boolean;
  noInteraction?: boolean;
  darkTheme?: boolean;
  className?: string;
};

export interface P5GridEditorElement {
  setGrid: (grid: Grid) => void;
  setErrorCells: (errorCells: Set<number>) => void;
  erase: () => void;
  getGrid: () => Grid;
}

const lightTheme = {
  onColor: [130],
  offColor: [255],
  errorColor: [214, 86, 90],
  hoverErrorOnColor: [235, 129, 133],
  hoverErrorOffColor: [179, 71, 75],
  hoverOnColor: [160],
  hoverOffColor: [195],
};

const darkTheme = {
  onColor: [200],
  offColor: [50],
  errorColor: [214, 86, 90],
  hoverErrorOnColor: [179, 71, 75],
  hoverErrorOffColor: [235, 129, 133],
  hoverOnColor: [230],
  hoverOffColor: [80],
};

// eslint-disable-next-line react/display-name
export const P5GridEditor = React.memo(
  React.forwardRef<P5GridEditorElement, P5GridEditorProps>((props, ref) => {
    const grid = useRef<Grid>({ values: new Array(14 * 14).fill(0), w: 14, h: 14 });
    const errorCells = useRef<Set<number>>(props.errorCells || new Set<number>());
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

          cellSize.current = props.width / grid.current.w;
          redraw();
        },
        setErrorCells: (newErrorCells) => {
          errorCells.current = newErrorCells;
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
        for (let j = 0; j < grid.current.h; j++) {
          const c = errorCells.current.has(i + j * grid.current.w)
            ? color.current.errorColor
            : getSPValue(i, j)
            ? color.current.onColor
            : color.current.offColor;

          drawRectUsingGridNeighbors(i, j, c);
        }
      p.redraw();
    }, []);

    const getSPValue = useCallback(
      (i: number, j: number) => grid.current.values[i + j * grid.current.w],
      [],
    );
    const setSPValue = useCallback((i: number, j: number, value: number) => {
      grid.current.values[i + j * grid.current.w] = value;
    }, []);

    const drawRectUsingGridNeighbors = useCallback((i: number, j: number, color: number[]) => {
      if (!p5Ref.current) return;
      const p = p5Ref.current;

      const index = i + j * grid.current.w;
      const cell = errorCells.current.has(index) ? 500 : grid.current.values[index];

      const aboveI = index - grid.current.w;
      const belowI = index + grid.current.w;
      const rightI = i < grid.current.w ? index + 1 : -1;
      const leftI = i > 0 ? index - 1 : -1;
      const above =
        aboveI >= 0 ? (errorCells.current.has(aboveI) ? 500 : grid.current.values[aboveI]) : -1;
      const below =
        belowI < grid.current.values.length
          ? errorCells.current.has(belowI)
            ? 500
            : grid.current.values[belowI]
          : -1;
      const right =
        rightI >= 0 ? (errorCells.current.has(rightI) ? 500 : grid.current.values[rightI]) : -1;
      const left =
        leftI >= 0 ? (errorCells.current.has(leftI) ? 500 : grid.current.values[leftI]) : -1;

      const offset = 0.4;
      let x = i * cellSize.current;
      let y = j * cellSize.current;
      let width = cellSize.current;
      let height = cellSize.current;
      if (cell == above) {
        y -= offset;
        height += offset;
      }
      if (cell == below) height += offset;
      if (cell == left) {
        x -= offset;
        width += offset;
      }
      if (cell == right) width += offset;

      p.push();
      p.fill(color);
      p.noStroke();
      p.rect(x, y, width, height);
      p.pop();
    }, []);

    const drawRect = useCallback((i: number, j: number, color: number[]) => {
      if (!p5Ref.current) return;
      const p = p5Ref.current;
      p.push();
      p.fill(color);
      p.noStroke();

      let x = i * cellSize.current;
      let y = j * cellSize.current;
      const halfCellSize = cellSize.current / 2;
      const above = p.get(x + halfCellSize, y - halfCellSize);
      const below = p.get(x + halfCellSize, y + halfCellSize * 3);
      const left = p.get(x - halfCellSize, y + halfCellSize);
      const right = p.get(x + halfCellSize * 3, y + halfCellSize);

      const offset = 0.7;
      let width = cellSize.current;
      let height = cellSize.current;
      if (color.every((v, i) => v == above[i])) {
        y -= offset;
        height += offset;
      }
      if (color.every((v, i) => v == below[i])) height += offset;
      if (color.every((v, i) => v == left[i])) {
        x -= offset;
        width += offset;
      }
      if (color.every((v, i) => v == right[i])) width += offset;

      p.rect(x, y, width, height);

      p.pop();
    }, []);

    const setup = useCallback((p: p5, canvasParentRef: Element) => {
      p.createCanvas(props.width, props.width).parent(canvasParentRef);
      p5Ref.current = p;
      p.noLoop();
      p.mouseMoved = () => {
        if (props.noInteraction) return;
        // If mouse goes outside editor
        if (p.mouseX < 0 || p.mouseX > props.width || p.mouseY < 0 || p.mouseY > props.width) {
          if (mouseInCell.current) {
            const { i, j } = mouseInCell.current;
            // Remove the current hovered cell
            const val = getSPValue(i, j);
            const isErrorCell = errorCells.current.has(j * grid.current.w + i);
            drawRect(
              i,
              j,
              mousePressedCellValue.current == undefined && isErrorCell
                ? color.current.errorColor
                : val > 0
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
          const { i: mi, j: mj } = mouseInCell.current;
          if (mi != i || mj != j) {
            // Mouse hovered in new cell
            // First put previous hovered back in original color
            const mouseInCellVal = getSPValue(mi, mj);
            let isErrorCell = errorCells.current.has(mj * grid.current.w + mi);
            drawRect(
              mi,
              mj,
              mousePressedCellValue.current == undefined && isErrorCell
                ? color.current.errorColor
                : mouseInCellVal
                ? color.current.onColor
                : color.current.offColor,
            );
            mouseInCell.current = { i, j };
            const val = getSPValue(i, j);
            isErrorCell = errorCells.current.has(j * grid.current.w + i);
            drawRect(
              i,
              j,
              mousePressedCellValue.current == undefined && isErrorCell
                ? val
                  ? color.current.hoverErrorOnColor
                  : color.current.hoverErrorOffColor
                : val
                ? mousePressedCellValue.current == undefined
                  ? color.current.hoverOnColor
                  : color.current.onColor
                : mousePressedCellValue.current == undefined
                ? color.current.hoverOffColor
                : color.current.offColor,
            );
            p.redraw();
          }
        } else {
          // Mouse hovered in cell
          mouseInCell.current = { i, j };
          const val = getSPValue(i, j);
          const isErrorCell = errorCells.current.has(j * grid.current.w + i);
          drawRect(
            i,
            j,
            mousePressedCellValue.current == undefined && isErrorCell
              ? val
                ? color.current.hoverErrorOnColor
                : color.current.hoverErrorOffColor
              : val
              ? mousePressedCellValue.current == undefined
                ? color.current.hoverOnColor
                : color.current.onColor
              : mousePressedCellValue.current == undefined
              ? color.current.hoverOffColor
              : color.current.offColor,
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
      <div className={clsx("relative")} style={{ width: props.width + 2, height: props.width + 2 }}>
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
