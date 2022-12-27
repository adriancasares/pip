import { useEffect, useState } from "react";
import Button from "./Button";
import DatePicker from "./DatePicker";
import Input from "./Input";
import Section from "./Section";

export default function SendMessageSection(props: {
  setMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    props.setMessage(message);
  }, [message]);

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
