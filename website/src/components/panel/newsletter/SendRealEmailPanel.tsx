import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import PanelWrapper from "./PanelWrapper";
import axios from "axios";
import { getAuth } from "firebase/auth";
import TextInput from "../TextInput";

export default function SendRealEmailPanel(props: {
  onClose: () => void;
  show: boolean;
  progressSaved: "NO_CHANGES" | "WAITING_TO_SAVE" | "WAITING_TO_RECIEVE";
  projectId: string;
}) {
  const [progress, setProgress] = useState(0);

  const [emailStatus, setEmailStatus] = useState<
    "WAITING" | "ON_CONFIRM_TIMER" | "WAITING_TO_CONFRIM" | "SENDING" | "SENT"
  >("WAITING");

  const [members, setMembers] = useState<any[] | undefined>(undefined);

  const [currentSendToText, setCurrentSendToText] =
    useState("Waiting to Send...");

  useEffect(() => {
    if (props.progressSaved === "NO_CHANGES" && props.show) {
      setTimeout(() => {
        setEmailStatus("ON_CONFIRM_TIMER");
      }, 0);
      return;
    } else {
      setEmailStatus("WAITING");
    }
  }, [props.progressSaved, props.show]);

  useEffect(() => {
    if (emailStatus === "ON_CONFIRM_TIMER") {
      getAuth()
        .currentUser?.getIdToken()
        .then((token) => {
          const bodyFormData = new FormData();
          bodyFormData.append("token", token);

          axios({
            method: "post",
            url: "/api/admin/get-email-list",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          }).then((res) => {
            setMembers(res.data.members);
          });
        });

      const t = setTimeout(() => {
        setEmailStatus("WAITING_TO_CONFRIM");
      }, 5000);

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
          async function sendEmails() {
            if (!members) return;

            for (let i = 0; i < members.length; i++) {
              const member = members[i];

              const bodyFormData = new FormData();
              bodyFormData.append("token", token);
              bodyFormData.append("email", member.email);
              bodyFormData.append("name", member.name);
              bodyFormData.append("projectId", props.projectId);

              setCurrentSendToText(`Sending to ${member.email}`);
              await axios({
                method: "post",
                url: "/api/admin/send-real-newsletter",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
              });

              setProgress((e) => {
                return e + 1 / members.length;
              });
            }
          }
          sendEmails().then(() => {
            setCurrentSendToText("Emails Sent");
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
            {emailStatus === "ON_CONFIRM_TIMER" ||
            emailStatus === "WAITING_TO_CONFRIM" ? (
              <div className="flex flex-col gap-4 font-os text-mono-c text-base items-center">
                <p className="text-2xl text-mono-text-dark">
                  Are you sure you want to send this newsletter?
                </p>
                {members ? (
                  <p>
                    This will send an email to {members.length} members of the
                    club.
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="flex gap-4">
                  <button
                    disabled={emailStatus === "ON_CONFIRM_TIMER"}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md font-os text-base disabled:opacity-50"
                    onClick={() => {
                      if (emailStatus === "ON_CONFIRM_TIMER") {
                        return;
                      }
                      setEmailStatus("SENDING");
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-mono-container-light text-mono-text-dark px-4 py-2 rounded-md font-os text-base"
                    onClick={() => {
                      props.onClose();
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    opacity: emailStatus === "SENT" ? 0 : 1,
                    transition: "opacity 1s ease-out",
                  }}
                >
                  <p>{currentSendToText}</p>
                  <div className="max-w-xl w-full relative h-3 bg-mono-container-light">
                    <div
                      className="relative top-0 left-0 w-full h-full from-blue-500 to-indigo-500 bg-gradient-to-r rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        transition:
                          emailStatus === "SENT"
                            ? "width 2s ease-out, opacity 1s ease-out"
                            : "width 8s ease-in-out",
                        opacity: emailStatus === "SENT" ? 0 : 1,
                      }}
                    ></div>
                  </div>
                </div>
                {emailStatus === "SENT" && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="flex flex-col gap-4 font-os text-mono-c text-base items-center">
                      <p className="text-2xl text-mono-text-dark">
                        Emails Sent
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
              </>
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
