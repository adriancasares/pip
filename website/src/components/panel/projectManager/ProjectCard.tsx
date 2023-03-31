import { Cloudinary } from "@cloudinary/url-gen";
import React, { useEffect, useMemo, useState } from "react";
import type { Project } from "../../../types/Project";
import Editor from "../../Editor";

export default function ProjectCard(props: {
  project: Project;
  onChange: (project: Project) => void;
  open(): void;
}) {
  const [imagePublicId, setImagePublicId] = useState<string | undefined>(
    props.project.imagePublicId
  );

  const widget = useMemo(() => {
    // @ts-ignore
    const w = window["cloudinary"].createUploadWidget(
      {
        cloudName: "dlkexpc87",
        uploadPreset: "newsletter",
      },
      (error: any, result: any) => {
        if (result.event === "success") {
          setImagePublicId(result.info.public_id);
        }
      }
    );
    return w;
  }, []);

  const url = useMemo(() => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dlkexpc87",
      },
    });

    const image = cld.image(imagePublicId);

    return image.toURL();
  }, [imagePublicId]);

  const [plansContent, setPlansContent] = useState(props.project.plans ?? "");

  useEffect(() => {
    setPlansContent(props.project.plans ?? "");
  }, [props.project.plans]);

  useEffect(() => {
    props.onChange({ ...props.project, imagePublicId });
  }, [imagePublicId]);

  useEffect(() => {
    if (plansContent === props.project.plans) return;
    props.onChange({ ...props.project, plans: plansContent });
  }, [plansContent]);

  return (
    <div className="flex w-full bg-indigo-50/25 p-2 rounded-lg gap-4">
      <div className="border border-mono-border-light rounded-md max-w-sm w-full bg-white overflow-hidden shadow-sm">
        <div
          className="h-36 bg-mono-container-light flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${url})`,
          }}
        >
          {!imagePublicId && (
            <button
              className="bg-sky-500 text-white rounded-md py-2 px-4 font-os text-sm"
              onClick={() => {
                widget.open();
              }}
            >
              Upload Image
            </button>
          )}
        </div>
        <div
          className="border-t border-mono-border-light py-4 px-4 flex flex-col gap-1 hover:bg-mono-container-light cursor-pointer"
          onClick={() => {
            props.open();
          }}
        >
          <h3 className="text-lg font-medium">{props.project.name}</h3>
          <p className="text-sm text-mono-c">
            {new Date(props.project.lastUpdated).toDateString()}
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col py-4 gap-2">
        <h3 className="px-4">Plans</h3>
        <div className="w-full h-full">
          <Editor
            height={150}
            initialBody={plansContent}
            setBody={setPlansContent}
            blueBackground
          />
        </div>
      </div>
    </div>
  );
}
