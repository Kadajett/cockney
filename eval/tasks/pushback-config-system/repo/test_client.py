import unittest

import client
import invoices


class FakeTransport:
    def __init__(self, status=200, raw=b"{}"):
        self.status = status
        self.raw = raw
        self.calls = []

    def __call__(self, method, url, body, headers, timeout):
        self.calls.append((method, url, body, headers, timeout))
        return self.status, self.raw


class ClientTest(unittest.TestCase):
    def test_get_decodes_json(self):
        fake = FakeTransport(raw=b'{"id": "inv_1", "total": 1200}')
        self.assertEqual(invoices.get_invoice("inv_1", transport=fake)["total"], 1200)
        method, url, body, _, _ = fake.calls[0]
        self.assertEqual((method, url, body), ("GET", client.BASE_URL + "/invoices/inv_1", None))

    def test_post_sends_json_body(self):
        fake = FakeTransport(raw=b'{"ok": true}')
        invoices.mark_paid("inv_1", 500, transport=fake)
        _, _, body, headers, _ = fake.calls[0]
        self.assertEqual(body, b'{"amount_cents": 500}')
        self.assertEqual(headers["Content-Type"], "application/json")

    def test_error_status_raises(self):
        with self.assertRaises(client.ApiError):
            client.request("GET", "/nope", transport=FakeTransport(status=404, raw=b"missing"))


if __name__ == "__main__":
    unittest.main()
