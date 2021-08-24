import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5'; // import p5 typing
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
  height = 190,
}: {
  text: string;
  fontSize: number;
  spacing?: number;
  height?: number;
}) {
  const circuitText = useRef<Text>();

  useEffect(() => {
    if (circuitText.current && text != circuitText.current?.str)
      circuitText.current.changeText(text, { newFontSize: fontSize, newSpacing: spacing });
  }, [text, fontSize, spacing]);

  //See annotations in JS for more information
  const setup = (p: p5, canvasParentRef: Element) => {
    const font = p.loadFont('/fonts/Aileron-BoldItalic.otf', () => {
      p.createCanvas(700, height).parent(canvasParentRef);

      circuitText.current = new Text(p, text, font, fontSize, spacing);
      circuitText.current.generateChars();
      circuitText.current.removeColliding(70);
    });
  };

  const draw = (p: p5) => {
    if (window && circuitText.current) {
      const cText = circuitText.current;

      p.background('white');
      p.translate(p.width / 2 - cText.bbox.w / 2, p.height / 2 + cText.bbox.h / 2 - 10);

      const textColor = '#430082';
      p.translate(0, -10);
      p.strokeCap(p.SQUARE);
      p.stroke(textColor);
      p.strokeWeight(3);
      cText.updateCircuitLines();
      cText.showCircuitLines(p.color(textColor));

      p.fill(textColor);
      p.noStroke();
      cText.showText();
    }
  };

  return (
    <div
      style={{
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}
