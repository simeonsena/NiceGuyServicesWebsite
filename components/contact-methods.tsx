import { businessConfig } from "@/src/config/business";

export function ContactMethods() {
  return (
    <div className="contact-options">
      <div className="contact-option">
        <p className="eyebrow">Call</p>
        <h2>Speak with us directly</h2>
        <p>Discuss the appliance and arrange a time that works.</p>
        <a
          className="button button--primary"
          href={`tel:${businessConfig.phone}`}
        >
          {businessConfig.phone}
        </a>
      </div>
      <div className="contact-option">
        <p className="eyebrow">Email</p>
        <h2>Send the details</h2>
        <p>
          Include the appliance, symptoms, ZIP code, and a way to reach you.
        </p>
        <a
          className="button button--secondary"
          href={`mailto:${businessConfig.email}`}
        >
          {businessConfig.email}
        </a>
      </div>
    </div>
  );
}
