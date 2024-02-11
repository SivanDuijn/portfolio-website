import clsx from "clsx";
import { useCallback, useMemo } from "react";

export type NumberInputProps = {
  value: number;
  min?: number;
  max?: number;
  incrStep?: number;
  decrStep?: number;
  largeIncrStep?: number;
  largeDecrStep?: number;
  disableLargeStep?: boolean;
  darkTheme?: boolean;
  onChange?: (value: number) => void;
};

export default function NumberInput(props: NumberInputProps) {
  const { incrStep, decrStep, largeIncrStep, largeDecrStep } = useMemo(
    () => ({
      incrStep: props.incrStep ?? 1,
      decrStep: props.decrStep ?? -1,
      largeIncrStep: props.largeIncrStep ?? 5,
      largeDecrStep: props.largeDecrStep ?? -5,
    }),
    [props.incrStep, props.decrStep, props.largeDecrStep, props.largeDecrStep],
  );

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
        props.darkTheme ? "bg-gray-900" : "bg-gray-100",
        props.darkTheme ? "border-gray-500" : "border-gray-400",
        props.darkTheme ? "text-gray-500" : "text-gray-600",
        props.darkTheme ? "hover:text-gray-200" : "hover:text-black",
        props.darkTheme ? "hover:border-gray-400" : "hover:border-gray-500",
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
    [props.darkTheme],
  );

  const change = useCallback(
    (v: number) =>
      props.onChange &&
      props.onChange(
        Math.max(
          props.min ?? Number.MIN_SAFE_INTEGER,
          Math.min(props.max ?? Number.MAX_SAFE_INTEGER, props.value + v),
        ),
      ),
    [props.value],
  );

  return (
    <div className={clsx("flex", "items-center")}>
      <div
        className={clsx(
          "min-w-[2rem]",
          "px-1",
          "text-center",
          "mr-1",
          "border",
          "border-gray-500",
          "rounded",
          "font-mono",
          props.darkTheme ? "bg-gray-800" : "bg-gray-100",
        )}
      >
        {props.value % 1 != 0 ? props.value.toFixed(1) : props.value}
      </div>
      <div className={clsx("flex", "flex-col")}>
        {!props.disableLargeStep && (
          <div className={clsx(classes.b, "mb-0.5")} onClick={() => change(largeIncrStep)}>
            <p className={classes.p}>&laquo;</p>
          </div>
        )}
        <div className={clsx(classes.b, "mb-1")} onClick={() => change(incrStep)}>
          <p className={classes.p}>&lsaquo;</p>
        </div>
        <div className={clsx(classes.b)} onClick={() => change(decrStep)}>
          <p className={classes.p}>&rsaquo;</p>
        </div>
        {!props.disableLargeStep && (
          <div className={clsx(classes.b, "mt-0.5")} onClick={() => change(largeDecrStep)}>
            <p className={classes.p}>&raquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
