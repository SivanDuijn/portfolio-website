import clsx from "clsx";
import { memo, useMemo } from "react";
import { MemoizedSVGPixelCell } from "./SVGPixelCell";

export type FontCharacterEditorProps = {
    placeholder: string;
    character: number[][];
    className?: string;
    lightTheme?: boolean;
};

export const MemoizedFontCharacterViewer = memo(FontCharacterViewer);
function FontCharacterViewer(props: FontCharacterEditorProps) {
    const gridSize = props.character.length;
    const cellSize = 100 / gridSize;

    const allEmpty = useMemo(
        () => !props.character.some((row) => row.some((c) => c > 0)),
        [props.character],
    );

    return (
        <div className={props.className}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img">
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
                    <text
                        x={50}
                        y={63}
                        textAnchor="middle"
                        className={clsx("text-5xl", "fill-gray-500")}
                    >
                        {props.placeholder}
                    </text>
                )}
            </svg>
        </div>
    );
}
