import React from "react";

export default function Carousel(props: { count: number }) {
  return (
    <div className="gap-10 flex flex-col">
      {Array.from({ length: props.count }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          className="rounded-full w-20 h-20 text-mono-text-dark flex justify-center items-center border-4 border-mono-border text-3xl font-number select-none"
        >
          {i}
        </div>
      ))}
    </div>
  );
}
