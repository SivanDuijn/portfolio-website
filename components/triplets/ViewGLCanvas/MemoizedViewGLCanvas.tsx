import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import ThreeJSViewGL from "./ThreeJSViewGL";
import { useGridSize, usePlaneGrid } from "../lib/GridContext/hooks";

type Props = {
    className?: string;
};

// eslint-disable-next-line react/display-name
export const MemoizedViewGLCanvas = React.memo((props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewGL = useRef<ThreeJSViewGL>();
    const { gridSize } = useGridSize();
    const { planeGrid: leftPlaneGrid } = usePlaneGrid("left");
    const { planeGrid: rightPlaneGrid } = usePlaneGrid("right");
    const { planeGrid: bottomPlaneGrid } = usePlaneGrid("bottom");

    useEffect(() => {
        viewGL.current = new ThreeJSViewGL(canvasRef.current || undefined);
    }, []);

    useEffect(() => {
        viewGL.current?.calculateGrid(leftPlaneGrid, rightPlaneGrid, bottomPlaneGrid, gridSize);
    }, [leftPlaneGrid, rightPlaneGrid, bottomPlaneGrid, gridSize]);

    return (
        <div className={clsx(props.className, "relative")}>
            <canvas ref={canvasRef} />
        </div>
    );
});
