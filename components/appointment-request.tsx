"use client";
import { useEffect, useRef, useState } from "react";
import { businessConfig } from "@/src/config/business";
type Slot = { hour: number };
export function AppointmentRequest() {
  const [slots, setSlots] = useState<Slot[]>([]),
    [date, setDate] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [received, setReceived] = useState(false);
  const [locked,setLocked]=useState(false),[ready,setReady]=useState<boolean|null>(null);
  useEffect(()=>{let active=true;fetch("/api/v1/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"status"})}).then(r=>r.json()).then(data=>{if(active)setReady(data.ready===true);}).catch(()=>{if(active)setReady(false);});return()=>{active=false;};},[]);
  const pending = useRef<Record<string, unknown> | null>(null),
    form = useRef<HTMLFormElement>(null);
  async function send(body: Record<string, unknown>) {
    const res = await fetch("/api/v1/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 400 || res.status === 422) {pending.current = null;setLocked(false);}
      throw Error(data.error ?? "Request unavailable.");
    }
    return data;
  }
  async function load(value: string) {
    setDate(value);
    setSlots([]);
    setBusy(true);
    setMessage("");
    try {
      const list = await send({ action: "slots", data: { date: value } });
      if (!Array.isArray(list)) throw Error("Could not load windows.");
      setSlots(list);
      if (!list.length)
        setMessage(
          "No available windows on that day. Please choose another date or call.",
        );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not load windows.");
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      if (!pending.current) {
        const values = Object.fromEntries(
          new FormData(form.current!).entries(),
        );
        pending.current = {
          action: "submit",
          id: crypto.randomUUID(),
          data: values,
          consent: values.consent === "on",
          website: values.website,
        };
      }
      setLocked(true);
      const result = await send(pending.current);
      if (!result.received)
        throw Error("Request receipt could not be verified.");
      setReceived(true);
      setMessage(
        "Request received — pending owner approval. This is not a confirmed appointment. We will review your address and contact you; no payment has been charged.",
      );
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Could not send. Retry this same request.",
      );
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    ["name", "Your name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["line1", "Street address"],
    ["line2", "Apartment / unit (optional)"],
    ["city", "City"],
    ["zip", "ZIP code"],
    ["brand", "Appliance brand"],
    ["model", "Model number (optional)"],
  ] as const;
  return (
    <section className="prose appointment-request">
      <h2>Request an appointment</h2>
      <p>
        Two-hour arrival windows, seven days a week, 8 AM–6 PM Eastern.
        Availability can change before review. Full addresses must be within our
        service area; ZIP screening is preliminary.
      </p>
      <p>
        Microwave service requires a phone consultation. Please call{" "}
        {businessConfig.phone}.
      </p>
      {message && (
        <p role="status" className="policy-note">
          {message}
        </p>
      )}
      {ready===null && <p>Checking online request availability…</p>}
      {ready===false && <p className="policy-note">Online requests are not available yet. Please call {businessConfig.phone} or email us below to arrange service.</p>}
      {ready && !received && (
        <form ref={form} onSubmit={submit}>
          <fieldset disabled={busy || locked}>
            <legend>Customer and appliance details</legend>
            {fields.map(([name, label]) => (
              <label key={name} style={{ display: "block", marginBottom: 12 }}>
                {label}
                <input
                  name={name}
                  type={
                    name === "email"
                      ? "email"
                      : name === "phone"
                        ? "tel"
                        : "text"
                  }
                  required={!["line2", "model"].includes(name)}
                  maxLength={200}
                  style={{ display: "block", width: "100%" }}
                />
              </label>
            ))}
            <label>
              State
              <select name="state" required>
                <option value="OH">Ohio</option>
                <option value="IN">Indiana</option>
                <option value="KY">Kentucky</option>
              </select>
            </label>
            <label>
              Appliance
              <select name="appliance" required>
                {["Washer", "Dryer", "Dishwasher", "Oven", "Range"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Problem / symptoms
              <textarea name="symptoms" required maxLength={1000} />
            </label>
            <label>
              Access notes (optional)
              <textarea name="notes" maxLength={2000} />
            </label>
            <label>
              Date
              <input
                type="date"
                name="date"
                value={date}
                required
                onChange={(e) => void load(e.target.value)}
              />
            </label>
            <label>
              Arrival window
              <select name="hour" required disabled={!slots.length}>
                <option value="">Choose a window</option>
                {slots.map((s) => (
                  <option value={s.hour} key={s.hour}>
                    {s.hour % 12 || 12}
                    {s.hour < 12 ? " AM" : " PM"}–{(s.hour + 2) % 12 || 12}
                    {s.hour + 2 < 12 ? " AM" : " PM"}
                  </option>
                ))}
              </select>
            </label>
            <div hidden>
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label>
              <input name="consent" type="checkbox" required /> I understand the
              $99 diagnostic fee is not waived or credited toward labor. Repairs
              require my approval, and this request is not a confirmed
              appointment.
            </label>
          </fieldset>
          <button
            className="button button--primary"
            disabled={busy || (!slots.length && !locked)}
            type="submit"
          >
            {busy
              ? "Please wait…"
              : locked
                ? "Retry same request"
                : "Request appointment"}
          </button>
        </form>
      )}
    </section>
  );
}
