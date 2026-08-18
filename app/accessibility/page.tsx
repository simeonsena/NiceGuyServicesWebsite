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
            <li>Semantic headings, regions, and form labels</li>
            <li>Visible keyboard focus and a skip link</li>
            <li>Keyboard-accessible navigation and form controls</li>
            <li>
              High-contrast text and status messages that do not rely on color
              alone
            </li>
            <li>Responsive layouts and large touch targets</li>
            <li>Reduced-motion support</li>
          </ul>
          <h2>Need another way to communicate?</h2>
          <p>
            Contact {businessConfig.phone} or {businessConfig.email} to request
            information or service through another available method.
          </p>
          <h2>Feedback</h2>
          <p className="policy-note">
            [EDITABLE ACCESSIBILITY CONTACT PLACEHOLDER: Add the monitored
            accessibility contact method and response process.]
          </p>
        </div>
      </section>
    </main>
  );
}
