import React from "react";

import { ScrollFunction } from "./Paragraph";
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
        <div
          key={i}
          onClick={() => {
            props.scrollTo(i);
          }}
          className={`transition-colors rounded-full w-20 h-20 flex justify-center items-center border-4 border-mono-border text-3xl font-number select-none
          ${
            i === props.currentSection
              ? "bg-mono-border text-mono-a"
              : "text-mono-text-dark hover:bg-mono-border hover:text-mono-a cursor-pointer"
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
