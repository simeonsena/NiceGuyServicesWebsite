import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nice Guy Appliance Services uses information shared by phone or email about appliance service.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        intro="This page explains how information you share while asking about appliance service is used."
      />
      <section className="section section--white">
        <div className="container prose">
          <h2>Information collected</h2>
          <p>
            When you call or email, you may provide your name, contact details,
            service location, appliance information, symptoms, access notes,
            scheduling preferences, and photos you choose to email. This website
            does not offer a booking or contact submission form.
          </p>
          <h2>How information is used</h2>
          <p>
            We use the information to respond, determine whether the appliance
            and location are in our service scope, arrange a visit, and keep
            records related to service provided.
          </p>
          <h2>Photos and email</h2>
          <p>
            You can choose to email appliance photos or a model-label photo. Do
            not send unrelated documents, identity records, financial
            information, or payment-card data.
          </p>
          <h2>Sharing and providers</h2>
          <p>
            Phone and email providers carry communications you initiate. Website
            hosting may process technical information needed to serve pages and
            protect the site. We do not offer online scheduling or payment
            processing on this website.
          </p>
          <h2>Payments and sensitive data</h2>
          <p>
            This website does not collect payment-card data. Do not include
            sensitive financial or identity information in an email about
            service.
          </p>
          <h2>Questions about your information</h2>
          <p>
            For a question about information you have shared with us, call{" "}
            <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>{" "}
            or email{" "}
            <a href={`mailto:${businessConfig.email}`}>
              {businessConfig.email}
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
