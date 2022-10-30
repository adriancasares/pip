import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";
import multiparty from "multiparty";
import dotenv from "dotenv";
import phoneChecker from "phone";
import admin from "firebase-admin";
import { getFirestore, CollectionReference } from "firebase-admin/firestore";

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

  const valid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN || "",
    // @ts-ignore
    request.headers["x-twilio-signature"],
    "https://www.lasapip.com/api/messaging/webhook/onRecieve",
    request.body
  );

  if (!valid) {
    response.status(401).send("Unauthorized");
    return;
  }

  const from = phoneChecker(request.body.From).phoneNumber;

  console.log("Got Message From: ", from);

  const message = request.body.Body;

  const memberStatus = await db
    .collection("member")
    .where("phoneNumber", "==", from)
    .get();

  if (memberStatus.empty) {
    const twiml = new twilio.twiml.MessagingResponse();

    twiml.message(
      "🤖 Programming in Practice:\nYou're not a member. Want texts?\nhttps://www.lasapip.com/add-phone"
    );

    response.status(200).send(twiml.toString());
  } else if (message.toLowerCase() === "stop") {
    const twiml = new twilio.twiml.MessagingResponse();

    twiml.message(
      "🤖 Programming in Practice:\nYou've been unsubscribed from messages. Want to subscribe again? Text us anything."
    );

    response.status(200).send(twiml.toString());
  } else {
    response.status(200).send("OK");
  }

  //   if(message.toLowerCase() === "stop"){
  //     response.status(200).send("You have been unsubscribed from all messages. If you would like to subscribe again, please text 'subscribe'.");
}
