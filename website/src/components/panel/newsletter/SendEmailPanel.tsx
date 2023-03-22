import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import PanelWrapper from "./PanelWrapper";
import axios from "axios";
import { getAuth } from "firebase/auth";

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
          // post request to /api/admin/send-test-newsletter/:id
          axios
            .post("/api/admin/send-test-newsletter", {
              token,
              projectId: props.projectId,
            })
            .then((res) => {
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
            <div className="max-w-xl w-full relative h-3 bg-mono-container-light">
              <p>{emailStatus}</p>
              <div
                className="relative top-0 left-0 w-full h-full from-blue-500 to-indigo-500 bg-gradient-to-r rounded-full"
                style={{
                  width: emailStatus === "WAITING" ? "0%" : "70%",
                  transition: "width 8s",
                }}
              ></div>
            </div>
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
