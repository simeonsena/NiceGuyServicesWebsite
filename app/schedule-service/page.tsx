import type { Metadata } from "next";
import { ContactMethods } from "@/components/contact-methods";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Schedule Appliance Service",
  description:
    "Call or email Nice Guy Appliance Services to arrange residential appliance repair within 25 miles of Cincinnati.",
  alternates: { canonical: "/schedule-service" },
};

export default function ScheduleServicePage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="By appointment"
        title="Schedule Appliance Service"
        intro="Call or email us to discuss your appliance and arrange a visit. Your appointment is set only when we confirm the date and time with you directly."
      />
      <section className="section section--white">
        <div className="container">
          <ContactMethods />
          <div className="prose contact-prep">
            <h2>Helpful details to have ready</h2>
            <ul>
              <li>Appliance type, brand, and model number if available</li>
              <li>What is happening and when the problem started</li>
              <li>Service address or ZIP code for area review</li>
              <li>Any access or safety concerns</li>
            </ul>
            <p>
              We serve qualifying residential addresses within 25 miles of
              Cincinnati city center. Please do not wait for an appointment if
              there is an immediate gas, fire, or electrical emergency.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
