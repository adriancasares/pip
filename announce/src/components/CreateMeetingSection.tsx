import { useEffect, useState } from "react";
import { Meeting } from "../lib/Meeting";
import Button from "./Button";
import DatePicker from "./DatePicker";
import DescriptionLine from "./DescriptionLine";
import Input from "./Input";
import Section from "./Section";

export default function CreateMeetingSection(props: {
  setMeeting: (meeting: Meeting) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    props.setMeeting({
      title: title,
      description: description,
      slides: slides,
      date: date,
    });
  }, [title, description, slides, date]);

  return (
    <Section label="Create Meeting" index={1}>
      <DescriptionLine>
        Enter details about the meeting for the website calendar.
      </DescriptionLine>

      <Input label="Title" value={title} onChange={setTitle} />
      <Input
        label="Description"
        value={description}
        onChange={setDescription}
        large={true}
      />
      <Input label="Slides" value={slides} onChange={setSlides} />
      <div className="flex gap-2">
        <DatePicker label="Date" value={date} onChange={setDate} />
      </div>
    </Section>
  );
}
