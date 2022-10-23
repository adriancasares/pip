import type { VercelRequest, VercelResponse } from "@vercel/node";
import multiparty from "multiparty";
import admin from "firebase-admin";
import { getFirestore, CollectionReference } from "firebase-admin/firestore";
import twilio from "twilio";
import axios from "axios";
import dotenv from "dotenv";
import phoneChecker from "phone";

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
  const phone = FormResp.fields.phone[0];
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

  if (!isValid) {
    response.status(400).json({
      result: "error",
      error: "invalid-phone-number",
    });
    return;
  }

  const matchingPhone = await db
    .collection("members")
    .where("phone", "==", phoneNumber)
    .get();

  if (!matchingPhone.empty) {
    response.status(400).json({
      result: "error",
      error: "phone-already-exists",
      message: "Phone number already registerd.",
    });
    return;
  }

  const memberRef = await db.collection("members").add({
    firstName,
    lastName,
    phoneNumber,
    classYear,
  });

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

  response.status(200).json({
    result: "success",
  });
}
