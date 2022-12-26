import React from "react";

export default function DescriptionLine(props: { children: string }) {
  return <p className="text-slate-600 text-base">{props.children}</p>;
}
