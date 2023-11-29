import dynamic from "next/dynamic";
import { useRef } from "react";
import * as p5 from "p5";
import clsx from "clsx";

const Sketch = dynamic(import("react-p5"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div>Loading...</div>,
});

export type P5WindowProps = {
  setup: (p: p5, canvasParentRef: Element) => {};
  draw: (p: p5) => {};
};

export default function P5Window(props: P5WindowProps) {
  return (
    <div>
      <Sketch setup={props.setup} draw={props.draw} />
    </div>
  );
}
