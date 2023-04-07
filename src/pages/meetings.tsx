import type { NextPage } from "next";
import React, { useState } from "react";
import Link from "next/link";
import { prisma } from "../server/db";
import type { GetStaticProps } from "next";
import type { meetings } from "@prisma/client";
import Pagination from "~/components/pagination";
import { paginate } from "~/lib/paginate";

type MeetingProps = {
  queriedMeetings: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
  }[];
};

export const getStaticProps: GetStaticProps = async () => {
  const dateOptions: Record<string, string | undefined> = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const queriedMeetings: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
  }[] = [];

  const allMeetings = await prisma.$queryRaw<
    meetings[]
  >`SELECT m.* FROM (SELECT meetingID, max(id) as id FROM meetings GROUP BY meetingID) AS mx JOIN meetings m ON m.meetingID = mx.meetingID AND mx.id = m.id WHERE meetingTime <= NOW() ORDER BY meetingTime DESC;`;

  allMeetings.forEach((meeting) => {
    if (
      meeting.meetingTime != null &&
      meeting.meetingType != null &&
      meeting.agendaURL != null &&
      meeting.agendaPacketURL != null &&
      meeting.summaryURL != null &&
      meeting.minutesURL != null
    ) {
      const meetingTimeFormatted = meeting.meetingTime.toLocaleDateString(
        "en-US",
        dateOptions
      );
      queriedMeetings.push({
        id: meeting.meetingID,
        meetingTime: meetingTimeFormatted,
        meetingType: meeting.meetingType,
        agendaURL: meeting.agendaURL,
        agendaPacketURL: meeting.agendaPacketURL,
        summaryURL: meeting.summaryURL,
        minutesURL: meeting.minutesURL,
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
          Last Updated:
        </div>
      </div>
      {/* Paginated Posts */}
      {paginatedPosts.map(
        (meeting: {
          id: number;
          meetingTime: string;
          meetingType: string;
          agendaURL: string;
          agendaPacketURL: string;
          summaryURL: string;
          minutesURL: string;
        }, index) => {
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
                      {/* Solid SVG */}
                      <div className="hidden group-hover:block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6 2xl:h-10 2xl:w-10"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="group-hover:hidden">
                        {/* Outline SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="h-6 w-6 2xl:h-10 2xl:w-10"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
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
