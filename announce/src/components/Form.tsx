import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import CreateMeetingSection from "./CreateMeetingSection";
import ComposeEmailSection from "./ComposeEmailSection";
import Section from "./Section";
import SendMessageSection from "./SendMessageSection";
import AddToWebsiteSection from "./AddToWebsiteSection";
import AnnounceTestSection from "./AnnounceTestSection";

export default function Form() {
  const [meeting, setMeeting] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  return (
    <MantineProvider>
      <div className="flex flex-col gap-8 p-8 items-center">
        <CreateMeetingSection setMeeting={setMeeting} />
        <ComposeEmailSection setEmail={setEmail} />
        <SendMessageSection />
        <AddToWebsiteSection meeting={meeting} />
        <AnnounceTestSection email={email} />
      </div>
    </MantineProvider>
  );
}
