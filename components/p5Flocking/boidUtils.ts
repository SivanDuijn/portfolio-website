import * as p5 from "p5";
import Boid from "./boid";

export default class BoidUtils {
  static addVector(v1: p5.Vector, v2: p5.Vector) {
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
    return v1;
  }

  static correctEdgeAxis(axisValue: number, min: number, max: number) {
    if (axisValue > max) axisValue = min;
    else if (axisValue < min) axisValue = max;
    return axisValue;
  }

  static getRandomRangeWithBoxInMiddle(p: p5, m: number, axis: number) {
    let destMaxX = axis * m;
    let left = (destMaxX - axis) / 2;
    let rand = -left + p.random(destMaxX);
    return rand;
  }

  static correctEdgeOverflowPerceptionR(
    p: p5,
    ourPos: p5.Vector,
    otherBoid: Boid,
    sizeBox: p5.Vector,
    perceptionRadius: number
  ) {
    // if a boid is close to an edge, than a boid on the other side of the
    // screen could still be inside the perception radius
    // because boids will get teleported to the other side of the sceen when they fly out of the screen
    // here we return a teleported copy, if a boid on the other side is in range

    let x = BoidUtils.correctEdgeInfinityPerceptionOnAxis(
      ourPos.x,
      otherBoid.pos.x,
      sizeBox.x,
      perceptionRadius
    );
    let y = BoidUtils.correctEdgeInfinityPerceptionOnAxis(
      ourPos.y,
      otherBoid.pos.y,
      sizeBox.y,
      perceptionRadius
    );
    let z = BoidUtils.correctEdgeInfinityPerceptionOnAxis(
      ourPos.z,
      otherBoid.pos.z,
      sizeBox.z,
      perceptionRadius
    );
    let pos = p.createVector(x, y, z);
    if (pos.equals(otherBoid.pos)) return otherBoid;
    else {
      let b = otherBoid.copy();
      b.pos = pos;
      return b;
    }
  }
  static correctEdgeInfinityPerceptionOnAxis(
    thisAxis: number,
    toCheckAxis: number,
    sizeBoxAxis: number,
    perceptionRadius: number
  ) {
    if (thisAxis < toCheckAxis) {
      let overflow = perceptionRadius - thisAxis;
      if (toCheckAxis > sizeBoxAxis - overflow) toCheckAxis -= sizeBoxAxis;
    } else if (sizeBoxAxis - thisAxis < perceptionRadius) {
      let overflow = perceptionRadius - (sizeBoxAxis - thisAxis);
      if (toCheckAxis < overflow) toCheckAxis += sizeBoxAxis;
    }
    return toCheckAxis;
  }
}
