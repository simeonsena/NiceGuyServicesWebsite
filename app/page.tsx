import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ActionLinks } from "@/components/action-links";
import { ReviewPlaceholder } from "@/components/review-placeholder";
import { businessConfig, faqItems, serviceRoutes } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Honest Appliance Repair in Cincinnati",
  description:
    "Residential washer, dryer, dishwasher, oven, range, and microwave repair within 25 miles of Cincinnati, with clear pricing and parts at cost whenever practical.",
  alternates: { canonical: "/" },
};

const trustItems = [
  [
    "Direct communication",
    "Reach a real local person without working through a national call-center maze.",
  ],
  [
    "Clear pricing",
    "Understand the diagnostic fee, labor, parts, and any extra-access charge before repair work begins.",
  ],
  [
    "Practical advice",
    "Get an honest repair-versus-replace recommendation based on age, condition, cost, and part availability.",
  ],
  [
    "No unnecessary upsells",
    "The goal is a sound diagnosis and an appropriate repair, not adding work that does not help.",
  ],
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero">
        <Image
          className="home-hero__art"
          src={businessConfig.brand.logo}
          alt=""
          width="1440"
          height="1080"
          aria-hidden="true"
          priority
        />
        <div className="container home-hero__content">
          <p className="eyebrow eyebrow--light">
            Independent appliance service near Cincinnati
          </p>
          <h1>Honest Appliance Repair Without Inflated Parts Markup</h1>
          <p className="home-hero__lead">
            In-home repair for washers, dryers, dishwashers, ovens, ranges, and
            microwaves within 25 miles of Cincinnati city center.
          </p>
          <ActionLinks context="home_hero" />
          <ul className="hero-facts" aria-label="Service highlights">
            <li>Local and independently operated</li>
            <li>Pricing approved before repair</li>
            <li>Direct human communication</li>
          </ul>
        </div>
      </section>

      <section
        className="qualification-band"
        aria-label="Service qualification summary"
      >
        <div className="container qualification-band__inner">
          <div>
            <strong>We repair</strong>
            <span>Washers, dryers, dishwashers, ovens, ranges, microwaves</span>
          </div>
          <div>
            <strong>Service area</strong>
            <span>
              Residential addresses within a 25-mile radius of Cincinnati
            </span>
          </div>
          <div>
            <strong>Not serviced</strong>
            <span>Refrigeration, air conditioning, furnaces, or HVAC</span>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">What you can expect</p>
              <h2>Clear answers before you approve a repair</h2>
            </div>
            <p>
              Appliance trouble is disruptive enough. The service process is
              designed to keep the diagnosis, options, and price understandable.
            </p>
          </div>
          <div className="trust-grid">
            {trustItems.map(([title, copy]) => (
              <article className="trust-item" key={title}>
                <span className="trust-item__mark" aria-hidden="true">
                  &bull;
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist" id="services">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Residential appliance repair</p>
            <h2>Service for the appliances that keep a home moving</h2>
            <p>
              Choose an appliance to see common problems, what to prepare, and
              how the visit works.
            </p>
          </div>
          <div className="service-grid">
            {serviceRoutes.map((service, index) => (
              <article className="service-card" key={service.slug}>
                <span className="service-card__number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
                <Link href={`/services/${service.slug}`}>
                  View {service.name.toLowerCase()}
                </Link>
              </article>
            ))}
          </div>
          <p className="exclusion-note">
            <strong>Important:</strong> Refrigerators, freezers, HVAC systems,
            air conditioners, and furnaces are not serviced.
          </p>
        </div>
      </section>

      <section className="section pricing-preview">
        <div className="container pricing-preview__layout">
          <div>
            <p className="eyebrow eyebrow--light">Straightforward pricing</p>
            <h2>Know how the visit is priced</h2>
            <p>{businessConfig.pricing.partsPolicy}</p>
            <Link className="text-link text-link--light" href="/pricing">
              See full pricing and policies
            </Link>
          </div>
          <div className="price-list">
            <div>
              <h3>Diagnostic fee</h3>
              <strong>$99</strong>
              <p>
                Charged when the recommended repair is declined; waived when the
                approved repair is completed.
              </p>
            </div>
            <div>
              <h3>Standard labor</h3>
              <strong>$250</strong>
              <p>Flat labor per completed repair, plus parts.</p>
            </div>
            <div>
              <h3>Additional technician</h3>
              <strong>+$200</strong>
              <p>
                Only for qualifying two-technician work and disclosed before
                repair.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>A practical path from problem to decision</h2>
          </div>
          <ol className="process-list">
            {[
              "Schedule service and share the appliance details.",
              "Receive an in-home diagnosis.",
              "Review the recommendation and complete price.",
              "Approve or decline without pressure.",
              "Complete the repair when it makes practical sense.",
            ].map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--warm">
        <div className="container decision-layout">
          <div>
            <p className="eyebrow">Repair or replace?</p>
            <h2>Sometimes the honest answer is not to repair</h2>
            <p>
              A useful recommendation considers the appliance age, repair and
              replacement costs, part availability, condition, prior repair
              history, safety, and likely remaining service life.
            </p>
          </div>
          <blockquote>
            The right repair is one that makes practical and financial sense for
            the customer.
          </blockquote>
        </div>
      </section>

      <ReviewPlaceholder />

      <section className="section section--white">
        <div className="container area-callout">
          <div>
            <p className="eyebrow">25-mile Cincinnati service radius</p>
            <h2>See whether your address is likely in range</h2>
            <p>
              The ZIP check is an initial screening. The complete residential
              address is confirmed before the appointment is scheduled.
            </p>
          </div>
          <Link className="button button--secondary" href="/service-area">
            Check service area
          </Link>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Common questions</p>
              <h2>Useful answers before you book</h2>
            </div>
            <Link className="text-link" href="/faq">
              View all FAQs
            </Link>
          </div>
          <div className="faq-preview">
            {faqItems.slice(0, 5).map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta__inner">
          <div>
            <p className="eyebrow eyebrow--light">Ready to request service?</p>
            <h2>Tell us what the appliance is doing.</h2>
            <p>
              For supported residential appliances within 25 miles of
              Cincinnati.
            </p>
          </div>
          <ActionLinks context="home_final" />
        </div>
      </section>
    </main>
  );
}
