import { LaborPricing } from "@/components/labor-pricing";
import type { Metadata } from "next";
import { ActionLinks } from "@/components/action-links";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";
import { serviceRoutes } from "@/src/config/business";
import { PartsPriceExamples } from "@/components/parts-price-examples";
import { partsPricing } from "@/src/config/parts-pricing";

export const metadata: Metadata = {
  title: "Appliance Repair Pricing",
  description:
    "Transparent appliance repair: $99 diagnostic visit, $49/$99/$149 labor tiers, parts at cost, and additional labor only with approval.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Transparent pricing"
        title="A clear price before repair work begins"
        intro="Diagnosis comes first. You receive the repair recommendation and complete price before deciding whether the work makes sense."
      />
      <section className="section section--mist">
        <div className="container">
          <LaborPricing />
        </div>
      </section>
      <section className="section section--white">
        <div className="container content-layout">
          <article className="content-layout__main prose">
            <h2>Parts without inflated retail markup</h2>
            <p>
              {businessConfig.pricing.partsPolicy} Part availability and
              acquisition price cannot be guaranteed until the appliance and
              required repair are diagnosed.
            </p>
            <h2>Common replacement parts</h2>
            {serviceRoutes
              .filter((service) => service.slug in partsPricing.appliances)
              .map((service) => (
                <section key={service.slug}>
                  <h3>{service.name}</h3>
                  <PartsPriceExamples slug={service.slug} />
                </section>
              ))}
            <p>{partsPricing.scopeNote}</p>
            <h2>What can affect the final cost?</h2>
            <ul>
              <li>The diagnosed failure and required parts</li>
              <li>The appliance configuration and installation</li>
              <li>Access, stairs, movement, or built-in removal needs</li>
              <li>Whether an additional technician is required</li>
              <li>Part availability and compatibility</li>
            </ul>
            <p className="policy-note">{businessConfig.pricing.disclaimer}</p>
            <h2>No symptom-based guaranteed totals</h2>
            <p>
              An error code or symptom can have more than one cause. Online
              descriptions help prepare for the visit but are not a guaranteed
              quote.
            </p>
          </article>
          <aside className="content-layout__aside">
            <h2>Ready to request service?</h2>
            <p>
              Share the appliance details so the visit can be prequalified
              before scheduling.
            </p>
            <ActionLinks compact context="pricing" />
          </aside>
        </div>
      </section>
    </main>
  );
}
