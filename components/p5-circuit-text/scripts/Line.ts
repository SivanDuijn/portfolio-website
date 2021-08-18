import p5 from 'p5';
import Utils from '../../utils';

/** Abstract class for a general circuit line with a update and show function. */
export abstract class CircuitLineItem {
  public finished = false;
  constructor(public p: p5, public pos: p5.Vector) {}

  abstract update(): void;
  abstract show(color: p5.Color, alpha: number): void;
}

export class CLLineStart extends CircuitLineItem {
  public length = 0;
  public maxLength = 2.5;
  public velocity = 0.1;
  public endPnt: p5.Vector; // the end of the line

  constructor(public p: p5, public pos: p5.Vector, public vec: p5.Vector) {
    super(p, pos);

    this.endPnt = this.p.createVector(
      this.pos.x + this.vec.x * this.maxLength,
      this.pos.y + this.vec.y * this.maxLength,
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
    this.p.strokeWeight(6);
    if (!this.finished)
      this.p.line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vec.x * this.length,
        this.pos.y + this.vec.y * this.length,
      );
    else this.p.line(this.pos.x, this.pos.y, this.endPnt.x, this.endPnt.y);
    this.p.strokeWeight(3);
  }
}

/** The line of a for a CircuitLine */
export class CLLine extends CircuitLineItem {
  public length = 0;
  public maxLength;
  public velocity = 0.1;
  public endPnt: p5.Vector; // the end of the line

  constructor(public p: p5, public pos: p5.Vector, public vec: p5.Vector, minLength: number) {
    super(p, pos);

    this.maxLength = Utils.GetRandomInt(15) + minLength;

    this.endPnt = this.p.createVector(
      this.pos.x + this.vec.x * this.maxLength,
      this.pos.y + this.vec.y * this.maxLength,
    );
  }

  update() {
    if (!this.finished) {
      // only update if we haven't finished yet

      this.length += this.velocity;
      if (this.length > this.maxLength) this.finish();
    }
  }

  show(color: p5.Color, alpha: number) {
    color.setAlpha(alpha);
    this.p.stroke(color);
    if (!this.finished)
      this.p.line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vec.x * this.length,
        this.pos.y + this.vec.y * this.length,
      );
    else this.p.line(this.pos.x, this.pos.y, this.endPnt.x, this.endPnt.y);
  }

  finish() {
    this.finished = true;
  }
}

export class CLCircle extends CircuitLineItem {
  a = 0; // alpha to use if not finished
  d; // diameter
  constructor(public p: p5, public pos: p5.Vector, public vec: p5.Vector) {
    super(p, pos);

    this.d = Utils.GetRandomInt(10) + 5;

    // determine middle point of circle
    let r = this.d / 2;
    this.pos.x += this.vec.x * r;
    this.pos.y += this.vec.y * r;
  }

  update() {
    if (this.finished) return;

    this.a += 4;
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
    this.p.circle(this.pos.x, this.pos.y, this.d);
  }
}
