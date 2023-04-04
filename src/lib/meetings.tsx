import { prisma } from "../server/db";
import { remark } from "remark";
import html from "remark-html";

export async function getAllMeetingIds() {
  const meetingIds = await prisma.meetings.findMany({
    select: {
      meetingID: true,
    },
    distinct: ["meetingID"],
  });

  const paths = meetingIds.map((meeting) => ({
    params: {
      meetingID: meeting.meetingID.toString(),
    },
  }));

  return paths;
}

export async function getMeetingData(meetingID: string) {
  const meetingIDInt = parseInt(meetingID);
  const agendaQuery = await prisma.agendas.findFirst({
    where: { meetingID: meetingIDInt },
    orderBy: { id: "desc" },
  });
  const agendaMD = agendaQuery?.agendaMD || "";

  const processedContent = await remark().use(html).process(agendaMD);
  const contentHtml = processedContent.toString();
  return {
    meetingID,
    contentHtml,
  };
}
