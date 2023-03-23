import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../server/db"
import type { GetServerSideProps } from "next";

type HomeProps = {
  allMeetings: {
    id: number;
    meetingTime: string;
  }[];
};

export const getServerSideProps: GetServerSideProps = async () => {
  const allMeetings = await prisma.meetings.findMany({})
  return {
    props: { allMeetings },
  };
};

const Home: NextPage<HomeProps> = ({ allMeetings }) => {
  return (
    <>
      <Head>
        <title>Better Patterson Council Site</title>
        <meta name="description" content="A Better Way to Track Patterson City Council Meetings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href={"/"} className="text-3xl">Meetings</Link>
      <div>
        {allMeetings.map((meetings) => (
          <div key={meetings.id}>
            <h1>{meetings.meetingTime}</h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
