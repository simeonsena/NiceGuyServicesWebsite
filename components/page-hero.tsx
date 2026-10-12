import { ActionLinks } from "./action-links";

export function PageHero({
  eyebrow,
  title,
  intro,
  showActions = false,
  actionContext = "page_hero",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  showActions?: boolean;
  actionContext?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {showActions && <ActionLinks context={actionContext} />}
      </div>
    </section>
  );
}
