import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import TripletThreeJSViewGL from "./TripletThreeJSViewGL";

type TripletCanvasProps = {
  className?: string;
  triplet: number[][][];
};

// eslint-disable-next-line react/display-name
export const TripletCanvas = React.memo((props: TripletCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewGL = useRef<TripletThreeJSViewGL>();

  useEffect(() => {
    viewGL.current = new TripletThreeJSViewGL(canvasRef.current || undefined);
  }, []);

  useEffect(() => viewGL.current?.updateTriplet(props.triplet), [props.triplet]);

  return (
    <div className={clsx(props.className, "relative")}>
      <canvas ref={canvasRef} />
    </div>
  );
});
