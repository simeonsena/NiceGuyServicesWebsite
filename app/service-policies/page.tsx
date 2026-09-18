import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Service Policies",
  description:
    "Diagnostic fee, pricing, workmanship warranty, customer-supplied parts, access, cancellation, and safety policies for Nice Guy Appliance Services.",
  alternates: { canonical: "/service-policies" },
};

export default function PoliciesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Read before service"
        title="Service policies"
        intro="Review the current pricing, warranty, parts, and safety terms before arranging service."
      />
      <section className="section section--white">
        <div className="container prose">
          <h2>Diagnostic fee and repair approval</h2>
          <p>
            The standard diagnostic fee is $99 when the recommended repair is
            declined. It is waived when the customer approves and completes the
            recommended repair. Final pricing is confirmed before repair work
            begins.
          </p>
          <h2>Standard and additional labor</h2>
          <p>
            Standard labor is $250 per completed repair, plus parts. Work
            requiring a second technician may include an additional $200 labor
            charge disclosed before repair.
          </p>
          <h2>30-day workmanship warranty</h2>
          <p>
            Labor performed by {businessConfig.name} is covered for 30 days
            beginning on the date the repair is completed. The policy covers
            correction of a workmanship issue connected to that repair.
          </p>
          <h3>What is not covered</h3>
          <p>
            Unrelated failures, new failures, misuse, additional damage, unsafe
            conditions, and unauthorized modifications are not covered by the
            workmanship warranty.
          </p>
          <h2>Customer-supplied parts</h2>
          <p>
            Customer-supplied parts receive 30 days of coverage under this
            policy. The part must be compatible with the appliance and
            appropriate for the repair. Installation may be declined when a part
            is visibly damaged, incorrect, unsafe, used, modified, or
            incompatible. This policy does not create a manufacturer warranty.
          </p>
          <h2>Requesting warranty service</h2>
          <p>
            Call{" "}
            <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>{" "}
            or email{" "}
            <a href={`mailto:${businessConfig.email}`}>
              {businessConfig.email}
            </a>{" "}
            with the completion date, appliance details, and a description of
            the concern.
          </p>
          <h2>Appointment changes and cancellations</h2>
          <p>
            If you need to change or cancel an appointment, please contact us
            directly by phone or email as soon as you can.
          </p>
          <h2>Safety and access</h2>
          <p>
            Customers must disclose stacked or built-in units, stairs,
            restricted access, movement needs, gas odors, smoke, sparking,
            burning smells, or serious leakage near electrical components.
            Unsafe work may be postponed or declined.
          </p>
        </div>
      </section>
    </main>
  );
}
