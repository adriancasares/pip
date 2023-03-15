import type React from "react";

export default function NewsletterBlockEditorWrapper(props: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="p-4 border border-mono-border-light rounded-md flex flex-col gap-2">
      <p className="text-mono-c font-os text-sm">{props.label}</p>
      {props.children}
    </div>
  );
}
