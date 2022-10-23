import React, { useEffect, useRef, useState } from "react";
import { BsChevronExpand } from "react-icons/bs/index.js";

export default function SelectInput(props: {
  values: string[];
  onChange: (value: string) => void;
  label?: string;
  tabIndex?: number;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState(-1);
  const { onChange, label, values } = props;

  const [active, setActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (e.target == null || !dropdownRef.current?.contains(e.target)) {
        setActive(false);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [active]);

  useEffect(() => {
    if (props.disabled) return;

    const handleFocus = (e: any) => {
      setActive(true);
    };

    const handleBlur = (e: any) => {
      setActive(false);
    };

    containerRef.current?.addEventListener("focus", handleFocus);
    containerRef.current?.addEventListener("blur", handleBlur);

    return () => {
      containerRef.current?.removeEventListener("focus", handleFocus);
      containerRef.current?.removeEventListener("blur", handleBlur);
    };
  }, [props.disabled]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 focus:outline-none"
      tabIndex={props.tabIndex}
    >
      {label && <p className="text-mono-a">{label}</p>}
      <div
        className={`bg-mono-border py-4 px-6 rounded-lg flex justify-between items-center cursor-pointer relative border ${
          active ? "border-accent-a" : "border-transparent"
        }`}
        onClick={() => {
          if (!active && !props.disabled) {
            setActive(true);
          }
        }}
      >
        {selected === -1 ? (
          <p className="text-mono-text-dark">Select an option</p>
        ) : (
          <p className="text-mono-a">{values[selected]}</p>
        )}
        <BsChevronExpand className="text-mono-text-dark" />

        {active && (
          <div
            className="absolute w-full top-full left-0 mt-2 rounded-lg overflow-hidden z-20"
            ref={dropdownRef}
          >
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-mono-border py-4 px-6 flex justify-between items-center cursor-pointer group hover:bg-mono-border-lighter"
                onClick={() => {
                  setSelected(index);
                  onChange(value);
                  setActive(false);
                }}
              >
                <p className="text-mono-text-dark group-hover:text-mono-a">
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
