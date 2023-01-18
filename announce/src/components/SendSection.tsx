import React, { useState } from "react";
import { Email } from "../lib/Email";
import Button from "./Button";
import DescriptionLine from "./DescriptionLine";
import ErrorLine from "./ErrorLine";
import Section from "./Section";
import StatusLine from "./StatusLine";
import axios from "redaxios";

export default function SendSection(props: {
  email?: Email;
  textMessage: string;
}) {
  const [fetchRecipientsStatus, setFetchRecipientsStatus] = useState("IDLE");
  const [textRecipients, setTextRecipients] = useState([]);
  const [emailRecipients, setEmailRecipients] = useState([]);

  function handleFetchMembers() {
    setFetchRecipientsStatus("LOADING");

    fetch("/api/fetch-members")
      .then((res) => res.json())
      .then((res) => {
        setFetchRecipientsStatus("DONE");
        setTextRecipients(res.textRecipients);
        setEmailRecipients(res.emailRecipients);
      })
      .catch((e) => {
        setFetchRecipientsStatus("ERROR");
      });
  }

  const [currentIdx, setCurrentIdx] = useState(-1);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const validEmail =
    props.email &&
    props.email.title &&
    props.email.body &&
    props.email.text &&
    props.email.footer &&
    props.email.from &&
    props.email.sender;

  async function send() {
    setSending(true);

    const max = Math.max(textRecipients.length, emailRecipients.length);
    for (let i = 0; i < max; i++) {
      setCurrentIdx(i);
      setSendingEmail(false);
      if (textRecipients[i] && props.textMessage) {
        await axios.post("/api/send-message", {
          message: props.textMessage,
          phoneNumber: textRecipients[i].phoneNumber,
        });
      }
      setSendingEmail(true);
      if (emailRecipients[i] && validEmail) {
        await axios.post("/api/send-email", {
          email: props.email,
          recipient: {
            name: emailRecipients[i].firstName,
            address: emailRecipients[i].email,
            id: 0,
          },
        });
      }
    }
    setDone(true);
  }

  return (
    <Section label="Send Announcements" index={7}>
      <DescriptionLine>
        Send the announcement to the list of recipients via text and email.
      </DescriptionLine>
      {!validEmail && (
        <ErrorLine>
          Members won't recieve emails because you left section 2 blank.
        </ErrorLine>
      )}
      {!props.textMessage && (
        <ErrorLine>
          Members won't recieve text messages because you left section 3 blank.
        </ErrorLine>
      )}

      {fetchRecipientsStatus !== "DONE" ? (
        <div>
          <StatusLine
            label="Fetch members via Firebase"
            /* @ts-ignore */
            status={fetchRecipientsStatus}
          />
          <Button label="Fetch members" onClick={handleFetchMembers} />
        </div>
      ) : (
        <div>
          {sending ? (
            <StatusLine
              status={done ? "IDLE" : "LOADING"}
              label="Sending announcements via Sendgrid and Twilio"
            />
          ) : (
            <Button label="Send Announcements" onClick={send} />
          )}
          <div className="flex gap-2">
            <div className="w-1/3 flex flex-col gap-2">
              {textRecipients.map((recipient, idx) => (
                <StatusLine
                  highlight={idx === currentIdx && !sendingEmail}
                  key={recipient}
                  label={`${recipient.firstName} ${
                    recipient.lastName
                  } (${recipient.phoneNumber.slice(-4)})`}
                  status="IDLE"
                />
              ))}
            </div>
            <div className="w-2/3 flex flex-col gap-2">
              {emailRecipients.map((recipient, idx) => (
                <StatusLine
                  highlight={idx === currentIdx && sendingEmail}
                  key={recipient}
                  label={`${recipient.firstName} ${
                    recipient.lastName
                  } (${recipient.email.slice(0, -4)})`}
                  status="IDLE"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
