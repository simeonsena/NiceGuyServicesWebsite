import type { Metadata } from "next";
import { ContactMethods } from "@/components/contact-methods";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call or email Nice Guy Appliance Services about residential appliance repair near Cincinnati.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Direct contact"
        title="Contact Nice Guy Appliance Services"
        intro="Questions about a repair or ready to arrange service? Call or email us directly. Service is by appointment."
      />
      <section className="section section--white">
        <div className="container">
          <ContactMethods />
          <p className="contact-hours">Service hours: {businessConfig.hours}</p>
        </div>
      </section>
    </main>
  );
}
