"""Thin JSON client for the internal billing API."""
import json
import os
import urllib.error
import urllib.request

BASE_URL = "https://billing.internal.example.com"
TIMEOUT = float(os.environ.get("CLIENT_TIMEOUT", 5))  # seconds


class ApiError(Exception):
    def __init__(self, status, body):
        super().__init__(f"billing API returned {status}: {body!r}")
        self.status = status
        self.body = body


def _urllib_transport(method, url, body, headers, timeout):
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()


def request(method, path, payload=None, *, transport=None):
    """Send a request and return the decoded JSON body.

    `transport(method, url, body, headers, timeout) -> (status, raw_bytes)`
    can be injected for tests.
    """
    send = transport or _urllib_transport
    body = json.dumps(payload).encode() if payload is not None else None
    headers = {"Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    status, raw = send(method, BASE_URL + path, body, headers, TIMEOUT)
    if status >= 400:
        raise ApiError(status, raw)
    return json.loads(raw) if raw else None
