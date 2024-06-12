import type { NextPage } from "next";
import React, { useState } from "react";
import Link from "next/link";
import { prisma } from "../server/db";
import type { GetStaticProps } from "next";
import type { meetings } from "@prisma/client";
import Pagination from "~/components/pagination";
import { paginate } from "~/lib/paginate";
import { ArrowIcon } from "~/components/arrowSVG"

type MeetingProps = {
  queriedMeetings: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
    lastUpdated: string;
  }[];
};

export const getStaticProps: GetStaticProps = async () => {
  const dateOptions: Record<string, string | undefined> = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "America/Los_Angeles",
  };
  const queriedMeetings: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
    lastUpdated: string;
  }[] = [];

  const allMeetings = await prisma.$queryRaw<
    meetings[]
  >`SELECT m.* FROM (SELECT meetingID, max(id) as id FROM meetings GROUP BY meetingID) AS mx JOIN meetings m ON m.meetingID = mx.meetingID AND mx.id = m.id WHERE meetingTime <= NOW() ORDER BY meetingTime DESC;`;

  allMeetings.forEach((meeting) => {
    if (
      meeting.meetingtime != null &&
      meeting.meetingtype != null &&
      meeting.agendaurl != null &&
      meeting.agendapacketurl != null &&
      meeting.summaryurl != null &&
      meeting.minutesurl != null &&
      meeting.created_at != null
    ) {
      const meetingTimeFormatted = meeting.meetingtime.toLocaleDateString(
        "en-US",
        dateOptions
      );
      const updatedTimeFormatted = meeting.created_at.toLocaleDateString(
        "en-US",
        dateOptions
      );
      queriedMeetings.push({
        id: meeting.meetingid,
        meetingTime: meetingTimeFormatted,
        meetingType: meeting.meetingtype,
        agendaURL: meeting.agendaurl,
        agendaPacketURL: meeting.agendapacketurl,
        summaryURL: meeting.summaryurl,
        minutesURL: meeting.minutesurl,
        lastUpdated: updatedTimeFormatted,
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
      {/* All Meetings */}
      <div className="max-w-full bg-primary-light py-5">
        <Link href={"/meetings"} className="">
          <div className="mx-auto w-3/4 text-3xl font-bold 2xl:w-2/3 2xl:text-5xl">
            All Meetings
          </div>
        </Link>
        <div className="mx-auto w-3/4 text-sm 2xl:w-2/3 2xl:text-xl">
          Last Updated:{" "}
          {queriedMeetings[0] == null ? "N/A" : queriedMeetings[0].lastUpdated}
        </div>
      </div>
      {/* Paginated Posts */}
      {paginatedPosts.map(
        (
          meeting: {
            id: number;
            meetingTime: string;
            meetingType: string;
            agendaURL: string;
            agendaPacketURL: string;
            summaryURL: string;
            minutesURL: string;
          },
          index
        ) => {
          return (
            <div
              key={meeting.id}
              className={index % 2 == 0 ? "" : "bg-primary-light"}
            >
              <div className="mx-auto px-5 py-5 md:mx-auto md:flex md:w-3/4 md:flex-row md:items-center md:justify-between md:px-0 2xl:w-2/3 2xl:text-2xl">
                <Link
                  className=""
                  href={`/meetings/${meeting.id}`}
                  key={meeting.id}
                >
                  <div className="flex items-center text-center md:text-left">
                    <div className="w-full">
                      <div className="hover:underline">
                        <div className="">{meeting.meetingType}</div>
                        <div className="">{meeting.meetingTime}</div>
                      </div>
                    </div>
                    <div className="group">
                      <ArrowIcon size={"h-6 w-6 2xl:h-10 2xl:w-10"} />
                    </div>
                  </div>
                </Link>
                {/* Agenda, Agenda Packet, Minutes, and Summary URLs */}
                <div className="block space-x-3 pt-3 text-center md:py-0 2xl:space-x-10">
                  {meeting.agendaURL == "" ? null : (
                    <Link
                      href={`https://pattersonca.iqm2.com/Citizens/${meeting.agendaURL}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      Agenda
                    </Link>
                  )}
                  {meeting.agendaPacketURL == "" ? null : (
                    <Link
                      href={`https://pattersonca.iqm2.com/Citizens/${meeting.agendaPacketURL}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      Agenda Packet
                    </Link>
                  )}
                  {meeting.minutesURL == "" ? null : (
                    <Link
                      href={`https://pattersonca.iqm2.com/Citizens/${meeting.minutesURL}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      Minutes
                    </Link>
                  )}
                  {meeting.summaryURL == "" ? null : (
                    <Link
                      href={`https://pattersonca.iqm2.com/Citizens/${meeting.summaryURL}`}
                      className="hover:underline"
                      target="_blank"
                    >
                      Summary
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        }
      )}
      {/* Pagination */}
      <Pagination
        items={queriedMeetings.length}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default Meetings;
