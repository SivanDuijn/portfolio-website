import React from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5'; // import typing
import Text from './scripts/Text';

const Sketch = dynamic(import('react-p5'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div className="sketch-holder">Loading...</div>,
});

export default function P5CircuitText() {
  let text: Text;

  //See annotations in JS for more information
  const setup = (p5: p5, canvasParentRef: Element) => {
    const font = p5.loadFont('./fonts/SourceCodePro-SemiBold.ttf', () => {
      p5.createCanvas(800, 200).parent(canvasParentRef);

      let str = 'Sivan Duijn';

      let spacing = 10;
      let fontSize = 90;

      text = new Text(p5, str, font, fontSize, spacing);

      text.generateChars();
      console.log(text);
      text.removeColliding(80);
    });
  };

  const draw = (p5: p5) => {
    if (window && text) {
      p5.background('white');
      p5.translate(p5.width / 2 - text.bbox.w / 2, p5.height / 2 + text.bbox.h / 2 - 10);

      const textColor = 'indigo';
      p5.stroke(textColor);
      p5.strokeWeight(3);
      text.updateCircuitLines();
      text.showCircuitLines(p5.color(textColor));

      p5.fill(textColor);
      p5.noStroke();
      text.showText();
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
