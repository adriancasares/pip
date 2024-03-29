import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import PanelWrapper from "./PanelWrapper";
import axios from "axios";
import { getAuth } from "firebase/auth";
import TextInput from "../TextInput";

export default function SendEmailPanel(props: {
  onClose: () => void;
  show: boolean;
  progressSaved: "NO_CHANGES" | "WAITING_TO_SAVE" | "WAITING_TO_RECIEVE";
  projectId: string;
}) {
  const [progress, setProgress] = useState(0);

  const [emailStatus, setEmailStatus] = useState<
    "WAITING" | "ON_SEND_TIMER" | "SENDING" | "SENT"
  >("WAITING");

  useEffect(() => {
    if (props.progressSaved === "NO_CHANGES" && props.show) {
      setTimeout(() => {
        setEmailStatus("ON_SEND_TIMER");
      }, 0);
      return;
    } else {
      setEmailStatus("WAITING");
    }
  }, [props.progressSaved, props.show]);

  useEffect(() => {
    if (emailStatus === "ON_SEND_TIMER") {
      const t = setTimeout(() => {
        setEmailStatus("SENDING");
      }, 1000);

      return () => {
        clearTimeout(t);
      };
    }
  }, [emailStatus]);

  useEffect(() => {
    if (emailStatus === "SENDING") {
      getAuth()
        .currentUser?.getIdToken()
        .then((token) => {
          const bodyFormData = new FormData();
          bodyFormData.append("token", token);
          bodyFormData.append("projectId", props.projectId);

          axios({
            method: "post",
            url: "/api/admin/send-test-newsletter",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          }).then((res) => {
            setEmailStatus("SENT");
          });
        });
    }
  }, [emailStatus]);

  return (
    <div>
      <PanelWrapper show={props.show} onClose={props.onClose}>
        {props.progressSaved === "NO_CHANGES" ? (
          <div className="flex items-center justify-center h-full">
            <div
              className="max-w-xl w-full relative h-3 bg-mono-container-light"
              style={{
                opacity: emailStatus === "SENT" ? 0 : 1,
                transition: "opacity 1s ease-out",
              }}
            >
              <div
                className="relative top-0 left-0 w-full h-full from-blue-500 to-indigo-500 bg-gradient-to-r rounded-full"
                style={{
                  width:
                    emailStatus === "WAITING"
                      ? "2%"
                      : emailStatus === "SENT"
                      ? "100%"
                      : "70%",
                  transition:
                    emailStatus === "SENT"
                      ? "width 2s ease-out, opacity 1s ease-out"
                      : "width 8s ease-in-out",
                  opacity: emailStatus === "SENT" ? 0 : 1,
                }}
              ></div>
            </div>
            {emailStatus === "SENT" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="flex flex-col gap-4 font-os text-mono-c text-base items-center">
                  <p className="text-2xl text-mono-text-dark">Email Sent</p>
                  <p className="text-sm">
                    You should receive an email shortly at{" "}
                    {getAuth().currentUser?.email}.
                  </p>
                  {
                    <button
                      className="bg-indigo-500 text-white px-4 py-2 rounded-md font-os text-sm"
                      onClick={() => {
                        props.onClose();
                      }}
                    >
                      Close
                    </button>
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col gap-4 font-os text-mono-c text-base items-center">
              <LoadingSpinner />
              <p>Saving progress...</p>
            </div>
          </div>
        )}
      </PanelWrapper>
    </div>
  );
}
