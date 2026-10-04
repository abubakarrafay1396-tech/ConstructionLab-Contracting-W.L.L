# QA and launch checklist

Checked locally on 1 October 2026. A local check is not a live-delivery guarantee.

1. **Mobile layout:** All five pages checked at 320, 768 and 1440px. No horizontal
   overflow. Check the published version on an actual iPhone and Android device.
2. **Navigation:** Active page links, mobile menu and Escape close checked.
   All local file links, service anchors and image references resolve.
3. **Project filtering:** All = 16; Showrooms = 6; Government/public = 6;
   Commercial/residential = 4. Buttons and result announcements checked.
4. **Form validation:** Required fields, invalid phone input, service preselection
   and missing-endpoint messages checked. No false success when unconfigured.
5. **Form delivery:** Success, HTTP error, network error, unconfirmed response and
   honeypot rejection checked with isolated simulated responses. Connect a real
   endpoint and confirm receipt, spam protection and rate limiting before launch.
6. **Contact actions:** Unconfirmed phone/WhatsApp links lead to contact details.
   WhatsApp draft construction checked using a simulated window.open; no message
   was sent. Test the owner's confirmed phone and WhatsApp numbers on a device.
7. **Images and content:** Five real Instagram photos, descriptive alt text and
   source links included. Match photos to named projects before replacing their
   placeholders. Confirm final contact details and official logo.
8. **Accessibility:** Labels on all fields, one H1 per page, unique IDs and text
   contrast checked. Focus styling and reduced-motion support included. Complete
   a keyboard/screen-reader pass on the live site, including the embedded map.
9. **SEO and tracking:** Unique titles/descriptions, HVACBusiness schema and
   configured canonical/Open Graph values checked. Final domain, sitemap and
   static social tags need completion. Tracking IDs are empty; test GA4/Meta events
   after configuring them. Disable GA4 automatic form interactions to avoid
   counting unsuccessful attempts alongside the site's confirmed-submit event.
10. **Speed and deployment:** All five photos total 405,744 bytes; non-hero photos
    and the map lazy-load. No framework or heavy libraries. Run PageSpeed Insights
    on the live domain after HTTPS and caching are enabled; no speed score is claimed.

## Contact form update — 4 October 2026

The form now offers both email and WhatsApp draft buttons. Both validate input
and include all enquiry details. Email is addressed to info@constructionlab.com;
WhatsApp uses +973 38951500. The visitor presses Send in the chosen app. The setup
notice remains removed. Tests simulate app opening; no messages are sent.

## Placeholders still to fill

Image update checked at 390px, 768px and 1440px across all five pages. No broken
images, empty image blocks or horizontal overflow were found. All 25 generated
image placements have captions and alt text. Filters still show 6 showroom,
6 public and 4 commercial/residential projects. Both enquiry buttons remain
visible. Existing Instagram photos are unchanged.

- SITE_URL: [TO CONFIRM: final website URL, including https://]
- Final domain in sitemap.xml and the Sitemap line in robots.txt
- Static canonical, og:url and og:image URLs in page heads at launch
- Optional GA4_ID and META_PIXEL_ID
- Approved official logo files (stand-in SVG files are supplied)
- Real photos for the 16 named projects can replace the generated category images;
  intended filenames are preserved in data-project-photo-file attributes.
- Optional real photos to replace the three generated service illustrations

## Manual verification

- The Instagram posts did not identify the pictured clients. Their relationship
  to Toyota, Lexus, BDF, BISB and the rest of the selected list could not be verified.
- Actual enquiry delivery, WhatsApp destination, phone availability and live
  analytics reporting remain unverified until the owner supplies settings.
