import http.server
import socketserver
import urllib.request
import sys

PORT = 4182
UPSTREAM = "https://agentrouter.org"

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len) if content_len > 0 else None
        url = f"{UPSTREAM}{self.path}"

        req = urllib.request.Request(url, data=post_body, method='POST')
        for key, value in self.headers.items():
            if key.lower() not in ['host', 'user-agent']:
                req.add_header(key, value)

        # AgentRouter authorized user-agent
        req.add_header('User-Agent', 'opencode/1.0.0')

        try:
            with urllib.request.urlopen(req) as resp:
                self.send_response(resp.status)
                for k, v in resp.headers.items():
                    if k.lower() not in ['transfer-encoding', 'content-encoding']:
                        self.send_header(k, v)
                self.end_headers()
                self.wfile.write(resp.read())
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ['transfer-encoding', 'content-encoding']:
                    self.send_header(k, v)
            self.end_headers()
            self.wfile.write(e.read())

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"AgentRouter Proxy Active")

print(f"AgentRouter Proxy listening on http://127.0.0.1:{PORT}")
with socketserver.TCPServer(("127.0.0.1", PORT), ProxyHandler) as httpd:
    httpd.serve_forever()
