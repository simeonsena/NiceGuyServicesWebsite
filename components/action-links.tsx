"use client";

import Link from "next/link";
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
      <Link
        className="button button--primary"
        href="/schedule-service"
        onClick={() => trackConversion("schedule_service_click", { context })}
      >
        Schedule Service
      </Link>
      <a
        className="button button--ghost"
        href={`tel:${businessConfig.phone}`}
        onClick={() => trackConversion("phone_click", { context })}
      >
        Call Now
      </a>
    </div>
  );
}
