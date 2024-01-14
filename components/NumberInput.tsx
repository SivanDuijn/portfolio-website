import clsx from "clsx";
import { useCallback, useMemo } from "react";

export type NumberInputProps = {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};

export default function NumberInput(props: NumberInputProps) {
  const classes = useMemo(
    () => ({
      b: clsx(
        "hover:cursor-pointer",
        "h-3.5",
        "w-5",
        "select-none",
        "border",
        "rounded",
        "font-mono",
        "relative",
        "bg-gray-900",
        "border-gray-500",
        "text-gray-500",
        "hover:text-gray-200",
        "hover:border-gray-400",
      ),
      p: clsx(
        "rotate-90",
        "ml-[1px]",
        "p-0",
        "absolute",
        "top-1/2",
        "left-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2",
      ),
    }),
    [],
  );

  const change = useCallback(
    (v: number) =>
      props.onChange &&
      props.onChange(
        Math.max(props.min ?? Number.MAX_SAFE_INTEGER, Math.min(props.max ?? 0, props.value + v)),
      ),
    [props.value],
  );

  return (
    <div className={clsx("flex", "items-center")}>
      <div
        className={clsx(
          "min-w-[2rem]",
          "text-center",
          "mr-1",
          "border",
          "border-gray-500",
          "rounded",
          "bg-gray-800",
        )}
      >
        {props.value}
      </div>
      <div className={clsx("flex", "flex-col")}>
        <div className={clsx(classes.b, "mb-0.5")} onClick={() => change(5)}>
          <p className={classes.p}>&laquo;</p>
        </div>
        <div className={clsx(classes.b, "mb-1")} onClick={() => change(1)}>
          <p className={classes.p}>&lsaquo;</p>
        </div>
        <div className={clsx(classes.b, "mb-0.5")} onClick={() => change(-1)}>
          <p className={classes.p}>&rsaquo;</p>
        </div>
        <div className={clsx(classes.b)} onClick={() => change(-5)}>
          <p className={classes.p}>&raquo;</p>
        </div>
      </div>
    </div>
  );
}
