import p5 from 'p5';
import Character from './Character';

export default class Text {
  private chars: Character[] = [];
  private angle: number = 80; // Default angle for removing colliding lines within a character.
  public bbox = { x: 0, y: 0, w: 0, h: 0 };

  public p5: p5;
  public str: string;
  private font: p5.Font;
  public fontSize: number;
  public spacing: number;

  constructor(p5: p5, str: string, font: p5.Font, fontSize: number, spacing = 20) {
    this.p5 = p5;
    this.str = str;
    this.font = font;
    this.fontSize = fontSize;
    this.spacing = spacing;

    if (str.length == 0) console.log('Text cannot be empty!');

    this.p5.textFont(this.font);
    this.p5.textSize(this.fontSize);
  }

  generateChars() {
    let letters = this.str.split('');
    this.chars = [];

    letters.forEach((e) => {
      let newChar;

      if (this.chars.length == 0)
        newChar = new Character(this.p5, this.font, this.fontSize, this.p5.createVector(0, 0), e);
      else {
        let c = this.chars[this.chars.length - 1];
        let pos = this.p5.createVector(c.pos.x + c.width + this.spacing, c.pos.y);
        newChar = new Character(this.p5, this.font, this.fontSize, pos, e);
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

    let firstChar = this.chars[0];
    let lastChar = this.chars[this.chars.length - 1];
    this.bbox = {
      x: firstChar.pos.x,
      y: firstChar.pos.y,
      w: lastChar.pos.x + lastChar.width - firstChar.pos.x,
      h: this.chars.reduce((acc, c) => Math.max(acc, c.height), 0),
    };
  }

  showText() {
    this.chars.forEach((c) => c.showText());
  }

  updateCircuitLines() {
    this.chars.forEach((c) => c.updateCircuitLines());
  }
  showCircuitLines(color: p5.Color) {
    this.chars.forEach((c) => c.showCircuitLines(color));
  }

  changeText(str: string, args?: { newFontSize?: number; newSpacing?: number }) {
    if (str.length == 0) console.log('Text cannot be empty!');

    if (args?.newFontSize) {
      this.fontSize = args.newFontSize;
      this.p5.textSize(this.fontSize);
    }
    if (args?.newSpacing) this.spacing = args.newSpacing;

    this.str = str;

    this.generateChars();
    this.removeColliding(this.angle);
  }
}
