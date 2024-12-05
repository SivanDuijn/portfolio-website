import clsx from "clsx";
import dynamic from "next/dynamic";
import * as p5 from "p5";

const Sketch = dynamic(import("react-p5"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div>Loading...</div>,
});

export type SmoothMovingEntityProps = {
  size?: number;
};

export function SmoothMovingEntity(props: SmoothMovingEntityProps) {
  const size = props.size ?? 500;

  // Entity properties
  let pos: p5.Vector;
  let vel: p5.Vector;

  let goal: p5.Vector;

  const maxSpeed = 130;
  const maxForce = 200.0;
  // ---

  //See annotations in JS for more information
  const setup = (p: p5, canvasParentRef: Element) => {
    p.setAttributes("antialias", true);
    p.createCanvas(size, size).parent(canvasParentRef);

    pos = p.createVector(0, 0);
    vel = p.createVector(0, 0);
    goal = p.createVector(0, 0);

    p.frameRate(60);
  };

  function draw(p: p5) {
    if (window) {
      p.background("#F7E8C9");
      // p.scale(boxSize / size, -boxSize / size, -boxSize / size);

      p.translate(size / 2, size / 2); // translate to middle

      if (Math.abs(pos.x - goal.x) < 10 && Math.abs(pos.y - goal.y) < 10) {
        // const s = 200;
        // const s2 = s / 2;
        // goal = p.createVector(pos.x + Math.random() * s - s2, pos.y + Math.random() * s - s2);
        goal = p.createVector(Math.random() * size - size / 2, Math.random() * size - size / 2);
      }

      const dt = p.deltaTime / 1000;

      const force = goal
        .copy()
        .sub(pos)
        .setMag(maxSpeed)
        .sub(vel)
        .mult(maxForce / maxSpeed);

      // const dir = goal.copy().sub(pos);
      // dir.setMag(maxSpeed);
      // const force = dir.sub(vel);
      // force.mult(maxForce / maxSpeed);
      // console.log(dir.x, dir.y, force.x, force.y);
      // acc.add(force.x * dt, force.y * dt);
      vel.add(force.x * dt, force.y * dt);
      pos.add(vel.x * dt, vel.y * dt);

      // draw box
      p.noStroke();
      p.fill(200, 0, 0);
      p.circle(pos.x, pos.y, 15);
      p.fill(0, 150, 0);
      p.circle(goal.x, goal.y, 10);
    }
  }

  return (
    <div className={clsx("flex", "flex-col", "justify-center", "items-center")}>
      <span className={clsx("border-2")}>
        <div className={clsx("overflow-hidden", "max-w-[80vw]")}>
          <Sketch setup={setup} draw={draw} />
        </div>
      </span>
    </div>
  );
}
