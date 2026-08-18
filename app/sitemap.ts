import type { MetadataRoute } from "next";
import { businessConfig, serviceRoutes } from "@/src/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/services",
    "/pricing",
    "/service-area",
    "/about",
    "/faq",
    "/schedule-service",
    "/contact",
    "/service-policies",
    "/privacy",
    "/accessibility",
  ];
  return [
    ...pages.map((path, index) => ({
      url: `${businessConfig.canonicalUrl}${path}`,
      changeFrequency: index === 0 ? ("weekly" as const) : ("monthly" as const),
      priority: index === 0 ? 1 : path === "/schedule-service" ? 0.9 : 0.7,
    })),
    ...serviceRoutes.map((service) => ({
      url: `${businessConfig.canonicalUrl}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
