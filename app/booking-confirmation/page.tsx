import type { Metadata } from "next";
import { BookingConfirmation } from "@/components/booking-confirmation";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Booking Request Received",
  description:
    "Review a pending Nice Guy Appliance Services appointment request.",
  robots: { index: false, follow: false },
};

export default function BookingConfirmationPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Request received"
        title="Your request is pending confirmation"
        intro="The preferred date and window are not confirmed until Nice Guy Appliance Services responds directly."
      />
      <BookingConfirmation />
    </main>
  );
}
