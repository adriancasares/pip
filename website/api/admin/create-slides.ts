import type { VercelRequest, VercelResponse } from "@vercel/node";
import multiparty from "multiparty";
import { getFirestore, CollectionReference } from "firebase-admin/firestore";
import twilio from "twilio";
import axios from "axios";
import admin from "firebase-admin";
import dotenv from "dotenv";
import phoneChecker from "phone";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import sgmail, { MailDataRequired } from "@sendgrid/mail";
import type Newsletter from "../../src/types/Newsletter";
import createNewsletter from "../../public/createNewsletter";
import { google } from "googleapis";
import type { Project } from "../../src/types/Project";
import type Meeting from "../../src/types/Meeting";

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

  const gServiceConfig = {
    type: "service_account",
    project_id: "lasapip",
    private_key_id: process.env.GSERVICE_PRIVATE_KEY_ID,
    private_key: process.env.GSERVICE_PRIVATE_KEY,
    client_email: process.env.GSERVICE_CLIENT_EMAIL,
    client_id: process.env.GSERVICE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GSERVICE_CLIENT_X509_CERT_URL,
  };

  const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        databaseURL: "https://lasapip-default-rtdb.firebaseio.com/",
        // @ts-ignore
        credential: admin.credential.cert(firebaseConfig),
      });

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

  const meeting: Meeting = (await db.ref(`meetings/${projectId}`).get()).val();

  if (!meeting) {
    response.status(404).json({
      result: "error",
      error: "Meeting not found",
    });
    return;
  }

  const decodedToken = await getAuth().verifyIdToken(token);

  const uid = decodedToken.uid;
  const email = decodedToken.email;
  const isAdmin = decodedToken.admin;

  if (!isAdmin) {
    response.status(401).json({
      result: "error",
      error: "Unauthorized",
    });
    return;
  }

  const jwtClient = new google.auth.JWT(
    gServiceConfig.client_email,
    undefined,
    gServiceConfig.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );

  await jwtClient.authorize();

  const drive = google.drive({
    version: "v3",
    auth: jwtClient,
  });

  const folderId = "1dznU8IYOYNwibmmGWf01sgQwN-8uhRg9";

  const fileMetadata = {
    name: "Slides for " + meeting.name,
    parents: [folderId],
    mimeType: "application/vnd.google-apps.presentation",
  };

  // make a copy of existing template
  const file = await drive.files.copy({
    fileId: "1QIJwWbOxHwqAlfRB1F9KZfXgJqOR6cmKBiQkd635dds",
    requestBody: fileMetadata,
    fields: "id",
  });

  const fileId = file.data.id;

  const fileUrl = `https://docs.google.com/presentation/d/${fileId}/edit`;

  response.status(200).json({
    result: "success",
    fileUrl,
  });
}
