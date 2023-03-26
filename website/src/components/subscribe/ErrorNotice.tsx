import React from "react";

export default function ErrorNotice(props: { children: string }) {
  return (
    <div className="bg-red-50 border border-red-400 rounded-lg text-red-500 fixed top-4 left-1/2 -translate-x-1/2 z-10 max-w-md w-full py-2 px-4">
      {props.children}
    </div>
  );
}
