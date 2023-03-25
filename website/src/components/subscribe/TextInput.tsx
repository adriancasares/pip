import React from "react";

export default function TextInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-mono-c">{props.label}</label>
      <input
        className="p-2 border-2 border-mono-border-light rounded-lg"
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
