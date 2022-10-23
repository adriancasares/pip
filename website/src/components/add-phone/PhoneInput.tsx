import React, { useState } from "react";
import phone from "phone";

export default function PhoneInput(props: {
  value: string;
  onChange: (value: string) => void;
  tabIndex?: number;
  disabled?: boolean;
}) {
  const { value, onChange } = props;

  const check = (v: string) => {
    if (v.length === 0) {
      setValid(undefined);
      return;
    }

    const pn = phone(v);

    setValid(pn.isValid);

    if (pn.phoneNumber) {
      onChange(pn.phoneNumber);
    }
  };

  const [valid, setValid] = useState<boolean | undefined>(undefined);

  return (
    <div className="flex flex-col gap-2 text-mono-a">
      <div className="flex gap-4 items-center">
        <p>Phone Number</p>
        <div
          className={`w-2 h-2 rounded-full ${
            valid === undefined ? "bg-yellow-400" : ""
          } ${valid === true ? "bg-green-400" : ""} ${
            valid === false ? "bg-red-400" : ""
          }`}
        ></div>
      </div>
      <input
        disabled={props.disabled}
        tabIndex={props.tabIndex}
        className="bg-mono-border placeholder:text-mono-text-dark py-4 px-6 rounded-lg border border-transparent focus:border-accent-a outline-none"
        type="text"
        placeholder={"Enter your Phone Number"}
        value={value}
        onChange={(e) => {
          check(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
