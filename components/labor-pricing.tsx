import { businessConfig } from "@/src/config/business";
export function LaborPricing() {
  const pricing = businessConfig.pricing;
  return (
    <>
      <div className="pricing-grid">
        <article className="pricing-card">
          <h2>Diagnostic visit</h2>
          <strong>${pricing.diagnosticFee}</strong>
          <p>
            Applies to service visits. Not waived or credited toward labor. If
            you decline the repair, only the diagnostic fee is owed unless
            another charge was approved in advance.
          </p>
        </article>
        {pricing.tiers.map((tier) => (
          <article className="pricing-card" key={tier.id}>
            <h2>{tier.name}</h2>
            <strong>${tier.labor} labor</strong>
            <p>
              ${pricing.diagnosticFee + tier.labor} diagnostic + labor, plus
              parts and applicable tax.
            </p>
            <ul>
              {tier.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p>
        Examples are illustrative. The technician assigns the tier after
        diagnosis based on actual complexity and may reduce it to Quick Fix when
        appropriate. You approve the exact total before repairs begin.
      </p>
      <p>
        <strong>
          Additional labor: +${pricing.additionalTechnicianCharge}.
        </strong>{" "}
        Second-technician work, specialized handling, or unusually demanding
        access may require this charge. It is not a fourth tier and is never
        applied without technician review and your advance approval.
      </p>
    </>
  );
}
