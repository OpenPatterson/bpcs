import { getAllMeetingIds, getMeetingData } from "~/lib/meetings";

interface MeetingData {
  meetingID: string;
  contentHtml: string;
}

export default function Meeting({ meetingData }: { meetingData: MeetingData }) {
  return (
    <>
      {meetingData.meetingID}
      <br />
      <article className="prose lg:prose-xl w-2/3 mx-auto">
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

export async function getStaticProps({ params }: { params: { meetingID: string } }) {  
  const meetingData = await getMeetingData(params.meetingID);
  return {
    props: {
      meetingData,
    },
  };
}
