import clsx from "clsx";
import { forwardRef, useEffect, useRef, memo, useImperativeHandle } from "react";
import { Triplet } from "../lib/buildTriplet";
import TripletThreeJSViewGL from "./TripletThreeJSViewGL";

type TripletCanvasProps = {
  className?: string;
  triplet: Triplet;
};

export interface TripletCanvasElement {
  export: (name?: string) => void;
}

// eslint-disable-next-line react/display-name
export const TripletCanvas = memo(
  forwardRef<TripletCanvasElement, TripletCanvasProps>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewGL = useRef<TripletThreeJSViewGL>();

    useImperativeHandle(
      ref,
      () => ({
        export: (name?: string) => viewGL.current?.exportTriplet(name),
      }),
      [],
    );

    useEffect(() => {
      viewGL.current = new TripletThreeJSViewGL(canvasRef.current || undefined);
    }, []);

    useEffect(
      () =>
        props.triplet.dims.some((d) => d == 0)
          ? viewGL.current?.removeTriplet()
          : viewGL.current?.updateTriplet(props.triplet),
      [props.triplet],
    );

    return (
      <div className={clsx(props.className, "relative")}>
        <canvas ref={canvasRef} />
      </div>
    );
  }),
);
