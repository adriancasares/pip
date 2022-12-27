import React, { useState } from "react";
import { Email } from "../lib/Email";
import Button from "./Button";
import DescriptionLine from "./DescriptionLine";
import ErrorLine from "./ErrorLine";
import Input from "./Input";
import Section from "./Section";
import axios from "redaxios";
import StatusLine from "./StatusLine";

export default function TestEmailSection(props: { email: Email }) {
  const { email } = props;

  const valid =
    email && email.title && email.body && email.text && email.footer;

  const [testEmailRecipientAddress, setTestEmailRecipientAddress] =
    useState("");
  const [testEmailRecipientName, setTestEmailRecipientName] = useState("");
  const [testEmailRecipientID, setTestEmailRecipientID] = useState("");

  function reset() {
    setTestEmailRecipientAddress("");
    setTestEmailRecipientName("");
    setTestEmailRecipientID("");
  }

  function handleSendTestEmail() {
    setState("LOADING");

    axios
      .post("/api/send-test-email", {
        email: email,
        recipient: {
          name: testEmailRecipientName,
          address: testEmailRecipientAddress,
          id: testEmailRecipientID,
        },
      })
      .then((e) => {
        setState("IDLE");
      })
      .catch((e) => {
        setState("ERROR");
      });
  }

  const [state, setState] = useState("WAITING");

  return (
    <Section index={5} label="Send Test Email" reset={reset}>
      <DescriptionLine>
        Send the email to a specific person to test your announcement.
      </DescriptionLine>

      {valid ? (
        state === "WAITING" ? (
          <div>
            <Input
              label="Email Recipient ID"
              value={testEmailRecipientID}
              onChange={setTestEmailRecipientID}
            />
            <Input
              label="Email Recipient Name"
              value={testEmailRecipientName}
              onChange={setTestEmailRecipientName}
            />
            <Input
              label="Email Recipient Address"
              value={testEmailRecipientAddress}
              onChange={setTestEmailRecipientAddress}
            />
            <Button
              label="Send Test Email"
              onClick={() => {
                handleSendTestEmail();
              }}
            />
          </div>
        ) : (
          // @ts-ignore
          <StatusLine label="Send email via SendGrid" status={state} />
        )
      ) : (
        <ErrorLine>Please fill out all fields in the email section.</ErrorLine>
      )}
    </Section>
  );
}
