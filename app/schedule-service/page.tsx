import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Schedule Appliance Service",
  description:
    "Request residential washer, dryer, dishwasher, oven, range, or microwave repair within 50 miles of Cincinnati.",
  alternates: { canonical: "/schedule-service" },
};

export default function ScheduleServicePage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Appointment request"
        title="Schedule Appliance Service"
        intro="Share enough detail to prequalify the appliance, service area, access, and safety concerns. Your preferred appointment remains pending until confirmed directly."
      />
      <section className="section section--mist">
        <div className="container">
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
