import { NextPage } from "next";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../server/db";
import type { GetStaticProps } from "next";
import { meetings } from "@prisma/client";
import Pagination from "~/components/pagination";
import { paginate } from "~/lib/paginate";

type MeetingProps = {
  queriedMeetings: {
    id: number;
    meetingTime: string;
  }[];
};

export const getStaticProps: GetStaticProps = async () => {
  const queriedMeetings: { id: number; meetingTime: string }[] = [];

  const allMeetings = await prisma.$queryRaw<
    meetings[]
  >`SELECT m.* FROM (SELECT meetingID, max(id) as id FROM meetings GROUP BY meetingID) AS mx JOIN meetings m ON m.meetingID = mx.meetingID AND mx.id = m.id WHERE meetingTime <= NOW() ORDER BY meetingTime DESC;`;

  allMeetings.forEach((meeting) => {
    if (meeting.meetingTime != null) {
      queriedMeetings.push({
        id: meeting.meetingID,
        meetingTime: meeting.meetingTime.toString(),
      });
    }
  });

  return {
    props: {
      queriedMeetings: queriedMeetings,
    },
  };
};

//Adapted from https://github.com/Taofiqq/nextjs-paginate
const Meetings: NextPage<MeetingProps> = ({ queriedMeetings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const onPageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const paginatedPosts = paginate(queriedMeetings, currentPage, pageSize);
  if (!Array.isArray(paginatedPosts)) {
    throw new Error("Expected paginatedPosts to be an array");
  }

  return (
    <>
      <h1 className="text-3xl font-bold w-2/3 mx-auto">Meetings</h1>

      {paginatedPosts.map((meeting: { id: number; meetingTime: string }) => {
        return <Link className="flex" href={`/meetings/${meeting.id}`} key={meeting.id}>{meeting.meetingTime}</Link>;
      })}

      <Pagination
        items={queriedMeetings.length}
        currentPage={1} // 1
        pageSize={10} // 10
        onPageChange={onPageChange}
      />
    </>
  );
};

export default Meetings;
