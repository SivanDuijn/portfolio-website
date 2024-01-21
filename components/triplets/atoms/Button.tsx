import { UsersIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export type ButtonProps = {
  label: string;
  icon?: React.FC<Parameters<typeof UsersIcon>[0]>;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  lightTheme?: boolean;
};

export default function Button(props: ButtonProps) {
  return (
    <button
      className={clsx(
        "flex",
        "px-2",
        "py-[0.15rem]",
        "rounded",
        "border",
        "font-mono",
        "font-bold",
        props.lightTheme
          ? `bg-[#57e347] ${
              props.disabled ? "text-gray-600" : "text-black hover:bg-[#52d243] active:bg-[#4cc03f]"
            }`
          : `bg-[#0c2c0c] ${
              props.disabled
                ? "text-gray-500"
                : "text-white hover:bg-[#144619] active:bg-[#002300] active:text-gray-200 hover:border-gray-300"
            }`,
        props.disabled && "cursor-default  border-gray-600",
        props.className,
      )}
      onClick={props.disabled ? () => true : props.onClick}
    >
      {props.label}
      {props.icon && <props.icon className={clsx("w-5", "ml-1", "-translate-y-[0.1rem]")} />}
    </button>
  );
}
