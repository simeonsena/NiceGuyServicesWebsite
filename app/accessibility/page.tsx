import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Accessibility commitment and contact information for the Nice Guy Appliance Services website.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Accessibility"
        title="Accessibility statement"
        intro="Nice Guy Appliance Services aims to make this website usable with keyboards, screen readers, magnification, touch input, and reduced-motion preferences."
      />
      <section className="section section--white">
        <div className="container prose">
          <h2>Measures included</h2>
          <ul>
            <li>Semantic headings and regions</li>
            <li>Visible keyboard focus and a skip link</li>
            <li>Keyboard-accessible navigation and service-area checker</li>
            <li>
              High-contrast text and status messages that do not rely on color
              alone
            </li>
            <li>Responsive layouts and large touch targets</li>
            <li>Reduced-motion support</li>
          </ul>
          <h2>Need another way to communicate?</h2>
          <p>
            Call{" "}
            <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>{" "}
            or email{" "}
            <a href={`mailto:${businessConfig.email}`}>
              {businessConfig.email}
            </a>{" "}
            to request information or service through another available method.
          </p>
          <h2>Feedback</h2>
          <p>
            Use the phone number or email above to report an accessibility
            barrier or request help with any information on this site.
          </p>
        </div>
      </section>
    </main>
  );
}
