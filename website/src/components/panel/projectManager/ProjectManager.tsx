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

  const [projectId, setProjectId] = useState(
    new URL(window.location.href).searchParams.get("project")
  );

  const project = useMemo(() => {
    return projects.find((project) => project.id === projectId);
  }, [projectId, projects]);

  return (
    <div>
      {project ? (
        <ProjectView
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
        <div>
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
          <button
            onClick={() => {
              setProgressSaved("WAITING_TO_SAVE");
              setProjects([
                ...projects,
                {
                  id: generateProjectId(),
                  name: "New Project",
                  lastUpdated: Date.now(),
                },
              ]);
            }}
          >
            Add Project
          </button>
        </div>
      )}
    </div>
  );
}
