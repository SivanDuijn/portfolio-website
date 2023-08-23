import * as p5 from "p5";
import BoidUtils from "./boidUtils";
export default class Boid {
  public vel: p5.Vector;
  flockForceToApply: p5.Vector;
  color: p5.Color;

  constructor(private p: p5, public pos: p5.Vector) {
    this.vel = p5.Vector.random3D();
    this.flockForceToApply = p.createVector(0, 0, 0);
    this.color = p.color(p.random(255), p.random(255), p.random(255));
  }

  setFromExisting(b: Boid) {
    // pos should already be set
    this.vel = b.vel.copy();
    this.color = b.color;
  }
  copy() {
    let r = new Boid(this.p, this.pos.copy());
    r.setFromExisting(this);
    return r;
  }

  applyDestinationSteer(dest: p5.Vector, maxSpeed: number, maxForce: number) {
    let seek = this.steerTowards(dest.copy(), maxSpeed, maxForce);
    //seek.limit(maxForce);
    seek.mult(0.3);
    //console.log(seek.mag());
    BoidUtils.addVector(this.flockForceToApply, seek);
  }

  calcFlockForce(
    boids: Boid[],
    perceptionRadius: number,
    perceptionAngle: number,
    maxSpeed: number,
    maxForce: number,
    sizeBox: p5.Vector,
    sepMultiplier: number,
    debug: string[]
  ) {
    this.flockForceToApply.set(0, 0, 0);

    let bsInView = this.calcBoidsInView(
      boids,
      perceptionRadius,
      perceptionAngle,
      sizeBox
    );
    let s = this.calcSeparation(
      bsInView,
      perceptionRadius,
      maxSpeed,
      maxForce
    ).mult(sepMultiplier);
    let c = this.calcCohesion(bsInView, maxSpeed, maxForce).mult(0.4);
    let a = this.calcAlignment(bsInView, maxSpeed, maxForce).mult(0.2);

    //console.log(`s: ${s.mag()}  c: ${c.mag()}   a: ${a.mag()} `);

    this.flockForceToApply = BoidUtils.addVector(BoidUtils.addVector(s, c), a);
  }

  calcBoidsInView(
    boids: Boid[],
    perceptionRadius: number,
    perceptionAngle: number,
    sizeBox: p5.Vector
  ) {
    // excluding ourself
    let bs = [];
    for (let b of boids) {
      let boid = BoidUtils.correctEdgeOverflowPerceptionR(
        this.p,
        this.pos,
        b,
        sizeBox,
        perceptionRadius
      );

      if (
        this != boid &&
        this.pos.dist(boid.pos) <= perceptionRadius //&&
        //Math.abs(this.vel.angleBetween(p5.Vector.sub(b.pos, this.pos))) <= perceptionAngle
      )
        bs.push(boid);
    }
    return bs;
  }

  calcSeparation(
    bsInView: Boid[],
    perceptionRadius: number,
    maxSpeed: number,
    maxForce: number
  ) {
    if (bsInView.length == 0) return this.p.createVector();

    let s = this.p.createVector();

    for (let bInView of bsInView) {
      let pushForce = p5.Vector.sub(this.pos, bInView.pos);
      // scale it so the nearer the bigger the force
      let l = pushForce.mag();
      pushForce.normalize().mult(1 - l / perceptionRadius);
      BoidUtils.addVector(s, pushForce);
    }

    s.div(bsInView.length);
    //return this.steerForceFromVector(s, maxSpeed, maxForce);

    s.mult(maxForce);
    return s;
  }
  calcAlignment(bsInView: Boid[], maxSpeed: number, maxForce: number) {
    if (bsInView.length == 0) return this.p.createVector();

    let averageHeading = this.vel.copy().normalize();

    for (let bInView of bsInView)
      if (bInView.vel.mag() > 0)
        BoidUtils.addVector(averageHeading, bInView.vel.copy().normalize());

    averageHeading.div(bsInView.length + 1);
    return this.steerForceFromVector(averageHeading, maxSpeed, maxForce);
  }
  calcCohesion(bsInView: Boid[], maxSpeed: number, maxForce: number) {
    if (bsInView.length == 0) return this.p.createVector();

    let centerOfMass = this.pos.copy();

    for (let bInView of bsInView)
      BoidUtils.addVector(centerOfMass, bInView.pos);

    centerOfMass.div(bsInView.length + 1);
    return this.steerTowards(centerOfMass, maxSpeed, maxForce);
  }

  steerTowards(dest: p5.Vector, maxSpeed: number, maxForce: number) {
    if (this.pos == dest) return this.p.createVector();

    dest.sub(this.pos);
    return this.steerForceFromVector(dest, maxSpeed, maxForce);
  }
  steerForceFromVector(desired: p5.Vector, maxSpeed: number, maxForce: number) {
    desired.setMag(maxSpeed);
    desired.sub(this.vel);
    desired.mult(maxForce / maxSpeed);
    return desired;
  }

  update(
    maxSpeed: number,
    maxForce: number,
    secondsPast: number,
    boxSize: p5.Vector
  ) {
    this.flockForceToApply.limit(maxForce);
    this.flockForceToApply.mult(secondsPast);
    // this.vel.add(this.flockForceToApply);
    this.vel.x += this.flockForceToApply.x;
    this.vel.y += this.flockForceToApply.y;
    this.vel.z += this.flockForceToApply.z;
    // console.log(this.flockForceToApply);
    // console.log(this.vel);
    //console.log(this.flockForceToApply.mag());
    this.vel.limit(maxSpeed);
    //console.log(this.vel.mag());
    const deltaVel = p5.Vector.mult(this.vel, secondsPast);
    this.pos.x += deltaVel.x;
    this.pos.y += deltaVel.y;
    this.pos.z += deltaVel.z;
    // this.pos.add(deltaVel);

    this.pos.x = BoidUtils.correctEdgeAxis(this.pos.x, 0, boxSize.x);
    this.pos.y = BoidUtils.correctEdgeAxis(this.pos.y, 0, boxSize.y);
    this.pos.z = BoidUtils.correctEdgeAxis(this.pos.z, 0, boxSize.z);
  }

  show(perceptionRadius: number, perceptionAngle: number, debug: String[]) {
    // this.p.push();
    // this.p.strokeWeight(2);
    // this.p.stroke(255, 0, 0);
    // this.p.line(this.pos.x, this.pos.y, this.pos.z, this.pos.x + 200, this.pos.y, this.pos.z);
    // this.p.stroke(0, 255, 0);
    // this.p.line(this.pos.x, this.pos.y, this.pos.z, this.pos.x, this.pos.y + 200, this.pos.z);
    // this.p.stroke(0, 0, 255);
    // this.p.line(this.pos.x, this.pos.y, this.pos.z, this.pos.x, this.pos.y, this.pos.z + 200);
    // this.p.pop();

    this.p.push();
    if (debug.includes("direction")) {
      const perceptionDir = this.vel.copy().setMag(perceptionRadius);
      const b = this.p.createVector(
        this.pos.x + perceptionDir.x,
        this.pos.y + perceptionDir.y,
        this.pos.z + perceptionDir.z
      );

      this.p.stroke(255);
      this.p.line(this.pos.x, this.pos.y, this.pos.z, b.x, b.y, b.z);
    }

    this.p.normalMaterial();
    this.p.translate(this.pos);
    this.p.fill(this.color);
    this.p.sphere(5);
    this.p.fill(255, 255, 255, 100);

    if (debug.includes("perception")) {
      // show cone
      let a = this.p.createVector(0, -1, 0);
      let cross = p5.Vector.cross(a, this.vel) as unknown as p5.Vector;
      this.p.rotate(a.angleBetween(this.vel), cross);

      let h = this.p.cos(perceptionAngle) * perceptionRadius;
      let r = this.p.sin(perceptionAngle) * perceptionRadius;
      this.p.translate(0, -h / 2, 0);
      this.p.cone(r, h);
    }

    this.p.pop();
  }
}
