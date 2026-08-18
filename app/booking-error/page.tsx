import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { businessConfig } from "@/src/config/business";

export const metadata: Metadata = {
  title: "Booking Request Not Submitted",
  description: "Retry a Nice Guy Appliance Services appointment request.",
  robots: { index: false, follow: false },
};

export default function BookingErrorPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Submission problem"
        title="The booking request was not submitted"
        intro="Return to the form to review and retry. Saved form details remain in this browser when available."
      />
      <section className="section section--white">
        <div className="container form-shell">
          <p>
            Try the form again, or call{" "}
            <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>.
            Do not assume an appointment exists unless you receive a request
            number and direct confirmation.
          </p>
          <Link className="button button--secondary" href="/schedule-service">
            Return to booking
          </Link>
        </div>
      </section>
    </main>
  );
}
