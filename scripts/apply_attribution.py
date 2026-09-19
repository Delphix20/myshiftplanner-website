#!/usr/bin/env python3
"""Keep generated pages' download links and shared tracking consistent."""
import html
import re
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]


def normalize(text):
    def link(match):
        tag = match[0]
        href = re.search(r'href="([^"]+)"', tag)
        if not href:
            return tag
        url = urlsplit(html.unescape(href[1]))
        app = 'nurse' if 'id6764406102' in url.path else 'work' if 'id6769349635' in url.path else None
        if url.hostname != 'apps.apple.com' or not app or '/redeem' in url.path:
            return tag
        params = dict(parse_qsl(url.query))
        params.update(pt='127823620', ct='website_' + app, mt='8')
        target = html.escape(urlunsplit((url.scheme, url.netloc, url.path, urlencode(params), url.fragment)), quote=True)
        tag = tag.replace(href[0], f'href="{target}"')
        click = re.search(r' onclick="([^"]+)"', tag)
        if click and 'app_store_click' in click[1]:
            placement = re.search(r"placement: '([^']+)'", click[1])
            value = placement[1] if placement else 'other'
            tag = tag.replace(click[0], f' data-app-store-placement="{value}"')
        return tag

    text = re.sub(r'<a\b[^>]+>', link, text)
    if 'apps.apple.com' in text or '/assets/js/analytics.js' in text:
        scripts = ''
        if '/assets/js/analytics.js' not in text and 'googletagmanager.com/gtag/js' not in text:
            scripts += '    <script src="/assets/js/analytics.js" defer></script>\n'
        if '/assets/js/attribution.js' not in text:
            scripts += '    <script src="/assets/js/attribution.js" defer></script>\n'
        text = text.replace('</head>', scripts + '  </head>', 1) if scripts else text
    return text


def main():
    for path in ROOT.rglob('*.html'):
        if '.git' in path.parts:
            continue
        before = path.read_text()
        after = normalize(before)
        if before != after:
            path.write_text(after)


if __name__ == '__main__':
    main()
