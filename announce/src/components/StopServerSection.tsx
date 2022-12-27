import React, { useState } from "react";
import { Email } from "../lib/Email";
import Button from "./Button";
import DescriptionLine from "./DescriptionLine";
import ErrorLine from "./ErrorLine";
import Section from "./Section";
import StatusLine from "./StatusLine";
import axios from "redaxios";

export default function StopServerSection() {
  const [stopped, setStopped] = useState(false);
  function stop() {
    setStopped(true);
    axios.post("/api/stop-server").then((e) => {
      location.reload();
    });
  }
  return (
    <Section label="Stop Server" index={8}>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={stop}
        disabled={stopped}
      >
        Stop Server
      </button>
    </Section>
  );
}
