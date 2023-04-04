import { prisma } from '../server/db';
import { remark } from 'remark';
import html from 'remark-html';


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

export async function getMeetingData(meetingID: string) {
  const placeholder = "### 1. Call to Order \n - 1. Roll Call [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8115) \n ### 2. Pledge of Allegiance \n ### 3. Statements of Conflict [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8117) \n ### 4. Items from the Public [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8118) \n ### 5. City Staff Reports \n - 1. Staff Recommends Council to Approve Resolution No. 2023-01 Ratifying the Director of Emergency Services Proclamation of Existence of a Local Emergency. [Link](https://pattersonca.iqm2.com/Citizens/Detail_LegiFile.aspx?Frame=&MeetingID=1373&MediaPosition=&ID=2028&CssClass=) \n     - Staff Report Printout [Link](https://pattersonca.iqm2.com/Citizens/FileOpen.aspx?Type=30&ID=11603&MeetingID=1373) \n     - a. Resolution No. 2023-01 Ratifying Local Emergency Proclamation Regarding Weather [Link](https://pattersonca.iqm2.com/Citizens/FileOpen.aspx?Type=4&ID=3162&MeetingID=1373) \n     - b. Exhibit A - Proclamation of Local Emergency Regarding Weather [Link](https://pattersonca.iqm2.com/Citizens/FileOpen.aspx?Type=4&ID=3161&MeetingID=1373) \n ### 6. City Council Reports \n - A. Councilmember Alves [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8124) \n     - Stanislaus Homeless Alliance ( Councilmember Roque alternate) \n - B. Councilmember Romero \n     - Westside Health Care Task Force (Councilmember Alves alternate) \n - C. Councilmember Farinha [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8128) \n     - San Joaquin Valley Air Pollution Control District (Councilmember Romero alternate) \n - D. Mayor Pro Tem Roque [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8130) \n     - (EDAC) Stanislaus County Economic Development Action Committee (Mayor Clauzel alternate) \n     - Workforce Development Board (Mayor Clauzel alternate) \n - E. Mayor Clauzel \n     - Stanislaus County Mayor's Meeting [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8134) \n     - StanCOG (Mayor Pro Tem Roque alternate) \n     - League of California Cities (Councilmember Farinha 1st alternate, Councilmember Alves 2nd alternate) \n ### 7. Other Matters [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8137) \n ### 8. Adjournment [Link](https://pattersonca.iqm2.com/Citizens/Detail_Motion.aspx?Frame=&MeetingID=1373&MinutesID=1305&MediaPosition=&ID=8138) \n";
  const processedContent = await remark()
  .use(html)
  .process(placeholder);
  const contentHtml = processedContent.toString();
  return {
    meetingID,
    contentHtml,
  };
}
