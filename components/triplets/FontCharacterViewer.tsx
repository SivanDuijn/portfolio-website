import { memo, useMemo } from "react";
import { P5GridEditor } from "./P5ShapePlaneEditor";

export type FontCharacterEditorProps = {
  placeholder: string;
  character: number[];
  w: number;
  h: number;
  className?: string;
  lightTheme?: boolean;
};

export const MemoizedFontCharacterViewer = memo(FontCharacterViewer);
function FontCharacterViewer(props: FontCharacterEditorProps) {
  const allEmpty = useMemo(() => !props.character.some((v) => v > 0), [props.character]);

  return (
    <div className={props.className}>
      <P5GridEditor
        width={96}
        grid={{ w: props.w, h: props.h, values: props.character }}
        noInteraction
      />
      {/* <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img">
        {props.character.map((rows, i) =>
          rows.map((value, j) => (
            <MemoizedSVGPixelCell
              key={i * gridSize + j}
              cellSize={cellSize}
              i={i}
              j={j}
              value={value}
              lightTheme={props.lightTheme}
            />
          )),
        )}
        {allEmpty && (
          <text x={50} y={63} textAnchor="middle" className={clsx("text-5xl", "fill-gray-500")}>
            {props.placeholder}
          </text>
        )}
      </svg> */}
    </div>
  );
}
