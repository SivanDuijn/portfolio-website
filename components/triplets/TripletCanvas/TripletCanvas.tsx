import clsx from "clsx";
import { forwardRef, useEffect, useRef, memo, useImperativeHandle } from "react";
import { Triplet } from "../models";
import TripletThreeJSViewGL from "./TripletThreeJSViewGL";

type TripletCanvasProps = {
  className?: string;
  // triplet: Triplet;
};

export interface TripletCanvasElement {
  export: (name?: string) => void;
  setTriplet: (triplet: Triplet) => void;
  setShowRemovedComponents: (v: boolean) => void;
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
        setTriplet: (triplet: Triplet) =>
          triplet.dims.some((d) => d == 0)
            ? viewGL.current?.removeTriplet()
            : viewGL.current?.updateTriplet(triplet),
        setShowRemovedComponents: (v: boolean) => viewGL.current?.setShowRemovedComponents(v),
      }),
      [],
    );

    useEffect(() => {
      // const height = window.innerHeight * 0.8;
      viewGL.current = new TripletThreeJSViewGL(canvasRef.current || undefined);
    }, []);

    return (
      <div className={clsx(props.className, "relative")}>
        <canvas ref={canvasRef} />
      </div>
    );
  }),
);
