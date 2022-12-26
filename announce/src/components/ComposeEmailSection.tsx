import React, { lazy, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Section from "./Section";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.bubble.css";
import Editor from "./Editor";
import { Meeting } from "../lib/Meeting";
import { Email } from "../lib/Email";

export default function ComposeEmailSection(props: {
  setEmail: (email: Email) => void;
}) {
  const [title, setTitle] = useState("Tomorrow at PIP: ");
  const [text, setText] = useState("We'll be covering...");

  const [body, setBody] = useState("");

  useEffect(() => {
    props.setEmail({
      title: title,
      body: body,
      text: text,
    });
  }, [title, body]);

  return (
    <Section label="Compose Email" index={2}>
      <p>Write the email to send to PIP members.</p>

      <Input label="Subject" value={title} onChange={setTitle} />
      <Input label="Text" value={text} onChange={setText} />
      <Editor setBody={setBody} />
    </Section>
  );
}
