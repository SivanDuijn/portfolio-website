import { vecToP5Vec } from "./utils";
import { Vector } from "./vector";
import * as p5 from "p5";

export type Boid = {
  pos: Vector;
  vel: Vector;
  color: number[];
};

export function updateBoid(
  b: Boid,
  force: Vector,
  maxSpeed: number,
  boxSize: number,
  deltaTime = 1
) {
  b.vel.add(Vector.mul(force, deltaTime));
  b.vel.limitLength(maxSpeed);

  b.pos.add(Vector.mul(b.vel, deltaTime));
  if (b.pos.x < 0) b.pos.x = boxSize;
  else if (b.pos.x > boxSize) b.pos.x = 0;
  if (b.pos.y < 0) b.pos.y = boxSize;
  else if (b.pos.y > boxSize) b.pos.y = 0;
  if (b.pos.z < 0) b.pos.z = boxSize;
  else if (b.pos.z > boxSize) b.pos.z = 0;
}

export function showBoid(p: p5, b: Boid) {
  const h = 24;

  p.push();
  p.normalMaterial();
  p.fill(b.color);
  // p.sphere(5);

  const y = p.createVector(0, 1, 0);
  const v = vecToP5Vec(p, b.vel);
  const theta = v.angleBetween(y);
  const n = y.cross(v).div(p.sin(theta));

  p.translate(vecToP5Vec(p, b.pos));
  p.translate(p.createVector(0, h / 2, 0));
  p.rotate(theta, [n.x, n.y, n.z]);

  p.cone(5, h, 0);
  p.pop();
}

export function calcFlockForce(
  b: Boid,
  allBoids: Boid[],
  perceptionRadius: number,
  maxSpeed: number,
  maxForce: number,
  sepMultiplier: number,
  aliMultiplier: number,
  cohMultiplier: number
) {
  const bsInView = calcBoidsInView(b, allBoids, perceptionRadius);
  if (bsInView.length === 0) return new Vector(0, 0, 0);

  const sep = calcSeparation(b, bsInView, perceptionRadius);
  let ali = calcAlignment(b, bsInView);
  let coh = calcCohesion(b, bsInView);

  sep.mul(maxForce);
  ali = steerForceFromVector(b, ali, maxSpeed, maxForce);
  coh = steerTowardsDestination(b, coh, maxSpeed, maxForce);

  sep.mul(sepMultiplier);
  ali.mul(aliMultiplier);
  coh.mul(cohMultiplier);
  return Vector.add(sep, ali).add(coh);
}

export function calcBoidsInView(
  b: Boid,
  allBoids: Boid[],
  perceptionRadius: number
) {
  // excluding ourself
  let boidsInView = [];
  for (const otherB of allBoids) {
    if (
      b != otherB &&
      b.pos.dist(otherB.pos) <= perceptionRadius //&&
      //Math.abs(this.vel.angleBetween(p5.Vector.sub(b.pos, this.pos))) <= perceptionAngle
    )
      boidsInView.push(otherB);
  }
  return boidsInView;
}

export function calcSeparation(
  b: Boid,
  bsInView: Boid[],
  perceptionRadius: number
) {
  if (bsInView.length == 0) return new Vector(0, 0, 0);

  let s = new Vector(0, 0, 0);

  for (let bInView of bsInView) {
    let pushForce = Vector.sub(b.pos, bInView.pos);
    // scale it so the nearer the bigger the force
    let l = pushForce.length();
    pushForce.setLength(1 - l / perceptionRadius);
    s.add(pushForce);
  }

  s.div(bsInView.length);
  return s;
}

export function calcAlignment(b: Boid, bsInView: Boid[]) {
  if (bsInView.length == 0) return new Vector(0, 0, 0);

  let a = b.vel.copy().normalize();

  for (let bInView of bsInView)
    if (bInView.vel.length() > 0) a.add(bInView.vel.copy().normalize());

  a.div(bsInView.length + 1);
  return a;
}

export function calcCohesion(b: Boid, bsInView: Boid[]) {
  if (bsInView.length == 0) return new Vector(0, 0, 0);

  let c = b.pos.copy();

  for (let bInView of bsInView) c.add(bInView.pos);

  c.div(bsInView.length + 1);
  return c;
}

export function steerTowardsDestination(
  b: Boid,
  destination: Vector,
  maxSpeed: number,
  maxForce: number
) {
  if (b.pos == destination) return new Vector(0, 0, 0);
  const vec = destination.copy();
  vec.sub(b.pos);
  return steerForceFromVector(b, vec, maxSpeed, maxForce);
}

export function steerForceFromVector(
  b: Boid,
  desired: Vector,
  maxSpeed: number,
  maxForce: number
) {
  const vec = desired.copy();
  vec.setLength(maxSpeed);
  vec.sub(b.vel);
  vec.mul(maxForce / maxSpeed);
  return vec;
}
