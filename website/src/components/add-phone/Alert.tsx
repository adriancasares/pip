import type React from "react";
import Button from "../Button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Alert(props: { children: React.ReactNode }) {
  const [hover, sethover] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-10 origin-top animate-fade-in-down transition-all duration-1000">
      <div className="border border-mono-border rounded-md p-10 flex flex-col gap-4">
        {props.children}
      </div>
    </div>
  );
}
