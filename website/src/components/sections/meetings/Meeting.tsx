import { useScroll, useTransform } from "framer-motion";
import React from "react";
import MeetingTag from "./MeetingTag";

export interface MeetingData {
  title: string;
  description: string;
  date: string;
  slides?: string;
  dateLabel?: string;
}

export default function Meeting(props: {
  title: string;
  description: string;
  date: string;
  slides?: string;
  dateLabel?: string;
  upcoming: boolean;
}) {
  const { description, date, slides, upcoming } = props;

  const localDate = new Date(Date.parse(date));

  return (
    <div className="py-10 border-t-4 border-t-black/30 md:border-t-0 max-w-4xl px-10 flex flex-col md:flex-row md:justify-between gap-4">
      <div className="flex flex-col xs:flex-row gap-8">
        <div
          className={`select-none shrink-0 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl bg-gradient-to-tr ${
            upcoming
              ? "from-gradient-cyan-from to-gradient-cyan-to"
              : "from-gradient-purple-from/25 to-gradient-purple-to/25"
          }`}
        >
          {localDate.getTime() ? (
            <div>
              <p className="text-mono-a font-title uppercase text-md text-center">
                {localDate.toLocaleDateString("en-US", {
                  month: "short",
                })}
              </p>
              <p
                className={`text-mono-a font-number text-3xl md:text-4xl ${
                  upcoming ? "" : "opacity-50"
                }`}
              >
                {localDate.getDate()}
              </p>
            </div>
          ) : (
            <p className="text-mono-b font-title uppercase text-3xl text-center">
              TBD
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:max-w-sm">
          <div className="flex gap-2 items-center">
            <p className="font-title text-mono-a text-lg select-text">
              {props.title}
            </p>
            {upcoming && <MeetingTag>Upcoming</MeetingTag>}
          </div>
          <p className="font-sans text-mono-b whitespace-normal">
            {props.description}
          </p>
        </div>
      </div>
      <div className="flex xs:ml-28 md:ml-0 md:flex-col gap-4 items-end whitespace-nowrap flex-wrap w-40">
        <p className="font-sans text-mono-b bg-mono-border py-4 px-6 rounded-full md:bg-transparent md:py-0 md:px-0 md:rounded-none">
          {props.dateLabel}
        </p>
        {/* <div>
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
        </div> */}
      </div>
    </div>
  );
}
