import clsx from "clsx";

export function Footer() {
  return (
    <div className={clsx("bg-black", "flex", "justify-center")}>
      <a href="#top" className={clsx("text-gray-600", "hover:underline", "p-4")}>
        Take me to the top ↑
      </a>
    </div>
  );
}
