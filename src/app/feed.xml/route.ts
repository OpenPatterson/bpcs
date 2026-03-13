import { prisma } from "@/lib/db/prisma";
import { formatShortDate } from "@/lib/dates";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://bpcs.openpatterson.org";

  let meetings: Array<{
    id: string;
    title: string | null;
    meetingType: string;
    meetingTime: Date;
    status: string;
    agendaUrl: string | null;
  }> = [];

  try {
    meetings = await prisma.meeting.findMany({
      select: {
        id: true,
        title: true,
        meetingType: true,
        meetingTime: true,
        status: true,
        agendaUrl: true,
      },
      orderBy: { meetingTime: "desc" },
      take: 50,
    });
  } catch {
    // DB not available
  }

  const items = meetings
    .map((m) => {
      const title = m.title || m.meetingType;
      const link = `${baseUrl}/meetings/${m.id}`;
      const date = m.meetingTime.toUTCString();
      const description = `${m.meetingType} — ${formatShortDate(m.meetingTime)} (${m.status})${
        m.agendaUrl ? ` | Agenda: ${m.agendaUrl}` : ""
      }`;

      return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Better Patterson Council Site</title>
    <link>${baseUrl}</link>
    <description>Patterson, CA city government meetings, agendas, and minutes</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
