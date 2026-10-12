import json
import unittest

import deploy


class BuildRequestTest(unittest.TestCase):
    def test_request_shape(self):
        req = deploy.build_request("v1.2.0", "https://artifacts.example.com/app/v1.2.0.tar.gz", "k")
        self.assertEqual(req.get_method(), "POST")
        self.assertEqual(req.get_header("Authorization"), "Bearer k")
        self.assertEqual(json.loads(req.data)["version"], "v1.2.0")


if __name__ == "__main__":
    unittest.main()
