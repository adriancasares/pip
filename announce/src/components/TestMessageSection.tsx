import React, { useState } from "react";
import { Email } from "../lib/Email";
import Button from "./Button";
import DescriptionLine from "./DescriptionLine";
import ErrorLine from "./ErrorLine";
import Input from "./Input";
import Section from "./Section";
import axios from "redaxios";
import StatusLine from "./StatusLine";
import phone from "phone";

export default function TestMessageSection(props: { message: string }) {
  const { message } = props;

  const [phoneNumber, setPhoneNumber] = useState("");
  const valid = message;

  const [state, setState] = useState("WAITING");

  function reset() {
    setPhoneNumber("");
    setState("WAITING");
  }

  function sendTestMessage() {
    setState("LOADING");

    axios
      .post("/api/send-test-message", {
        message: message,
        phoneNumber: phoneNumber,
      })
      .then((e) => {
        setState("IDLE");
      })
      .catch((e) => {
        setState("ERROR");
      });
  }

  return (
    <Section index={6} label="Send Test Message" reset={reset}>
      <DescriptionLine>
        Send the text message to a specific phone number to test your
        announcement.
      </DescriptionLine>

      {valid ? (
        state === "WAITING" ? (
          <div>
            <Input
              label="Phone Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            {phone(phoneNumber).isValid && (
              <Button
                label="Send Test Message"
                onClick={() => {
                  sendTestMessage();
                }}
              />
            )}
          </div>
        ) : (
          // @ts-ignore
          <StatusLine label="Send text message via Twilio" status={state} />
        )
      ) : (
        <ErrorLine>
          Please fill out section three and include a valid phone number to test
          with.
        </ErrorLine>
      )}
    </Section>
  );
}
