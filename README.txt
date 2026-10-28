Sathvika & Sai Venkat | Kalyana Vaibhogam — Version 2_19 Optimized
=================================================================

This is a static site. Upload index.html and the entire assets/ folder into the
same public directory. Do not merge or overwrite the separate Version 1 website.

RSVP
----
The existing Version 2 Google Apps Script endpoint and all form field names are
unchanged. Successful responses were confirmed by the owner on Version 2_12;
this optimized release has NOT been independently confirmed to write to the Sheet.
The request uses fetch(mode="no-cors"), so the thank-you screen is not a database
acknowledgement. Verify a test Yes and No entry in the destination Sheet.

LINK PREVIEW
------------
The approved image is assets/og-preview.jpg (1200 x 630). For reliable WhatsApp
and social previews set og:image and twitter:image to the absolute HTTPS URL
of the Version 2 image on your deployed domain (not Version 1's URL).
The relative paths in index.html are only placeholders until the URL is known.
After deployment, check social preview caching with the relevant platform tools.

BUILD NOTES
-----------
This release removes demonstrably unused assets, removes stylesheet selectors
that cannot match the current HTML or JavaScript, and losslessly converts eligible decorative PNG files into pixel-identical
WebP, and generates appropriately sized icon PNGs. It does NOT recompress the selected wedding audio or
re-encode photographic artwork. No page layouts or RSVP form logic are changed.
The only functionality-related edit is the release tracking label V2_19.

Refer to the accompanying external Diagnostic_Report_V2_19.md for details.
