import { prisma } from "../server/db";
import { remark } from "remark";
import html from "remark-html";

export async function getAllMeetingIds() {
  const meetingIds = await prisma.meetings.findMany({
    select: {
      meetingid: true,
    },
    distinct: ["meetingid"],
  });

  const paths = meetingIds.map((meeting) => ({
    params: {
      meetingID: meeting.meetingid.toString(),
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
    timeZone: "America/Los_Angeles",
  };
  let meetingTimeFormatted = "Missing Date";
  const meetingIDInt = parseInt(meetingID);
  const agendaQuery = await prisma.agendas.findFirst({
    where: { meetingid: meetingIDInt },
    orderBy: { id: "desc" },
  });
  const meetingQuery = await prisma.meetings.findFirst({
    where: { meetingid: meetingIDInt },
    orderBy: { id: "desc" },
  });
  const agendaMD = agendaQuery?.agendamd || "";
  const meetingTime = meetingQuery?.meetingtime || "";
  const meetingType = meetingQuery?.meetingtype || "";
  const meetingLink = meetingQuery?.meetinglink || "";
  const boardType = meetingQuery?.boardtype || "";
  const agendaURL = meetingQuery?.agendaurl || "";
  const agendaPacketURL = meetingQuery?.agendapacketurl || "";
  const summaryURL = meetingQuery?.summaryurl || "";
  const minutesURL = meetingQuery?.minutesurl || "";

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
