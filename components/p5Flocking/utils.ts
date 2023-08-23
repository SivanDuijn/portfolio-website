import { Vector } from "./vector";
import * as p5 from "p5";

export function vecToP5Vec(p: p5, vec: Vector) {
  return p.createVector(vec.x, vec.y, vec.z);
}
