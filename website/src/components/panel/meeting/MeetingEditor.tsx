import React, { useContext, useEffect, useState } from "react";
import type Meeting from "../../../types/Meeting";
import TextInput from "../TextInput";
import MetadataTextInput from "../newsletter/MetadataTextInput";
import { get, getDatabase, off, onValue, ref, set } from "firebase/database";
import MetadataDateInput from "../newsletter/MetadataDateInput";
import Editor from "../../Editor";
import { AlertContext } from "../newsletter/EditorAlertDisplay";
import { IoArrowBack } from "react-icons/io5/index.js";
import { getAuth } from "firebase/auth";
import axios from "axios";
import LoadingSpinner from "../../LoadingSpinner";

export default function MeetingEditor(props: {
  id: string;
  close: () => void;
}) {
  const [meeting, setMeeting] = React.useState<Meeting | undefined>(undefined);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(0);
  const [slides, setSlides] = useState<string>("");

  useEffect(() => {
    const database = getDatabase();

    const draft = ref(database, "meetings/" + props.id);

    get(draft).then((snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const date = new Date(val.date);

        if (date.toString() === "Invalid Date") {
          val.date = new Date();
        }

        setMeeting({
          name: val.name || "",
          date: val.date || Date.now(),
          description: val.description || "",
          slidesUrl: val.slidesUrl || "",
        });
      }
    });
  }, []);

  useEffect(() => {
    if (meeting) {
      setName(meeting.name);
      setDate(meeting.date);
      setDescription(meeting.description);
      setSlides(meeting.slidesUrl);
    }
  }, [meeting]);

  const [progressSaved, setProgressSaved] = useState<
    "NO_CHANGES" | "WAITING_TO_SAVE" | "WAITING_TO_RECIEVE"
  >("NO_CHANGES");

  const database = getDatabase();

  useEffect(() => {
    const draft = ref(database, "meetings/" + props.id);

    onValue(draft, (snapshot) => {
      if (progressSaved === "WAITING_TO_RECIEVE") {
        return setProgressSaved("NO_CHANGES");
      } else if (progressSaved === "WAITING_TO_SAVE") {
        return;
      }

      const data = snapshot.val();

      if (data) {
        if (data.name) {
          setName(data.name);
        }
        if (data.date) {
          setDate(data.date);
        }
        if (data.description) {
          setDescription(data.description);
        }
        if (data.slidesUrl) {
          setSlides(data.slidesUrl);
        }
      }
    });

    return () => {
      off(draft);
    };
  }, [progressSaved]);

  useEffect(() => {
    return () => {
      setProgressSaved("WAITING_TO_SAVE");
    };
  }, [name, date, description, slides]);

  useEffect(() => {
    const intervalCallback = () => {
      if (progressSaved === "WAITING_TO_SAVE") {
        setProgressSaved("WAITING_TO_RECIEVE");

        set(ref(database, "meetings/" + props.id), {
          name,
          date,
          description,
          slidesUrl: slides,
        });
      }
    };
    const interval = setInterval(intervalCallback, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (progressSaved !== "NO_CHANGES") {
      const beforeunloadCallback = (e: BeforeUnloadEvent) => {
        set(ref(database, "meetings/" + props.id), {
          name,
          date,
          description,
          slidesUrl: slides,
        });

        e.preventDefault();
        e.returnValue = "Do you want to leave before saving?";
        return "Do you want to leave before saving?";
      };

      window.addEventListener("beforeunload", beforeunloadCallback);

      return () => {
        window.removeEventListener("beforeunload", beforeunloadCallback);
      };
    }
  }, [progressSaved]);

  const alerts = useContext(AlertContext);

  const [creatingSlides, setCreatingSlides] = useState(false);

  return (
    <div className="max-w-2xl w-full mx-auto flex flex-col gap-8 py-8">
      <div className="fixed z-40 top-4 left-4">
        <button
          className="bg-mono-container-light rounded-md w-12 h-12 flex justify-center items-center cursor-pointer"
          onClick={() => {
            props.close();
          }}
        >
          <IoArrowBack />
        </button>
      </div>
      <h1 className="text-4xl font-semibold">{name}</h1>
      <div>
        <MetadataTextInput label="Name" value={name} setValue={setName} />
        <MetadataDateInput label="Date" value={date} setValue={setDate} />
      </div>

      <div className="flex gap-2 flex-col">
        {creatingSlides ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex gap-2">
              {slides ? (
                <button
                  className="bg-sky-500 text-white rounded-md py-2 px-4 font-os text-sm w-fit"
                  onClick={() => {
                    window.open(slides, "_blank");
                  }}
                >
                  Present
                </button>
              ) : (
                <button
                  className="bg-sky-500 text-white rounded-md py-2 px-4 font-os text-sm w-fit"
                  onClick={() => {
                    setCreatingSlides(true);

                    getAuth()
                      .currentUser?.getIdToken()
                      .then((token) => {
                        const bodyFormData = new FormData();
                        bodyFormData.append("token", token);
                        bodyFormData.append("projectId", props.id);

                        axios({
                          method: "post",
                          url: "/api/admin/create-slides",
                          data: bodyFormData,
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }).then((res) => {
                          window.open(res.data.fileUrl, "_blank");

                          setSlides(res.data.fileUrl);

                          setCreatingSlides(false);
                        });
                      });
                  }}
                >
                  Create Slideshow
                </button>
              )}
              <button
                className="border border-mono-border-light text-mono-c rounded-md py-2 px-4 font-os text-sm w-fit"
                onClick={() => {
                  alerts.addAlert({
                    name: "Enter Slideshow URL",
                    defaultValue: slides,
                    type: "INPUT",
                    // @ts-ignore
                    callback: (url) => {
                      setSlides(url);
                    },
                  });
                }}
              >
                Add Existing Slideshow
              </button>
            </div>
            {slides && <p className="text-xs font-os text-mono-c">{slides}</p>}
          </>
        )}
      </div>
      <div className="flex-col gap-4 flex">
        <p>
          <b>Description</b>
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write stuff here."
          className="w-full h-36 border-0 bg-indigo-50/25 focus:bg-indigo-50/50 rounded-lg outline-none p-4 resize-none"
        />
      </div>
    </div>
  );
}
