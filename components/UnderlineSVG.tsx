import clsx from "clsx";

export type UnderlineSVGProps = {
  r?: number;
  cx?: number;
  cy?: number;
  xOffset?: number;
  strokeWidth?: number;
  widthRatio?: number;
  color?: string;
  className?: string;
};

export function UnderlineSVG(props: UnderlineSVGProps) {
  const r = props.r ?? 6;
  const cx = props.cx ?? -15;
  const cy = props.cy ?? -12;
  const xoffset = props.xOffset ?? -5;
  const strokeWidth = props.strokeWidth ?? 3;
  const widthRatio = props.widthRatio ?? 120;
  const color = "#282828" ?? props.color;

  return (
    <div className={clsx("mt-1", props.className, "relative")}>
      <svg
        width="100%"
        height="1px"
        viewBox="0 0 100 1"
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
      >
        <line
          x1={0}
          y1={strokeWidth / 2}
          x2={xoffset}
          y2={strokeWidth / 2}
          strokeLinecap="round"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <line
          x1={xoffset}
          y1={strokeWidth / 2}
          x2={cx + r / 2 + 2 + xoffset}
          y2={cy + strokeWidth / 2 + r / 2 + 2}
          strokeLinecap="round"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx + xoffset}
          cy={cy + strokeWidth / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={color}
        />
      </svg>
    </div>
  );
}
