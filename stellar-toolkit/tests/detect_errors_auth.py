"""
Stellar — Authenticated Error Detector
Usage: python tests/detect_errors_auth.py [--url http://localhost:3000]

Same as detect_errors.py but loads auth.json so pages run with a real
Privy session. Run auth_setup.py first to create auth.json.

Catches errors that only surface when a wallet is connected:
  - NFT fetching failures
  - Stars balance API errors
  - Profile data loading issues
  - Wallet-gated mission actions
"""

import argparse
import os
import sys
from playwright.sync_api import sync_playwright

AUTH_FILE = os.path.join(os.path.dirname(__file__), "..", "auth.json")

PAGES = [
    "/",
    "/missions",
    "/chat",
    "/nfts",
    "/profile",
    "/marketplace",
    "/darksky",
    "/leaderboard",
]

IGNORE_PATTERNS = [
    "favicon.ico",
    "hot-update",
    "_next/webpack",
    "ResizeObserver loop",
    "__nextjs",
]


def should_ignore(text: str) -> bool:
    return any(p in text for p in IGNORE_PATTERNS)


def run(base_url: str) -> dict:
    if not os.path.exists(AUTH_FILE):
        print(f"ERROR: {AUTH_FILE} not found.")
        print("Run auth_setup.py first:  python tests/auth_setup.py")
        sys.exit(1)

    all_results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            geolocation={"latitude": 41.72, "longitude": 44.83},
            permissions=["geolocation"],
            storage_state=AUTH_FILE,
        )
        print(f"Stellar Auth Error Detector  →  {base_url}")
        print(f"Session: {AUTH_FILE}\n")

        for path in PAGES:
            errors = []
            warnings = []
            failed_requests = []

            page = ctx.new_page()

            def on_console(msg, _e=errors, _w=warnings):
                if should_ignore(msg.text):
                    return
                if msg.type == "error":
                    _e.append(msg.text)
                elif msg.type == "warning" and "Warning:" in msg.text:
                    _w.append(msg.text)

            def on_pageerror(err, _e=errors):
                _e.append(f"[uncaught] {err}")

            def on_response(resp, _r=failed_requests):
                if resp.status == 404 and not should_ignore(resp.url):
                    _r.append(f"404 {resp.url}")
                elif resp.status >= 500:
                    _r.append(f"{resp.status} {resp.url}")

            page.on("console", on_console)
            page.on("pageerror", on_pageerror)
            page.on("response", on_response)

            try:
                page.goto(f"{base_url}{path}", wait_until="domcontentloaded", timeout=15000)
                # Give React time to hydrate and fire authenticated useEffects
                page.wait_for_timeout(2000)
            except Exception as e:
                errors.append(f"[navigation] {e}")

            # Check for auth-specific signals
            auth_note = ""
            try:
                is_authed = page.evaluate(
                    "() => Object.keys(localStorage).some(k => k.toLowerCase().includes('privy'))"
                )
                if not is_authed:
                    auth_note = " (session expired — re-run auth_setup.py)"
            except Exception:
                pass

            total_issues = len(errors) + len(failed_requests)
            status = "OK " if total_issues == 0 else "ERR"

            print(f"  {status}  {path}{auth_note}")
            for e in errors[:5]:
                print(f"       [error]   {e[:120]}")
            for r in failed_requests[:3]:
                print(f"       [request] {r[:120]}")

            all_results[path] = {
                "errors": errors,
                "warnings": warnings,
                "failed_requests": failed_requests,
            }

            page.close()

        ctx.close()
        browser.close()

    total_errors = sum(len(v["errors"]) + len(v["failed_requests"]) for v in all_results.values())
    print(f"\n{'='*50}")
    if total_errors == 0:
        print("All authenticated pages clean.")
    else:
        print(f"Total issues: {total_errors}")
        print("Fix errors above before submitting to Colosseum.")
    return all_results


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://localhost:3000")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    results = run(args.url)
    total = sum(len(v["errors"]) + len(v["failed_requests"]) for v in results.values())
    sys.exit(1 if total > 0 else 0)
