import React from "react";

export default function PhoneInput(props: {
  value: string;
  onChange: (value: string) => void;
  tabIndex?: number;
  disabled?: boolean;
}) {
  const { value, onChange } = props;

  return (
    <div className="flex flex-col gap-2 text-mono-a">
      <p>Phone Number</p>
      <input
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        className="bg-mono-border placeholder:text-mono-text-dark py-4 px-6 rounded-lg border border-transparent focus:border-accent-a outline-none"
        type="text"
        placeholder={"Enter your Phone Number"}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
