import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Nice Guy Appliance Services approaches residential appliance diagnosis, pricing, communication, and repair decisions near Cincinnati.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Locally operated"
        title="Practical service without the national call-center experience"
        intro="Nice Guy Appliance Services is an independent residential appliance repair business built around clear diagnosis, direct communication, and repair decisions that make financial sense."
        showActions
      />
      <section className="section section--white">
        <div className="container content-layout">
          <article className="content-layout__main prose">
            <h2>A straightforward way to handle appliance trouble</h2>
            <p>
              The process begins with useful appliance and access details,
              continues with an in-home diagnosis, and ends with a
              recommendation and price you can evaluate before repair work
              begins.
            </p>
            <h2>What the business emphasizes</h2>
            <ul>
              <li>Honest troubleshooting and practical repair advice</li>
              <li>Transparent diagnostic and labor pricing</li>
              <li>
                Parts charged at actual acquisition cost whenever practical
              </li>
              <li>Direct human communication</li>
              <li>No unnecessary upselling</li>
              <li>A candid repair-versus-replace recommendation</li>
            </ul>
            <h2>Defined service boundaries</h2>
            <p>
              Supported work includes washers, dryers, dishwashers, ovens,
              ranges, and microwaves at qualifying residential addresses.
              Refrigeration, HVAC, furnaces, air conditioners, and commercial
              appliances are excluded.
            </p>
          </article>
          <aside className="content-layout__aside">
            <h2>Business details</h2>
            <p>
              Service is {businessConfig.hours.toLowerCase()} for qualifying
              residential addresses within 25 miles of Cincinnati city center.
            </p>
            <p>
              Call{" "}
              <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>{" "}
              or email{" "}
              <a href={`mailto:${businessConfig.email}`}>
                {businessConfig.email}
              </a>
              .
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
