import type { Metadata, Viewport } from "next";
import { MobileActions } from "@/components/mobile-actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { businessConfig } from "@/src/config/business";
import "./globals.css";
import "./site.css";
import "./forms.css";

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.canonicalUrl),
  title: {
    default: "Nice Guy Appliance Services | Cincinnati Appliance Repair",
    template: "%s | Nice Guy Appliance Services",
  },
  description:
    "Independent residential appliance repair for washers, dryers, dishwashers, ovens, ranges, and microwaves within 25 miles of Cincinnati.",
  applicationName: businessConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: businessConfig.name,
    locale: "en_US",
    url: businessConfig.canonicalUrl,
    title: "Nice Guy Appliance Services",
    description:
      "Honest residential appliance repair within 25 miles of Cincinnati.",
    images: [
      {
        url: `${businessConfig.canonicalUrl}/og.png`,
        width: 1734,
        height: 907,
        alt: "Nice Guy Appliance Services - honest appliance repair within 25 miles of Cincinnati",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nice Guy Appliance Services",
    description:
      "Honest residential appliance repair within 25 miles of Cincinnati.",
    images: [`${businessConfig.canonicalUrl}/og.png`],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f1678",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${businessConfig.canonicalUrl}/#business`,
  name: businessConfig.name,
  url: businessConfig.canonicalUrl,
  telephone: businessConfig.phone,
  email: businessConfig.email,
  image: `${businessConfig.canonicalUrl}${businessConfig.brand.logo}`,
  areaServed: {
    "@type": "GeoCircle",
    name: "25 miles from Cincinnati city center",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 39.1031,
      longitude: -84.512,
    },
    geoRadius: "40233.6",
  },
  serviceType: [
    "Washer repair",
    "Dryer repair",
    "Dishwasher repair",
    "Oven repair",
    "Range repair",
    "Microwave repair",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileActions />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </body>
    </html>
  );
}
