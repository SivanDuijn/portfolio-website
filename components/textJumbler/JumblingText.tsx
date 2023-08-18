import { useEffect, useState } from "react";
import { jumbleText } from "./jumbleText";

export type JumblingTextProps = {
  initialText: string;
  changeInto: string[];
  className?: string;
  repeat?: boolean;
};

export function JumblingText(props: JumblingTextProps) {
  const [text, setText] = useState(props.initialText);

  useEffect(
    () =>
      jumbleText(props.initialText, props.changeInto, setText, {
        repeat: props.repeat,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <p className={props.className}>{text}</p>;
}
