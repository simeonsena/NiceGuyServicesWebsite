"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { businessConfig } from "@/src/config/business";

type BookingReceipt = {
  reference?: string;
  status?: string;
  message?: string;
  details?: Record<string, string>;
};

export function BookingConfirmation() {
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setReceipt(
          JSON.parse(sessionStorage.getItem("nice-guy-last-booking") ?? "null"),
        );
      } catch {
        setReceipt(null);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="section section--white">
      <div className="container form-shell">
        <div className="form-status">
          <strong>Request received and pending confirmation</strong>
          <p>
            {receipt?.message ??
              "Your appointment is not confirmed until Nice Guy Appliance Services responds directly."}
          </p>
        </div>
        <dl className="receipt-list">
          <div>
            <dt>Request number</dt>
            <dd>{receipt?.reference ?? "Unavailable in this browser"}</dd>
          </div>
          {receipt?.details &&
            Object.entries(receipt.details).map(([key, value]) => (
              <div key={key}>
                <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        <p>
          No production email or text provider is configured yet. Keep the
          request number and call{" "}
          <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a> if
          you need immediate follow-up.
        </p>
        <div className="form-actions">
          <Link className="button button--secondary" href="/">
            Return home
          </Link>
          <Link className="text-link" href="/contact">
            Contact the business
          </Link>
        </div>
      </div>
    </section>
  );
}
