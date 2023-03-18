import React from "react";

export default function MetadataTextInput(props: {
  label: string;
  value: string;
  placeholder?: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="flex items-center">
      <p className="text-xs text-mono-text font-os w-24">{props.label}</p>
      <textarea
        className="font-os text-sm py-1 w-full whitespace-normal overflow-hidden resize-none outline-none focus:bg-mono-container-light transition-colors rounded-md px-2"
        placeholder={props.placeholder}
        suppressContentEditableWarning
        style={{
          height: "28px",
        }}
        onChange={(e) => {
          e.currentTarget.style.height = "0px";
          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";

          props.setValue(e.currentTarget.value);
        }}
        value={props.value}
      />
    </div>
  );
}
