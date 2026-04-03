# AdSense Preflight Checklist

Last updated: April 3, 2026

This checklist is ordered by likely impact on AdSense review outcomes for this site. `Done` means the codebase now covers the item. `Manual` means the owner still needs to verify or complete it outside the repo.

## Priority 1: High-Trust Site Signals

- `Done` Clear site purpose on the homepage and supporting landing pages.
- `Done` Dedicated trust pages:
  - `/about`
  - `/contact`
  - `/editorial-policy`
  - `/privacy`
  - `/terms`
- `Done` Direct contact emails for support, copyright, and policy questions.
- `Done` Footer and homepage internal links to trust pages.
- `Done` `ads.txt` present and aligned with the configured publisher.

## Priority 2: Ad Layout Safety

- `Done` No homepage ad block directly above the main downloader form.
- `Done` No tool-page ad block directly between the page hero and the first useful content section.
- `Done` Ads appear after meaningful content sections instead of replacing them.
- `Done` Auto Ads are opt-in instead of enabled by default.
- `Manual` During review, keep Auto Ads disabled unless there is a specific reason to test them.
- `Manual` Use real production ad slots only after the site is approved. Keep test mode off in production once approved.

## Priority 3: Crawlability and Indexation

- `Done` `sitemap.xml` includes homepage, hubs, legal pages, and trust pages.
- `Done` `robots.txt` allows crawling of public pages and blocks API routes.
- `Done` Canonical tags generated through shared metadata utilities.
- `Done` Structured data added across homepage, guides, tools, and trust content.
- `Manual` Submit the live production sitemap in Google Search Console after deploy.
- `Manual` Check that Google can fetch `https://threadsextractor.com/ads.txt`, `robots.txt`, and `sitemap.xml` without redirects or auth prompts.

## Priority 4: Content Quality

- `Done` Multiple long-tail tool pages with distinct intent.
- `Done` Multiple guide pages covering how-to, FAQ, troubleshooting, and copyright topics.
- `Done` Homepage contains explanatory content and site-policy links, not just a form.
- `Done` Editorial policy explains page purpose and ad separation.
- `Manual` Keep adding genuinely useful guides based on Search Console impressions, not thin keyword variants.

## Priority 5: Operational Checks Before Submission

- `Manual` Deploy the latest build to production.
- `Manual` Confirm there are no broken internal links in footer, navigation, and homepage trust cards.
- `Manual` Confirm the live site has HTTPS and no major console or hydration errors.
- `Manual` Confirm the site is accessible without login and does not show placeholder content.
- `Manual` Confirm the domain in AdSense exactly matches the production site being reviewed.

## Recommended Review Mode

Use this configuration while the site is under initial AdSense review:

```env
NEXT_PUBLIC_GOOGLE_ADSENSE_AUTO_ADS=false
NEXT_PUBLIC_GOOGLE_ADSENSE_TEST_MODE=false
```

Manual slots can remain in content sections, but avoid increasing density until the site is approved.
