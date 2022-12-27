import React from "react";
import { IoCloseCircle } from "react-icons/io5/index.js";
import ReactLoading from "react-loading";

export default function StatusLine(props: {
  label: string;
  status: "IDLE" | "LOADING" | "ERROR";
}) {
  return (
    <div className="flex gap-2 bg-slate-200 p-2 rounded-md items-center">
      <p>{props.label}</p>
      {props.status !== "IDLE" && (
        <div>
          {props.status === "ERROR" ? (
            <IoCloseCircle className="text-lg text-red-500" />
          ) : (
            <ReactLoading type="spin" color="#000" height={15} width={15} />
          )}
        </div>
      )}
    </div>
  );
}
