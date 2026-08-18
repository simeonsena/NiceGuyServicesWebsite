import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nice Guy Appliance Services collects and uses contact, appliance, address, scheduling, and optional photo information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        intro="Only information reasonably needed to review and respond to service or contact requests should be collected."
      />
      <section className="section section--white">
        <div className="container prose">
          <h2>Information collected</h2>
          <p>
            Booking and contact forms may collect contact details, service
            address, appliance information, symptoms, scheduling preferences,
            access notes, policy consent, and optional photos.
          </p>
          <h2>How information is used</h2>
          <p>
            Information is used to evaluate the request, communicate with the
            customer, determine service-area eligibility, prepare for a visit,
            and maintain reasonable service records.
          </p>
          <h2>Photos and uploads</h2>
          <p>
            Only JPG, PNG, or WebP images up to 5 MB each are accepted. Do not
            upload unrelated documents, identity records, financial information,
            or payment-card data.
          </p>
          <h2>Sharing and providers</h2>
          <p>
            Production scheduling, email, SMS, analytics, and storage providers
            have not been selected. This policy must be updated when those
            services are configured.
          </p>
          <h2>Payments and sensitive data</h2>
          <p>
            This website does not collect or process payment-card data. Do not
            include sensitive financial or identity information in free-text
            fields.
          </p>
          <h2>Retention and requests</h2>
          <p className="policy-note">
            [EDITABLE PRIVACY PLACEHOLDER: Add the approved retention period,
            privacy contact, applicable customer rights, and final provider
            disclosures after professional review.]
          </p>
        </div>
      </section>
    </main>
  );
}
