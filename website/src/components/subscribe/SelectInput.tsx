import React from "react";

export default function SelectInput(props: {
  options: string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-mono-c">{props.label}</label>
      <select
        className="p-2 border-2 border-mono-border-light rounded-lg"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value=""></option>
        {props.options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
