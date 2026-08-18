import type { MetadataRoute } from "next";
import { businessConfig } from "@/src/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/booking-confirmation", "/booking-error"],
    },
    sitemap: `${businessConfig.canonicalUrl}/sitemap.xml`,
    host: businessConfig.canonicalUrl,
  };
}
