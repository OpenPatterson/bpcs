import { type NextPage } from "next";
import Head from "next/head";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import dynamic from "next/dynamic";


const CityCouncil: NextPage = () => {
    const MapWithNoSSR = dynamic(() => import("~/components/map"), {
        ssr: false
      });
  return (
    <>
      <main>
        <div className="h-600 w-100" id="map">
          <MapWithNoSSR />
        </div>
      </main>
    </>
  );
};

export default CityCouncil;
