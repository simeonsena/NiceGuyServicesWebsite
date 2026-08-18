"use client";

export type ConversionEvent =
  | "phone_click"
  | "schedule_service_click"
  | "booking_started"
  | "booking_submitted"
  | "booking_failed"
  | "contact_submitted"
  | "service_area_checked"
  | "pricing_viewed"
  | "service_page_conversion";

export function trackConversion(
  event: ConversionEvent,
  detail: Record<string, string> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nice-guy:conversion", { detail: { event, ...detail } }),
  );
}
