import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://bpcs.openpatterson.org";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/meetings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/your-gov`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/your-gov/council`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/your-gov/districts`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/your-gov/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic meeting pages
  let meetingPages: MetadataRoute.Sitemap = [];
  try {
    const meetings = await prisma.meeting.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { meetingTime: "desc" },
      take: 500,
    });
    meetingPages = meetings.map((m) => ({
      url: `${baseUrl}/meetings/${m.id}`,
      lastModified: m.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available during build
  }

  return [...staticPages, ...meetingPages];
}
