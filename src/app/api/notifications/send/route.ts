import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";
import { formatShortDate, formatMeetingTime } from "@/lib/dates";

export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let emailsSent = 0;
  let smsSent = 0;
  let failed = 0;

  try {
    // Get all users with active notification preferences
    const users = await prisma.user.findMany({
      where: {
        preferences: {
          OR: [{ emailEnabled: true }, { smsEnabled: true }],
        },
      },
      include: { preferences: true, notificationLogs: true },
    });

    for (const user of users) {
      if (!user.preferences) continue;
      const prefs = user.preferences;

      // Find meetings in the next N days matching user preferences
      const daysAhead = new Date(now.getTime() + prefs.daysBefore * 86400000);
      const meetings = await prisma.meeting.findMany({
        where: {
          meetingTime: { gte: now, lte: daysAhead },
          status: { not: "cancelled" },
          ...(prefs.meetingTypes.length > 0
            ? { meetingType: { in: prefs.meetingTypes } }
            : {}),
        },
      });

      for (const meeting of meetings) {
        // Check if we already sent this notification
        const alreadySent = await prisma.notificationLog.findFirst({
          where: {
            userId: user.id,
            meetingId: meeting.id,
            type: "reminder",
          },
        });
        if (alreadySent) continue;

        const dateStr = formatShortDate(meeting.meetingTime);
        const timeStr = formatMeetingTime(meeting.meetingTime);
        const meetingUrl = `${env.NEXTAUTH_URL || "https://bpcs.openpatterson.org"}/meetings/${meeting.id}`;

        // Send email
        if (prefs.emailEnabled && user.email && env.RESEND_API_KEY) {
          try {
            const { Resend } = await import("resend");
            const resend = new Resend(env.RESEND_API_KEY);
            await resend.emails.send({
              from: env.FROM_EMAIL,
              to: user.email,
              subject: `📅 ${meeting.meetingType} — ${dateStr} at ${timeStr}`,
              html: `
                <h2>${meeting.title || meeting.meetingType}</h2>
                <p><strong>${dateStr} at ${timeStr}</strong></p>
                ${meeting.location ? `<p>${meeting.location}</p>` : ""}
                <p><a href="${meetingUrl}">View meeting details</a></p>
                <p style="color: #666; font-size: 12px;">
                  You're receiving this because you subscribed to BPCS meeting reminders.
                </p>
              `,
            });
            await prisma.notificationLog.create({
              data: {
                userId: user.id,
                meetingId: meeting.id,
                channel: "email",
                type: "reminder",
                status: "sent",
              },
            });
            emailsSent++;
          } catch (err) {
            await prisma.notificationLog.create({
              data: {
                userId: user.id,
                meetingId: meeting.id,
                channel: "email",
                type: "reminder",
                status: "failed",
                error: err instanceof Error ? err.message : "Unknown",
              },
            });
            failed++;
          }
        }

        // Send SMS
        if (prefs.smsEnabled && user.phone && user.phoneVerified && env.TWILIO_ACCOUNT_SID) {
          try {
            const twilio = await import("twilio");
            const client = twilio.default(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
              body: `Patterson ${meeting.meetingType} meeting ${dateStr} at ${timeStr}. Agenda: ${meetingUrl}`,
              from: env.TWILIO_PHONE_NUMBER,
              to: user.phone,
            });
            await prisma.notificationLog.create({
              data: {
                userId: user.id,
                meetingId: meeting.id,
                channel: "sms",
                type: "reminder",
                status: "sent",
              },
            });
            smsSent++;
          } catch (err) {
            await prisma.notificationLog.create({
              data: {
                userId: user.id,
                meetingId: meeting.id,
                channel: "sms",
                type: "reminder",
                status: "failed",
                error: err instanceof Error ? err.message : "Unknown",
              },
            });
            failed++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      smsSent,
      failed,
    });
  } catch (error) {
    console.error("Notification dispatch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
