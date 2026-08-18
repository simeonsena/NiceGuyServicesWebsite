"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { trackConversion } from "./analytics";

type Result = {
  status: "likely-inside" | "outside" | "manual-review";
  message: string;
};

export function ServiceAreaChecker({ compact = false }: { compact?: boolean }) {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);

  async function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    try {
      const response = await fetch("/api/v1/service-area", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ location }),
      });
      const data = (await response.json()) as Result;
      setResult(data);
      trackConversion("service_area_checked", { status: data.status });
    } catch {
      setResult({
        status: "manual-review",
        message:
          "The automated check is unavailable. Submit your address with a booking request for manual review.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className={`checker${compact ? " checker--compact" : ""}`}
      onSubmit={check}
      noValidate
    >
      <div className="checker__row">
        <div className="field">
          <label htmlFor="service-area-location">
            Service address or ZIP code
          </label>
          <input
            id="service-area-location"
            name="location"
            autoComplete="postal-code"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />
          <p className="field-hint">
            The complete address is confirmed before scheduling.
          </p>
        </div>
        <button
          className="button button--secondary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Checking..." : "Check area"}
        </button>
      </div>
      {result && (
        <div
          className={`form-status${result.status === "outside" ? " form-status--error" : result.status === "manual-review" ? " form-status--warning" : ""}`}
          role="status"
        >
          <strong>
            {result.status === "likely-inside"
              ? "Likely in range"
              : result.status === "outside"
                ? "Likely outside the normal area"
                : "Manual review needed"}
          </strong>
          <p>{result.message}</p>
          {result.status !== "likely-inside" && (
            <Link href="/schedule-service">Request a manual review</Link>
          )}
        </div>
      )}
    </form>
  );
}
