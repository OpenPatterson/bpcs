import {
  format,
  formatDistanceToNow,
  isFuture,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "America/Los_Angeles";

function toPacific(date: Date): Date {
  return toZonedTime(date, TIMEZONE);
}

/** "Tuesday, March 9, 2026 at 7:00 PM" */
export function formatMeetingDate(date: Date): string {
  return format(toPacific(date), "EEEE, MMMM d, yyyy 'at' h:mm a");
}

/** "Mar 9, 2026" */
export function formatShortDate(date: Date): string {
  return format(toPacific(date), "MMM d, yyyy");
}

/** "7:00 PM" */
export function formatMeetingTime(date: Date): string {
  return format(toPacific(date), "h:mm a");
}

/** "in 3 days" or "3 days ago" */
export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/** Positive = future, negative = past */
export function daysUntilMeeting(date: Date): number {
  return differenceInDays(date, new Date());
}

export function hoursUntilMeeting(date: Date): number {
  return differenceInHours(date, new Date());
}

export function minutesUntilMeeting(date: Date): number {
  return differenceInMinutes(date, new Date());
}

export function isMeetingUpcoming(date: Date): boolean {
  return isFuture(date);
}

/** ICS format: "20260309T190000" */
export function formatICSDate(date: Date): string {
  return format(toPacific(date), "yyyyMMdd'T'HHmmss");
}

/** Year in Pacific time */
export function getMeetingYear(date: Date): number {
  return toPacific(date).getFullYear();
}

/** "March" in Pacific time */
export function getMeetingMonth(date: Date): string {
  return format(toPacific(date), "MMMM");
}

/** "March 2026" in Pacific time */
export function getMeetingMonthYear(date: Date): string {
  return format(toPacific(date), "MMMM yyyy");
}
