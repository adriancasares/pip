import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "../../LoadingSpinner";
import { IoCheckmarkCircle } from "react-icons/io5/index.js";

export default function ProjectResourceOption(props: {
  label: string;
  faded?: boolean;
  loading?: boolean;
  onClick?: () => void;
  status: "CURRENT" | "COMPLETED" | "NOT_CREATED";
  onChangeComplete?: (arg0: boolean) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative"
      onClick={props.onClick}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      {hover && (
        <motion.div
          layoutId="project-resource-option-hover"
          className={`z-0 absolute top-0 left-0 w-full h-full rounded-lg bg-mono-container-light`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <div
        className={`relative px-8 z-10 flex items-center justify-between gap-4 ${
          props.faded ? "text-mono-c italic" : "text-black"
        }`}
      >
        <div className="flex items-center gap-4 py-4">
          {props.loading && <LoadingSpinner small />}
          <p>{props.label}</p>
        </div>
        <div
          className="w-10 h-10 justify-self-end rounded-full p-2 group relative"
          onClick={(e) => {
            e.stopPropagation();

            if (props.onChangeComplete) {
              props.onChangeComplete(!(props.status === "COMPLETED"));
            }
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-indigo-50 z-0 scale-0 group-hover:scale-100 transition-transform cursor-pointer" />
          {props.status === "CURRENT" && (
            <div className="relative z-10 w-full h-full rounded-full border-2 border-mono-border-light bg-white cursor-pointer" />
          )}

          {props.status === "COMPLETED" && (
            <IoCheckmarkCircle className="relative z-10 w-full h-full text-indigo-400 cursor-pointer" />
          )}

          {props.status === "NOT_CREATED" && (
            <div className="relative z-10 w-full h-full rounded-full cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  );
}
