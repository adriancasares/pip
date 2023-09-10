import Meeting, { MeetingData } from "./Meeting";
import PreviousMeetings from "./PreviousMeetings";
import MeetingHeader from "./MeetingHeader";

export default function Meetings(props: { meetings: MeetingData[] }) {
  const meetings = props.meetings;

  const isUpcoming = (date: string) => {
    return Date.parse(date) > Date.now() || date === "";
  };

  return (
    <section
      id="header"
      className="w-full bg-section-bg-purple py-20 flex flex-col gap-10"
    >
      <MeetingHeader>Meetings</MeetingHeader>

      <div className="flex flex-col w-fit mx-auto">
        {meetings.slice(0, 2).map((meeting, idx) => {
          return (
            <Meeting
              key={idx}
              upcoming={isUpcoming(meeting.date)}
              {...meeting}
            />
          );
        })}

        <PreviousMeetings meetings={meetings.slice(2)} />
      </div>
    </section>
  );
}
