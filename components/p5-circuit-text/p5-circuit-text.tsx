import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5'; // import typing
import Text from './scripts/Text';

const Sketch = dynamic(import('react-p5'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <div>Loading...</div>,
});

export default function P5CircuitText({
  text,
  fontSize,
  spacing = 10,
}: {
  text: string;
  fontSize: number;
  spacing?: number;
}) {
  const circuitText = useRef<Text>();

  useEffect(() => {
    if (circuitText.current && text != circuitText.current?.str)
      circuitText.current.changeText(text, { newFontSize: fontSize, newSpacing: spacing });
  }, [text, fontSize, spacing]);

  //See annotations in JS for more information
  const setup = (p5: p5, canvasParentRef: Element) => {
    const font = p5.loadFont('/fonts/Aileron-BoldItalic.otf', () => {
      p5.createCanvas(700, 190).parent(canvasParentRef);

      circuitText.current = new Text(p5, text, font, fontSize, spacing);
      circuitText.current.generateChars();
      circuitText.current.removeColliding(80);
    });
  };

  const draw = (p5: p5) => {
    if (window && circuitText.current) {
      const cText = circuitText.current;

      p5.background('white');
      p5.translate(p5.width / 2 - cText.bbox.w / 2, p5.height / 2 + cText.bbox.h / 2 - 10);

      const textColor = '#430082';
      p5.translate(0, -10);
      // p5.strokeCap(p5.SQUARE);
      p5.stroke(textColor);
      p5.strokeWeight(3);
      cText.updateCircuitLines();
      cText.showCircuitLines(p5.color(textColor));

      p5.fill(textColor);
      p5.noStroke();
      cText.showText();
    }
  };

  return <Sketch setup={setup} draw={draw} />;
}
