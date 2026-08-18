"use client";

import { FormEvent, useState } from "react";
import { validateUpload } from "@/src/domain/qualification";
import { trackConversion } from "./analytics";

type FieldErrors = Record<string, string[] | undefined>;

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrors({});
    setStatus(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const photo = formData.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const validation = validateUpload(photo);
      if (!validation.valid) {
        setErrors({ photo: [validation.error ?? "Invalid upload."] });
        setStatus({ kind: "error", message: "Review the selected image." });
        setPending(false);
        return;
      }
    }
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        message?: string;
        fieldErrors?: FieldErrors;
        reference?: string;
      };
      if (!response.ok) {
        setErrors(data.fieldErrors ?? {});
        setStatus({
          kind: "error",
          message: data.message ?? "Your message could not be sent.",
        });
        return;
      }
      form.reset();
      setStatus({
        kind: "success",
        message: `${data.message} Reference: ${data.reference}`,
      });
      trackConversion("contact_submitted");
    } catch {
      setStatus({
        kind: "error",
        message:
          "Your message could not be submitted. The information remains in the form so you can try again.",
      });
    } finally {
      setPending(false);
    }
  }

  const error = (name: string) =>
    errors[name]?.[0] ? (
      <p className="field-error" id={`${name}-error`}>
        {errors[name]?.[0]}
      </p>
    ) : null;

  return (
    <form
      className="form-shell"
      onSubmit={submit}
      noValidate
      encType="multipart/form-data"
    >
      {status && (
        <div
          className={`form-status${status.kind === "error" ? " form-status--error" : ""}`}
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.message}
        </div>
      )}
      <div className="field-grid">
        <div className="field">
          <label htmlFor="contact-name">Name *</label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
          />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="contact-method">Phone or email *</label>
          <input
            id="contact-method"
            name="contact"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.contact)}
          />
          {error("contact")}
        </div>
        <div className="field field--full">
          <label htmlFor="contact-subject">Subject *</label>
          <input
            id="contact-subject"
            name="subject"
            required
            aria-invalid={Boolean(errors.subject)}
          />
          {error("subject")}
        </div>
        <div className="field">
          <label htmlFor="contact-appliance">Appliance type</label>
          <input id="contact-appliance" name="appliance" />
        </div>
        <div className="field">
          <label htmlFor="contact-model">Model number</label>
          <input id="contact-model" name="modelNumber" />
        </div>
        <div className="field field--full">
          <label htmlFor="contact-message">Message *</label>
          <textarea
            id="contact-message"
            name="message"
            required
            aria-invalid={Boolean(errors.message)}
          />
          {error("message")}
        </div>
        <div className="field field--full">
          <label htmlFor="contact-photo">Optional photo</label>
          <input
            id="contact-photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-invalid={Boolean(errors.photo)}
          />
          {error("photo")}
          <p className="field-hint">JPG, PNG, or WebP; 5 MB maximum.</p>
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-actions">
        <button
          className="button button--secondary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
