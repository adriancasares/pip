import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  IoCaretDownOutline,
  IoCaretUpOutline,
  IoRemoveCircle,
} from "react-icons/io5/index.js";
import { AlertContext } from "./EditorAlertDisplay";
export default function NewsletterChangeOrderBar(props: {
  show: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  remove: () => void;
}) {
  const alerts = useContext(AlertContext);
  return (
    <div>
      <motion.div
        className={`hover:children:bg-mono-container-light child:p-2 flex bg-white rounded-full shadow-sm border border-mono-border-light overflow-hidden w-fit z-10 ${
          props.show ? "child:cursor-pointer" : "child:cursor-default"
        }`}
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
        <div
          onClick={() => {
            alerts.addAlert({
              name: "Are you sure you want to remove this alert?",
              callback: (confirm: boolean) => {
                if (confirm) {
                  props.remove();
                }
              },
            });
          }}
        >
          <IoRemoveCircle className="text-red-500" />
        </div>
      </motion.div>
    </div>
  );
}
