import React, { useEffect, useMemo, useState } from "react";
import type { Project } from "../../../types/Project";
import ProjectCard from "./ProjectCard";
import { getDatabase, ref, set, onValue, off, get } from "firebase/database";
import ProjectView from "./ProjectView";

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);

  const database = getDatabase();

  useEffect(() => {
    const draft = ref(database, "projects");

    get(draft).then((snapshot) => {
      if (snapshot.exists()) {
        setProjects(snapshot.val());
      }
    });
  }, []);

  const [progressSaved, setProgressSaved] = useState<
    "NO_CHANGES" | "WAITING_TO_SAVE" | "WAITING_TO_RECIEVE"
  >("NO_CHANGES");

  useEffect(() => {
    const draft = ref(database, "projects");

    onValue(draft, (snapshot) => {
      if (progressSaved === "WAITING_TO_RECIEVE") {
        return setProgressSaved("NO_CHANGES");
      } else if (progressSaved === "WAITING_TO_SAVE") {
        return;
      }

      const data = snapshot.val();

      if (data) {
        setProjects(data);
      }
    });

    return () => {
      off(draft);
    };
  }, [progressSaved]);

  useEffect(() => {
    const intervalCallback = () => {
      if (progressSaved === "WAITING_TO_SAVE") {
        setProgressSaved("WAITING_TO_RECIEVE");

        set(ref(database, "projects"), projects);
      }
    };
    const interval = setInterval(intervalCallback, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  const generateProjectId = () => {
    return Math.random().toString(16).substring(2, 8);
  };

  const [projectId, setProjectId] = useState<string | undefined>(
    new URL(window.location.href).searchParams.get("project") ?? undefined
  );

  const project = useMemo(() => {
    return projects.find((project) => project.id === projectId);
  }, [projectId, projects]);

  return (
    <div>
      {project ? (
        <ProjectView
          close={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("project");
            window.history.pushState({}, "", url.toString());
            setProjectId(undefined);
          }}
          project={project}
          onChange={(project) => {
            const newProjects = [...projects];
            newProjects[projects.findIndex((p) => p.id === project.id)] =
              project;
            setProjects(newProjects);

            setProgressSaved("WAITING_TO_SAVE");
          }}
        />
      ) : (
        <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
          <h1 className="text-3xl font-bold pt-10">Projects</h1>
          <hr />
          <button
            className="bg-gray-800 text-white rounded-md py-2 px-4 font-os text-sm w-fit"
            onClick={() => {
              setProgressSaved("WAITING_TO_SAVE");
              setProjects([
                ...projects,
                {
                  id: generateProjectId(),
                  name: "New Project",
                  lastUpdated: Date.now(),
                  imagePublicId: "",
                },
              ]);
            }}
          >
            Add Project
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => {
              return (
                <ProjectCard
                  open={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("project", project.id);
                    window.history.pushState({}, "", url.toString());
                    setProjectId(project.id);
                  }}
                  project={project}
                  onChange={(project) => {
                    const newProjects = [...projects];
                    newProjects[index] = project;
                    setProjects(newProjects);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
