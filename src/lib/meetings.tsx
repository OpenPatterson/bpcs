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
  const dateOptions: Record<string, string | undefined> = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  let meetingTimeFormatted = "Missing Date";
  const meetingIDInt = parseInt(meetingID);
  const agendaQuery = await prisma.agendas.findFirst({
    where: { meetingID: meetingIDInt },
    orderBy: { id: "desc" },
  });
  const meetingQuery = await prisma.meetings.findFirst({
    where: { meetingID: meetingIDInt },
    orderBy: { id: "desc" },
  });
  const agendaMD = agendaQuery?.agendaMD || "";
  const meetingTime = meetingQuery?.meetingTime || "";
  const meetingType = meetingQuery?.meetingType || "";
  const meetingLink = meetingQuery?.meetingLink || "";
  const boardType = meetingQuery?.boardType || "";
  const agendaURL = meetingQuery?.agendaURL || "";
  const agendaPacketURL = meetingQuery?.agendaPacketURL || "";
  const summaryURL = meetingQuery?.summaryURL || "";
  const minutesURL = meetingQuery?.minutesURL || "";

  if (meetingTime != null && meetingTime != "") {
    meetingTimeFormatted = meetingTime.toLocaleDateString(
      "en-US",
      dateOptions
    );
  }

  const processedContent = await remark().use(html).process(agendaMD);
  const contentHtml = processedContent.toString();
  return {
    meetingID,
    contentHtml,
    meetingTimeFormatted,
    meetingType,
    meetingLink,
    boardType,
    agendaURL,
    agendaPacketURL,
    summaryURL,
    minutesURL,
  };
}
