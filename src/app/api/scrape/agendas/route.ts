import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";
import { htmlToMarkdown } from "@/lib/scrapers/html-to-markdown";
import { scrapeIQM2Agenda } from "@/lib/scrapers/iqm2";

export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let processed = 0;
  let failed = 0;

  try {
    // Find meetings that need agenda scraping:
    // 1. CivicPlus meetings with agendaHtmlUrl but no Agenda record
    // 2. IQM2 meetings with agendaUrl but no Agenda record
    const meetings = await prisma.meeting.findMany({
      where: {
        agenda: null,
        OR: [
          {
            source: "civicplus",
            agendaHtmlUrl: { not: null },
          },
          {
            source: "iqm2",
            agendaUrl: { not: null },
          },
        ],
      },
    });

    for (const meeting of meetings) {
      try {
        let markdown: string | null = null;
        let rawHtml: string | null = null;

        if (meeting.source === "civicplus" && meeting.agendaHtmlUrl) {
          // Fetch the HTML agenda from CivicPlus
          const response = await fetch(meeting.agendaHtmlUrl);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch agenda HTML: ${response.status} ${response.statusText}`
            );
          }

          rawHtml = await response.text();
          markdown = htmlToMarkdown(rawHtml);
        } else if (meeting.source === "iqm2" && meeting.iqm2Id) {
          // Use IQM2 scraper — returns markdown directly (string | null)
          markdown = await scrapeIQM2Agenda(meeting.iqm2Id);
        }

        if (!markdown || markdown.trim().length === 0) {
          console.warn(
            `Empty agenda content for meeting ${meeting.id}, skipping`
          );
          failed++;
          continue;
        }

        // Create the Agenda record
        await prisma.agenda.create({
          data: {
            meetingId: meeting.id,
            agendaMd: markdown,
            agendaHtml: rawHtml,
          },
        });

        processed++;
      } catch (error) {
        console.error(`Failed to process agenda for meeting ${meeting.id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({ success: true, processed, failed });
  } catch (error) {
    console.error("Agenda scraper error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
