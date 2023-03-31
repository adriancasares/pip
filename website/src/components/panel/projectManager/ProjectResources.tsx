import React from "react";
import ProjectResourceOption from "./ProjectResourceOption";

export default function ProjectResources(props: {
  resources: {
    name: string;
    open: () => void;
    create: () => void;
    complete: boolean;
    changeComplete: (arg0: boolean) => void;
    exists: boolean;
    loading: boolean;
  }[];
}) {
  const current = props.resources.filter(
    (resource) => resource.exists && !resource.complete
  );
  const completed = props.resources.filter(
    (resource) => resource.exists && resource.complete
  );
  const notCreated = props.resources.filter((resource) => !resource.exists);
  return (
    <div className="max-w-lg border border-mono-border-light p-2 rounded-lg">
      {current.length > 0 && (
        <div className="py-4 relative">
          <hr />
          <p className="absolute top-1/2 -translate-y-1/2 left-6 bg-white text-xs font-os p-2 text-mono-c">
            Current
          </p>
        </div>
      )}
      {current.map((resource) => (
        <ProjectResourceOption
          loading={resource.loading}
          label={resource.name}
          onClick={resource.open}
          status="CURRENT"
          onChangeComplete={resource.changeComplete}
        />
      ))}
      {completed.length > 0 && (
        <div className="py-4 relative">
          <hr />
          <p className="absolute top-1/2 -translate-y-1/2 left-6 bg-white text-xs font-os p-2 text-mono-c">
            Completed
          </p>
        </div>
      )}
      {completed.map((resource) => (
        <ProjectResourceOption
          label={resource.name}
          loading={resource.loading}
          onClick={resource.open}
          status="COMPLETED"
          onChangeComplete={resource.changeComplete}
        />
      ))}
      {notCreated.length > 0 && (
        <div className="py-4 relative">
          <hr />
          <p className="absolute top-1/2 -translate-y-1/2 left-6 bg-white text-xs font-os p-2 text-mono-c">
            Add Another Resource
          </p>
        </div>
      )}
      {notCreated.map((resource) => (
        <ProjectResourceOption
          loading={resource.loading}
          faded
          status="NOT_CREATED"
          label={resource.name}
          onClick={resource.create}
          onChangeComplete={resource.changeComplete}
        />
      ))}
    </div>
  );
}
