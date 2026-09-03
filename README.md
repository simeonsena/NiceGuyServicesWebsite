# Nice Guy Appliance Services Website

Public website and appointment-request experience for Nice Guy Appliance Services, serving qualifying residential addresses within 25 miles of Cincinnati city center.

## Current capabilities

- Responsive multi-page website with distinct appliance service pages
- Central business configuration in `src/config/business.ts`
- Transparent pricing, service area, FAQ, policy, privacy, and accessibility content
- Mobile-first booking form with safety triage, access planning, uploads, and pending confirmation
- Separate contact form
- Server-side Zod validation, same-origin checks, honeypots, in-memory rate limiting, upload validation, and idempotency
- Local provider interfaces for future booking, notification, contact, analytics, and payment integrations
- Canonical metadata for `https://niceguyservices.com`, structured data, sitemap, robots, web manifest, icons, social image, and custom 404
- HTTPS, `www` canonical-host, and legacy-path redirects in the Worker entry point

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The default development URL is usually `http://localhost:3000`.

## Validation commands

```bash
npm run format
npm run lint
npm run typecheck
npm run test:unit
npm run test:api
npm run test:rendered
npm run test:e2e
npm run build
```

## Required business configuration

Before treating the site as production-ready, replace these values in `src/config/business.ts`:

- `[BUSINESS_ADDRESS_OR_SERVICE_AREA_LABEL]`
- `[BUSINESS_HOURS]`

The cancellation, privacy-retention, and accessibility-contact placeholders in the policy pages also require approved final language and professional review.

## Provider configuration

Copy `.env.example` to a local `.env` only when configuring a provider. Never commit real credentials.

The current `LocalBookingProvider` creates an in-memory pending request number. It does not persist bookings, reserve availability, send email, send SMS, or confirm an appointment. Replace the provider behind `src/providers/booking.ts` with the selected production scheduling service while preserving the interface. Configure notifications behind `src/providers/notifications.ts`.

Payments are intentionally absent. The placeholder environment name documents a future integration point only; do not add card fields or payment SDKs without a separate approved project.

The service-area checker uses ZIP-prefix screening. It is an initial "likely inside/outside" result and not an exact geocoded radius calculation. A production geocoding provider can replace the logic behind `/api/v1/service-area` without changing the form.

## Domain and hosting

The canonical host is `niceguyservices.com`. Production DNS must point both the apex and `www` records at the chosen host. The Worker permanently redirects `www.niceguyservices.com` to the apex and forces HTTPS for the canonical host.

For a typical host:

1. Add `niceguyservices.com` as the primary custom domain.
2. Add `www.niceguyservices.com` as an alias.
3. Configure the DNS records supplied by that host.
4. Verify TLS is active for both hosts.
5. Confirm the apex redirect, `/robots.txt`, `/sitemap.xml`, and social preview image.
6. Add production provider variables through the host's secret manager, not the repository.

Legacy `/book` and `/warranty` paths redirect permanently to `/schedule-service` and `/service-policies`. Add future changed URLs to the explicit `legacyRedirects` map in `worker/index.ts`; do not create thin duplicate pages.

## Data and privacy limitations

No database or file bucket is configured. Uploaded photos are validated but not retained by the local provider. In-memory rate limits reset when the Worker instance restarts and should be replaced with durable edge protection for production. Legal and policy content is an implementation draft and should receive professional review for the business and jurisdiction.

## Brand assets

`public/nice-guy-appliance-services-logo.png` is the supplied canonical transparent logo and must not be redrawn or replaced. `public/icon.png` and `public/apple-icon.png` use the same supplied artwork. `public/og.png` is the project social-share treatment derived from that brand reference.
