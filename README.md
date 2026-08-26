# myshiftplanner-website

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
