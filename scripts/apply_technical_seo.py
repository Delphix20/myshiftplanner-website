#!/usr/bin/env python3
"""Apply shared technical SEO annotations to the static HTML output."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://myshiftplanner.app"
LOCALES = (("es", "es"), ("fr", "fr"), ("de", "de"), ("pt-br", "pt-BR"), ("ja", "ja"))
FEED_LINK = '<link rel="alternate" type="application/atom+xml" title="My Shift Planner Guides" href="https://myshiftplanner.app/feed.xml">'
ANALYTICS_SCRIPT = '<script src="/assets/js/analytics.js" defer></script>'


def canonical(text: str) -> str | None:
    match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', text, re.I)
    return match.group(1) if match else None


def localized_url(url: str, locale: str) -> str:
    relative = url.removeprefix(BASE).lstrip("/")
    return f"{BASE}/{locale}/{relative}" if relative else f"{BASE}/{locale}/"


def href_to_path(url: str) -> Path:
    relative = url.removeprefix(BASE).lstrip("/")
    if not relative:
        return ROOT / "index.html"
    if url.endswith("/"):
        return ROOT / relative / "index.html"
    return ROOT / relative


def add_alternates(text: str, url: str) -> str:
    if 'hreflang="' in text or not url.startswith(BASE):
        return text
    links = [("en", url)]
    for locale, hreflang in LOCALES:
        candidate = localized_url(url, locale)
        if href_to_path(candidate).exists():
            links.append((hreflang, candidate))
    if len(links) == 1:
        return text
    links.append(("x-default", url))
    block = "\n".join(f'    <link rel="alternate" hreflang="{lang}" href="{href}">' for lang, href in links)
    needle = f'<link rel="canonical" href="{url}">'
    return text.replace(needle, f"{needle}\n{block}", 1)


def add_feed(text: str) -> str:
    if "application/atom+xml" in text:
        return text
    marker = '<meta name="twitter:card" content="summary_large_image">'
    if marker in text:
        return text.replace(marker, f"{marker}\n    {FEED_LINK}", 1)
    marker = '<link rel="stylesheet"'
    return text.replace(marker, f"{FEED_LINK}\n    {marker}", 1)


def update_social_image(text: str, url: str) -> str:
    if "/nurse/" in url:
        image = f"{BASE}/assets/images/social/my-nurse-shift-planner.jpg"
        alt = "My Nurse Shift Planner calendar and app icon"
    elif "/work/" in url:
        image = f"{BASE}/assets/images/social/my-work-shift-planner.jpg"
        alt = "My Work Shift Planner calendar and app icon"
    else:
        image = f"{BASE}/assets/images/social/my-shift-planner.jpg"
        alt = "My Shift Planner apps for nursing and work schedules"

    text = re.sub(r'<meta\s+property="og:image"\s+content="[^"]+">', f'<meta property="og:image" content="{image}">', text, count=1, flags=re.I)
    text = re.sub(r'\s*<meta\s+property="og:image:(?:width|height|alt)"[^>]*>', '', text, flags=re.I)
    text = re.sub(r'\s*<meta\s+name="twitter:image"[^>]*>', '', text, flags=re.I)
    marker = f'<meta property="og:image" content="{image}">'
    extras = f'{marker}\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">\n    <meta property="og:image:alt" content="{alt}">\n    <meta name="twitter:image" content="{image}">'
    return text.replace(marker, extras, 1)


def update_analytics(text: str) -> str:
    text = re.sub(
        r'\s*<!-- Google tag \(gtag\.js\) -->\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-1G81C7EHDF"></script>\s*<script>.*?</script>',
        f"\n    {ANALYTICS_SCRIPT}",
        text,
        count=1,
        flags=re.I | re.S,
    )
    text = re.sub(
        r'\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-1G81C7EHDF"></script>\s*<script>.*?</script>',
        f"\n    {ANALYTICS_SCRIPT}",
        text,
        count=1,
        flags=re.I | re.S,
    )
    return text


def main() -> None:
    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        url = canonical(text)
        if not url or "noindex" in text.lower():
            continue
        updated = update_analytics(update_social_image(add_feed(add_alternates(text, url)), url))
        if updated != text:
            path.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()
