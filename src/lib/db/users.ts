import { prisma } from "@/lib/db/prisma";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { preferences: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { preferences: true },
  });
}

export async function getNotificationPreferences(userId: string) {
  return prisma.notificationPreference.findUnique({
    where: { userId },
  });
}

export async function updateNotificationPreferences(
  userId: string,
  prefs: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    notifyOnNewMeeting?: boolean;
    notifyOnAgendaPosted?: boolean;
    notifyOnMinutes?: boolean;
    meetingTypes?: string[];
    daysBefore?: number;
  }
) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    update: prefs,
    create: {
      userId,
      ...prefs,
    },
  });
}
