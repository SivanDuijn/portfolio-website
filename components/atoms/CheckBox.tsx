import clsx from "clsx";
import { useEffect, useState } from "react";

type CheckBoxProps = {
  className?: string;
  label: string;
  onChange?: (value: boolean) => void;
  initial?: boolean;
  darkMode?: boolean;
  size?: "small" | "medium" | "large";
};

export default function CheckBox({
  className,
  label,
  onChange,
  initial,
  darkMode,
  size,
}: CheckBoxProps) {
  const [checked, setChecked] = useState(initial ?? false);

  useEffect(() => {
    if (onChange) onChange(checked);
  }, [checked]);

  return (
    <div
      className={clsx(
        "flex",
        "flex-row",
        "items-center",
        "hover:cursor-pointer",
        "select-none",
        className,
      )}
      onClick={() => setChecked((v) => !v)}
    >
      <div
        className={clsx(
          size == "large" ? "w-[1.5rem]" : size == "medium" ? "w-[1.2rem]" : "w-[0.9rem]",
          "aspect-square",
          darkMode ? "border" : "border-2",
          darkMode ? "border-white" : "border-gray-800",
          size == "large" ? "mr-3" : size == "medium" ? "mr-2" : "mr-1.5",
        )}
      >
        {checked && <div className={clsx("w-3/4", "m-[12.5%]", "aspect-square", "bg-[#68d16f]")} />}
      </div>
      <p
        className={clsx(
          size == "large" ? "text-lg" : size == "medium" ? "text-base" : "text-xs",
          darkMode ? "text-white" : "text-black",
        )}
      >
        {label}
      </p>
    </div>
  );
}
