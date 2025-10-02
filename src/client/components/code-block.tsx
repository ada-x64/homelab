import { ClipboardWithIconText, HR } from "flowbite-react";
import cn from "../cn";

export default function ({
  className,
  language,
  text,
}: {
  className?: string;
  language?: string;
  text: string;
}) {
  return (
    <div
      className={cn([
        "w-full",
        "lg:max-w-2xl",
        "mx-auto",
        "bg-gray-900",
        "p-4",
        "rounded-md",
        "shadow-lg",
      ])}
    >
      <div
        className={cn([
          "flex",
          "justify-between",
          "items-center",
          "px-4",
          "rounded-t-lg",
        ])}
      >
        <span
          className={cn([
            "text-xs",
            "py-0.5",
            "font-semibold",
            "text-gray-400",
          ])}
        >
          {language}
        </span>
        <ClipboardWithIconText
          theme={{ base: "relative translate-y-0 end-0 top-0" }}
          valueToCopy={text}
        />
      </div>
      <HR theme={{ base: "my-2" }}></HR>
      <pre
        className={cn([
          className ?? "",
          "text-sm",
          "text-white",
          "overflow-x-auto",
        ])}
      >
        <code className="block">{text}</code>
      </pre>
    </div>
  );
}
