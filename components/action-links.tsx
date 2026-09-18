"use client";

import { businessConfig } from "@/src/config/business";
import { trackConversion } from "./analytics";

export function ActionLinks({
  context,
  compact = false,
}: {
  context: string;
  compact?: boolean;
}) {
  return (
    <div className={`action-links${compact ? " action-links--compact" : ""}`}>
      <a
        className="button button--primary"
        href={`tel:${businessConfig.phone}`}
        onClick={() => trackConversion("phone_click", { context })}
      >
        Call Now
      </a>
      <a
        className="button button--ghost"
        href={`mailto:${businessConfig.email}`}
        onClick={() => trackConversion("email_click", { context })}
      >
        Email Us
      </a>
    </div>
  );
}
