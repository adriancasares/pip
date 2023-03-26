import type { VercelRequest, VercelResponse } from "@vercel/node";
import multiparty from "multiparty";
import admin from "firebase-admin";
import { getFirestore, CollectionReference } from "firebase-admin/firestore";
import twilio from "twilio";
import axios from "axios";
import dotenv from "dotenv";
import phoneChecker from "phone";
import validateEmail from "email-validator";
import sgmail, { MailDataRequired } from "@sendgrid/mail";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  dotenv.config();

  const firebaseConfig = {
    type: "service_account",
    project_id: "lasapip",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        // @ts-ignore
        credential: admin.credential.cert(firebaseConfig),
      });

  const db = getFirestore(app);

  const form = new multiparty.Form();

  let FormResp: any = await new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const firstName = FormResp.fields.firstName[0];
  const lastName = FormResp.fields.lastName[0];
  const email = FormResp.fields.email ? FormResp.fields.email[0] : null;
  const phone = FormResp.fields.phone ? FormResp.fields.phone[0] : null;
  const classYear = FormResp.fields.classYear[0];
  const captchaKey = FormResp.fields.captchaKey[0];
  // verify captchaKey with hcaptcha
  const captchaResponse = await axios.post(
    "https://hcaptcha.com/siteverify",
    "secret=" + process.env.HCAPTCHA_SECRET + "&response=" + captchaKey,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!captchaResponse.data.success) {
    response.status(400).json({
      result: "error",
      error: "invalid-captcha",
    });
    return;
  }

  const { isValid, phoneNumber } = phoneChecker(phone);
  const emailValid = validateEmail.validate(email);

  if (phoneNumber != null) {
    if (!isValid) {
      response.status(400).json({
        result: "error",
        error: "invalid-phone-number",
      });
      return;
    }

    const matchingPhone = await db
      .collection("members")
      .where("phoneNumber", "==", phoneNumber)
      .get();

    if (!matchingPhone.empty) {
      response.status(400).json({
        result: "error",
        error: "phone-already-exists",
        message: "Phone number already registerd.",
      });
      return;
    }
  }

  if (email != null) {
    if (!emailValid) {
      response.status(400).json({
        result: "error",
        error: "invalid-email",
      });
      return;
    }

    const matchingEmail = await db
      .collection("members")
      .where("email", "==", email)
      .get();

    if (!matchingEmail.empty) {
      response.status(400).json({
        result: "error",
        error: "email-already-exists",
        message: "Email already registerd.",
      });
      return;
    }
  }

  if (phoneNumber != null) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `🤖 Programming in Practice:\nWelcome, ${firstName}. We'll text you about new meetings and events. Reply STOP to unsubscribe, and send a message if you have any questions.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    const contactMessage = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      body: "Save our contact:",
    });

    const contactFile = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      mediaUrl: "https://lasapip.vercel.app/api/misc/contact",
    });
  }

  const memberRef = await db.collection("members").add({
    firstName,
    lastName,
    email,
    phoneNumber,
    classYear,
  });

  if (email != null) {
    sgmail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg: MailDataRequired = {
      to: email,
      from: {
        email: "mailer@lasapip.com",
        name: "Programming in Practice",
      },
      subject: "Welcome to PIP!",
      text: "test",
      html: `<html>
      <body>
        <div>
          <p>Hi ${firstName},</p>
          <p>You're signed up to recieve newsletters from us.
          </div>
        </body>
      </html>`,
    };

    await sgmail.send(msg);
  }

  response.status(200).json({
    result: "success",
  });
}
