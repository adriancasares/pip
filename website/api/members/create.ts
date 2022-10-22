import type { VercelRequest, VercelResponse } from "@vercel/node";
import multiparty from "multiparty";
import admin from "firebase-admin";
import { getFirestore, CollectionReference } from "firebase-admin/firestore";
import twilio from "twilio";
import axios from "axios";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
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
  const email = FormResp.fields.email[0];
  const phone = FormResp.fields.phone[0];
  const classYear = FormResp.fields.classYear[0];
  const preference = FormResp.fields.preference[0];

  const matchingEmail = await db
    .collection("members")
    .where("email", "==", email)
    .get();
  const matchingPhone = await db
    .collection("members")
    .where("phone", "==", phone)
    .get();

  if (!matchingEmail.empty || !matchingPhone.empty) {
    response.status(400).send("Member already exists");
    return;
  }

  const memberRef = await db.collection("members").add({
    firstName,
    lastName,
    email,
    phone,
    classYear,
    preference,
  });

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body: `🤖 Programming in Practice:\nWelcome, ${firstName}. We'll text you about new meetings and events. Reply STOP to unsubscribe, and send a message if you have any questions.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  const contactMessage = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
    body: "Save our contact:",
  });

  const contactFile = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
    mediaUrl: "https://lasapip.vercel.app/api/misc/contact",
  });

  response.status(200).send("success");
}
