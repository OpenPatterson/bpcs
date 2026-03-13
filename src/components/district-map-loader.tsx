"use client";

import dynamic from "next/dynamic";

const DistrictMap = dynamic(() => import("@/components/district-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-lg border bg-surface flex items-center justify-center">
      <p className="text-muted">Loading map...</p>
    </div>
  ),
});

export default function DistrictMapLoader() {
  return <DistrictMap />;
}
