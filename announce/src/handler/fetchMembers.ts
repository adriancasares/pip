import admin, { ServiceAccount } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

export default async function fetchMembers() {
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

  const membersQuery = db.collection("members");

  const members = await membersQuery.get();

  const rawData = members.docs.map((doc: any) => doc.data());

  const sortedData = rawData.sort((a: any, b: any) => {
    if (a.email && a.phoneNumber && !(b.email && b.phoneNumber)) {
      return -1;
    } else if (!(a.email && a.phoneNumber) && b.email && b.phoneNumber) {
      return 1;
    } else {
      return 0;
    }
  });

  const textRecipients = sortedData.filter((member: any) => member.phoneNumber);

  const emailRecipients = sortedData.filter((member: any) => member.email);

  return {
    textRecipients,
    emailRecipients,
  };
}
