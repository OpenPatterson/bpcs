"use client";

import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarButtonProps {
  meetingId: string;
  meetingTime: Date;
  meetingType: string;
  title?: string;
  location?: string;
}

export function CalendarButton({
  meetingId,
  meetingTime,
  meetingType,
  title,
  location,
}: CalendarButtonProps) {
  async function handleDownload() {
    try {
      const response = await fetch(`/api/calendar/${meetingId}`);
      if (!response.ok) {
        throw new Error("Failed to generate calendar file");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${meetingType.replace(/\s+/g, "-").toLowerCase()}-${meetingId}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Calendar download failed:", error);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <CalendarPlus className="mr-1.5 h-4 w-4" />
      Add to Calendar
    </Button>
  );
}
