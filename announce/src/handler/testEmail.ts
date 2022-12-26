import { Meeting } from "../lib/Meeting";
import axios from "redaxios";
import sgmail, { MailDataRequired } from "@sendgrid/mail";
import { Email } from "../lib/Email";

export default function sendTestEmail(email: Email) {
  return new Promise((resolve, reject) => {
    sgmail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg: MailDataRequired = {
      to: "",
      from: {
        email: "mailer@lasapip.com",
        name: "Gabriel Keller",
      },
      subject: email.title,
      text: email.text,
      html: email.body,
    };

    sgmail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
