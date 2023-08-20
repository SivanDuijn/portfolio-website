import clsx from "clsx";

export type UnderlineSVGProps = {
  r?: number;
  cx?: number;
  cy?: number;
  extraLengthLeft?: number;
  strokeWidth?: number;
  widthRatio?: number;
  color?: string;
  className?: string;
  hover?: boolean;
};

/** The container probably needs inline-block */
export function UnderlineSVG(props: UnderlineSVGProps) {
  const r = props.r ?? 6;
  const cx = props.cx ?? -15;
  const cy = props.cy ?? -12;
  const extraLengthLeft = props.extraLengthLeft ?? -5;
  const strokeWidth = props.strokeWidth ?? 3;
  const extraLengthRight = 10;
  const widthRatio = props.widthRatio ?? 1.2;
  const color = props.color ?? "#777777";

  return (
    <div className={clsx("mt-1", props.className, "relative")}>
      <svg
        width="100%"
        height="1px"
        viewBox="0 0 1 1"
        overflow="visible"
        preserveAspectRatio="none"
      >
        <rect
          x={0}
          y={0}
          width={widthRatio}
          height={strokeWidth}
          fill={color}
        />
      </svg>
      <svg
        className={clsx("absolute", "bottom-0", "left-0")}
        width="1px"
        height="1px"
        viewBox="0 0 1 1"
        overflow="visible"
        preserveAspectRatio="none"
        strokeWidth={strokeWidth}
        stroke={color}
        strokeLinecap="round"
      >
        <line
          x1={0}
          y1={strokeWidth / 2}
          x2={extraLengthLeft}
          y2={strokeWidth / 2}
        />
        <line
          x1={extraLengthLeft}
          y1={strokeWidth / 2}
          x2={cx + r / 2 + 2 + extraLengthLeft}
          y2={cy + strokeWidth / 2 + r / 2 + 2}
        />
        <circle
          cx={cx + extraLengthLeft}
          cy={cy + strokeWidth / 2}
          r={r}
          fill="none"
        />
      </svg>

      <svg
        className={clsx("absolute", "bottom-0")}
        style={{ left: `${widthRatio * 100}%` }}
        width="1px"
        height="1px"
        viewBox="0 0 1 1"
        overflow="visible"
        preserveAspectRatio="none"
        strokeWidth={strokeWidth}
        stroke={color}
      >
        <line
          x1={-1}
          y1={strokeWidth / 2}
          x2={extraLengthRight}
          y2={strokeWidth / 2}
        />
        {props.hover && (
          <g
            className={clsx(
              "transition",
              "group-hover:translate-x-6",
              "opacity-0",
              "group-hover:opacity-100"
            )}
          >
            <line
              x1={extraLengthRight - 10}
              y1={strokeWidth / 2}
              x2={-50 + extraLengthRight - 10}
              y2={strokeWidth / 2}
            />
            <line
              x1={extraLengthRight - 10}
              y1={strokeWidth / 2 + 1}
              x2={-7 + extraLengthRight - 10}
              y2={strokeWidth / 2 - 7}
            />
            <line
              x1={extraLengthRight - 10}
              y1={strokeWidth / 2 - 1}
              x2={-7 + extraLengthRight - 10}
              y2={strokeWidth / 2 + 7}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
