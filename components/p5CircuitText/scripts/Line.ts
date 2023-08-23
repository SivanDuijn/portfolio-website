import BoidUtils from "@/components/p5Flocking/boidUtils";
import { getRandomInt } from "@/components/utils";
import p5 from "p5";

/** Abstract class for a general circuit line with a update and show function. */
export abstract class CircuitLineItem {
  public finished = false;
  public p: p5;
  public startPos: p5.Vector;
  // public abstract type = 'abstract';

  constructor(p: p5, startPos: p5.Vector) {
    this.p = p;
    this.startPos = startPos;
  }

  abstract update(): void;
  abstract show(color: p5.Color, alpha: number): void;

  /**
   * Should generate startpos and vector to be used by the following CircuitLineItem after this one.
   * @param angle A possible angle to change the vector.
   */
  abstract generateNextLineItemVectors(angle?: number): {
    startPos: p5.Vector;
    vec: p5.Vector;
  };
}

export class CLLineStart extends CircuitLineItem {
  private vec: p5.Vector;
  private length = 0;
  private maxLength = 3;
  private velocity = 0.1;
  private endPos: p5.Vector; // the end of the line
  public type = "CLLineStart";

  constructor(p: p5, startPos: p5.Vector, vec: p5.Vector) {
    super(p, startPos);
    this.vec = vec;

    this.endPos = this.p.createVector(
      this.startPos.x + this.vec.x * this.maxLength,
      this.startPos.y + this.vec.y * this.maxLength
    );
  }

  update(): void {
    if (!this.finished) {
      // only update if we haven't finished yet

      this.length += this.velocity;
      if (this.length > this.maxLength) this.finished = true;
    }
  }
  show(color: p5.Color, alpha: number): void {
    color.setAlpha(alpha);
    this.p.stroke(color);
    this.p.strokeCap(this.p.SQUARE);
    this.p.strokeWeight(6);
    if (!this.finished)
      this.p.line(
        this.startPos.x,
        this.startPos.y,
        this.startPos.x + this.vec.x * this.length,
        this.startPos.y + this.vec.y * this.length
      );
    else
      this.p.line(
        this.startPos.x,
        this.startPos.y,
        this.endPos.x,
        this.endPos.y
      );
    // Reset default values
    this.p.strokeWeight(3);
    this.p.strokeCap(this.p.ROUND);
  }

  generateNextLineItemVectors(angle = 0): {
    startPos: p5.Vector;
    vec: p5.Vector;
  } {
    // Copy the current vector and rotate by the provided angle.
    const vec = this.vec.copy().rotate((angle / 180) * this.p.PI);
    return { startPos: this.endPos.copy(), vec };
  }
}

/** The line of a for a CircuitLine */
export class CLLine extends CircuitLineItem {
  private vec: p5.Vector;
  private length = 0;
  private maxLength;
  private velocity = 0.1;
  private endPos: p5.Vector; // the end of the line
  public type = "CLLine";

  constructor(p: p5, startPos: p5.Vector, vec: p5.Vector, minLength: number) {
    super(p, startPos);
    this.vec = vec;

    this.maxLength = getRandomInt(15) + minLength;

    this.endPos = this.p.createVector(
      this.startPos.x + this.vec.x * this.maxLength,
      this.startPos.y + this.vec.y * this.maxLength
    );
  }

  update() {
    if (!this.finished) {
      // only update if we haven't finished yet

      this.length += this.velocity;
      if (this.length > this.maxLength) this.finished = true;
    }
  }

  show(color: p5.Color, alpha: number) {
    color.setAlpha(alpha);
    this.p.stroke(color);
    if (!this.finished)
      this.p.line(
        this.startPos.x,
        this.startPos.y,
        this.startPos.x + this.vec.x * this.length,
        this.startPos.y + this.vec.y * this.length
      );
    else
      this.p.line(
        this.startPos.x,
        this.startPos.y,
        this.endPos.x,
        this.endPos.y
      );
  }

  generateNextLineItemVectors(angle = 0): {
    startPos: p5.Vector;
    vec: p5.Vector;
  } {
    // Copy the current vector and rotate by the provided angle.
    const vec = this.vec.copy().rotate((angle / 180) * this.p.PI);
    return { startPos: this.endPos.copy(), vec };
  }
}

export class CLCircle extends CircuitLineItem {
  public type = "CLCircle";
  private vec: p5.Vector;
  private a = 0; // alpha to use if not finished
  private d: number; // diameter
  private speed = 4;

  constructor(p: p5, pos: p5.Vector, vec: p5.Vector, diameter: number) {
    super(p, pos);
    this.vec = vec;
    this.d = diameter;

    // determine middle point of circle
    let r = this.d / 2;
    this.startPos.x += this.vec.x * r;
    this.startPos.y += this.vec.y * r;
  }

  update() {
    if (this.finished) return;

    this.a += this.speed;
    if (this.a > 255) {
      this.a = 255;
      this.finished = true;
    }
  }

  show(color: p5.Color, alpha: number) {
    if (!this.finished) color.setAlpha(this.a);
    else color.setAlpha(alpha);

    this.p.stroke(color);
    this.p.noFill();
    this.p.circle(this.startPos.x, this.startPos.y, this.d);
  }

  generateNextLineItemVectors(angle = 0): {
    startPos: p5.Vector;
    vec: p5.Vector;
  } {
    const vec = this.vec.copy().rotate((angle / 180) * this.p.PI);

    const startPos = BoidUtils.addVector(
      this.startPos.copy(),
      vec.copy().setMag(this.d / 2)
    );

    return { startPos, vec };
  }
}
