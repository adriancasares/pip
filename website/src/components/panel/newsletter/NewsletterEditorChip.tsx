import type React from "react";

export default function NewsletterEditorChip(props: {
  label: string;
  icon?: React.ReactNode;
  grayscale?: boolean;
  vibrant?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`py-2 px-4 rounded-full flex gap-2 items-center cursor-pointer ${
        props.grayscale
          ? "bg-mono-container-light text-mono-c"
          : props.vibrant
          ? "bg-indigo-500 text-white"
          : "bg-indigo-50 text-indigo-500"
      }`}
      onClick={props.onClick}
    >
      {props.icon}
      <p>{props.label}</p>
    </div>
  );
}
