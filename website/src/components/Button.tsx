import React from "react";
import { IoCall } from "react-icons/io5";
export default function Button(props: {
  children: string;
  onClick?: () => void;
  icon?: string;
}) {
  return (
    <button className="bg-accent-a hover:bg-accent-b transition-colors text-accent-c w-fit py-3 px-6 rounded-md uppercase font-sans flex gap-4 items-center">
      {props.icon === "phone" && <IoCall />}
      <span>{props.children}</span>
    </button>
  );
}
