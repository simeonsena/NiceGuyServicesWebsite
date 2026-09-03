import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { serviceRoutes } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Residential Appliance Repair Services",
  description:
    "Washer, dryer, dishwasher, oven, range, and microwave repair services for residential customers within 25 miles of Cincinnati.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Residential service"
        title="Appliance repair with a clear, practical process"
        intro="Choose the appliance you need help with. Refrigeration, HVAC, furnaces, air conditioners, and commercial equipment are not included."
        showActions
      />
      <section className="section section--mist">
        <div className="container">
          <div className="service-grid">
            {serviceRoutes.map((service, index) => (
              <article className="service-card" key={service.slug}>
                <span className="service-card__number">0{index + 1}</span>
                <h2>{service.name}</h2>
                <p>{service.summary}</p>
                <Link href={`/services/${service.slug}`}>
                  Explore {service.name.toLowerCase()}
                </Link>
              </article>
            ))}
          </div>
          <p className="exclusion-note">
            <strong>Not a supported category?</strong> Refrigerator, freezer,
            air-conditioning, furnace, HVAC, refrigeration, and
            commercial-appliance requests cannot be booked.
          </p>
        </div>
      </section>
    </main>
  );
}
