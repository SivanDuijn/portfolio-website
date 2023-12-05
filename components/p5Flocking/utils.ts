import * as p5 from "p5";
import { Vector } from "./vector";

export function vecToP5Vec(p: p5, vec: Vector) {
  return p.createVector(vec.x, vec.y, vec.z);
}
