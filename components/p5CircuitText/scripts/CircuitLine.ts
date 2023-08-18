import p5 from "p5";
import Character from "./Character";
import { CLLineStart, CLLine, CLCircle, CircuitLineItem } from "./Line";
import { getRandomInt } from "@/components/utils";

export default class CircuitLine {
  public p: p5;
  public pos: p5.Vector;
  public vec: p5.Vector;
  public CLItems: CircuitLineItem[] = [];
  public isEnding = false;
  public isFinished = false;
  public alpha = 255;
  public timer = 0;
  public maxNCLItems = 4;
  public waitTime = 0;

  constructor(p: p5, pos: p5.Vector) {
    this.p = p;
    this.pos = pos;
    this.vec = this.p.createVector(1, 1);
    this.reset();
  }

  update() {
    if (this.timer < 0) {
      // wait a bit (random) before showing
      if (this.timer == this.waitTime) this.timer = 0;
      else this.timer--;
    } else if (this.isEnding)
      // If all CLItems are finished, update the fading out process
      this.updateFade();
    else if (this.CLItems.length > 0) {
      // else we just update.

      // Loop through all CLItems until one that is not finished yet
      for (let i = 0; i < this.CLItems.length; i++) {
        this.CLItems[i].update();

        if (!this.CLItems[i].finished) break;
      }

      // Check if al CLItems are finished
      if (this.CLItems.every((cli) => cli.finished)) this.isEnding = true;
    }
  }

  show(color: p5.Color) {
    if (this.timer >= 0) {
      // Loop through all CLItems until one that is not finished yet
      for (let i = 0; i < this.CLItems.length; i++) {
        this.CLItems[i].show(color, this.alpha);

        if (!this.CLItems[i].finished) break;
      }
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
    this.pos.x -= this.vec.x * 0.5;
    this.pos.y -= this.vec.y * 0.5;
  }

  reset() {
    this.generateCircuitItems();
    this.alpha = 255;
    this.timer = -1;
    this.isEnding = false;
    this.isFinished = false;
    this.waitTime = getRandomInt(2000) * -1;
  }

  /** Generates a new CLItems array. */
  generateCircuitItems() {
    // Generate the start line with the little beginning blocky thing
    // So two array items
    // const startLine = new CLLineStart(this.p, this.pos, this.vec);
    // let nextData = startLine.generateNextLineItemVectors();
    let nextItem: CircuitLineItem = new CLLine(this.p, this.pos, this.vec, 15);

    this.CLItems = [nextItem];

    // push some random lines
    let nextData = nextItem.generateNextLineItemVectors();
    nextItem = new CLCircle(this.p, nextData.startPos, nextData.vec, 3);
    this.CLItems.push(nextItem);

    nextData = nextItem.generateNextLineItemVectors(
      45 * (getRandomInt(2) == 0 ? 1 : -1)
    );
    nextItem = new CLLine(this.p, nextData.startPos, nextData.vec, 3);
    this.CLItems.push(nextItem);

    nextData = nextItem.generateNextLineItemVectors();
    nextItem = new CLCircle(
      this.p,
      nextData.startPos,
      nextData.vec,
      getRandomInt(10) + 5
    );
    this.CLItems.push(nextItem);
  }

  pointOnItsWay(chars: Character[], angle: number): boolean {
    let rad = this.p.radians(angle / 2);
    let vRight = this.p.createVector(this.vec.x, this.vec.y).rotate(rad);
    let vLeft = this.p.createVector(this.vec.x, this.vec.y).rotate(-rad);

    return chars.some((c) => {
      return c.cLines.some((cl) => {
        if (cl == this) return false;

        let vToPnt = this.p.createVector(
          cl.pos.x - this.pos.x,
          cl.pos.y - this.pos.y
        );

        let vRightCross = vToPnt.cross(vRight);
        let vLeftCross = vToPnt.cross(vLeft);

        if (vRightCross.z > 0 && vLeftCross.z < 0) return true;
      });
    });
  }
}
