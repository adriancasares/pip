import React from "react";
import Alert from "./Alert";

export default function DoneAlert() {
  return (
    <Alert>
      <h3 className="text-mono-a">Thanks for signing up.</h3>
      <p className="text-mono-text">
        You should have recieved an email or text message. Not seeing it? Shoot
        us an email or try again.
      </p>
      <a href="/" className="text-accent-a">
        Back to Home
      </a>
    </Alert>
  );
}
