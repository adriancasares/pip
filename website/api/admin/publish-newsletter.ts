import type { VercelRequest, VercelResponse } from "@vercel/node";
import multiparty from "multiparty";
import admin from "firebase-admin";
import { getFirestore, CollectionReference } from "firebase-admin/firestore";
import twilio from "twilio";
import axios from "axios";
import dotenv from "dotenv";
import phoneChecker from "phone";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import sgmail, { MailDataRequired } from "@sendgrid/mail";
import type Newsletter from "../../src/types/Newsletter";
import createNewsletter from "../../public/createNewsletter";
import type { NewsletterTextBlock } from "../../src/types/NewsletterContentBlock";
import { htmlToText } from "html-to-text";

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
        databaseURL: "https://lasapip-default-rtdb.firebaseio.com/",
        // @ts-ignore
        credential: admin.credential.cert(firebaseConfig),
      });

  const fs = getFirestore(app);
  const db = getDatabase(app);

  const form = new multiparty.Form();

  let FormResp: any = await new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const token = FormResp.fields.token[0];
  const projectId = FormResp.fields.projectId[0];

  const decodedToken = await getAuth().verifyIdToken(token);

  const isAdmin = decodedToken.admin;

  if (!isAdmin) {
    response.status(401).json({
      result: "error",
      error: "Unauthorized",
    });
    return;
  }

  const projectDraft: Newsletter = await (
    await db.ref(`newsletterDrafts/${projectId}`).get()
  ).val();

  const projectPublished: Newsletter = {
    ...projectDraft,
  };

  const publishedDoc = fs.collection("publishedNewsletters").doc(projectId);

  if ((await publishedDoc.get()).exists) {
    publishedDoc.update(projectPublished as any);
  } else {
    publishedDoc.set(projectPublished);
  }

  response.status(200).json({
    result: "success",
  });
}
