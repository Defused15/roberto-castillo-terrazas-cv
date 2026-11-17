import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_TITLE } from "./site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: "R. Castillo",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    // The R spans at most 37.5% of the icon from its centre, inside the 40%
    // maskable safe zone, so launchers may crop these to any shape. Each file
    // is listed for "any" and "maskable" (Next's types reject "any maskable").
    icons: (["any", "maskable"] as const).flatMap((purpose) => [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose },
    ]),
  };
}
