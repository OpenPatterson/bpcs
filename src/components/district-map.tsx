"use client";

import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Patterson district polygon coordinates (approximate)
// These should be updated with actual district boundaries
const districts = [
  {
    id: 1,
    name: "District 1",
    representative: "TBD (Mayor)",
    color: "#1B3A6B",
    coords: [
      [37.475, -121.135],
      [37.475, -121.125],
      [37.468, -121.125],
      [37.468, -121.135],
    ] as [number, number][],
  },
  {
    id: 2,
    name: "District 2",
    representative: "TBD (Mayor Pro Tem)",
    color: "#0D9488",
    coords: [
      [37.475, -121.125],
      [37.475, -121.115],
      [37.468, -121.115],
      [37.468, -121.125],
    ] as [number, number][],
  },
  {
    id: 3,
    name: "District 3",
    representative: "TBD",
    color: "#4F46E5",
    coords: [
      [37.468, -121.135],
      [37.468, -121.125],
      [37.461, -121.125],
      [37.461, -121.135],
    ] as [number, number][],
  },
  {
    id: 4,
    name: "District 4",
    representative: "TBD",
    color: "#EA580C",
    coords: [
      [37.468, -121.125],
      [37.468, -121.115],
      [37.461, -121.115],
      [37.461, -121.125],
    ] as [number, number][],
  },
  {
    id: 5,
    name: "District 5",
    representative: "TBD",
    color: "#7C3AED",
    coords: [
      [37.461, -121.135],
      [37.461, -121.115],
      [37.454, -121.115],
      [37.454, -121.135],
    ] as [number, number][],
  },
];

export default function DistrictMap() {
  return (
    <MapContainer
      center={[37.466, -121.125]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[500px] w-full rounded-lg border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districts.map((district) => (
        <Polygon
          key={district.id}
          positions={district.coords}
          pathOptions={{
            color: district.color,
            fillColor: district.color,
            fillOpacity: 0.3,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-center">
              <p className="font-bold">{district.name}</p>
              <p className="text-sm">{district.representative}</p>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
