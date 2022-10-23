import React from "react";

export default function TextInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tabIndex?: number;
  disabled?: boolean;
}) {
  const { label, value, onChange, placeholder } = props;

  return (
    <div className="flex flex-col gap-2 text-mono-a">
      {label && <p>{label}</p>}
      <input
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        className="bg-mono-border placeholder:text-mono-text-dark py-4 px-6 rounded-lg border border-transparent focus:border-accent-a outline-none"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
