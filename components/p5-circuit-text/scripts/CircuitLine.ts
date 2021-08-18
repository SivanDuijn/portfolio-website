import p5 from 'p5';
import Character from './Character';
import { CLLineStart, CLLine, CLCircle, CircuitLineItem } from './Line';
import Utils from '../../utils';

export default class CircuitLine {
  public p5: p5;
  public pos: p5.Vector;
  public vec: p5.Vector;
  public CLItems: CircuitLineItem[] = [];
  public isEnding = false;
  public isFinished = false;
  public alpha = 255;
  public timer = 0;
  public maxNCLItems = 4;
  public waitTime = 0;

  constructor(p5: p5, pos: p5.Vector) {
    this.p5 = p5;
    this.pos = pos;
    this.vec = this.p5.createVector(1, 1);
    // this.reset();
  }

  update() {
    if (this.timer < 0) {
      // wait a bit (random) before showing
      if (this.timer == this.waitTime) this.timer = 0;
      else this.timer--;
    } else if (this.isEnding)
      // check if we are in the ending phase
      this.updateFade();
    else if (this.CLItems.length > 0) {
      // else we just update
      let i = this.CLItems[this.CLItems.length - 1];
      if (i.finished) {
        if (this.CLItems.length == this.maxNCLItems - 1)
          this.CLItems.push(new CLCircle(this.p5, (i as CLLine).endPnt.copy(), (i as CLLine).vec));
        else if (this.CLItems.length == this.maxNCLItems) this.isEnding = true;
        else this.addNewLine(i as CLLine);
      } else i.update();
    }
  }

  show(color: p5.Color) {
    if (this.timer >= 0) this.CLItems.forEach((l) => l.show(color, this.alpha));
  }

  private addNewLine(l: CLLine) {
    // Cheator completor, refactor this!
    let v = l.vec.copy();
    if (l.maxLength == 2.5) this.CLItems.push(new CLLine(this.p5, l.endPnt, v, 15));
    else {
      if (Utils.GetRandomInt(1) == 0) v.rotate(this.p5.HALF_PI / 2);
      else v.rotate(-this.p5.HALF_PI / 2);
      this.CLItems.push(new CLLine(this.p5, l.endPnt, v, 5));
    }
  }

  private updateFade() {
    if (this.timer > 100) {
      this.alpha -= 1;

      if (this.alpha == -1) this.isFinished = true;
    } else this.timer += 1;
  }

  setVector(v: p5.Vector) {
    this.vec = v;
  }

  reset() {
    this.CLItems = [new CLLineStart(this.p5, this.pos, this.vec)];
    this.alpha = 255;
    this.timer = -1;
    this.isEnding = false;
    this.isFinished = false;
    this.waitTime = Utils.GetRandomInt(2000) * -1;
  }

  pointOnItsWay(chars: Character[], angle: number): boolean {
    let rad = this.p5.radians(angle / 2);
    let vRight = this.p5.createVector(this.vec.x, this.vec.y).rotate(rad);
    let vLeft = this.p5.createVector(this.vec.x, this.vec.y).rotate(-rad);

    return chars.some((c) => {
      return c.cLines.some((cl) => {
        if (cl == this) return false;

        let vToPnt = this.p5.createVector(cl.pos.x - this.pos.x, cl.pos.y - this.pos.y);

        let vRightCross = vToPnt.cross(vRight);
        let vLeftCross = vToPnt.cross(vLeft);

        if (vRightCross.z > 0 && vLeftCross.z < 0) return true;
      });
    });
  }
}
