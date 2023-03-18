import type React from "react";

export default function NewsletterEditorChip(props: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-indigo-50 text-indigo-500 py-2 px-4 rounded-full flex gap-2 items-center">
      {props.icon}
      <p>{props.label}</p>
    </div>
  );
}
