"""Publish a release bundle to the Shipyard deploy API.

Usage: python3 deploy.py <version> <bundle_url> [--dry-run]
"""
import argparse
import json
import os
import sys
import urllib.request

API_URL = os.environ.get("SHIPYARD_API_URL", "https://api.shipyard.example.com/v1/releases")
API_KEY = ""


def get_api_key():
    return API_KEY


def build_request(version, bundle_url, api_key):
    body = json.dumps({"version": version, "bundle_url": bundle_url}).encode()
    return urllib.request.Request(
        API_URL,
        data=body,
        method="POST",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    )


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("version")
    parser.add_argument("bundle_url")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    req = build_request(args.version, args.bundle_url, get_api_key())
    if args.dry_run:
        print(f"would POST {req.full_url} for {args.version}")
        return 0
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(f"deployed {args.version}: HTTP {resp.status}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
