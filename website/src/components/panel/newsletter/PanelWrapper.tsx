import type React from "react";
import { IoCloseOutline } from "react-icons/io5/index.js";
import { motion } from "framer-motion";

export default function PanelWrapper(props: {
  children: React.ReactNode;
  onClose: () => void;
  show: boolean;
}) {
  return (
    <motion.div
      className={`fixed top-0 left-0 w-full h-full bg-black/20 p-20 ${
        props.show ? "z-50" : "z-0 invisible"
      }`}
      onClick={() => {
        props.onClose();
      }}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: props.show ? 1 : 0,
      }}
      transition={{
        duration: props.show ? 0.5 : 0,
      }}
    >
      <div className="bg-mono-container-light text-mono-c w-8 h-8 flex items-center justify-center rounded-full absolute left-1/2 -translate-x-1/2 top-20 -translate-y-1/2 z-50">
        <IoCloseOutline className="w-4 h-4" />
      </div>
      <motion.div
        className="bg-white w-full h-full rounded-md shadow-lg"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: props.show ? 1 : 0,
          scale: props.show ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          bounce: 0.2,
          type: "spring",
        }}
      >
        {props.children}
      </motion.div>
    </motion.div>
  );
}
