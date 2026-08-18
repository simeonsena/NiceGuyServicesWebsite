import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Nice Guy Appliance Services about a residential appliance question or an existing service request.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="General questions"
        title="Contact Nice Guy Appliance Services"
        intro="Use this form for general questions. Use Schedule Service when you are ready to request an appliance-repair appointment."
      />
      <section className="section section--white">
        <div className="container content-layout">
          <div className="content-layout__main">
            <ContactForm />
          </div>
          <aside className="content-layout__aside">
            <h2>Direct contact</h2>
            <p>
              <strong>Phone</strong>
              <br />
              <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>
            </p>
            <p>
              <strong>Email</strong>
              <br />
              <a href={`mailto:${businessConfig.email}`}>
                {businessConfig.email}
              </a>
            </p>
            <p>
              <strong>Hours</strong>
              <br />
              {businessConfig.hours}
            </p>
            <p className="field-hint">
              These editable placeholders must be replaced with approved
              business information.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
