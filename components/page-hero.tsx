import { ActionLinks } from "./action-links";

export function PageHero({
  eyebrow,
  title,
  intro,
  showActions = false,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  showActions?: boolean;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {showActions && <ActionLinks context="page_hero" />}
      </div>
    </section>
  );
}
