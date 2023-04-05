import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../server/db";
import type { GetServerSideProps } from "next";
import { meetings } from "@prisma/client";

// type MeetingProps = {
// };

// export const getServerSideProps: GetServerSideProps = async () => {
// };

//Adapted from https://github.com/Taofiqq/nextjs-paginate
const Meetings: NextPage = () => {
  return (
    <>
    <h1>Meetings</h1>
    </>
  );
};

export default Meetings;
