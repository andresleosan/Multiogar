import hmac
import os
from http.server import BaseHTTPRequestHandler

# Vercel Functions have a read-only bundle and a writable /tmp scratch area.
# Keeping the model there avoids trying to write into the deployed source tree.
os.environ.setdefault("REMBG_HOME", "/tmp/rembg")
os.environ.setdefault("OMP_NUM_THREADS", "2")

from rembg import new_session, remove

MAX_INPUT_BYTES = 8 * 1024 * 1024
MODEL_NAME = os.environ.get("REMBG_MODEL", "u2netp")
SESSION = None


def get_session():
    global SESSION
    if SESSION is None:
        SESSION = new_session(MODEL_NAME)
    return SESSION


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        configured_secret = os.environ.get("REMBG_INTERNAL_SECRET", "")
        provided_secret = self.headers.get("x-rembg-secret", "")
        if not configured_secret or not hmac.compare_digest(provided_secret, configured_secret):
            self.send_error(401, "Unauthorized")
            return

        try:
            content_length = int(self.headers.get("content-length", "0"))
        except ValueError:
            self.send_error(400, "Invalid content length")
            return

        if content_length <= 0 or content_length > MAX_INPUT_BYTES:
            self.send_error(413, "Image too large")
            return

        raw_image = self.rfile.read(content_length)
        if len(raw_image) != content_length:
            self.send_error(400, "Incomplete image")
            return

        try:
            output = remove(raw_image, session=get_session(), force_return_bytes=True)
        except Exception:
            # Do not return model internals or user data in the response.
            self.send_error(422, "Image could not be processed")
            return

        if not isinstance(output, bytes) or not output:
            self.send_error(502, "Invalid model response")
            return

        self.send_response(200)
        self.send_header("Content-Type", "image/png")
        self.send_header("Content-Length", str(len(output)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(output)

    def log_message(self, _format, *_args):
        # Avoid logging request metadata or image-related details.
        return
