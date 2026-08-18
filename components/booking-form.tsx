"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { businessConfig } from "@/src/config/business";
import { getSafetyWarnings, validateUpload } from "@/src/domain/qualification";
import { trackConversion } from "./analytics";

type FieldErrors = Record<string, string[] | undefined>;
type SafetyKey =
  | "gasOdor"
  | "smoke"
  | "sparking"
  | "fire"
  | "burningSmell"
  | "severeLeakNearElectrical";
const draftKey = "nice-guy-booking-draft";

function firstError(errors: FieldErrors, name: string) {
  return errors[name]?.[0];
}

export function BookingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKey = useRef("");
  const started = useRef(false);
  const [appliance, setAppliance] = useState("");
  const [safety, setSafety] = useState<Partial<Record<SafetyKey, boolean>>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const form = formRef.current;
      if (!form) return;
      try {
        const draft = JSON.parse(
          sessionStorage.getItem(draftKey) ?? "{}",
        ) as Record<string, string | boolean>;
        for (const element of Array.from(form.elements)) {
          if (!(
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement ||
            element instanceof HTMLSelectElement
          ))
            continue;
          if (!(element.name in draft) || element.type === "file") continue;
          if (
            element instanceof HTMLInputElement &&
            (element.type === "checkbox" || element.type === "radio")
          )
            element.checked = Boolean(draft[element.name]);
          else element.value = String(draft[element.name] ?? "");
        }
        if (typeof draft.appliance === "string") setAppliance(draft.appliance);
        const restoredSafety: Partial<Record<SafetyKey, boolean>> = {};
        for (const key of [
          "gasOdor",
          "smoke",
          "sparking",
          "fire",
          "burningSmell",
          "severeLeakNearElectrical",
        ] as SafetyKey[])
          restoredSafety[key] = Boolean(draft[key]);
        setSafety(restoredSafety);
      } catch {
        sessionStorage.removeItem(draftKey);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    const draft: Record<string, string | boolean> = {};
    for (const element of Array.from(form.elements)) {
      if (!(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      ))
        continue;
      if (
        !element.name ||
        element.type === "file" ||
        element.name === "company"
      )
        continue;
      if (
        element instanceof HTMLInputElement &&
        (element.type === "checkbox" || element.type === "radio")
      )
        draft[element.name] = element.checked;
      else draft[element.name] = element.value;
    }
    sessionStorage.setItem(draftKey, JSON.stringify(draft));
  }

  function handleChange(event: React.ChangeEvent<HTMLFormElement>) {
    const target = event.target as unknown as
      HTMLInputElement | HTMLSelectElement;
    if (target.name === "appliance") setAppliance(target.value);
    if (
      [
        "gasOdor",
        "smoke",
        "sparking",
        "fire",
        "burningSmell",
        "severeLeakNearElectrical",
      ].includes(target.name)
    ) {
      setSafety((current) => ({
        ...current,
        [target.name]: (target as HTMLInputElement).checked,
      }));
    }
    saveDraft();
  }

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackConversion("booking_started");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setStatus("");
    const formData = new FormData(event.currentTarget);
    for (const name of ["appliancePhoto", "modelLabelPhoto"]) {
      const file = formData.get(name);
      if (file instanceof File && file.size > 0) {
        const validation = validateUpload(file);
        if (!validation.valid) {
          setErrors({ [name]: [validation.error ?? "Invalid upload."] });
          setStatus("Review the selected image before submitting.");
          setPending(false);
          return;
        }
      }
    }
    idempotencyKey.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "idempotency-key": idempotencyKey.current },
        body: formData,
      });
      const data = (await response.json()) as {
        message?: string;
        fieldErrors?: FieldErrors;
        reference?: string;
        status?: string;
        details?: Record<string, string>;
      };
      if (!response.ok) {
        setErrors(data.fieldErrors ?? {});
        setStatus(
          data.message ?? "The booking request could not be submitted.",
        );
        trackConversion("booking_failed");
        return;
      }
      sessionStorage.removeItem(draftKey);
      sessionStorage.setItem("nice-guy-last-booking", JSON.stringify(data));
      trackConversion("booking_submitted", {
        status: data.status ?? "pending",
      });
      window.location.assign(
        `/booking-confirmation?reference=${encodeURIComponent(data.reference ?? "")}`,
      );
    } catch {
      setStatus(
        "The booking request could not be submitted. Your information remains in this form so you can try again.",
      );
      trackConversion("booking_failed");
    } finally {
      setPending(false);
    }
  }

  const warnings = getSafetyWarnings(safety);
  const invalid = (name: string) => Boolean(firstError(errors, name));
  const error = (name: string) =>
    firstError(errors, name) ? (
      <p className="field-error" id={`${name}-error`}>
        {firstError(errors, name)}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      className="form-shell"
      onSubmit={submit}
      onChange={handleChange}
      onFocus={markStarted}
      noValidate
      encType="multipart/form-data"
    >
      <p className="required-note">
        Fields marked with * are required. This is an appointment request; the
        date is pending until confirmed directly.
      </p>
      {status && (
        <div className="form-status form-status--error" role="alert">
          {status}
        </div>
      )}

      <fieldset className="form-section">
        <legend>1. Contact and service address</legend>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="name">Customer name *</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              aria-invalid={invalid("name")}
              aria-describedby={invalid("name") ? "name-error" : undefined}
              required
            />
            {error("name")}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={invalid("phone")}
              required
            />
            {error("phone")}
          </div>
          <div className="field">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={invalid("email")}
              required
            />
            {error("email")}
          </div>
          <div className="field field--full">
            <label htmlFor="address">Service address *</label>
            <input
              id="address"
              name="address"
              autoComplete="street-address"
              aria-invalid={invalid("address")}
              required
            />
            {error("address")}
          </div>
        </div>
        <div className="field-grid field-grid--three">
          <div className="field">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              aria-invalid={invalid("city")}
              required
            />
            {error("city")}
          </div>
          <div className="field">
            <label htmlFor="state">State *</label>
            <input
              id="state"
              name="state"
              defaultValue="OH"
              maxLength={2}
              autoComplete="address-level1"
              aria-invalid={invalid("state")}
              required
            />
            {error("state")}
          </div>
          <div className="field">
            <label htmlFor="zip">ZIP code *</label>
            <input
              id="zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              aria-invalid={invalid("zip")}
              required
            />
            {error("zip")}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>2. Appliance and problem</legend>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="appliance">Appliance category *</label>
            <select
              id="appliance"
              name="appliance"
              value={appliance}
              onChange={(event) => setAppliance(event.target.value)}
              aria-invalid={invalid("appliance")}
              required
            >
              <option value="">Select an appliance</option>
              {businessConfig.supportedAppliances.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {error("appliance")}
          </div>
          {appliance === "Other supported residential appliance" && (
            <div className="field">
              <label htmlFor="otherAppliance">Describe the appliance *</label>
              <input
                id="otherAppliance"
                name="otherAppliance"
                aria-invalid={invalid("otherAppliance")}
                required
              />
              {error("otherAppliance")}
            </div>
          )}
          <div className="field">
            <label htmlFor="brand">Brand *</label>
            <input
              id="brand"
              name="brand"
              autoComplete="off"
              aria-invalid={invalid("brand")}
              required
            />
            <p className="field-hint">
              Enter <q>Unknown</q> when the brand is unavailable.
            </p>
            {error("brand")}
          </div>
          <div className="field">
            <label htmlFor="modelNumber">Model number</label>
            <input id="modelNumber" name="modelNumber" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="applianceAge">Approximate appliance age</label>
            <input
              id="applianceAge"
              name="applianceAge"
              placeholder="Example: about 7 years"
            />
          </div>
          <div className="field">
            <label htmlFor="errorCode">Error code, if any</label>
            <input id="errorCode" name="errorCode" autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="problemBegan">When did the problem begin?</label>
            <input
              id="problemBegan"
              name="problemBegan"
              placeholder="Example: yesterday"
            />
          </div>
          <div className="field">
            <label htmlFor="operational">Is the appliance operational?</label>
            <select id="operational" name="operational">
              <option>Unknown</option>
              <option>Yes, partly</option>
              <option>Yes, normally except for this issue</option>
              <option>No</option>
            </select>
          </div>
          <div className="field field--full">
            <label htmlFor="problemDescription">Describe the problem *</label>
            <textarea
              id="problemDescription"
              name="problemDescription"
              aria-invalid={invalid("problemDescription")}
              required
            />
            {error("problemDescription")}
          </div>
        </div>
        <p className="exclusion-note">
          Refrigerators, freezers, air conditioners, furnaces, HVAC,
          refrigeration, and commercial appliances are not accepted through this
          form.
        </p>
      </fieldset>

      <fieldset className="form-section">
        <legend>3. Safety check</legend>
        <p>
          Select every condition that applies. You may still submit the request,
          but immediate safety comes first.
        </p>
        <div className="check-grid">
          {(
            [
              ["gasOdor", "Gas odor"],
              ["smoke", "Smoke"],
              ["sparking", "Active sparking"],
              ["fire", "Fire"],
              ["burningSmell", "Burning electrical odor"],
              [
                "severeLeakNearElectrical",
                "Serious leakage near electrical components",
              ],
            ] as const
          ).map(([name, label]) => (
            <label className="check-option" key={name}>
              <input type="checkbox" name={name} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {warnings.length > 0 && (
          <div className="form-status form-status--error" role="alert">
            <strong>Stop using the appliance.</strong>
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="form-section">
        <legend>4. Appointment preferences</legend>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="preferredDate">Preferred date *</label>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              aria-invalid={invalid("preferredDate")}
              required
            />
            {error("preferredDate")}
          </div>
          <div className="field">
            <label htmlFor="preferredWindow">Preferred time window *</label>
            <select
              id="preferredWindow"
              name="preferredWindow"
              aria-invalid={invalid("preferredWindow")}
              required
            >
              <option value="">Select a window</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Any available window</option>
            </select>
            {error("preferredWindow")}
          </div>
          <div className="field field--full">
            <label htmlFor="secondaryPreference">
              Secondary date or time preference
            </label>
            <input
              id="secondaryPreference"
              name="secondaryPreference"
              placeholder="A second option helps with scheduling"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>5. Access and labor planning</legend>
        <div className="check-grid">
          {(
            [
              ["stacked", "The unit is stacked"],
              ["builtIn", "The appliance is built in"],
              ["mustBeMoved", "The appliance may need to be moved"],
              ["stairs", "Stairs are involved"],
              [
                "secondTechnicianPossible",
                "A second technician may be required",
              ],
              [
                "customerSuppliedPart",
                "I want to discuss a customer-supplied part",
              ],
            ] as const
          ).map(([name, label]) => (
            <label className="check-option" key={name}>
              <input type="checkbox" name={name} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="accessNotes">Access notes</label>
            <textarea
              id="accessNotes"
              name="accessNotes"
              placeholder="Doorways, utility shutoffs, tight spaces, pets, or other access details"
            />
          </div>
          <div className="field">
            <label htmlFor="parkingNotes">Parking notes</label>
            <textarea id="parkingNotes" name="parkingNotes" />
          </div>
        </div>
        <p className="field-hint">
          Qualifying two-technician work may add $200 after disclosure and
          approval.
        </p>
      </fieldset>

      <fieldset className="form-section">
        <legend>6. Optional photos</legend>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="appliancePhoto">Appliance or problem photo</label>
            <input
              id="appliancePhoto"
              name="appliancePhoto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-invalid={invalid("appliancePhoto")}
            />
            {error("appliancePhoto")}
            <p className="field-hint">JPG, PNG, or WebP; 5 MB maximum.</p>
          </div>
          <div className="field">
            <label htmlFor="modelLabelPhoto">Model-number-label photo</label>
            <input
              id="modelLabelPhoto"
              name="modelLabelPhoto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              aria-invalid={invalid("modelLabelPhoto")}
            />
            {error("modelLabelPhoto")}
            <p className="field-hint">On mobile, you can use the camera.</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>7. Consent and policies</legend>
        <div className="check-grid">
          <label className="check-option">
            <input type="checkbox" name="contactConsent" />
            <span>
              I consent to calls or text messages about this appointment
              request.
            </span>
          </label>
          <label className="check-option">
            <input
              type="checkbox"
              name="diagnosticPolicyAccepted"
              required
              aria-invalid={invalid("diagnosticPolicyAccepted")}
            />
            <span>
              I accept the $100 diagnostic-fee policy and understand it is
              waived only when the approved repair is completed. *
            </span>
          </label>
          <label className="check-option">
            <input
              type="checkbox"
              name="servicePolicyAccepted"
              required
              aria-invalid={invalid("servicePolicyAccepted")}
            />
            <span>
              I agree to the{" "}
              <Link href="/service-policies">
                cancellation and service policies
              </Link>
              . *
            </span>
          </label>
        </div>
        {error("diagnosticPolicyAccepted")}
        {error("servicePolicyAccepted")}
      </fieldset>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-actions">
        <button
          className="button button--secondary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting request..." : "Submit appointment request"}
        </button>
        <p>
          Your appointment is not confirmed until you receive direct
          confirmation.
        </p>
      </div>
    </form>
  );
}
