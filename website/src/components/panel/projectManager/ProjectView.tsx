import React from "react";
import type { Project } from "../../../types/Project";

export default function ProjectView(props: { project: Project }) {
  return (
    <div className="border border-mono-border-light rounded-md max-w-sm">
      <div className="h-36 bg-mono-container-light flex items-center justify-center">
        <button className="bg-sky-500 text-white rounded-md py-2 px-4 font-os text-sm">
          Upload Image
        </button>
      </div>
      <div className="border-t border-mono-border-light py-4 px-4 flex flex-col gap-1">
        <h3 className="text-lg font-medium">{props.project.name}</h3>
        <p className="text-sm text-mono-c">
          {new Date(props.project.lastUpdated).toDateString()}
        </p>
      </div>
    </div>
  );
}
