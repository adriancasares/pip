import type React from "react";
import Button from "../Button";

export default function Alert(props: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-10">
      <div className="border border-mono-border rounded-md p-10 flex flex-col gap-4">
        {props.children}
      </div>
    </div>
  );
}
