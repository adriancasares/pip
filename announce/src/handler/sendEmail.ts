import { Meeting } from "../lib/Meeting";
import axios from "redaxios";
import sgmail, { MailDataRequired } from "@sendgrid/mail";
import { Email, EmailRecipient } from "../lib/Email";
import { createEmail } from "./createEmail.js";

export default function sendEmail(email: Email, recipient: EmailRecipient) {
  return new Promise((resolve, reject) => {
    sgmail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg: MailDataRequired = {
      to: recipient.address,
      from: {
        email: email.from,
        name: email.sender,
      },
      subject: email.title,
      text: email.text,
      html: createEmail(email, recipient),
    };

    sgmail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        resolve("Email sent");
      })
      .catch((error) => {
        console.log(JSON.stringify(error));

        resolve("Email not sent");
      });
  });
}
