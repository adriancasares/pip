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

  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");

  const BODY_PRESET =
    "<p>Hi {NAME}, this is a reminder about the PIP meeting tomorrow:</p><p>We'll be <strong>(Sentence)</strong> in Room 505 tomorrow at lunch. <strong>(Additional Sentence)</strong>.</p><p><strong>(Closing)</strong>,</p><p><strong>(Your Name)</strong></p>";
  const FOOTER_PRESET =
    "<p>We send announcements about upcoming meetings so you're in the know. If you're not a part of PIP anymore, just reply to this email and we'll update our list.</p>";

  useEffect(() => {
    props.setEmail({
      from: senderAddress,
      sender: senderName,
      title: title,
      body: body,
      text: text,
      footer: footer,
    });
  }, [title, body, footer]);

  return (
    <Section label="Compose Email" index={2}>
      <p>Write the email to send to PIP members.</p>

      <Input label="Subject" value={title} onChange={setTitle} />
      <Input label="Text" value={text} onChange={setText} />
      <Input label="Sender Name" value={senderName} onChange={setSenderName} />
      <Input
        label="Sender Address"
        value={senderAddress}
        onChange={setSenderAddress}
      />
      <Editor setBody={setBody} label="Body" preset={BODY_PRESET} />
      <Editor setBody={setFooter} label="Footer" preset={FOOTER_PRESET} />
    </Section>
  );
}
