# Wedding Website Version 2 — Full Diagnostic & Optimisation Report

**Build:** Version 2_19 Optimized  
**Source:** Supplied `SVR Wedding Website.zip`, containing Version 2_18  
**Scope:** Unused assets, legacy code, performance, page structure, metadata, form integration, accessibility basics and deployment risks.  
**Result:** Static validation passed; browser visual and production RSVP write tests still require manual verification.

## Executive summary

| Metric | Source | Optimised |
|---|---:|---:|
| Website files (excluding this report) | 76 | 68 |
| Uncompressed website size | 25.88 MiB | 22.78 MiB |
| Reduction | — | **3.10 MiB (12.0%)** |
| Unused image assets removed | — | **10** |
| Obsolete CSS rules removed | — | **583** |
| Decorative PNGs converted losslessly to WebP | — | **27** |
| Lossless media savings | — | 0.98 MiB |

These optimisations do **not** re-encode the music or photographic artwork, change invitation wording, change the approved page layout, change the RSVP form field names, or change the Google Apps Script endpoint.

## 1. Unused assets removed

The following images had no surviving references in page markup, JavaScript, or stylesheets after unused CSS was removed:

| Removed asset | Original bytes |
|---|---:|
| `assets/section2-ivory-card.webp` | 117,204 |
| `assets/section2-single-card-tall.webp` | 213,704 |
| `assets/section2-single-card-wide-mobile.webp` | 178,876 |
| `assets/section2-single-card.webp` | 279,154 |
| `assets/section2-top-strip-clean.png` | 24,228 |
| `assets/section4/lotus_center_only.png` | 25,807 |
| `assets/section4/scroll_v2_2_yes_desktop.webp` | 282,468 |
| `assets/section4/scroll_v2_2_yes_mid.webp` | 308,244 |
| `assets/section4/scroll_v2_2_yes_mobile.webp` | 364,834 |
| `assets/section4/scroll_v2_2_yes_small.webp` | 397,122 |

**Total removed from unused images: 2.09 MiB.** This includes four obsolete early Yes-scroll variants, the removed Section 2 card artwork, and an unused lotus image. Current Yes and No scroll art is retained.

## 2. CSS cleanup

Removed CSS rules that require absent IDs/classes and cannot match the current HTML or JavaScript states. All retained declarations remain in their original cascade order. Historical CSS comments were removed.

| Stylesheet | Orphan rules removed |
|---|---:|
| `assets/section3/section3.css` | 45 |
| `assets/section4/section4.css` | 16 |
| `assets/section5/section5.css` | 35 |
| `assets/version2.css` | 68 |
| `index.html inline` | 419 |

The deprecated multi-event page, former standalone Section 2 card, retired RSVP event checkboxes and unused venue decoration selectors account for much of the reduction. Media queries and active styles are retained.

## 3. Image optimisation and visual fidelity

- **27 PNG files** were converted to **lossless WebP** only when a meaningful saving was available.
- Every converted image was decoded and compared against its original at full resolution. **All pixel values, including transparency, matched exactly.**
- The original high-resolution SS monogram is now served as a pixel-identical lossless WebP. Small PNG favicon and Apple-touch-icon derivatives are included for more efficient icon loading.
- Approved photo backgrounds, venue waterfront, social preview image and the 320 kbps wedding MP3 were **not re-encoded**.
- The music source has `preload="none"`, but the existing script attempts playback on arrival, which may still initiate download depending on browser autoplay policy.

## 4. Code and functional integrity checks

**25 checks passed**, including:

- [x] unique html ids
- [x] ids preserved
- [x] primary sections preserved
- [x] form field names preserved
- [x] forms count preserved
- [x] nav targets resolve
- [x] images have alt
- [x] countdown ist correct
- [x] only muhurtham
- [x] audio preload none
- [x] preview image correct size
- [x] social titles bride first
- [x] backend endpoint identical
- [x] backend fields preserved
- [x] tracked version consistent
- [x] lossless images identical
- [x] byte identical wedding-music.mp3
- [x] byte identical og-preview.jpg
- [x] byte identical madurai waterfront final approved skybridge.webp
- [x] all local asset refs resolve
- [x] no stylesheet parse errors
- [x] all javascript syntax passes
- [x] visible text unchanged
- [x] no unintended text rewrite
- [x] no old artwork refs


**Local asset references validated:** 77. No missing referenced assets or CSS parser errors found. Both external and inline scripts passed Node syntax checks. Existing HTML IDs, RSVP form field names, main sections, visible page text, and internal navigation anchors are preserved.

**RSVP integration:** The original Version 2 Apps Script `/exec` endpoint and posted field names remain intact. Only the release tracking label was updated to `V2_19` (and HTML `2_19`). This changes how test responses are labelled, not where they are sent.

**Countdown:** Correctly targets `2026-11-20T00:00:00+05:30`, midnight at the start of 20 November in India. The site still shows the single Muhurtham ceremony, scheduled for 9:39 AM IST.

## 5. Important outstanding issues

### Social share image URL — configure after deployment
The Open Graph and Twitter image tags still contain the relative path `assets/og-preview.jpg`. For dependable WhatsApp and social previews, replace both with the **absolute HTTPS URL of Version 2's deployed image**, and validate the public preview. Do not insert Version 1's URL. This setting needs the final Version 2 domain, which was not supplied.

### RSVP submission acknowledgement — platform limitation
The form uses `fetch(..., {mode: "no-cors"})` and therefore shows its thank-you message after the browser accepts the request, **without being able to inspect a successful Google Sheets write**. The user previously confirmed production RSVP responses reached the separate Sheet; nevertheless, submit one Yes and one No test from the deployed optimized version and check both rows in the new Sheet.

### Browser-based visual regression test — not completed
The installed Chromium environment is governed by a URL block policy and refused both localhost and file navigation. Consequently, no successful real-browser screenshots, animation tests, device-size visual comparisons, or Lighthouse performance scores were available in this audit. **Do not treat this build as visually verified on mobile or desktop.** The cleanup was designed to leave active CSS declarations and visible content unchanged, but published-device checks are still necessary.

### Third-party fonts and media
The page depends on Google Fonts. Offline or blocked font loading will use fallback fonts. The 3.5-minute wedding music file remains roughly 8 MB, deliberately preserved at its original quality; MP3 transcoding would risk audible generational loss.

## 6. Final deployment checklist

- [ ] Keep the Version 1 repository and website untouched.
- [ ] Upload the **contents** of `Version_2_19_Optimized/` to the separate Version 2 site (not the parent folder, unless the host expects it).
- [ ] Verify desktop and phone display, especially Hero, ceremony join, short Yes and No scrolls, confirmation scroll, and Venue-to-waterfront join.
- [ ] Test RSVP Yes and No, check corresponding rows in the intended Google Sheet, and confirm the `V2_19` version label.
- [ ] Check petal toggle, music Play/Pause, Google Maps directions, the calendar default of 20 November, and the countdown.
- [ ] Update the two share-image tags to the final public HTTPS URL, then verify a WhatsApp preview (caching may delay changes).
- [ ] Ensure the host serves `.webp` as `image/webp` and uses appropriate browser cache headers for assets.
- [ ] Revert to the supplied Version 2_18 ZIP if any unexpected visual regression appears.

## 7. Preservation statement

The supplied source ZIP was read and copied to create this independent output; it was not overwritten. No Version 1 website files were opened for editing or modified. The output is a standalone Version 2 build.
