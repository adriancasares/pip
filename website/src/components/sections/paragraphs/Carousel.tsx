import React from "react";

export default function Carousel(props: {
  count: number;
  currentSection: number;
}) {
  return (
    <div className="gap-10 flex flex-col">
      {Array.from({ length: props.count }, (_, i) => i).map((i) => (
        <div
          key={i}
          className={`transition-colors rounded-full w-20 h-20 flex justify-center items-center border-4 border-mono-border text-3xl font-number select-none
          ${
            i === props.currentSection
              ? "bg-mono-border text-mono-a"
              : "text-mono-text-dark"
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
