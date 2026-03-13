import { PrismaClient } from "@prisma/client";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.translation.deleteMany();
  await prisma.aISummary.deleteMany();
  await prisma.agenda.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.meeting.deleteMany();

  const now = new Date();

  // Create sample meetings
  const meetings = await Promise.all([
    prisma.meeting.create({
      data: {
        source: "civicplus",
        civicplusId: "seed-1",
        meetingTime: addDays(now, 5),
        title: "City Council Regular Meeting",
        meetingType: "City Council",
        boardType: "City Council",
        status: "upcoming",
        location: "Council Chambers, 1 Plaza, Patterson, CA 95363",
        agendaUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Agenda/_example1",
        agendaHtmlUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Agenda/_example1?html=true",
      },
    }),
    prisma.meeting.create({
      data: {
        source: "civicplus",
        civicplusId: "seed-2",
        meetingTime: addDays(now, 12),
        title: "Planning Commission Regular Meeting",
        meetingType: "Planning Commission",
        boardType: "Planning Commission",
        status: "upcoming",
        location: "Council Chambers, 1 Plaza, Patterson, CA 95363",
      },
    }),
    prisma.meeting.create({
      data: {
        source: "civicplus",
        civicplusId: "seed-3",
        meetingTime: subDays(now, 3),
        title: "City Council Regular Meeting",
        meetingType: "City Council",
        boardType: "City Council",
        status: "final",
        location: "Council Chambers, 1 Plaza, Patterson, CA 95363",
        agendaUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Agenda/_example3",
        minutesUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Minutes/_example3",
      },
    }),
    prisma.meeting.create({
      data: {
        source: "civicplus",
        civicplusId: "seed-4",
        meetingTime: subDays(now, 14),
        title: "Parks, Recreation & Beautification Commission Meeting",
        meetingType: "Parks, Recreation & Beautification Commission",
        boardType: "Parks, Recreation & Beautification Commission",
        status: "final",
        location: "Council Chambers, 1 Plaza, Patterson, CA 95363",
        agendaUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Agenda/_example4",
        agendaPacketUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Agenda/_example4?packet=true",
        minutesUrl: "https://pattersonca.gov/AgendaCenter/ViewFile/Minutes/_example4",
      },
    }),
    prisma.meeting.create({
      data: {
        source: "iqm2",
        iqm2Id: 99001,
        meetingTime: subDays(now, 60),
        title: "City Council Regular Meeting (Legacy)",
        meetingType: "City Council",
        boardType: "City Council",
        status: "final",
        meetingLink: "https://pattersonca.iqm2.com/Citizens/Detail_Meeting.aspx?ID=99001",
        agendaUrl: "https://pattersonca.iqm2.com/Citizens/FileOpen.aspx?Type=14&ID=99001",
        minutesUrl: "https://pattersonca.iqm2.com/Citizens/FileOpen.aspx?Type=12&ID=99001",
      },
    }),
  ]);

  // Add an agenda to the first upcoming meeting
  await prisma.agenda.create({
    data: {
      meetingId: meetings[0].id,
      agendaMd: `## Call to Order

## Roll Call

## Pledge of Allegiance

## Public Comment
- Members of the public may address the City Council on any item not on the agenda.
- Comments are limited to three (3) minutes per speaker.

## Consent Calendar
- Approve minutes of the previous regular meeting
- Approve warrants and demands
- Receive monthly financial report

## Public Hearings
### Resolution 2026-XX: Annual Budget Review
- Staff presentation on proposed FY 2026-27 budget
- Public comment period
- Council discussion and action

### Ordinance 2026-XX: Downtown Parking
- Second reading of ordinance updating parking requirements in the downtown core
- Reduces minimum parking for mixed-use developments

## New Business
### Award of Contract — West Main Street Improvements
- Approve contract with ABC Construction for $1.2M street improvements
- Project includes ADA-compliant sidewalks, lighting, and landscaping

## Council Reports

## City Manager Report

## Adjournment`,
      agendaHtml: null,
    },
  });

  // Add AI summary to the most recent past meeting
  await prisma.aISummary.create({
    data: {
      meetingId: meetings[2].id,
      summary:
        "The City Council approved the previous meeting's minutes and monthly financial reports. Key decisions included adopting Resolution 2026-XX for the annual budget review, which allocates increased funding for public safety and parks maintenance. The council also gave a second reading to a downtown parking ordinance that reduces minimum parking requirements for mixed-use developments, aiming to encourage downtown revitalization. A $1.2 million contract was awarded for West Main Street improvements including new sidewalks and lighting.",
      keyTopics: [
        "Annual Budget",
        "Downtown Parking",
        "Street Improvements",
        "Public Safety Funding",
      ],
      model: "claude-sonnet-4-20250514",
      tokenCount: 312,
    },
  });

  console.log(`Seeded ${meetings.length} meetings, 1 agenda, 1 AI summary.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
