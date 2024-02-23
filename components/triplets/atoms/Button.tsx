import { UsersIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export type ButtonProps = {
  label: string;
  icon?: React.FC<Parameters<typeof UsersIcon>[0]>;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  darkTheme?: boolean;
};

export default function Button(props: ButtonProps) {
  return (
    <div className={props.className}>
      <button
        className={clsx(
          "flex",
          "px-2",
          "py-[0.15rem]",
          "rounded",
          "border",
          "font-mono",
          "font-bold",
          props.darkTheme
            ? `bg-[#529956] ${
                props.disabled
                  ? "text-gray-300 border-gray-400 mt-[1px] mr-[1px]"
                  : `text-gray-100 hover:text-white hover:bg-[#59a35b] active:bg-[#529956] 
                  border-gray-200 hover:border-white border-2 border-t border-r active:border-2 active:border-b active:border-l`
              }`
            : `bg-[#77d87e] ${
                props.disabled
                  ? "text-gray-600 border-gray-600 mt-[1px] mr-[1px]"
                  : `text-gray-900 hover:text-black hover:bg-[#68d970] active:bg-[#77d87e] 
                 border-gray-600 hover:border-black border-2 border-t border-r active:border-2 active:border-b active:border-l`
              }`,
          props.disabled && "cursor-default",
        )}
        onClick={props.disabled ? () => true : props.onClick}
      >
        {props.label}
        {props.icon && <props.icon className={clsx("w-5", "ml-1", "-translate-y-[0.1rem]")} />}
      </button>
    </div>
  );
}
