"""
Stellar — Auth Setup
Usage: python tests/auth_setup.py [--url http://localhost:3000]

Opens a real browser window. Log in with your Privy account.
Press Enter in this terminal once you're logged in.
Saves your session to auth.json for use by detect_errors_auth.py.

Run this once (or whenever your session expires).
"""

import argparse
import os
from playwright.sync_api import sync_playwright

AUTH_FILE = os.path.join(os.path.dirname(__file__), "..", "auth.json")


def run(base_url: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 800},
            geolocation={"latitude": 41.72, "longitude": 44.83},
            permissions=["geolocation"],
        )
        page = ctx.new_page()
        page.goto(base_url)

        print()
        print("=" * 50)
        print("Browser is open.")
        print("1. Log in with your Privy account")
        print("2. Wait for the app to fully load")
        print("3. Press Enter here to save the session")
        print("=" * 50)
        input()

        # Give wallet a moment to settle after Enter
        page.wait_for_timeout(1500)

        # Print what Privy stored so we can verify
        keys = page.evaluate("() => Object.keys(localStorage)")
        privy_keys = [k for k in keys if "privy" in k.lower()]
        if privy_keys:
            print(f"Privy keys found: {privy_keys}")
        else:
            print("Warning: no Privy keys found in localStorage — are you logged in?")

        ctx.storage_state(path=AUTH_FILE)
        browser.close()

        print(f"\nAuth saved → {AUTH_FILE}")
        print("Run: python stellar-toolkit/tests/detect_errors_auth.py")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:3000")
    args = parser.parse_args()
    run(args.url)
