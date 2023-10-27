import { useEffect, useState } from "react";
import { jumbleText } from "./jumbleText";

export type JumblingTextProps = {
  texts: string[];
  className?: string;
  repeat?: boolean;
};

export function JumblingText(props: JumblingTextProps) {
  const [text, setText] = useState("");

  useEffect(
    () =>
      jumbleText(props.texts, setText, {
        repeat: props.repeat,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <p className={props.className}>{text}</p>;
}
