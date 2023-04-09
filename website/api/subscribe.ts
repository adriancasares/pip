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

  const { isValid, phoneNumber } = phoneChecker(phone);
  const emailValid = validateEmail.validate(email);

  let matchingPhone: any = null;
  let matchingEmail: any = null;

  if (phoneNumber != null) {
    if (!isValid) {
      response.status(400).json({
        result: "error",
        error: "invalid-phone-number",
      });
      return;
    }

    matchingPhone = await db
      .collection("members")
      .where("phoneNumber", "==", phoneNumber)
      .get();
  }

  if (email != null) {
    if (!emailValid) {
      response.status(400).json({
        result: "error",
        error: "invalid-email",
      });
      return;
    }

    matchingEmail = await db
      .collection("members")
      .where("email", "==", email)
      .get();
  }

  if (phoneNumber != null && email != null) {
    if (matchingPhone.size > 0 && !(matchingEmail.size > 0)) {
      await db.collection("members").doc(matchingPhone.docs[0].id).update({
        email,
      });
    } else if (matchingEmail.size > 0 && !(matchingPhone.size > 0)) {
      await db.collection("members").doc(matchingEmail.docs[0].id).update({
        phoneNumber,
      });
    } else if (matchingEmail.size > 0 && matchingPhone.size > 0) {
      response.status(400).json({
        result: "error",
        error: "duplicate-email-and-phone",
      });
      return;
    } else {
      await db.collection("members").add({
        firstName,
        lastName,
        email,
        phoneNumber,
        classYear,
      });
    }
  } else if (phoneNumber != null) {
    if (matchingPhone.size > 0) {
      response.status(400).json({
        result: "error",
        error: "duplicate-phone",
      });
      return;
    } else {
      await db.collection("members").add({
        firstName,
        lastName,
        phoneNumber,
        classYear,
      });
    }
  } else if (email != null) {
    if (matchingEmail.size > 0) {
      response.status(400).json({
        result: "error",
        error: "duplicate-email",
      });
      return;
    } else {
      await db.collection("members").add({
        firstName,
        lastName,
        email,
        classYear,
      });
    }
  }

  if (phoneNumber != null && matchingPhone.size == 0) {
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

  if (email != null && matchingEmail.size == 0) {
    sgmail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg: MailDataRequired = {
      to: email,
      from: {
        email: "mailer@lasapip.com",
        name: "Adrian Casares",
      },
      subject: "Welcome to PIP!",
      text: `Welcome to Programming in Practice! We're excited to have you join us for our weekly newsletters and meetings.\nYou can expect new emails every Thursday morning.`,
      html: `<html>
      <body>
        <div>
          <p>${firstName},</p>
          <p>
            Welcome to Programming in Practice! We're
            excited to have you join us for our weekly
            newsletters and meetings. 
          </p>
          <p>
            <b>You can expect new emails every Thursday morning.</b>
          </p>
          <p>
            Thanks,
            <br />
            Adrian Casares
          </p>
          </div>
        </body>
      </html>`,
    };

    await sgmail.send(msg);
  }

  if (matchingPhone != null && matchingPhone.size != 0) {
    response.status(200).json({
      result: "success",
      matchingPhone: true,
    });
  } else if (matchingEmail.size != 0) {
    response.status(200).json({
      result: "success",
      matchingEmail: true,
    });
  } else {
    response.status(200).json({
      result: "success",
    });
  }
}
