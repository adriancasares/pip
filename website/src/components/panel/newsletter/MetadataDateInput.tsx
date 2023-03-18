import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mantine/dates";
import { motion } from "framer-motion";

export default function MetadataDateInput(props: {
  label: string;
  value: number;
  placeholder?: string;
  setValue: (value: number) => void;
}) {
  const [show, setShow] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      const listener = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as any)) {
          setShow(false);
        }
      };

      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [show]);

  return (
    <div className="flex items-center relative" ref={inputRef}>
      <p className="text-xs text-mono-text font-os w-24">{props.label}</p>
      <p
        onClick={() => {
          setShow(!show);
        }}
        className="font-os text-sm py-1 w-full whitespace-normal overflow-hidden resize-none outline-none hover:bg-mono-container-light transition-colors rounded-md px-2 cursor-pointer"
        placeholder={props.placeholder}
        style={{
          height: "28px",
        }}
      >
        {props.value
          ? new Date(props.value).toDateString()
          : "No date selected"}
      </p>
      <motion.div
        className="origin-top absolute bg-white top-full left-0 z-20 shadow-sm border border-mono-border-light rounded-md overflow-hidden p-1"
        animate={{
          opacity: show ? 1 : 0,
          scale: show ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.25,
        }}
        initial={{
          opacity: 0,
          scale: 0,
        }}
      >
        <DatePicker
          value={new Date(props.value)}
          onChange={(v) => {
            props.setValue(v?.getTime() || 0);
          }}
          weekendDays={[1, 2, 5, 6]}
        />
      </motion.div>
    </div>
  );
}
