# myshiftplanner-website

Download attribution uses `assets/js/attribution.js`. Untagged visits use
`website_nurse` or `website_work`; a validated `?campaign=...` or `utm_campaign`
label is kept through same-app navigation and forwarded as the App Store `ct` token.
Labels are limited to 30 letters, digits, underscores or hyphens. Never put
recipient names, emails or identifiers in campaign labels. Existing email campaign
configuration is managed separately.

GA4 `app_store_click` measures clicks; `offer_code_click` measures redemption-link
clicks. Neither is an install or purchase. App Store Connect displays a campaign
after at least five individual Apple Accounts download through it, subject to
Apple's attribution window and reporting delay. The provider token was verified
in App Store Connect on 2026-09-19. Shared links without a campaign parameter cannot
distinguish an email visitor from another visitor to the same URL.

After generating pages run `python3 scripts/apply_attribution.py` (also called by
`apply_technical_seo.py`). Run `node --test tests/attribution.test.cjs` to check attribution.

Static GitHub Pages website for `myshiftplanner.app`, including the root planner chooser, the nurse and work planner pages, localized guides, and browser-based planning tools.

## Publishing checks

After rebuilding localized pages, run the maintenance scripts in this order:

```sh
python3 scripts/refine_localized_copy.py
python3 scripts/apply_technical_seo.py
python3 scripts/generate_sitemap.py
```

The first pass repairs app-specific terminology in generated translations, the second applies shared metadata and analytics loading, and the final pass regenerates the canonical sitemap with language alternates and updated modification dates.

AI access and citation guidance is published in `robots.txt`, `llms.txt`, and `llms-full.txt`. These machine-readable resources are intentionally not linked from the visible website navigation. Keep them aligned when adding substantial guides or tools.

## Hosting and the security certificate

The site is served by GitHub Pages from `main`; the DNS for `myshiftplanner.app` is at Cloudflare.
The four `A` records and the `www` record must stay **DNS only** (grey cloud). GitHub renews the
site's certificate by itself, but cannot do so behind the Cloudflare proxy: on 4 October 2026 the
certificate expired that way and the site was down for two days. `.github/workflows/site-check.yml`
checks every day that the pages open and that the certificate has at least 14 days left, and GitHub
emails the repository owner when it fails.
