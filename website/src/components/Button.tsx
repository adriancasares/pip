import React from "react";
import { IoChatbubble } from "react-icons/io5/index.js";

export default function Button(props: {
  children: string;
  onClick?: () => void;
  icon?: string;
}) {
  return (
    <button className="bg-accent-a hover:bg-accent-b transition-colors text-accent-c w-fit py-3 px-6 rounded-md uppercase font-sans flex gap-4 items-center">
      <span className="opacity-50">
        {props.icon === "message" && <IoChatbubble />}
      </span>
      <span>{props.children}</span>
    </button>
  );
}
