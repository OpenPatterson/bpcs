"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

function getTimeRemaining(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    const elapsed = Math.abs(diff);
    const elapsedMinutes = Math.floor(elapsed / 1000 / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    let agoText: string;
    if (elapsedMinutes < 5) {
      agoText = "Meeting has started";
    } else if (elapsedDays > 0) {
      agoText = `Meeting was ${elapsedDays} day${elapsedDays !== 1 ? "s" : ""} ago`;
    } else if (elapsedHours > 0) {
      agoText = `Meeting was ${elapsedHours} hour${elapsedHours !== 1 ? "s" : ""} ago`;
    } else {
      agoText = `Meeting was ${elapsedMinutes} minute${elapsedMinutes !== 1 ? "s" : ""} ago`;
    }

    return { past: true, text: agoText, urgent: false };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const urgent = diff < 3600000; // less than 1 hour

  let text: string;
  if (urgent) {
    text = `${minutes} minute${minutes !== 1 ? "s" : ""}, ${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else {
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    text = parts.join(", ") || "Less than a minute";
  }

  return { past: false, text, urgent };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeInfo, setTimeInfo] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    // Update immediately on mount
    setTimeInfo(getTimeRemaining(targetDate));

    const interval = setInterval(
      () => {
        const info = getTimeRemaining(targetDate);
        setTimeInfo(info);
      },
      timeInfo.urgent || timeInfo.past ? 1000 : 60000
    );

    return () => clearInterval(interval);
  }, [targetDate, timeInfo.urgent, timeInfo.past]);

  return (
    <span className={timeInfo.past ? "text-muted-foreground" : "font-semibold text-navy"}>
      {timeInfo.text}
    </span>
  );
}
