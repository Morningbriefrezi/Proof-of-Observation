"""
Stellar — Screenshot All Pages
Usage: python tests/screenshot_all.py [--url http://localhost:3000] [--out /tmp/stellar_screenshots]

Captures full-page screenshots of every route at both desktop and mobile viewports.
Run this any time you want to visually review your app.
"""

import argparse
import os
import sys
import time
from playwright.sync_api import sync_playwright

PAGES = [
    ("home",        "/"),
    ("missions",    "/missions"),
    ("chat",        "/chat"),
    ("nfts",        "/nfts"),
    ("profile",     "/profile"),
    ("marketplace", "/marketplace"),
    ("darksky",     "/darksky"),
    ("leaderboard", "/leaderboard"),
]

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile":  {"width": 390,  "height": 844},   # iPhone 14
    "tablet":  {"width": 768,  "height": 1024},
}

def run(base_url: str, out_dir: str, viewports: list):
    os.makedirs(out_dir, exist_ok=True)
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for vp_name in viewports:
            vp = VIEWPORTS[vp_name]
            ctx = browser.new_context(
                viewport=vp,
                device_scale_factor=2 if vp_name == "mobile" else 1,
                geolocation={"latitude": 41.72, "longitude": 44.83},
                permissions=["geolocation"],
            )
            page = ctx.new_page()

            print(f"\n[{vp_name.upper()} {vp['width']}x{vp['height']}]")

            for name, path in PAGES:
                url = f"{base_url}{path}"
                try:
                    page.goto(url, wait_until="load", timeout=30000)
                    page.wait_for_timeout(600)
                    out_path = os.path.join(out_dir, f"{name}_{vp_name}.png")
                    page.screenshot(path=out_path, full_page=True)
                    print(f"  OK  {path:20}  → {out_path}")
                    results.append({"page": name, "vp": vp_name, "path": out_path, "ok": True})
                except Exception as e:
                    print(f"  ERR {path:20}  → {e}")
                    results.append({"page": name, "vp": vp_name, "ok": False, "error": str(e)})

            ctx.close()
        browser.close()

    ok = sum(1 for r in results if r["ok"])
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Done: {ok}/{total} screenshots saved to {out_dir}")
    failures = [r for r in results if not r["ok"]]
    if failures:
        print(f"\nFailed ({len(failures)}):")
        for f in failures:
            print(f"  {f['page']} ({f['vp']}): {f.get('error', 'unknown')}")
    return failures


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Screenshot all Stellar pages")
    parser.add_argument("--url", default="http://localhost:3000", help="Base URL")
    parser.add_argument("--out", default="/tmp/stellar_screenshots", help="Output directory")
    parser.add_argument("--vp", nargs="+", default=["desktop", "mobile"],
                        choices=list(VIEWPORTS.keys()), help="Viewports to capture")
    args = parser.parse_args()

    print(f"Stellar Screenshot Crawler")
    print(f"  URL:       {args.url}")
    print(f"  Output:    {args.out}")
    print(f"  Viewports: {', '.join(args.vp)}")

    failures = run(args.url, args.out, args.vp)
    sys.exit(1 if failures else 0)
