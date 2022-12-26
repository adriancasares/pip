import { useState } from "react";
import Button from "./Button";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Section from "./Section";

export default function SendMessageSection() {
  const [message, setMessage] = useState("");

  return (
    <Section label="Send Message" index={3}>
      <p>Enter a message to send via SMS.</p>

      <Input
        label="Message"
        value={message}
        onChange={setMessage}
        large={true}
      />
    </Section>
  );
}
