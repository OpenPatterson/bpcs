import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../server/db"
import type { GetServerSideProps } from "next";
import { meetings } from "@prisma/client";


type HomeProps = {
  queriedMeetings: {
    id: number;
    meetingTime: string;
  }[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const homeProps: HomeProps = {
    queriedMeetings: []
  };

  const allMeetings = await prisma.$queryRaw<meetings[]>`SELECT m.* FROM (SELECT meetingID, max(id) as id FROM meetings GROUP BY meetingID) AS mx JOIN meetings m ON m.meetingID = mx.meetingID AND mx.id = m.id ORDER BY meetingID;`
  allMeetings.forEach((meetings) => {
    if (meetings.meetingTime != null) {
      homeProps.queriedMeetings.push({
        id: meetings.id,
        meetingTime: meetings.meetingTime.toString()
      })
    }
  });
  return {
    props:  homeProps ,
  };
};

const Home: NextPage<HomeProps> = ({ queriedMeetings }) => {
  return (
    <>
      <Head>
        <title>Better Patterson Council Site</title>
        <meta name="description" content="A Better Way to Track Patterson City Council Meetings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href={"/"} className="text-3xl">Meetings</Link>
      <div>
        {queriedMeetings.map((meetings) => (
          <div key={meetings.id}>
            <h1>{meetings.meetingTime}</h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
