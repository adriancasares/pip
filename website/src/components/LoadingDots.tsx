import React from "react";

export default function LoadingDots() {
  return (
    <div className="h-6 flex items-center justify-center gap-2">
      <div className="animate-loading-dot-1 h-2 w-2 rounded-full bg-accent-c opacity-75"></div>
      <div className="animate-loading-dot-2 h-2 w-2 rounded-full bg-accent-c opacity-75"></div>
      <div className="animate-loading-dot-3 h-2 w-2 rounded-full bg-accent-c opacity-75"></div>
    </div>
  );
}
