import React from "react";
import { Email } from "../lib/Email";
import DescriptionLine from "./DescriptionLine";
import Section from "./Section";

export default function AnnounceTestSection(props: { email: Email }) {
  return (
    <Section index={5} label="Send Test Announcements">
      <DescriptionLine>
        Send emails and text messages to certain people to test your
        announcement.
      </DescriptionLine>
    </Section>
  );
}
