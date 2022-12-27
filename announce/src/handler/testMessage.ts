import { Meeting } from "../lib/Meeting";
import axios from "redaxios";
import sgmail, { MailDataRequired } from "@sendgrid/mail";
import { Email, EmailRecipient } from "../lib/Email";
import { createEmail } from "./createEmail.js";
import twilio from "twilio";

export default function sendTestMessage(message: string, phoneNumber: string) {
  return new Promise(async (resolve, reject) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    client.messages
      .create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      })
      .then(resolve)
      .catch(reject);
  });
}
