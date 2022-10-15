import React from "react";

export interface MeetingData {
  description: string;
  date: string;
  slides?: string;
}

export default function Meeting(props: {
  description: string;
  date: string;
  slides?: string;
  status: "NEXT" | "LAST" | "PAST";
}) {
  const { description, date, slides, status } = props;
  const localDate = new Date(Date.parse(date.replaceAll("-", "/")));

  return (
    <div className="py-10 border-t-4 border-t-black/30 md:border-t-0 mx-auto max-w-4xl px-10 flex flex-col md:flex-row md:justify-between gap-4">
      <div className="flex flex-col xs:flex-row gap-8">
        <div
          className={`select-none shrink-0 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl bg-gradient-to-tr ${
            status === "NEXT"
              ? "from-gradient-cyan-from to-gradient-cyan-to"
              : "from-gradient-purple-from/25 to-gradient-purple-to/25"
          }`}
        >
          <p
            className={`text-mono-a font-number text-4xl md:text-5xl ${
              status === "NEXT" ? "" : "opacity-50"
            }`}
          >
            {localDate.getDate()}
          </p>
        </div>

        <div className="flex flex-col gap-2 md:max-w-sm">
          <p className="font-title text-mono-a text-lg select-text">
            {status === "NEXT" && "Next Meeting"}
            {status === "LAST" && "Last Meeting"}
            {status === "PAST" && "Previous Meeting"}
          </p>
          <p className="font-sans text-mono-b whitespace-normal">
            {props.description}
          </p>
        </div>
      </div>
      <div className="flex xs:ml-28 md:ml-0 md:flex-col gap-4 items-end whitespace-nowrap flex-wrap">
        <p className="font-sans text-mono-b bg-mono-border py-4 px-6 rounded-full md:bg-transparent md:py-0 md:px-0 md:rounded-none">
          {localDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div>
          {slides ? (
            <a
              href={slides}
              className="hover:underline block text-accent-a bg-mono-border py-4 px-6 rounded-full md:bg-transparent md:py-0 md:px-0 md:rounded-none"
            >
              <span>Slides</span>
            </a>
          ) : (
            <p className="bg-mono-border py-4 px-6 rounded-full md:bg-transparent md:py-0 md:px-0 md:rounded-none">
              No slides yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
