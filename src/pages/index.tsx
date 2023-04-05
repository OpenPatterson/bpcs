import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../server/db";
import type { GetStaticProps } from "next";
import { meetings } from "@prisma/client";

type HomeProps = {
  queriedMeetings: {
    id: number;
    meetingTime: string;
  }[];
  queryUpcoming: {
    id: number;
    meetingTime: string;
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const dateOptions: Record<string, string | undefined> = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  const queriedMeetings: { id: number; meetingTime: string }[] = [];
  const queryUpcoming: { id: number; meetingTime: string } = {
    id: 1,
    meetingTime: "",
  };

  const allMeetings = await prisma.$queryRaw<
    meetings[]
  >`SELECT m.* FROM (SELECT meetingID, max(id) as id FROM meetings GROUP BY meetingID) AS mx JOIN meetings m ON m.meetingID = mx.meetingID AND mx.id = m.id WHERE meetingTime <= NOW() ORDER BY meetingTime DESC LIMIT 10;`;
  const upcomingMeeting = await prisma.$queryRaw<
    meetings[]
  >`SELECT * FROM meetings WHERE meetingTime >= NOW() ORDER BY meetingTime ASC LIMIT 1;`;

  allMeetings.forEach((meeting) => {
    if (meeting.meetingTime != null) {
      const meetingTimeFormatted = meeting.meetingTime.toLocaleDateString("en-US", dateOptions)
      queriedMeetings.push({
        id: meeting.meetingID,
        meetingTime: meetingTimeFormatted,
      });
    }
  });

  if (upcomingMeeting[0]) {
    queryUpcoming.id = upcomingMeeting[0].meetingID;
    if (upcomingMeeting[0].meetingTime != null) {
      const meetingTimeFormatted = upcomingMeeting[0].meetingTime.toLocaleDateString("en-US", dateOptions)
      queryUpcoming.meetingTime = meetingTimeFormatted;
    }
  }

  return {
    props: {
      queriedMeetings: queriedMeetings,
      queryUpcoming: queryUpcoming,
    },
  };
};

const Home: NextPage<HomeProps> = ({ queriedMeetings, queryUpcoming }) => {
  return (
    <>
      <Head>
        <title>Better Patterson Council Site</title>
        <meta
          name="description"
          content="A Better Way to Track Patterson City Council Meetings"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1 className="text-center text-7xl font-bold">Upcoming Meeting:</h1>
        <div>
          <Link
            className="flex-column"
            href={`/meetings/${queryUpcoming.id}`}
            key={queryUpcoming.id}
          >
            <h1 className="text-center text-2xl">City Council Meeting</h1>
            <h1 className="text-center text-2xl">
              {queryUpcoming.meetingTime}
            </h1>
          </Link>
        </div>
      </div>
      <Link href={"/"} className="text-3xl">
        Meetings
      </Link>
      <div>
        {queriedMeetings.map((meeting) => (
          <div key={meeting.id}>
            <Link
              className="flex"
              href={`/meetings/${meeting.id}`}
              key={meeting.id}
            >
              {meeting.meetingTime}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
