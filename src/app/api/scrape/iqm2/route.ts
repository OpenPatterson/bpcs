import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { scrapeIQM2 } from "@/lib/scrapers/iqm2";

export async function POST(request: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────────────
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse optional body params ────────────────────────────
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    try {
      const body = await request.json();
      if (body.fromDate) fromDate = new Date(body.fromDate);
      if (body.toDate) toDate = new Date(body.toDate);
    } catch {
      // No body or invalid JSON — use defaults
    }

    // ── Scrape ────────────────────────────────────────────────
    console.log("[IQM2 Route] Starting scrape...");
    const meetings = await scrapeIQM2({ fromDate, toDate });
    console.log(`[IQM2 Route] Scraped ${meetings.length} meetings`);

    // ── Upsert into database ──────────────────────────────────
    let created = 0;
    let updated = 0;

    for (const meeting of meetings) {
      const existing = await prisma.meeting.findUnique({
        where: { iqm2Id: meeting.iqm2Id },
      });

      if (existing) {
        await prisma.meeting.update({
          where: { iqm2Id: meeting.iqm2Id },
          data: {
            source: "iqm2",
            meetingTime: meeting.meetingTime,
            meetingType: meeting.meetingType,
            boardType: meeting.boardType,
            status: meeting.meetingStatus,
            agendaUrl: meeting.agendaUrl,
            agendaPacketUrl: meeting.agendaPacketUrl,
            minutesUrl: meeting.minutesUrl,
            summaryUrl: meeting.summaryUrl,
            meetingLink: meeting.meetingLink,
          },
        });
        updated++;
      } else {
        await prisma.meeting.create({
          data: {
            iqm2Id: meeting.iqm2Id,
            source: "iqm2",
            meetingTime: meeting.meetingTime,
            title: meeting.meetingType,
            meetingType: meeting.meetingType,
            boardType: meeting.boardType,
            status: meeting.meetingStatus,
            agendaUrl: meeting.agendaUrl,
            agendaPacketUrl: meeting.agendaPacketUrl,
            minutesUrl: meeting.minutesUrl,
            summaryUrl: meeting.summaryUrl,
            meetingLink: meeting.meetingLink,
          },
        });
        created++;
      }

      if ((created + updated) % 25 === 0) {
        console.log(
          `[IQM2 Route] Progress: ${created + updated}/${meetings.length} (${created} created, ${updated} updated)`
        );
      }
    }

    console.log(
      `[IQM2 Route] Done: ${meetings.length} total, ${created} created, ${updated} updated`
    );

    return NextResponse.json({
      success: true,
      count: meetings.length,
      created,
      updated,
    });
  } catch (error) {
    console.error("[IQM2 Route] Error:", error);
    return NextResponse.json(
      {
        error: "Scrape failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
