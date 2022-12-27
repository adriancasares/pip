import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import CreateMeetingSection from "./CreateMeetingSection";
import ComposeEmailSection from "./ComposeEmailSection";
import Section from "./Section";
import SendMessageSection from "./SendMessageSection";
import AddToWebsiteSection from "./AddToWebsiteSection";
import TestEmailSection from "./TestEmailSection";
import TestMessageSection from "./TestMessageSection";

export default function Form() {
  const [meeting, setMeeting] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [textMessage, setTextMessage] = useState(undefined);
  return (
    <MantineProvider>
      <div className="flex flex-col gap-8 p-8 items-center">
        <CreateMeetingSection setMeeting={setMeeting} />
        <ComposeEmailSection setEmail={setEmail} />
        <SendMessageSection setMessage={setTextMessage} />
        <AddToWebsiteSection meeting={meeting} />
        <TestEmailSection email={email} />
        <TestMessageSection message={textMessage} />
      </div>
    </MantineProvider>
  );
}
