import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "../../LoadingSpinner";

export default function ProjectResourceOption(props: {
  label: string;
  faded?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative cursor-pointer"
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
          className={`absolute top-0 left-0 w-full h-full rounded-lg bg-mono-container-light`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <div
        className={`relative z-10 py-4 px-8 flex items-center gap-4 ${
          props.faded ? "text-mono-c italic" : "text-black"
        }`}
      >
        {props.loading && <LoadingSpinner small />}
        <p>{props.label}</p>
      </div>
    </div>
  );
}
