import Link from "next/link";
import { getAllMeetingIds, getMeetingData } from "~/lib/meetings";

interface MeetingData {
  meetingID: string;
  contentHtml: string;
  meetingTimeFormatted: string;
  meetingType: string;
  meetingLink: string;
  boardType: string;
  agendaURL: string;
  agendaPacketURL: string;
  summaryURL: string;
  minutesURL: string;
}

export default function Meeting({ meetingData }: { meetingData: MeetingData }) {
  return (
    <>
      <div className="flex flex-col items-center py-5">
        <div className="text-3xl font-bold md:text-5xl">
          {meetingData.boardType}
        </div>
        <div className="text-xl md:text-3xl">{meetingData.meetingType}</div>
        <div className="text-xl md:text-3xl">
          {meetingData.meetingTimeFormatted}
        </div>
      </div>
      <div className="flex flex-col items-center space-x-5 space-y-3 bg-primary-light py-3 md:flex-row md:justify-center md:space-y-0">
        <div className="hover:underline">
          <Link href={meetingData.meetingLink}>Original Page</Link>
        </div>
        <div className="hover:underline">
          <Link href={`https://pattersonca.iqm2.com/Citizens/${meetingData.agendaURL}`}>
            Agenda
          </Link>
        </div>
        <div className="hover:underline">
          <Link href={`https://pattersonca.iqm2.com/Citizens/${meetingData.agendaPacketURL}`}>
            Agenda Packet
          </Link>
        </div>
        <div className="hover:underline">
          <Link href={`https://pattersonca.iqm2.com/Citizens/${meetingData.summaryURL}`}>
            Summary
          </Link>
        </div>
        <div className="hover:underline">
          <Link href={`https://pattersonca.iqm2.com/Citizens/${meetingData.minutesURL}`}>
            Minutes
          </Link>
        </div>
      </div>
      <article className="prose mx-auto px-5 lg:prose-xl md:w-2/3 md:px-0">
        <div dangerouslySetInnerHTML={{ __html: meetingData.contentHtml }} />
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllMeetingIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { meetingID: string };
}) {
  const meetingData = await getMeetingData(params.meetingID);
  return {
    props: {
      meetingData,
    },
  };
}
