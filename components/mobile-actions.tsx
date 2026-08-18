"use client";

import Link from "next/link";
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
      <Link
        href="/schedule-service"
        onClick={() =>
          trackConversion("schedule_service_click", {
            context: "mobile_sticky",
          })
        }
      >
        Schedule Service
      </Link>
    </nav>
  );
}
