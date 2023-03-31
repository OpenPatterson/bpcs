import { prisma } from '../server/db';

export async function getAllMeetingIds() {
  const meetingIds = await prisma.meetings.findMany({
    select: {
      meetingID: true,
    },
    distinct: ['meetingID'],
  });

  const paths = meetingIds.map((meeting) => ({
    params: {
      meetingID: meeting.meetingID.toString()
    },
  }));

  return paths;
}

export function getMeetingData(meetingID: string) {
  const placeholder = 'Hello';
  return {
    meetingID,
    placeholder,
  };
}
