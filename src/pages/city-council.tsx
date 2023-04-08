import { type NextPage } from "next";
import dynamic from "next/dynamic";
import GovStructure from "../../public/images/gov-structure.png";
import Image from "next/image";
import Link from "next/link";

const CityCouncil: NextPage = () => {
  const MapWithNoSSR = dynamic(() => import("~/components/map"), {
    ssr: false,
  });
  const MapWithNoSSRLg = dynamic(() => import("~/components/map-lg"), {
    ssr: false,
  });
  const MapWithNoSSRXl = dynamic(() => import("~/components/map-xl"), {
    ssr: false,
  });
  return (
    <>
      <div className="justify-between">
        <div className="bg-primary-light py-5 text-center text-3xl font-bold md:text-5xl 2xl:text-7xl">
          City Leadership
        </div>
        <div className="flex flex-col items-center lg:flex-row">
          <div className="flex flex-col md:w-1/2 md:text-xl lg:text-2xl 2xl:text-5xl">
            <div className="mx-auto flex w-full flex-row justify-center space-x-5">
              <div className="font-bold">City Manager</div>
              <div className="">Ken Irwin</div>
            </div>
            <div className="mx-auto flex w-full flex-row justify-center space-x-5">
              <div className="font-bold">City Mayor</div>
              <div className="">Michael Clauzel</div>
            </div>
            <div className="mx-auto flex w-full flex-row justify-center space-x-5">
              <div className="font-bold">City Council District A</div>
              <div className="">Shivaugn Alves</div>
            </div>
            <div className="mx-auto flex w-full flex-row justify-center space-x-5">
              <div className="font-bold">City Council District B</div>
              <div className="">Jessica Romero</div>
            </div>
            <div className="mx-auto flex w-full flex-row justify-center space-x-5">
              <div className="font-bold">City Council District C</div>
              <div className="">Dominic Farinha</div>
            </div>
            <div className="mx-auto flex w-full flex-row justify-center space-x-5">
              <div className="font-bold">City Council District D</div>
              <div className="">Carlos Roque</div>
            </div>
          </div>
          <div id="map" className="h-full lg:hidden lg:w-1/2">
            <MapWithNoSSR />
          </div>
          <div id="map" className="hidden h-full lg:block lg:w-1/2 2xl:hidden">
            <MapWithNoSSRLg />
          </div>
          <div id="map" className="hidden h-full lg:w-1/2 2xl:block">
            <MapWithNoSSRXl />
          </div>
        </div>
        <div className="bg-primary-light py-5 text-center text-3xl font-bold md:text-5xl 2xl:text-7xl">
          City Structure
        </div>
        <div className="">
          <Image
            src={GovStructure}
            alt={"City Government Structure"}
            className="mx-auto"
          />
          <Link
            href={"https://ci.patterson.ca.us/129/City-Administration"}
            target="_blank"
          >
            <div className="pb-5 text-center text-sm underline xl:text-xl">
              Provided by City of Patterson
            </div>
          </Link>
          <div className="px-5 text-center text-xl md:mx-auto md:w-2/3 lg:px-0 lg:text-2xl 2xl:w-1/2 2xl:text-4xl">
            The City of Patterson is a Council-Manager government. Citizens of
            Patterson vote for 4 Council Members to serve four-year terms and a
            Mayor who serves a two-year term. The mayor presides over the City
            Council and performs ceremonial duties. The City Council appoints a
            City Manager, City Attorney, and all other positions. They hold
            office indefinitely until they resign or are removed from office.
          </div>
          <div className="py-5 text-center text-2xl font-medium md:text-3xl 2xl:text-5xl">
            Selected Salary & Position Type as of 2023
          </div>
          <div className="px-5 text-center text-xl md:mx-auto md:w-2/3 lg:px-0 lg:text-2xl 2xl:w-1/2 2xl:text-4xl">
            <ul className="space-y-3">
              <li>
                <div className="font-bold">
                  City Manager, Appointed, Full-Time:
                </div>
                <div className="">Approx $180,000 to $220,000 per year</div>
              </li>
              <li>
                <div className="font-bold">
                  City Mayor, Elected, Monthly Stipend:
                </div>
                <div className="">Approx $660 per month</div>
              </li>
              <li>
                <div className="font-bold">
                  City Councilmember, Elected, Monthly Stipend:
                </div>
                <div className="">Approx $396 per month</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityCouncil;
