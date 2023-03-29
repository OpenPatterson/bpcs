import { type NextPage } from "next";
import Head from "next/head";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import dynamic from "next/dynamic";

const CityCouncil: NextPage = () => {
  const MapWithNoSSR = dynamic(() => import("~/components/map"), {
    ssr: false,
  });
  return (
    <>
      <div className="my-10">
        <div className="flex flex-col items-center lg:flex-row">
          <div className="flex flex-col md:w-1/2">
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
          <div id="map" className="h-full lg:w-1/2">
            <MapWithNoSSR />
          </div>
        </div>
      </div>
    </>
  );
};

export default CityCouncil;
