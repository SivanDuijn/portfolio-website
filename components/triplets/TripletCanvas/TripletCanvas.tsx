import clsx from "clsx";
import { forwardRef, useEffect, useRef, memo, useImperativeHandle } from "react";
import { Triplet } from "../models";
import TripletThreeJSViewGL from "./TripletThreeJSViewGL";

type TripletCanvasProps = {
  className?: string;
};

export interface TripletCanvasElement {
  export: (name?: string) => void;
  setTriplet: (triplet: Triplet) => void;
  setShowRemovedComponents: (v: boolean) => void;
  setRotate: (v: boolean) => void;
  setSpotLight: (v: boolean) => void;
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
        setRotate: (v: boolean) => viewGL.current?.setRotate(v),
        setSpotLight: (v: boolean) => viewGL.current?.setSpotLight(v),
      }),
      [],
    );

    useEffect(() => {
      // const height = window.innerHeight * 0.8;
      viewGL.current = new TripletThreeJSViewGL(canvasRef.current || undefined);
      if (canvasRef.current) {
        canvasRef.current.style.width = "100%";
        canvasRef.current.style.height = "unset";
        canvasRef.current.style.aspectRatio = "1";
      }
    }, []);

    return (
      <div className={clsx(props.className, "relative")}>
        <canvas ref={canvasRef} />
      </div>
    );
  }),
);
