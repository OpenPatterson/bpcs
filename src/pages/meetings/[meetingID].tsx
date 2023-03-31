import { getAllMeetingIds, getMeetingData } from "~/lib/meetings";

interface MeetingData {
  meetingID: string;
  placeholder: string;
}

export default function Meeting({ meetingData }: { meetingData: MeetingData }) {
  return (
    <>
      {meetingData.meetingID}
      <br />
      {meetingData.placeholder}
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

export function getStaticProps({ params }: { params: { meetingID: string } }) {  
  const meetingData = getMeetingData(params.meetingID);
  return {
    props: {
      meetingData,
    },
  };
}
