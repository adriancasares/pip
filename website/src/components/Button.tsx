import React from "react";
import { IoChatbubble } from "react-icons/io5/index.js";
import LoadingDots from "./LoadingDots";
import { motion } from "framer-motion";

function ButtonInner(props: { icon?: string; children: string }) {
  return (
    <>
      {props.icon && (
        <span className="opacity-50">
          {props.icon === "message" && <IoChatbubble />}
        </span>
      )}
      <span>{props.children}</span>
    </>
  );
}
export default function Button(props: {
  link?: string;
  children: string;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
  tabIndex?: number;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}) {
  const { link, onClick, children, disabled, tabIndex, type, loading, icon } =
    props;
  return (
    <a
      href={link}
      onClick={() => {
        if (!disabled) {
          onClick?.();
        }
      }}
    >
      <button
        type={type}
        tabIndex={tabIndex}
        className={`rounded-md bg-accent-a transition-colors text-accent-c w-fit py-3 px-6 uppercase font-sans flex gap-4 items-center overflow-hidden ${
          disabled ? "opacity-50" : ""
        } ${
          !loading && !disabled
            ? "hover:bg-accent-b cursor-pointer"
            : "cursor-default"
        }`}
      >
        {loading && <LoadingDots />}
        {!loading && <ButtonInner icon={icon}>{children}</ButtonInner>}
      </button>
    </a>
  );
}
