import React from "react";
import { motion } from "framer-motion";
import {
  IoCaretDownOutline,
  IoCaretUpOutline,
  IoRemoveCircle,
} from "react-icons/io5/index.js";
export default function NewsletterChangeOrderBar(props: {
  show: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  remove: () => void;
}) {
  return (
    <div>
      <motion.div
        className="hover:children:bg-mono-container-light child:p-2 flex bg-white rounded-full shadow-sm border border-mono-border-light overflow-hidden w-fit z-10 child:cursor-pointer"
        style={{}}
        animate={{
          opacity: props.show ? 1 : 0,
          scale: props.show ? 1 : 0.9,
        }}
        transition={{ duration: props.show ? 0.3 : 0 }}
      >
        {!props.isFirst && (
          <div onClick={props.onMoveUp}>
            <IoCaretUpOutline className="text-mono-c" />
          </div>
        )}
        {!props.isLast && (
          <div onClick={props.onMoveDown}>
            <IoCaretDownOutline className="text-mono-c" />
          </div>
        )}
        <div onClick={props.remove}>
          <IoRemoveCircle className="text-red-500" />
        </div>
      </motion.div>
    </div>
  );
}
