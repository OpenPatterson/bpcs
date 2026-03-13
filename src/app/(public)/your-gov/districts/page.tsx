import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "District Map",
  description: "Interactive map of Patterson, CA city council districts. Find your district.",
};

const DistrictMap = dynamic(() => import("@/components/district-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-lg border bg-surface flex items-center justify-center">
      <p className="text-muted">Loading map...</p>
    </div>
  ),
});

export default function DistrictsPage() {
  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-2">
        Council Districts
      </h1>
      <p className="text-muted mb-6">
        Patterson is divided into five council districts. Each district elects one
        Council Member. Click a district on the map to learn more.
      </p>

      <div className="mb-8">
        <DistrictMap />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-bold text-navy mb-3">
            Find Your District
          </h2>
          <p className="text-sm text-muted mb-3">
            Not sure which district you&apos;re in? Enter your address to find out.
          </p>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Enter your Patterson address..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              disabled
            />
            <button
              className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white"
              disabled
            >
              Look Up
            </button>
          </div>
          <p className="text-xs text-muted mt-2">
            Address lookup coming soon. Uses OpenStreetMap Nominatim geocoding.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
