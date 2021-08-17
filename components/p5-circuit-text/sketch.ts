import Text from './scripts/Text';
import p5 from 'p5';

export default class CircuitTextSketch {
  private text: Text | undefined;

  //See annotations in JS for more information
  public setup(p5: p5, canvasParentRef: Element) {
    const font = p5.loadFont('/fonts/Aileron-BoldItalic.otf', () => {
      p5.createCanvas(700, 200).parent(canvasParentRef);

      let str = 'Sivan Duijn';

      let spacing = 10;
      let fontSize = 90;

      this.text = new Text(p5, str, font, fontSize, spacing);

      if (this.text) {
        this.text.generateChars();
        this.text.removeColliding(80);
      }
    });
  }

  public draw(p5: p5) {
    if (window && this.text) {
      p5.background('white');
      p5.translate(p5.width / 2 - this.text.bbox.w / 2, p5.height / 2 + this.text.bbox.h / 2 - 10);

      const textColor = 'indigo';
      p5.translate(0, -15);
      p5.stroke(textColor);
      p5.strokeWeight(3);
      this.text.updateCircuitLines();
      this.text.showCircuitLines(p5.color(textColor));

      p5.fill(textColor);
      p5.noStroke();
      this.text.showText();
    }
  }
}
