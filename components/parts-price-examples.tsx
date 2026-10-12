import { partsPricing } from "@/src/config/parts-pricing";

export function PartsPriceExamples({ slug }: { slug: string }) {
  if (!(slug in partsPricing.appliances)) return null;
  const parts =
    partsPricing.appliances[slug as keyof typeof partsPricing.appliances];
  return (
    <div className="parts-examples">
      <p>
        <strong>{partsPricing.title}</strong>
      </p>
      <ul>
        {parts.map((part) => (
          <li key={part.name}>
            {part.name}:{" "}
            <strong>
              ${part.min}–${part.max}
            </strong>
          </li>
        ))}
      </ul>
      {slug === "washer-repair" && <p>{partsPricing.washerNote}</p>}
      <p>{partsPricing.disclaimer}</p>
    </div>
  );
}
