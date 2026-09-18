"use client";

import { businessConfig } from "@/src/config/business";
import { trackConversion } from "./analytics";

export function MobileActions() {
  return (
    <nav className="mobile-actions" aria-label="Quick actions">
      <a
        href={`tel:${businessConfig.phone}`}
        onClick={() =>
          trackConversion("phone_click", { context: "mobile_sticky" })
        }
      >
        Call Now
      </a>
      <a
        href={`mailto:${businessConfig.email}`}
        onClick={() =>
          trackConversion("email_click", {
            context: "mobile_sticky",
          })
        }
      >
        Email Us
      </a>
    </nav>
  );
}
