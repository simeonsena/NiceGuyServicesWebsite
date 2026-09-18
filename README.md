# Nice Guy Appliance Services Website

Public website for Nice Guy Appliance Services, serving qualifying residential addresses within 25 miles of Cincinnati city center. Appointments are arranged by phone or email.

## Current capabilities

- Responsive service, pricing, service-area, FAQ, policy, and contact pages
- Direct `tel:` and `mailto:` actions using the approved business phone and email
- $99 diagnostic fee and other approved pricing in `src/config/business.ts`
- Preliminary ZIP-based service-area checker with manual review instructions
- Canonical metadata, structured data, sitemap, robots, web manifest, and supplied brand assets
- HTTPS, `www` canonical-host, and legacy-path redirects in the Worker entry point

The site has no online booking or contact form. Old form submission endpoints return HTTP 410 with direct contact instructions. No page issues a request number or claims that a message was delivered.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The default development URL is usually `http://localhost:3000`.

## Validation

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

## Domain and hosting

The canonical host is `niceguyservices.com`. Both apex and `www` need verified DNS and HTTPS. The Worker redirects `www.niceguyservices.com` to the apex and forces HTTPS for the canonical host. Check current DNS records before changing them, especially MX, SPF, DKIM, and DMARC records used by `ssena@niceguyservices.com`.

Legacy `/book`, `/booking-confirmation`, and `/booking-error` paths redirect to `/schedule-service`; `/warranty` redirects to `/service-policies`.

## Service-area limitation

The ZIP checker is a preliminary screen, not an exact distance calculation or appointment guarantee. Customers can call or email the complete address for review.

## Brand assets

`public/nice-guy-appliance-services-logo.png` is the supplied canonical transparent logo. `public/icon.png`, `public/apple-icon.png`, and `public/og.png` derive from that artwork.
