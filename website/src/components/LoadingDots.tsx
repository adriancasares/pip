import React from "react";

export default function LoadingDots(props: { light?: boolean }) {
  return (
    <div className="h-6 flex items-center justify-center gap-2">
      <div
        className={`animate-loading-dot-1 h-2 w-2 rounded-full opacity-75 ${
          props.light ? "bg-white" : "bg-accent-c"
        }`}
      />
      <div
        className={`animate-loading-dot-2 h-2 w-2 rounded-full opacity-75 ${
          props.light ? "bg-white" : "bg-accent-c"
        }`}
      />
      <div
        className={`animate-loading-dot-3 h-2 w-2 rounded-full opacity-75 ${
          props.light ? "bg-white" : "bg-accent-c"
        }`}
      />
    </div>
  );
}
