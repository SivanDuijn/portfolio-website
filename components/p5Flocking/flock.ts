import * as p5 from "p5";
import Boid from "./boid";
import boidUtils from "./boidUtils";
import { getRandomInt } from "../utils";

export default class Flock {
  boids: Boid[];
  dest: p5.Vector;
  sepMult = 2;

  constructor(
    private p: p5,
    amount: number,
    private boxDimensions: p5.Vector,
    private perceptionRadius: number,
    private perceptionAngle: number,
    private maxSpeed: number,
    private maxForce: number
  ) {
    this.boids = [];
    this.dest = p.createVector();
    // fill boids array
    for (let i = 0; i < amount; i++) {
      let x = p.random(this.boxDimensions.x);
      let y = p.random(this.boxDimensions.y);
      let z = p.random(this.boxDimensions.z);
      this.boids.push(new Boid(p, p.createVector(x, y, z)));
    }
    this.changeSepMult();
  }
  changeSepMult() {
    this.sepMult = 2 + getRandomInt(100) / 40;
    let r = 4000 + getRandomInt(2000);
    setTimeout(() => this.changeSepMult(), r);
  }

  calcFlockForces(debug: string[], sizeBox: p5.Vector) {
    // and steer to destination
    //console.log(" ");

    for (let b of this.boids) {
      b.calcFlockForce(
        this.boids,
        this.perceptionRadius,
        this.perceptionAngle,
        this.maxSpeed,
        this.maxForce,
        sizeBox,
        this.sepMult,
        debug
      );
      if (this.dest)
        b.applyDestinationSteer(this.dest, this.maxSpeed, this.maxForce);
    }
  }

  setDestination(d: p5.Vector) {
    this.dest = d;
  }

  update(secondsPast: number) {
    for (let b of this.boids) {
      b.update(this.maxSpeed, this.maxForce, secondsPast, this.boxDimensions);

      if (p5.Vector.dist(b.pos, this.dest) < 50) {
        let m = 1;
        let x = boidUtils.getRandomRangeWithBoxInMiddle(
          this.p,
          m,
          this.boxDimensions.x
        );
        let y = boidUtils.getRandomRangeWithBoxInMiddle(
          this.p,
          m,
          this.boxDimensions.y
        );
        let z = boidUtils.getRandomRangeWithBoxInMiddle(
          this.p,
          m,
          this.boxDimensions.z
        );
        this.setDestination(this.p.createVector(x, y, z));
      }
    }
  }

  show(debug: string[]) {
    for (let i = 0; i < this.boids.length; i++) {
      if (i != 0 && debug.includes("first"))
        this.boids[i].show(this.perceptionRadius, this.perceptionAngle, []);
      else
        this.boids[i].show(this.perceptionRadius, this.perceptionAngle, debug);
    }

    // show destination if present
    if (this.dest && debug.includes("showDest")) {
      this.p.push();
      this.p.fill(255, 0, 0);
      this.p.normalMaterial();
      this.p.translate(this.dest);
      this.p.sphere(30);
      this.p.pop();
    }
  }
}
