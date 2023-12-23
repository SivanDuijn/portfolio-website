import * as p5 from "p5";
import { getRandomInt } from "../utils";
import { Boid, calcFlockForce, showBoid, steerTowardsDestination, updateBoid } from "./boid";
import { Vector } from "./vector";

export type Flock = { boids: Boid[]; destination: Vector; boxSize: number };

export function updateFlock(
  flock: Flock,
  perceptionRadius: number,
  maxSpeed: number,
  maxForce: number,
  sepMultiplier: number,
  aliMultiplier: number,
  cohMultiplier: number,
  seekMultiplier: number,
  deltaTime = 1,
) {
  for (const boid of flock.boids) {
    const flockForce = calcFlockForce(
      boid,
      flock.boids,
      perceptionRadius,
      maxSpeed,
      maxForce,
      sepMultiplier,
      aliMultiplier,
      cohMultiplier,
    );

    // Calculate steer towards destination force
    const seek = steerTowardsDestination(boid, flock.destination, maxSpeed, maxForce);
    seek.mul(seekMultiplier);

    const force = Vector.add(flockForce, seek);

    updateBoid(boid, force, maxSpeed, flock.boxSize, deltaTime);

    if (boid.pos.dist(flock.destination) < 40) setRandomDestination(flock);
  }
}

export function showFlock(p: p5, flock: Flock) {
  for (const boid of flock.boids) showBoid(p, boid);

  //   p.push();
  //   p.normalMaterial();
  //   p.translate(vecToP5Vec(p, flock.destination));
  //   p.fill(p.color(255, 255, 255));
  //   p.sphere(20);
  //   p.pop();
}

/** Creates a flock with random positions inside the cube box, and with random colors*/
export function createFlock(amount: number, boxSize: number): Flock {
  const boids: Boid[] = [];

  for (let i = 0; i < amount; i++) {
    const pos = new Vector(
      Math.random() * boxSize,
      Math.random() * boxSize,
      Math.random() * boxSize,
    );
    const vel = new Vector(Math.random(), Math.random(), Math.random());
    const color = [getRandomInt(256), getRandomInt(256), getRandomInt(256)];
    boids.push({ pos, vel, color });
  }

  const destination = new Vector(
    Math.random() * boxSize,
    Math.random() * boxSize,
    Math.random() * boxSize,
  );

  return { boids, destination, boxSize };
}

export function setRandomDestination(flock: Flock) {
  flock.destination = new Vector(
    Math.random() * flock.boxSize,
    Math.random() * flock.boxSize,
    Math.random() * flock.boxSize,
  );
}
