import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://bpcs.openpatterson.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/account/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
