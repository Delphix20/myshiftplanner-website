#!/usr/bin/env python3
"""Generate the canonical multilingual sitemap from indexable HTML files."""

from __future__ import annotations

import re
import subprocess
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://myshiftplanner.app"
LOCALES = ("es", "fr", "de", "pt-br", "ja")


def canonical_url(path: Path) -> str | None:
    text = path.read_text(encoding="utf-8")
    if re.search(r'<meta\s+name="robots"[^>]*content="[^"]*noindex', text, re.I):
        return None
    match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', text, re.I)
    return match.group(1) if match else None


def last_modified(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if subprocess.run(
        ["git", "diff", "--quiet", "--", rel], cwd=ROOT, check=False
    ).returncode != 0:
        return date.today().isoformat()
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", rel],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    return result.stdout.strip() or date.today().isoformat()


def alternate_links(url: str, known_urls: set[str]) -> list[tuple[str, str]]:
    relative = url.removeprefix(BASE).lstrip("/")
    first = relative.split("/", 1)[0] if relative else ""
    if first in LOCALES:
        relative = relative.split("/", 1)[1] if "/" in relative else ""

    links: list[tuple[str, str]] = []
    english = f"{BASE}/{relative}" if relative else f"{BASE}/"
    if english in known_urls:
        links.append(("en", english))
    for locale in LOCALES:
        localized = f"{BASE}/{locale}/{relative}" if relative else f"{BASE}/{locale}/"
        if localized in known_urls:
            links.append(("pt-BR" if locale == "pt-br" else locale, localized))
    if english in known_urls and len(links) > 1:
        links.append(("x-default", english))
    return links


def main() -> None:
    records: dict[str, tuple[Path, str]] = {}
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel == "404.html" or rel.startswith(".git/"):
            continue
        url = canonical_url(path)
        if url and url.startswith(BASE):
            records[url] = (path, last_modified(path))

    known_urls = set(records)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for url, (_, modified) in sorted(records.items()):
        lines.extend(("  <url>", f"    <loc>{escape(url)}</loc>", f"    <lastmod>{modified}</lastmod>"))
        for language, href in alternate_links(url, known_urls):
            lines.append(f'    <xhtml:link rel="alternate" hreflang="{language}" href="{escape(href)}" />')
        lines.append("  </url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
