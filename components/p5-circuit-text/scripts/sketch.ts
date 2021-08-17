import * as p5 from 'p5';

const Sketch = (W: number, H: number) => (p5: p5) => {
  let PI = p5.PI;
  let PI_2 = p5.HALF_PI;
  let PI_4 = p5.QUARTER_PI;
  let TWO_PI = p5.TWO_PI;

  p5.setup = () => {
    p5.createCanvas(W, H);
    p5.angleMode(p5.RADIANS);
  };

  p5.draw = () => {
    p5.background(220);

    const c1 = p5.map(p5.constrain(p5.mouseX, 0, W), 0, W, 0, 255);
    const c2 = p5.map(p5.constrain(p5.mouseY, 0, H), 0, H, 0, 255);
    p5.fill(c1, c2, 255);
    p5.strokeWeight(4);
    if (p5.mouseIsPressed) {
      p5.stroke(255);
    } else {
      p5.stroke(0);
    }

    p5.textSize(H / 3);
    p5.text('Hello!', 20, H / 2);
  };
};

export default Sketch;
