import dynamic from "next/dynamic";
import Flock from "./flock";
import { useRef } from "react";
import * as p5 from "p5";

const Sketch = dynamic(import("react-p5"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div>Loading...</div>,
});

export function P5Flocking() {
  const flock = useRef<Flock>();
  const speedslider = useRef<p5.Element>();
  const timestamp = useRef<number>();
  const oneRun = useRef<boolean>(false);

  const amount = 100;
  const perceptionRadius = 100;
  const perceptionAngle = Math.PI / 2;
  const maxSpeed = 60;
  const maxForce = 6;

  const boxSize = 1000;

  // possible values:
  // "first"            to only apply debugsettings for the first bird
  // "perception"       show how a bird sees
  // "direction"        show direction line
  // "log"
  const debug: string[] = ["direction", "perception", "showDest"];

  //See annotations in JS for more information
  const setup = (p: p5, canvasParentRef: Element) => {
    p.setAttributes("antialias", true);
    p.createCanvas(700, 700, "webgl").parent(canvasParentRef);

    speedslider.current = p
      .createSlider(0, 200, 50, 1)
      .parent(canvasParentRef)
      .style("margin", "1rem 0");

    flock.current = new Flock(
      p,
      amount,
      p.createVector(boxSize, boxSize, boxSize),
      perceptionRadius,
      perceptionAngle,
      maxSpeed,
      maxForce
    );

    flock.current.setDestination(
      p.createVector(boxSize / 2, boxSize / 2, boxSize / 2)
    );

    p.frameRate(60);
    timestamp.current = p.millis();
  };

  function draw(p: p5) {
    if (
      window &&
      flock.current &&
      speedslider.current &&
      timestamp.current &&
      !oneRun.current
    ) {
      //   oneRun.current = true;
      const speed = 60; //+ (speedslider.current.value() as number);

      p.background(10);
      p.orbitControl();
      p.scale(1000 / p.width, -1000 / p.width, -1000 / p.width);
      //console.log(1000/ p.width);

      p.translate(0, 0, boxSize * 1.1);

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
      //p.line(boxSize.x,0,0, boxSize.x, boxSize.y,0);
      p.pop();

      flock.current.calcFlockForces(
        debug,
        p.createVector(boxSize, boxSize, boxSize)
      );

      // calculate interval
      let interval = p.millis() - timestamp.current;
      timestamp.current = p.millis();
      // console.log(interval/speed);
      flock.current.update(interval / speed);

      flock.current.show(debug);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}
