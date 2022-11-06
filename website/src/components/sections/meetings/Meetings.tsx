import Meeting, { MeetingData } from "./Meeting";
import PreviousMeetings from "./PreviousMeetings";
import MeetingHeader from "./MeetingHeader";

export default function Meetings(props: { meetings: MeetingData[] }) {
	const meetings = Astro.props.meetings.sort((a, b) => {
		return Date.parse(b.date) - Date.parse(a.date);
	});
	
	const isUpcoming = (date: string) => {
		return Date.parse(date) > Date.now();
	}

	return <section id="header" class="w-full bg-section-bg-purple py-20 flex flex-col gap-10">

				<MeetingHeader>Meetings</MeetingHeader>
					
				<div class="flex flex-col w-fit mx-auto">
						
						{ meetings.splice(0, 2).map((meeting, idx) => {
							return <Meeting upcoming={isUpcoming(meeting.date)} {...meeting} />
						})}

					<PreviousMeetings meetings={meetings} />

				</div>
			</section>;
}
