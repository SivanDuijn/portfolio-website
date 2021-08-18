import p5 from 'p5';
import CircuitLine from './CircuitLine';
import Utils from '../../utils';

export default class Character {
  public readonly char: string;
  public cLines: CircuitLine[] = [];
  public activeCLs: number[] = []; // array of indices for cLines array
  public width: number;
  public height: number;
  public linesPerChar = 5;

  // private possibleStartingPnts: p5.Vector[] = [];

  private p5: p5;
  private font: p5.Font;
  private fontSize: number;
  public pos: p5.Vector;

  constructor(p5: p5, font: p5.Font, fontSize: number, pos: p5.Vector, char: string) {
    this.p5 = p5;
    this.font = font;
    this.fontSize = fontSize;
    this.pos = pos;
    this.char = char;

    const bbox = this.font.textBounds(this.char, this.pos.x, this.pos.y, this.fontSize) as {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    this.width = bbox.w;
    this.width = this.char == 'j' ? this.width - 18 : this.width;
    this.height = bbox.h;

    this.calcPoints();
    this.calcCLLineVectors();
  }

  showText() {
    this.p5.text(this.char, this.pos.x, this.pos.y);
    // this.p5.stroke('purple'); // Change the color
    // this.p5.strokeWeight(2); // Make the points 10 pixels in size
    // this.cLines.forEach((cl) => {
    //   this.p5.point(cl.pos.x, cl.pos.y);
    //   // this.p5.line(cl.pos.x, cl.pos.y, cl.pos.x + cl.vec.x * 10, cl.pos.y + cl.vec.y * 10);
    // });
  }

  showCircuitLines(color: p5.Color) {
    this.activeCLs.forEach((acl) => this.cLines[acl].show(color));
    //this.cLines.forEach(cl => this.p.circle(cl.pos.x, cl.pos.y, 1));
  }
  updateCircuitLines() {
    // remove finished lines from the activeCls list
    this.activeCLs = this.activeCLs.filter((acl) => !this.cLines[acl].isFinished);

    if (this.cLines.length > 0 && this.activeCLs.length < this.linesPerChar) {
      let rnd = Utils.GetRandomInt(this.cLines.length);
      this.activateCircuitLine(rnd);
    }

    this.activeCLs.forEach((acl) => this.cLines[acl].update());
  }

  activateCircuitLine(i: number) {
    // Check if the i-th line is not yet active and 3 away from other start points/lines
    if (!this.activeCLs.includes(i) && this.activeCLs.every((acl) => Math.abs(i - acl) > 3)) {
      this.cLines[i].reset();
      this.activeCLs.push(i);
    }
  }

  calcPoints(sampleFactor = 0.15) {
    this.cLines = [];
    this.font
      .textToPoints(this.char, this.pos.x, this.pos.y, this.fontSize, {
        sampleFactor: sampleFactor,
        simplifyThreshold: 0,
      })
      .forEach((pnt) => this.cLines.push(new CircuitLine(this.p5, pnt)));
  }

  calcCLLineVectors() {
    // Different tactic, calculate vec from 2 neighboring points
    for (let i = 0; i < this.cLines.length; i++) {
      const prevPoint = this.cLines[i - 1 < 0 ? this.cLines.length - 1 : i - 1].pos;
      const nextPoint = this.cLines[i + 1 > this.cLines.length - 1 ? 0 : i + 1].pos;

      const v = this.p5.createVector(nextPoint.x - prevPoint.x, nextPoint.y - prevPoint.y);
      v.normalize();

      v.rotate(this.p5.PI / 2);
      this.cLines[i].setVector(v);
    }

    // old shit
    // const center = this.p5.createVector(0, 0);
    // this.cLines.forEach((pnt) => {
    //   center.add(pnt.pos.x, pnt.pos.y);
    // });

    // center.div(this.cLines.length);
    // this.cLines.forEach((cl) => cl.calcVector(center));
  }

  removeColliding(chars: Character[], angle: number) {
    for (let i = 0; i < this.cLines.length; i++) {
      let cl = this.cLines[i];

      if (cl.pointOnItsWay(chars, angle)) {
        this.cLines.splice(i, 1);
        i--;
      }
    }
  }
}
