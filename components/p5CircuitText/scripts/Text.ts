/* eslint-disable no-console */
import p5 from "p5";
import Character from "./Character";

export default class Text {
  private chars: Character[] = [];
  private angle = 80; // Default angle for removing colliding lines within a character.
  public bbox = { x: 0, y: 0, w: 0, h: 0 };

  public p: p5;
  public str: string;
  private font: p5.Font;
  public fontSize: number;
  public spacing: number;

  constructor(p: p5, str: string, font: p5.Font, fontSize: number, spacing = 20) {
    this.p = p;
    this.str = str;
    this.font = font;
    this.fontSize = fontSize;
    this.spacing = spacing;

    if (str.length == 0) console.log("Text cannot be empty!");

    this.p.textFont(this.font);
    this.p.textSize(this.fontSize);
  }

  generateChars() {
    const letters = this.str.split("");
    this.chars = [];

    letters.forEach((e) => {
      let newChar;

      if (this.chars.length == 0)
        newChar = new Character(this.p, this.font, this.fontSize, this.p.createVector(0, 0), e);
      else {
        const c = this.chars[this.chars.length - 1];
        const pos = this.p.createVector(c.pos.x + c.width + this.spacing, c.pos.y);
        newChar = new Character(this.p, this.font, this.fontSize, pos, e);
      }

      this.chars.push(newChar);
    });

    this.calcBoundingBox();
  }

  removeColliding(angle: number) {
    this.angle = angle;
    this.chars.forEach((c) => {
      c.removeColliding(this.chars, angle);
    });
  }

  calcBoundingBox() {
    if (this.chars.length == 0) {
      this.bbox = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      };
      return;
    }

    const firstChar = this.chars[0];
    const lastChar = this.chars[this.chars.length - 1];
    this.bbox = {
      x: firstChar.pos.x,
      y: firstChar.pos.y,
      w: lastChar.pos.x + lastChar.width - firstChar.pos.x,
      h: this.chars.reduce((acc, c) => Math.max(acc, c.height), 0),
    };
  }

  showText(debug?: boolean) {
    this.chars.forEach((c) => c.showText(debug));
  }

  updateCircuitLines() {
    this.chars.forEach((c) => c.updateCircuitLines());
  }
  showCircuitLines(color: p5.Color) {
    this.chars.forEach((c) => c.showCircuitLines(color));
  }

  changeText(str: string, args?: { newFontSize?: number; newSpacing?: number }) {
    if (str.length == 0) console.log("Text cannot be empty!");

    if (args?.newFontSize) {
      this.fontSize = args.newFontSize;
      this.p.textSize(this.fontSize);
    }
    if (args?.newSpacing) this.spacing = args.newSpacing;

    this.str = str;

    this.generateChars();
    this.removeColliding(this.angle);
  }
}
