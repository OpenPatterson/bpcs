import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { scrapeCivicPlus } from "@/lib/scrapers/civicplus";
import type { ScrapedMeeting } from "@/lib/scrapers/civicplus";

export async function POST(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── Parse optional body params ────────────────────────
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    try {
      const body = await request.json();
      if (body.startDate) {
        startDate = new Date(body.startDate);
        if (isNaN(startDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid startDate" },
            { status: 400 }
          );
        }
      }
      if (body.endDate) {
        endDate = new Date(body.endDate);
        if (isNaN(endDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid endDate" },
            { status: 400 }
          );
        }
      }
    } catch {
      // Body is optional — no body or invalid JSON is fine
    }

    // ── Scrape ────────────────────────────────────────────
    console.log("[api/scrape/civicplus] Starting scrape...");
    const meetings = await scrapeCivicPlus({ startDate, endDate });
    console.log(`[api/scrape/civicplus] Scraped ${meetings.length} meetings`);

    // ── Upsert into database ──────────────────────────────
    let created = 0;
    let updated = 0;

    for (const meeting of meetings) {
      const data = mapMeetingToDb(meeting);

      const existing = await prisma.meeting.findUnique({
        where: { civicplusId: meeting.sourceId },
      });

      if (existing) {
        await prisma.meeting.update({
          where: { civicplusId: meeting.sourceId },
          data,
        });
        updated++;
      } else {
        await prisma.meeting.create({
          data: {
            ...data,
            civicplusId: meeting.sourceId,
            source: "civicplus",
          },
        });
        created++;
      }
    }

    console.log(
      `[api/scrape/civicplus] Done. Created: ${created}, Updated: ${updated}`
    );

    return NextResponse.json({
      success: true,
      count: meetings.length,
      created,
      updated,
    });
  } catch (error) {
    console.error("[api/scrape/civicplus] Scrape failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Scrape failed", details: message },
      { status: 500 }
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Map a ScrapedMeeting to the Prisma Meeting model fields for create/update.
 */
function mapMeetingToDb(meeting: ScrapedMeeting) {
  return {
    meetingTime: meeting.meetingDate,
    title: meeting.title,
    meetingType: meeting.category,
    boardType: meeting.category,
    status: meeting.status,
    agendaUrl: meeting.agendaUrl,
    agendaHtmlUrl: meeting.agendaHtmlUrl,
    agendaPacketUrl: meeting.agendaPacketUrl,
    minutesUrl: meeting.minutesUrl,
    postedAt: meeting.postedAt,
    isAmended: meeting.isAmended,
  };
}
