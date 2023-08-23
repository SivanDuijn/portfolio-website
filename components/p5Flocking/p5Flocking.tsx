import dynamic from "next/dynamic";
import { createFlock, showFlock, updateFlock, Flock } from "./flock";
import { useRef } from "react";
import * as p5 from "p5";
import clsx from "clsx";

const Sketch = dynamic(import("react-p5"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div>Loading...</div>,
});

export type P5FlockingProps = {
  size?: number;
};

export function P5Flocking(props: P5FlockingProps) {
  const flock = useRef<Flock>();

  const amount = 300;
  const perceptionRadius = 100;
  const maxSpeed = 2;
  const maxForce = 0.03;

  const sepMultiplier = useRef(5);
  const aliMultiplier = useRef(0.15);
  const cohMultiplier = useRef(0.4);
  const seekMultiplier = 0.1;

  const boxSize = 1000;

  const size = props.size ?? 700;

  const deltaTimeModifier = 0.8;

  // possible values:
  // "first"            to only apply debugsettings for the first bird
  // "perception"       show how a bird sees
  // "direction"        show direction line
  // "log"
  //   const debug: string[] = ["direction", "perception", "showDest"];

  //See annotations in JS for more information
  const setup = (p: p5, canvasParentRef: Element) => {
    p.setAttributes("antialias", true);
    p.createCanvas(size, size, "webgl").parent(canvasParentRef);

    flock.current = createFlock(amount, boxSize);

    p.frameRate(60);
  };

  function draw(p: p5) {
    if (window && flock.current) {
      p.background(10);
      //   p.orbitControl();
      //   p.scale(1000 / p.width, -1000 / p.width, -1000 / p.width);
      p.scale(boxSize / size, -boxSize / size, -boxSize / size);
      //console.log(1000/ p.width);

      p.translate(0, 0, boxSize * 0.8);

      //p.rotateY(p.millis() / 10000);                                       // rotate a bit
      p.rotateY(p.HALF_PI / 3);
      p.translate(-boxSize / 2, -boxSize / 2, -boxSize / 2); // translate to middle

      // draw box
      p.push();
      p.strokeWeight(2);
      p.stroke(255, 0, 0);
      p.line(0, 0, 0, boxSize, 0, 0);
      p.stroke(0, 255, 0);
      p.line(0, 0, 0, 0, boxSize, 0);
      p.stroke(0, 0, 255);
      p.line(0, 0, 0, 0, 0, boxSize);
      p.stroke(255, 255, 255);
      p.line(0, boxSize, boxSize, boxSize, boxSize, boxSize);
      p.line(boxSize, 0, boxSize, boxSize, boxSize, boxSize);
      p.line(boxSize, boxSize, 0, boxSize, boxSize, boxSize);
      p.line(0, boxSize, 0, 0, boxSize, boxSize);
      p.line(0, 0, boxSize, 0, boxSize, boxSize);
      p.line(0, 0, boxSize, boxSize, 0, boxSize);
      p.line(boxSize, 0, 0, boxSize, 0, boxSize);
      p.line(0, boxSize, 0, boxSize, boxSize, 0);
      p.pop();

      updateFlock(
        flock.current,
        perceptionRadius,
        maxSpeed,
        maxForce,
        sepMultiplier.current,
        aliMultiplier.current,
        cohMultiplier.current,
        seekMultiplier,
        p.deltaTime * deltaTimeModifier
      );

      showFlock(p, flock.current);
    }
  }

  return (
    <div className={clsx("flex", "flex-col", "justify-center", "items-center")}>
      <span className={clsx("border-2")}>
        <Sketch setup={setup} draw={draw} />
      </span>
      <div
        className={clsx(
          "flex",
          "flex-col",
          "md:flex-row",
          "md:space-x-8",
          "mt-4",
          "text-center"
        )}
      >
        <div>
          <p>Separation</p>
          <input
            type="range"
            min="0"
            max="10"
            step={0.1}
            defaultValue={sepMultiplier.current}
            onChange={(e) => {
              sepMultiplier.current = parseFloat(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Alignment</p>
          <input
            type="range"
            min="0"
            max="2"
            step={0.1}
            defaultValue={aliMultiplier.current}
            onChange={(e) => {
              aliMultiplier.current = parseFloat(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Alignment</p>
          <input
            type="range"
            min="0"
            max="2"
            step={0.1}
            defaultValue={cohMultiplier.current}
            onChange={(e) => {
              cohMultiplier.current = parseFloat(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
