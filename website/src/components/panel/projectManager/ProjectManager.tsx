import React from "react";
import ProjectView from "./ProjectView";

export default function ProjectManager() {
  return (
    <div>
      <ProjectView
        project={{
          name: "Project Name",
          id: "project-id",
          lastUpdated: Date.now(),
        }}
      />
    </div>
  );
}
