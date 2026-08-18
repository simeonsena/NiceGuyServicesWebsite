import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionLinks } from "@/components/action-links";
import { PageHero } from "@/components/page-hero";
import {
  businessConfig,
  serviceDetails,
  serviceRoutes,
} from "@/src/config/business";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return serviceRoutes.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceRoutes.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} in Cincinnati`,
    description: `${service.summary} Available for qualifying residential addresses within 50 miles of Cincinnati city center.`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = serviceRoutes.find((item) => item.slug === slug);
  if (!service) notFound();
  const details = serviceDetails[service.slug];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    provider: { "@id": `${businessConfig.canonicalUrl}/#business` },
    areaServed: "Within 50 miles of Cincinnati city center",
    url: `${businessConfig.canonicalUrl}/services/${service.slug}`,
  };

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Cincinnati residential appliance service"
        title={service.name}
        intro={service.summary}
        showActions
      />
      <section className="section section--white">
        <div className="container content-layout">
          <article className="content-layout__main prose">
            <nav aria-label="Breadcrumb">
              <ol className="breadcrumb">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li aria-current="page">{service.name}</li>
              </ol>
            </nav>
            <h2>Problems worth diagnosing</h2>
            <ul>
              {service.commonIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
            <h2>What the visit may cover</h2>
            <p>{details.diagnosticFocus}</p>
            <h2>Before the appointment</h2>
            <p>{details.prepare}</p>
            <h2>Making a practical repair decision</h2>
            <p>{details.decisionNote}</p>
            <p className="policy-note">
              Final pricing is confirmed after diagnosis and before repair work
              begins. Standard labor is $250 plus parts; other disclosed charges
              may apply when access or a second technician is required.
            </p>
          </article>
          <aside className="content-layout__aside">
            <h2>Request {service.name.toLowerCase()}</h2>
            <p>
              Share the model number, symptoms, access details, and optional
              photos. The request remains pending until confirmed directly.
            </p>
            <ActionLinks compact context={`service_${service.slug}`} />
          </aside>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
