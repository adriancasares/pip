import React from "react";

export default function TextInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tabIndex?: number;
  disabled?: boolean;
  password?: boolean;
  smallLabel?: boolean;
}) {
  const { label, value, onChange, placeholder } = props;

  return (
    <div className="flex flex-col gap-2 font-os">
      {label && (
        <p className={props.smallLabel ? "text-sm" : "text-base"}>{label}</p>
      )}
      <input
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        className="outline-none border border-mono-b py-2 px-4 rounded-md"
        type={props.password ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
