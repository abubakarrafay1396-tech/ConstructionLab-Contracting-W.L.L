# Construction Lab Air Conditioning — static website

## Delivery status

All five pages are implemented: Home, About, Services, Projects and Contact.
Includes shared CSS/JavaScript, SVG wordmarks/favicon/avatar, five real Instagram
photos, a filtered list of 16 selected projects, sitemap template and robots.txt.
The static website works without a framework or build step. Company details,
the final domain and an enquiry endpoint still need configuration before launch.

## Open the preview

Open index.html in a browser. No npm install, framework or build is required.
The folder can be uploaded directly to ordinary static hosting after the launch
items below are filled. The local preview runs at http://127.0.0.1:8765/ while the
preview server is active. This address is only available on this computer.

## Shared components

partials/header.html and partials/footer.html are editing references. Their
contents are included directly in each page, so navigation and contact information
are available without JavaScript and without fetching HTML fragments.
When changing shared markup, make the same edit in every page. Set aria-current
on the appropriate navigation link. No runtime template system is needed.

## Configuration

Edit js/config.js. FOUNDED_YEAR is the single runtime setting for the founding year;
all visible occurrences are marked with data-config. HTML contains fallback text
for visitors without JavaScript. If facts change, update that fallback text too.

PHONE and WHATSAPP must be international numbers, e.g. + followed by country code
and number. Do not enter an unconfirmed number. Until configured, Call and WhatsApp
links lead to the contact details instead of opening invalid phone/chat URLs.

SITE_URL must be the final HTTPS folder URL with a trailing slash. JavaScript uses
it for canonical/og:url and business schema. The final sitemap and robots also
need that URL. Before launch, mirror final canonical/og:url values into the HTML
head for crawlers that do not execute JavaScript. No domain has been assumed.

GA4_ID and META_PIXEL_ID are optional and blank by default. When enabled, scripts
load asynchronously into the head. Events: whatsapp_click, phone_click,
get_quote_click and form_submit. Form submission is tracked only after confirmed
acceptance. No form text or customer contact details are included in events.
Disable automatic form event collection in the GA4 web stream too, so enhanced
measurement does not count unsuccessful attempts as submitted leads.

## Enquiry form

The form provides both Send by email and Send on WhatsApp. Both validate the
fields and include all enquiry details in a draft. Email opens the visitor's
email app addressed to info@constructionlab.com; WhatsApp opens a chat addressed
to +973 38951500. The visitor must press Send in that app. Email requires an
email app configured on the device. Fallback links are displayed, and neither
action claims confirmed delivery. No setup notice is shown above the form.

## Optional form endpoint contract

To enable direct server submission instead, set FORM_ENDPOINT to a public HTTPS
endpoint accepting POST JSON. Fields:
name, company, phone, email, service, location, message, website (honeypot).
It must allow requests from the live domain via CORS, validate all fields on the
server, check the honeypot, rate-limit abuse and deliver/store enquiries securely.
Only HTTP 2xx with JSON {"success": true} is treated as a successful enquiry.
Validation failures should return an appropriate non-2xx status. An empty endpoint
never displays a success message. A honeypot is only one spam control; browser
validation cannot replace server checks. Do not place secret keys in config.js.
Test end-to-end delivery before launch. A static site alone cannot send email.

## Images

Five company Instagram photos are stored in assets/images. Their source posts
and verified context are recorded in IMAGE-SOURCES.md. None of those posts named
a client, so the photos are used for general site work and service illustrations.
Named project photo slots remain unassigned. No invented project-photo matching.

Ice-blue placeholder blocks identify where matching approved photos belong.
data-image-file specifies the intended filename.
Replace each block with a real image, descriptive alt text, width/height and
loading="lazy" below the fold. Keep the hero image eager if it is above the fold.
Only use approved project photos. Stand-in logo.svg, logo-light.svg, avatar.svg
and favicon.svg are included in assets/. Replace the wordmarks with official files
when available. The five downloaded photos total approximately 406 KB.

## Known placeholders

- [TO CONFIRM: final website URL, including https://]
- Optional GA4 measurement ID and Meta Pixel ID
- Approved company logo (current wordmark is a stand-in)
- Photos matched to the 16 named projects
- Photos for HVAC design, testing/commissioning and maintenance service blocks

## How to deploy

1. Fill confirmed company details in js/config.js. Update HTML fallback contact
   text to match, for visitors who do not run JavaScript.
2. Test both email and WhatsApp drafts on desktop and mobile. FORM_ENDPOINT is optional;
   connect and test it only if direct server/email delivery is required.
3. Set SITE_URL to the final HTTPS domain/folder. Replace https://example.invalid/
   in sitemap.xml, then add the correct uncommented Sitemap line in robots.txt.
   Mirror the canonical and Open Graph URLs into each page head. Runtime JS also
   supplies these values from SITE_URL, but social crawlers may not execute it.
4. Upload index.html, about.html, services.html, projects.html, contact.html,
   css/, js/, assets/, sitemap.xml and robots.txt to the public web directory.
   README.md, IMAGE-SOURCES.md, QA-CHECKLIST.md and partials/ are editing references
   and do not need to be public. The separate construction-lab-ac-qa folder is
   local test material and must not be deployed.
5. Enable HTTPS in the hosting control panel and run QA-CHECKLIST.md on the live
   domain. Test a real enquiry and check it arrives before promoting the site.

## Google Maps

Contact uses the coordinates in the user-supplied listing for its lazy-loaded
embedded map. Get directions links directly to the supplied listing and remains
available if the embedded map is blocked. ADDRESS remains unconfirmed.

## Accessibility adjustment

The specified orange hover #D1621D with text #17202A has only 4.29:1 contrast.
Hover text uses #111820 instead (4.66:1). Normal orange buttons keep #17202A.
All other requested palette values are unchanged.

## Reference use

Utility and Yateem were consulted for general content order only: services,
project evidence and contact. No competitor text, images, styles or code are used.
