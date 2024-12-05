import { useCallback, useEffect, useMemo, useState } from "react";
import { jumbleText } from "./jumbleText";

export type JumblingTextProps = {
  texts: string[];
  className?: string;
  repeat?: boolean;
  initialWaitMs?: number;
};

export function JumblingText(props: JumblingTextProps) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("black");

  const updateText = useCallback(
    (text: string) => {
      setText(text);
      if (text == "unwise") {
        // setTimeout(() => {
        setColor("#bf0000");
        // }, 600);
        setTimeout(() => {
          setColor("black");
        }, 6000);
      }
    },
    [setText],
  );

  useEffect(
    () =>
      jumbleText(props.texts, updateText, {
        repeat: props.repeat,
        initialWaitMs: props.initialWaitMs,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <p style={{ color: color }} className={props.className}>
      {text}
    </p>
  );
}
