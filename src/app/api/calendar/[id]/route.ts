import { NextRequest, NextResponse } from "next/server";
import { getMeetingById } from "@/lib/db/meetings";
import { formatICSDate } from "@/lib/dates";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meeting = await getMeetingById(id);

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  const title = meeting.title || meeting.meetingType;
  const start = formatICSDate(meeting.meetingTime);
  // Default 2-hour meeting duration
  const endDate = new Date(meeting.meetingTime.getTime() + 2 * 60 * 60 * 1000);
  const end = formatICSDate(endDate);
  const now = formatICSDate(new Date());

  const description = [
    meeting.meetingType,
    meeting.agendaUrl ? `Agenda: ${meeting.agendaUrl}` : null,
    meeting.meetingLink ? `Details: ${meeting.meetingLink}` : null,
    "https://bpcs.openpatterson.org",
  ]
    .filter(Boolean)
    .join("\\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BPCS//Better Patterson Council Site//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;TZID=America/Los_Angeles:${start}`,
    `DTEND;TZID=America/Los_Angeles:${end}`,
    `DTSTAMP:${now}`,
    `UID:${meeting.id}@bpcs.openpatterson.org`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    meeting.location ? `LOCATION:${meeting.location}` : null,
    meeting.zoomUrl ? `URL:${meeting.zoomUrl}` : null,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${meeting.meetingType.replace(/\s+/g, "-").toLowerCase()}-${id}.ics"`,
    },
  });
}
