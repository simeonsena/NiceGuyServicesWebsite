import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { faqItems } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about supported appliances, Cincinnati service area, diagnostic and labor pricing, parts, warranties, safety, and booking.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Before you book"
        title="Frequently asked questions"
        intro="Clear answers about supported appliances, service boundaries, pricing, parts, warranties, safety, and appointment requests."
      />
      <section className="section section--mist">
        <div className="container faq-preview">
          {faqItems.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
