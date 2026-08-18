import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nice Guy Appliance Services",
    short_name: "Nice Guy Services",
    description: "Residential appliance repair within 50 miles of Cincinnati.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f1678",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png", purpose: "any" },
    ],
  };
}
