import clsx from "clsx";
import { useEffect, useState } from "react";

type CheckBoxProps = {
  className?: string;
  label: string;
  onChange?: (value: boolean) => void;
  initial?: boolean;
  darkMode?: boolean;
};

export default function CheckBox({ className, label, onChange, initial, darkMode }: CheckBoxProps) {
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
          "w-[0.9rem]",
          "h-[0.9rem]",
          "border-2",
          "border-gray-800",
          "mr-1.5",
          checked ? "bg-[#68d16f]" : "bg-white",
        )}
      />
      <p className={clsx("text-xs", darkMode ? "text-white" : "text-black")}>{label}</p>
    </div>
  );
}
