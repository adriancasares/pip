import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { slug } = request.query;
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

  const db = getDatabase(app);

  const projectsRef = db.ref("projects");

  const projects = await projectsRef.get();

  const project = projects.val().filter((project: any) => {
    return project.slug === slug;
  })[0];

  const fs = getFirestore(app);

  const newsletterRef = fs.collection("publishedNewsletters");

  const newsletters = await newsletterRef.get();

  const newsletter = newsletters.docs
    .filter((doc) => {
      return doc.get("slug") === slug;
    })
    .map((doc) => {
      return doc.data();
    });

  response.status(200).json({
    result: "success",
    newsletter,
    project,
  });
}
