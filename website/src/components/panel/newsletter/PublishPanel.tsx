import React, { useEffect } from "react";
import PanelWrapper from "./PanelWrapper";
import LoadingSpinner from "../../LoadingSpinner";
import axios from "axios";
import { getAuth } from "firebase/auth";
export default function PublishPanel(props: {
  onClose: () => void;
  show: boolean;
  progressSaved: "NO_CHANGES" | "WAITING_TO_SAVE" | "WAITING_TO_RECIEVE";
  projectId: string;
}) {
  useEffect(() => {
    // get token
    getAuth()
      .currentUser?.getIdToken()
      .then((token) => {
        const bodyFormData = new FormData();
        bodyFormData.append("token", token);
        bodyFormData.append("projectId", props.projectId);

        axios({
          method: "post",
          url: "/api/admin/publish-newsletter",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          props.onClose();
        });
      });
  }, [props.progressSaved, props.show]);

  return (
    <div>
      <PanelWrapper show={props.show} onClose={props.onClose}>
        {props.progressSaved === "NO_CHANGES" ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col gap-4 font-os text-mono-c text-base items-center">
              <LoadingSpinner />
              <p>Updating published version...</p>
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
