import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ServiceAreaChecker } from "@/components/service-area-checker";

export const metadata: Metadata = {
  title: "Appliance Repair Service Area",
  description:
    "Check whether a residential address appears to be within the 25-mile Nice Guy Appliance Services radius from Cincinnati city center.",
  alternates: { canonical: "/service-area" },
};

export default function ServiceAreaPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="25-mile Cincinnati radius"
        title="Check Your Service Area"
        intro="Service is offered to qualifying residential addresses within 25 miles of Cincinnati city center. A ZIP result is an initial screen, not a promise of service."
      />
      <section className="section section--mist">
        <div className="container">
          <ServiceAreaChecker />
        </div>
      </section>
      <section className="section section--white">
        <div className="container prose">
          <h2>How the radius check works</h2>
          <p>
            The checker uses the ZIP code as an initial indicator. ZIP areas are
            irregular and can cross the 25-mile boundary, so the complete street
            address is reviewed before an appointment is accepted.
          </p>
          <h2>Borderline or uncertain addresses</h2>
          <p>
            If the result is uncertain, continue to the booking form and request
            manual review. Do not rely on a ZIP-only result when the address may
            sit outside the normal territory.
          </p>
          <h2>What the service area includes</h2>
          <p>
            Residential service locations only. This page does not create
            city-specific guarantees or expand the stated 25-mile radius.
          </p>
        </div>
      </section>
    </main>
  );
}
