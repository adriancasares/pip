import { Cloudinary } from "@cloudinary/url-gen";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { IoArrowBack, IoTrashBinOutline } from "react-icons/io5/index.js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import type { Project } from "../../../types/Project";
import CreateNewsletterPanel from "../newsletter/CreateNewsletterPanel";
import MetadataTextInput from "../newsletter/MetadataTextInput";
import ProjectResourceOption from "./ProjectResourceOption";
import axios from "axios";
import { AlertContext } from "../newsletter/EditorAlertDisplay";

export default function ProjectView(props: {
  project: Project;
  onChange: (project: Project | null) => void;
  close: () => void;
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
          props.onChange({ ...props.project, imagePublicId });
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

  useEffect(() => {
    props.onChange({ ...props.project, imagePublicId });
  }, [imagePublicId]);

  const [hasNewsletter, setHasNewsletter] = useState(false);
  const hasNotes = useMemo(
    () => props.project.notesUrl != null,
    [props.project]
  );
  const [loadingNotes, setLoadingNotes] = useState(false);

  const database = getDatabase();

  useEffect(() => {
    get(ref(database, `newsletterDrafts/${props.project.id}`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          setHasNewsletter(true);
        }
      }
    );
  }, []);

  // from url ?projectView
  const [view, setView] = useState<string | undefined>(
    new URLSearchParams(window.location.search).get("projectView") ?? undefined
  );

  const alerts = useContext(AlertContext);

  return (
    <div>
      {(() => {
        if (view === "newsletter") {
          return (
            <CreateNewsletterPanel
              id={props.project.id}
              close={() => {
                setView(undefined);
                const url = new URL(window.location.href);
                url.searchParams.delete("projectView");
                window.history.pushState({}, "", url.toString());
              }}
            />
          );
        } else {
          return (
            <div className="max-w-lg w-full mx-auto flex flex-col gap-4 py-4">
              <div className="fixed z-50 top-4 left-4">
                <button
                  className="bg-mono-container-light rounded-md w-12 h-12 flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    props.close();
                  }}
                >
                  <IoArrowBack />
                </button>
              </div>
              <div
                className="w-full h-48 bg-mono-container-light rounded-lg relative bg-cover flex justify-center items-center group object-center bg-center"
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
                {imagePublicId && (
                  <button
                    className="absolute bottom-2 right-2 py-1 px-2 bg-mono-container-light text-xs font-os rounded-md text-mono-c opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setImagePublicId("");
                    }}
                  >
                    Reset Image
                  </button>
                )}
              </div>
              <div>
                {props.project.name ? (
                  <h1 className="text-4xl font-semibold">
                    {props.project.name}
                  </h1>
                ) : (
                  <h1 className="text-4xl font-semibold text-mono-c">
                    Untitled Project
                  </h1>
                )}
              </div>

              <MetadataTextInput
                label="Name"
                value={props.project.name}
                setValue={(v) => {
                  props.onChange({ ...props.project, name: v });
                }}
              />

              <h3 className="text-lg font-medium">Resources</h3>
              <div className="max-w-lg border border-mono-border-light p-2 rounded-lg cursor-pointer">
                {hasNewsletter && (
                  <ProjectResourceOption
                    label="Newsletter"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("projectView", "newsletter");
                      history.pushState({}, "", url.toString());
                      setView("newsletter");
                    }}
                  />
                )}
                {hasNotes && (
                  <ProjectResourceOption
                    label="Notes"
                    onClick={() => {
                      window.open(props.project.notesUrl, "_blank");
                    }}
                  />
                )}
                <div className="py-4 relative">
                  <hr />
                  <p className="absolute top-1/2 -translate-y-1/2 left-6 bg-white text-xs font-os p-2 text-mono-c">
                    Add Another Resource
                  </p>
                </div>
                {!hasNewsletter && (
                  <ProjectResourceOption
                    faded
                    label="Newsletter"
                    onClick={() => {
                      set(
                        ref(database, `newsletterDrafts/${props.project.id}`),
                        {
                          name: props.project.name + " Newsletter",
                          slug: "",
                          date: Date.now(),
                          author: "",
                          sections: [],
                        }
                      );

                      const url = new URL(window.location.href);
                      url.searchParams.set("projectView", "newsletter");
                      history.pushState({}, "", url.toString());

                      setHasNewsletter(true);
                      setView("newsletter");
                    }}
                  />
                )}
                {!hasNotes && (
                  <ProjectResourceOption
                    faded
                    loading={loadingNotes}
                    label="Notes"
                    onClick={() => {
                      setLoadingNotes((l) => {
                        if (!l) {
                          getAuth()
                            .currentUser?.getIdToken()
                            .then((token) => {
                              const bodyFormData = new FormData();
                              bodyFormData.append("token", token);
                              bodyFormData.append(
                                "projectId",
                                props.project.id
                              );

                              axios({
                                method: "post",
                                url: "/api/admin/create-notes",
                                data: bodyFormData,
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                },
                              }).then((res) => {
                                window.open(res.data.fileUrl, "_blank");

                                props.onChange({
                                  ...props.project,
                                  notesUrl: res.data.fileUrl,
                                });

                                setLoadingNotes(false);
                              });
                            });
                        }
                        return true;
                      });
                    }}
                  />
                )}
              </div>
              <div
                className="text-xs text-red-400 flex gap-2 items-center cursor-pointer hover:underline"
                onClick={() => {
                  alerts.addAlert({
                    name: "Are you sure you want to remove this project and all of its resources?",
                    callback(arg0) {
                      if (arg0) {
                        props.onChange(null);
                        props.close();
                      }
                    },
                  });
                }}
              >
                <p>Remove Project</p>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}
