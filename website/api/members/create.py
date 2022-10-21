from http.server import BaseHTTPRequestHandler
from datetime import datetime
import cgi
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore_async

class handler(BaseHTTPRequestHandler):

  def do_POST(self):
    my_credentials = {
    "type": "service_account",
    "project_id": "lasapip",
    "private_key_id": os.environ.get("PRIVATE_KEY_ID"),
    "private_key": os.environ.get("PRIVATE_KEY").replace(r'\n', '\n'),  # CHANGE HERE
    "client_email": os.environ.get("CLIENT_EMAIL"),
    "client_id": os.environ.get("CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL")
    }

    cred = credentials.Certificate(my_credentials)

    firebase_admin.initialize_app(cred)
    db = firestore_async.client()

    content_length = int(self.headers['Content-Length'])

    form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
    )

    firstName = form.getvalue("firstName")
    lastName = form.getvalue("lastName")
    phone = form.getvalue("phone")
    email = form.getvalue("email")
    classYear = form.getvalue("classYear")
    preference = form.getvalue("preference")

    doc_ref = db.collection('members').document()

    doc_ref.set({
        'firstName': firstName,
        'lastName': lastName,
        'phone': phone,
        'email': email,
        'classYear': classYear,
        'preference': preference,
        'timestamp': datetime.now()
    })

    print(form)

    self.send_response(200)
    self.send_header('Content-type', 'text/plain')
    self.end_headers()
    self.wfile.write(str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')).encode())
    return
