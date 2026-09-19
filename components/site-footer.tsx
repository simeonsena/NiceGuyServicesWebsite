import Link from "@/components/site-link";
import Image from "next/image";
import { businessConfig, serviceRoutes } from "@/src/config/business";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link href="/" aria-label={`${businessConfig.name} home`}>
            <Image
              src={businessConfig.brand.logo}
              alt={businessConfig.name}
              width="240"
              height="180"
            />
          </Link>
          <p>
            Independent residential appliance repair within 25 miles of
            Cincinnati city center.
          </p>
        </div>
        <div>
          <h2>Services</h2>
          {serviceRoutes.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              {service.name}
            </Link>
          ))}
        </div>
        <div>
          <h2>Information</h2>
          <Link href="/pricing">Pricing</Link>
          <Link href="/service-area">Service area</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h2>Contact</h2>
          <a href={`tel:${businessConfig.phone}`}>{businessConfig.phone}</a>
          <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
          <p>{businessConfig.hours}</p>
          <p>{businessConfig.addressLabel}</p>
        </div>
      </div>
      <div className="container site-footer__legal">
        <p>
          Copyright {new Date().getFullYear()} {businessConfig.name}. All rights
          reserved.
        </p>
        <div>
          <Link href="/service-policies">Service policies</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
