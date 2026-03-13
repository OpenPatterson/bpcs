import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNotificationPreferences, updateNotificationPreferences } from "@/lib/db/users";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences = await getNotificationPreferences(session.user.id);
  return NextResponse.json({ preferences });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const preferences = await updateNotificationPreferences(session.user.id, {
    emailEnabled: body.emailEnabled,
    smsEnabled: body.smsEnabled,
    notifyOnNewMeeting: body.notifyOnNewMeeting,
    notifyOnAgendaPosted: body.notifyOnAgendaPosted,
    notifyOnMinutes: body.notifyOnMinutes,
    meetingTypes: body.meetingTypes,
    daysBefore: body.daysBefore,
  });

  return NextResponse.json({ preferences });
}
