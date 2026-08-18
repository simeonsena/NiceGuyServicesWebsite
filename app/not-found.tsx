import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow eyebrow--light">404</p>
          <h1>Page not found</h1>
          <p>The page may have moved, or the address may be incomplete.</p>
          <div className="action-links">
            <Link className="button button--primary" href="/">
              Return home
            </Link>
            <Link className="button button--ghost" href="/schedule-service">
              Schedule Service
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
