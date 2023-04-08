import type { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../server/db";
import type { GetStaticProps } from "next";
import type { meetings } from "@prisma/client";

type HomeProps = {
  queriedMeetings: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
  }[];
  queryUpcoming: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
    lastUpdated: string;
  };
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
  }[] = [];
  const queryUpcoming: {
    id: number;
    meetingTime: string;
    meetingType: string;
    agendaURL: string;
    agendaPacketURL: string;
    summaryURL: string;
    minutesURL: string;
    lastUpdated: string;
  } = {
    id: 1,
    meetingTime: "",
    meetingType: "",
    agendaURL: "",
    agendaPacketURL: "",
    summaryURL: "",
    minutesURL: "",
    lastUpdated: "",
  };

  const allMeetings = await prisma.$queryRaw<
    meetings[]
  >`SELECT m.* FROM (SELECT meetingID, max(id) as id FROM meetings GROUP BY meetingID) AS mx JOIN meetings m ON m.meetingID = mx.meetingID AND mx.id = m.id WHERE meetingTime <= NOW() ORDER BY meetingTime DESC LIMIT 10;`;
  const upcomingMeeting = await prisma.$queryRaw<
    meetings[]
  >`SELECT * FROM meetings WHERE meetingTime >= NOW() ORDER BY meetingTime ASC LIMIT 1;`;

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

  if (upcomingMeeting[0]) {
    queryUpcoming.id = upcomingMeeting[0].meetingID;
    if (
      upcomingMeeting[0].meetingTime != null &&
      upcomingMeeting[0].meetingType != null &&
      upcomingMeeting[0].meetingType != null &&
      upcomingMeeting[0].agendaURL != null &&
      upcomingMeeting[0].agendaPacketURL != null &&
      upcomingMeeting[0].summaryURL != null &&
      upcomingMeeting[0].minutesURL != null &&
      upcomingMeeting[0].created_at != null
    ) {
      const meetingTimeFormatted =
        upcomingMeeting[0].meetingTime.toLocaleDateString("en-US", dateOptions);
      const updatedTimeFormatted =
        upcomingMeeting[0].created_at.toLocaleDateString("en-US", dateOptions);
      queryUpcoming.meetingTime = meetingTimeFormatted;
      queryUpcoming.meetingType = upcomingMeeting[0].meetingType;
      queryUpcoming.agendaURL = upcomingMeeting[0].agendaURL;
      queryUpcoming.agendaPacketURL = upcomingMeeting[0].agendaPacketURL;
      queryUpcoming.summaryURL = upcomingMeeting[0].summaryURL;
      queryUpcoming.minutesURL = upcomingMeeting[0].minutesURL;
      queryUpcoming.lastUpdated = updatedTimeFormatted;
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
      <div className="">
        {/* Next Meeting Section */}
        <div className="my-5 text-center">
          <h1 className="my-5 text-5xl font-bold md:text-7xl 2xl:text-9xl">
            Next Meeting
          </h1>
          <div>
            <Link
              className="flex-column"
              href={`/meetings/${queryUpcoming.id}`}
              key={queryUpcoming.id}
            >
              <div className="flex flex-col text-2xl hover:underline">
                <div className="">{queryUpcoming.meetingType}</div>
                <div className="">{queryUpcoming.meetingTime}</div>
              </div>
              <div className="group relative mx-auto flex w-10 justify-center">
                {/* Solid */}
                <div className="hidden group-hover:block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-10 w-10 2xl:h-20 2xl:w-20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div className="group-hover:hidden">
                  {/* Outline */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-10 w-10 2xl:h-20 2xl:w-20"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
        {/* Previous Meetings Title */}
        <div className="max-w-full bg-primary-light py-5">
          <Link href={"/meetings"} className="">
            <div className="mx-auto w-3/4 text-3xl font-bold 2xl:w-2/3 2xl:text-5xl">
              Previous Meetings
            </div>
          </Link>
          <div className="mx-auto w-3/4 text-sm 2xl:w-2/3 2xl:text-xl">
            Last Updated: {queryUpcoming.lastUpdated}
          </div>
        </div>
        {/* 10 Previous Meetings */}
        <div className="">
          {queriedMeetings.map((meeting, index) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
