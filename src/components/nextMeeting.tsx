import Link from "next/link";
import React from "react";

type Props = {
  id: number;
  meetingType: string;
  meetingTime: string;
};

export const NextMeeting: React.FC<Props> = ({ id, meetingType, meetingTime }) => {
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
    </>
  );
};

export default NextMeeting;
