import React from "react";

export default function Button(props: {
  children: string;
  onClick?: () => void;
}) {
  return (
    <button className="bg-accent-a hover:bg-accent-b transition-colors text-accent-c w-fit py-3 px-6 rounded-md uppercase font-sans">
      {props.children}
    </button>
  );
}
