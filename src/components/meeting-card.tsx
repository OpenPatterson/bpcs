"use client";

import Link from "next/link";
import { FileText, FileCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MeetingTypeBadge } from "@/components/meeting-type-badge";
import { MeetingStatusBadge } from "@/components/meeting-status-badge";
import { formatShortDate, formatMeetingTime } from "@/lib/dates";

interface MeetingCardProps {
  id: string;
  meetingTime: Date;
  meetingType: string;
  title?: string | null;
  status: string;
  agendaUrl?: string | null;
  minutesUrl?: string | null;
  hasAiSummary?: boolean;
  compact?: boolean;
}

export function MeetingCard({
  id,
  meetingTime,
  meetingType,
  title,
  status,
  agendaUrl,
  minutesUrl,
  hasAiSummary,
  compact = false,
}: MeetingCardProps) {
  const displayTitle = title || meetingType;

  if (compact) {
    return (
      <Link
        href={`/meetings/${id}`}
        className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
      >
        <span className="shrink-0 text-sm text-muted-foreground">
          {formatShortDate(meetingTime)}
        </span>
        <MeetingTypeBadge type={meetingType} />
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {displayTitle}
        </span>
        <MeetingStatusBadge status={status} />
        <span className="flex shrink-0 items-center gap-1.5">
          {agendaUrl && (
            <a
              href={agendaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-navy transition-colors"
              title="View agenda"
            >
              <FileText className="h-4 w-4" />
            </a>
          )}
          {minutesUrl && (
            <a
              href={minutesUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-navy transition-colors"
              title="View minutes"
            >
              <FileCheck className="h-4 w-4" />
            </a>
          )}
          {hasAiSummary && (
            <span title="AI summary available"><Sparkles className="h-4 w-4 text-amber-500" /></span>
          )}
        </span>
      </Link>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/meetings/${id}`} className="block">
        <div className="p-6">
          {/* Header: badges */}
          <div className="flex items-center gap-2 mb-3">
            <MeetingTypeBadge type={meetingType} />
            <MeetingStatusBadge status={status} />
          </div>

          {/* Date & time */}
          <p className="text-sm text-muted-foreground mb-1">
            {formatShortDate(meetingTime)} &middot; {formatMeetingTime(meetingTime)}
          </p>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground">
            {displayTitle}
          </h3>

          {/* Action links */}
          <div className="mt-4 flex items-center gap-3">
            {agendaUrl && (
              <a
                href={agendaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy transition-colors"
              >
                <FileText className="h-4 w-4" />
                Agenda
              </a>
            )}
            {minutesUrl && (
              <a
                href={minutesUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy transition-colors"
              >
                <FileCheck className="h-4 w-4" />
                Minutes
              </a>
            )}
            {hasAiSummary && (
              <span className="inline-flex items-center gap-1.5 text-sm text-amber-600">
                <Sparkles className="h-4 w-4" />
                AI Summary
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
