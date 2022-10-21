from http.server import BaseHTTPRequestHandler
from datetime import datetime
import cgi

class handler(BaseHTTPRequestHandler):

  def do_POST(self):
    content_length = int(self.headers['Content-Length'])

    form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
    )

    print(form)

    self.send_response(200)
    self.send_header('Content-type', 'text/plain')
    self.end_headers()
    self.wfile.write(str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')).encode())
    return
