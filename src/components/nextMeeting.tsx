import Link from "next/link";
import React from "react";
import { ArrowIcon } from "~/components/arrowSVG";

type Props = {
  id: number;
  meetingType: string;
  meetingTime: string;
};

export const NextMeeting: React.FC<Props> = ({
  id,
  meetingType,
  meetingTime,
}) => {
  return (
    <>
      <div className="my-5 text-center">
        <h1 className="my-5 text-5xl font-bold md:text-7xl 2xl:text-9xl">
          Next Meeting
        </h1>
        <div>
          <Link className="flex-column" href={`/meetings/${id}`} key={id}>
            <div className="flex flex-col text-2xl hover:underline">
              <div className="">{meetingType}</div>
              <div className="">{meetingTime}</div>
            </div>
            <div className="group relative mx-auto flex w-10 justify-center">
              <ArrowIcon size={"h-10 w-10 2xl:h-20 2xl:w-20"} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NextMeeting;
