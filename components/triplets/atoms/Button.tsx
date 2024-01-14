import { UsersIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export type ButtonProps = {
  label: string;
  icon?: React.FC<Parameters<typeof UsersIcon>[0]>;
  onClick?: () => void;
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
        props.lightTheme
          ? "bg-[#57e347] hover:bg-[#52d243] active:bg-[#4cc03f] text-black"
          : "bg-[#0c2c0c] hover:bg-[#144619] active:bg-[#002300] text-white active:text-gray-200 hover:border-gray-300",
        "border",
        "font-mono",
        "font-bold",
        "border-gray-500",
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.label}
      {props.icon && <props.icon className={clsx("w-5", "ml-1", "-translate-y-[0.1rem]")} />}
    </button>
  );
}
