import React, { useState, useRef, useEffect } from "react";
import Meeting, { MeetingData } from "./Meeting";
import { motion } from "framer-motion";
import { IoChevronDownOutline } from "react-icons/io5";

export default function PreviousMeetings(props: {
  meetings: MeetingData[];
  lastMeeting: number;
}) {
  const { meetings, lastMeeting } = props;

  const [show, setShow] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (show) {
      scrollRef.current.scrollIntoView();
    }
  }, [show]);

  if (meetings.length === 0) return <></>;

  return (
    <div>
      <div className="w-fit mx-auto">
        <motion.button
          onClick={() => {
            setShow(!show);
          }}
          animate={show ? "showing" : "hiding"}
          className="bg-section-bg-purple-lighter text-mono-text py-4 px-8 rounded-full flex gap-2 items-center relative group"
          whileHover={{ paddingLeft: "32px", paddingRight: "60px" }}
          variants={{
            hiding: {},
            showing: { paddingLeft: "32px", paddingRight: "60px" },
          }}
        >
          {!show && <span>Load More</span>}
          {show && <span>Collapse</span>}
          <motion.span
            className={`absolute right-8 ${
              show ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } transition-opacity`}
            animate={show ? "showing" : "hiding"}
            variants={{
              hiding: { rotate: 0 },
              showing: { rotate: 180 },
            }}
          >
            <IoChevronDownOutline />
          </motion.span>
        </motion.button>
      </div>

      {show && (
        <div>
          {meetings.map((meeting, idx) => {
            return (
              <motion.div
                initial={{
                  opacity: 0,
                  translateX: -20,
                  translateY: -50,
                }}
                animate={{
                  opacity: 100,
                  translateX: 0,
                  translateY: 0,
                }}
                transition={{
                  delay: 0.35,
                }}
              >
                <Meeting
                  status={(() => {
                    if (idx + 2 < lastMeeting) return "NEXT";
                    if (idx + 2 > lastMeeting) return "PAST";
                    return "LAST";
                  })()}
                  {...meeting}
                />
                ;
              </motion.div>
            );
          })}
          <span ref={scrollRef}></span>
        </div>
      )}
    </div>
  );
}
