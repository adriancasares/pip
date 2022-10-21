import React from "react";

import { ScrollFunction } from "./Paragraph";
import { motion } from "framer-motion";
export default function Carousel(props: {
  horizontal: boolean;
  count: number;
  currentSection: number;
  scrollTo(idx: number): void;
}) {
  return (
    <div
      className={`gap-10 flex ${props.horizontal ? "flex-row" : "flex-col"}`}
    >
      {Array.from({ length: props.count }, (_, i) => i).map((i) => (
        <motion.div
          layoutId={`carousel-${i}`}
          key={i}
          onClick={() => {
            props.scrollTo(i);
          }}
          className={`transition-colors rounded-full w-16 h-16 xs:w-20 xs:h-20 flex justify-center items-center border-4 border-mono-border text-2xl smed:text-3xl font-number select-none
          ${
            i === props.currentSection
              ? "bg-mono-border text-mono-a"
              : "text-mono-text-dark hover:bg-mono-border hover:text-mono-a cursor-pointer"
          }`}
        >
          {i + 1}
        </motion.div>
      ))}
    </div>
  );
}
