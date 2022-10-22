import type { VercelRequest, VercelResponse } from "@vercel/node";
import multiparty from "multiparty";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
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

  console.log(firstName, lastName, email, phone, classYear, preference);

  const docRef = await addDoc(collection(db, "members"), {
    firstName,
    lastName,
    email,
    phone,
    classYear,
    preference,
  });

  response.status(200).send("success");
}

//   let form = new multiparty.Form();

//   let FormResp = await new Promise((resolve, reject) => {
//     form.parse(request, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });

//   console.log(FormResp.fields);

//   return response.end(`Hello!`);
// }

// from http.server import BaseHTTPRequestHandler
// from datetime import datetime
// import cgi
// import os
// import firebase_admin
// from firebase_admin import credentials
// from firebase_admin import firestore_async

// class handler(BaseHTTPRequestHandler):

//     def do_POST(self):

//         my_credentials = {
//         "type": "service_account",
//         "project_id": "lasapip",
//         "private_key_id": os.environ.get("PRIVATE_KEY_ID"),
//         "private_key": os.environ.get("PRIVATE_KEY").replace(r'\n', '\n'),  # CHANGE HERE
//         "client_email": os.environ.get("CLIENT_EMAIL"),
//         "client_id": os.environ.get("CLIENT_ID"),
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL"),
//         "client_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL")
//         }

//         cred = credentials.Certificate(my_credentials)

//         firebase_admin.initialize_app(cred)
//         db = firestore_async.client()

//         content_length = int(self.headers['Content-Length'])

//         form = cgi.FieldStorage(
//                 fp=self.rfile,
//                 headers=self.headers,
//                 environ={'REQUEST_METHOD': 'POST'}
//         )

//         firstName = form.getvalue("firstName")
//         lastName = form.getvalue("lastName")
//         phone = form.getvalue("phone")
//         email = form.getvalue("email")
//         classYear = form.getvalue("classYear")
//         preference = form.getvalue("preference")

//         db.collection(u'members').add({
//             u'firstName': firstName,
//             u'lastName': lastName,
//             u'phone': phone,
//             u'email': email,
//             u'classYear': classYear,
//             u'preference': preference,
//             u'createdAt': datetime.now()
//         }).then(lambda doc_ref: print(u'Document added with ID: {}'.format(doc_ref.id)))
//         # doc_ref = await db.collection(u'members').add({
//         #     'firstName': firstName,
//         #     'lastName': lastName,
//         #     'phone': phone,
//         #     'email': email,
//         #     'classYear': classYear,
//         #     'preference': preference,
//         #     'timestamp': datetime.now()
//         # })

//         # print(time, doc_ref)

//         self.send_response(200)
//         self.send_header('Content-type', 'text/plain')
//         self.end_headers()
//         self.wfile.write(str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')).encode())
//         return
