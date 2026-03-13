import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/db/meetings";
import { formatMeetingDate, formatShortDate, isMeetingUpcoming } from "@/lib/dates";
import { MeetingTypeBadge } from "@/components/meeting-type-badge";
import { MeetingStatusBadge } from "@/components/meeting-status-badge";
import { AISummaryCard } from "@/components/ai-summary-card";
import { AgendaRenderer } from "@/components/agenda-renderer";
import { CalendarButton } from "@/components/calendar-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  FileCheck,
  Package,
  ExternalLink,
  Share2,
  Video,
  MapPin,
  Clock,
  MessageSquare,
} from "lucide-react";

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MeetingPageProps): Promise<Metadata> {
  const { id } = await params;
  const meeting = await getMeetingById(id);
  if (!meeting) return { title: "Meeting Not Found" };

  const title = meeting.title || meeting.meetingType;
  const dateStr = formatShortDate(meeting.meetingTime);
  return {
    title: `${title} — ${dateStr}`,
    description: meeting.aiSummary?.summary?.slice(0, 160) ??
      `${title} on ${dateStr}. View the agenda, minutes, and AI summary.`,
  };
}

export const dynamic = "force-dynamic";

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const meeting = await getMeetingById(id);
  if (!meeting) notFound();

  const isUpcoming = isMeetingUpcoming(meeting.meetingTime);
  const displayTitle = meeting.title || meeting.meetingType;

  // Collect document links
  const documents = [
    meeting.agendaUrl && { label: "Agenda PDF", url: meeting.agendaUrl, icon: FileText },
    meeting.agendaPacketUrl && { label: "Agenda Packet", url: meeting.agendaPacketUrl, icon: Package },
    meeting.minutesUrl && { label: "Minutes", url: meeting.minutesUrl, icon: FileCheck },
    meeting.summaryUrl && { label: "Summary", url: meeting.summaryUrl, icon: FileText },
    meeting.meetingLink && { label: "Meeting Page", url: meeting.meetingLink, icon: ExternalLink },
  ].filter(Boolean) as Array<{ label: string; url: string; icon: React.ComponentType<{ className?: string }> }>;

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/meetings" className="text-sm text-muted hover:text-navy mb-4 inline-block">
        &larr; Back to meetings
      </Link>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Header */}
          <section>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MeetingTypeBadge type={meeting.meetingType} />
              <MeetingStatusBadge status={meeting.status} />
              {meeting.isAmended && (
                <span className="rounded-full bg-orange-100 text-orange-800 border border-orange-200 px-2.5 py-0.5 text-xs font-semibold">
                  Amended
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl mb-2">
              {displayTitle}
            </h1>

            <div className="flex flex-col gap-1 text-sm text-muted mb-4">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatMeetingDate(meeting.meetingTime)}
              </span>
              {meeting.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {meeting.location}
                </span>
              )}
              {meeting.zoomUrl && (
                <a
                  href={meeting.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-navy hover:underline"
                >
                  <Video className="h-4 w-4" />
                  Join via Zoom
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <CalendarButton
                meetingId={meeting.id}
                meetingTime={meeting.meetingTime}
                meetingType={meeting.meetingType}
                title={meeting.title ?? undefined}
                location={meeting.location ?? undefined}
              />
              <Button variant="outline" size="sm" disabled>
                <Share2 className="mr-1.5 h-4 w-4" />
                Share
              </Button>
            </div>
          </section>

          {/* 2. AI Summary */}
          {meeting.aiSummary && (
            <section>
              <AISummaryCard
                summary={meeting.aiSummary.summary}
                keyTopics={meeting.aiSummary.keyTopics}
                meetingId={meeting.id}
              />
            </section>
          )}

          {/* 3. Agenda */}
          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-4">
              Agenda
            </h2>
            {meeting.agenda ? (
              <div className="rounded-lg border bg-card p-6 print-expand">
                <AgendaRenderer markdown={meeting.agenda.agendaMd} />
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted">
                  <p>
                    Agenda not yet available
                    {isUpcoming
                      ? " — typically posted 72 hours before the meeting."
                      : "."}
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* 5. How to Participate (upcoming only) */}
          {isUpcoming && (
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5 text-navy" />
                    How to Participate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Speak at the Meeting</p>
                    <p className="text-muted">
                      Sign up to speak during Public Comment. Each speaker is
                      given 3 minutes. Arrive early to fill out a speaker card
                      with the City Clerk.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Submit Written Comment</p>
                    <p className="text-muted">
                      Email your comments to the City Clerk before the meeting.
                      Written comments are entered into the public record.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">City Clerk Contact</p>
                    <p className="text-muted">
                      City of Patterson, 1 Plaza, Patterson, CA 95363
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="mt-8 lg:mt-0 space-y-6">
          {/* 4. Documents */}
          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {documents.map((doc) => (
                    <li key={doc.label}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-navy hover:underline"
                      >
                        <doc.icon className="h-4 w-4 shrink-0" />
                        {doc.label}
                        <ExternalLink className="h-3 w-3 ml-auto text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 6. Remind Me (upcoming only) */}
          {isUpcoming && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get Reminded</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted mb-3">
                  Sign up to receive a reminder before this meeting.
                </p>
                <Button asChild className="w-full">
                  <Link href="/signup">Sign Up for Reminders</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Meeting info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Source</span>
                <span className="capitalize">{meeting.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Board</span>
                <span>{meeting.boardType || "—"}</span>
              </div>
              {meeting.postedAt && (
                <div className="flex justify-between">
                  <span className="text-muted">Posted</span>
                  <span>{formatShortDate(meeting.postedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
