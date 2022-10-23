import React from "react";
import Alert from "./Alert";

export default function ErrorAlert(props: { children: string }) {
  return (
    <Alert>
      <h3 className="text-red-400">There was a problem.</h3>
      <p className="text-mono-text">{props.children}</p>
    </Alert>
  );
}
