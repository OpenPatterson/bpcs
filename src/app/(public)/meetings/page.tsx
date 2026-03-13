import { Metadata } from "next";
import Link from "next/link";
import { getMeetings, getMeetingTypes, getMeetingYears } from "@/lib/db/meetings";
import { MeetingCard } from "@/components/meeting-card";
import { getMeetingMonthYear } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Meetings Archive",
  description: "Browse all Patterson, CA city government meeting records, agendas, and minutes.",
};

export const dynamic = "force-dynamic";

interface MeetingsPageProps {
  searchParams: Promise<{
    type?: string;
    year?: string;
    status?: string;
    board?: string;
    page?: string;
  }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const year = params.year ? parseInt(params.year, 10) : undefined;

  const [{ meetings, total, pages }, types, years] = await Promise.all([
    getMeetings({
      page,
      meetingType: params.type,
      year,
      status: params.status,
      board: params.board,
    }),
    getMeetingTypes(),
    getMeetingYears(),
  ]);

  // Group meetings by month-year
  const grouped = new Map<string, typeof meetings>();
  for (const m of meetings) {
    const key = getMeetingMonthYear(m.meetingTime);
    const arr = grouped.get(key) ?? [];
    arr.push(m);
    grouped.set(key, arr);
  }

  // Build filter URL helper
  function filterUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { type: params.type, year: params.year, status: params.status, board: params.board, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) p.set(k, v);
    }
    return `/meetings?${p.toString()}`;
  }

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        Meeting Archive
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Meeting Type */}
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={filterUrl({ type: undefined, page: undefined })}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              !params.type
                ? "bg-navy text-white border-navy"
                : "bg-white text-muted border-border hover:border-navy"
            }`}
          >
            All Types
          </Link>
          {types.map((t) => (
            <Link
              key={t}
              href={filterUrl({ type: t, page: undefined })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                params.type === t
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-muted border-border hover:border-navy"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Year */}
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={filterUrl({ year: undefined, page: undefined })}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              !params.year
                ? "bg-navy text-white border-navy"
                : "bg-white text-muted border-border hover:border-navy"
            }`}
          >
            All Years
          </Link>
          {years.map((y) => (
            <Link
              key={y}
              href={filterUrl({ year: String(y), page: undefined })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                params.year === String(y)
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-muted border-border hover:border-navy"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-1.5">
          {["upcoming", "final", "cancelled"].map((s) => (
            <Link
              key={s}
              href={filterUrl({
                status: params.status === s ? undefined : s,
                page: undefined,
              })}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors capitalize ${
                params.status === s
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-muted border-border hover:border-navy"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted mb-4">
        {total} meeting{total !== 1 ? "s" : ""} found
        {params.type && ` for ${params.type}`}
        {params.year && ` in ${params.year}`}
        {params.status && ` (${params.status})`}
      </p>

      {/* Grouped meeting list */}
      {meetings.length > 0 ? (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([monthYear, items]) => (
            <section key={monthYear}>
              <h2 className="font-display text-lg font-semibold text-navy mb-3 border-b pb-1">
                {monthYear}
              </h2>
              <div className="space-y-2">
                {items.map((m) => (
                  <MeetingCard
                    key={m.id}
                    id={m.id}
                    meetingTime={m.meetingTime}
                    meetingType={m.meetingType}
                    title={m.title}
                    status={m.status}
                    agendaUrl={m.agendaUrl}
                    minutesUrl={m.minutesUrl}
                    hasAiSummary={!!m.aiSummary}
                    compact
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted">No meetings match your filters.</p>
          <Link href="/meetings" className="text-sm text-navy hover:underline mt-2 inline-block">
            Clear filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Button asChild variant="outline" size="sm">
              <Link href={filterUrl({ page: String(page - 1) })}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
          <span className="text-sm text-muted">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Button asChild variant="outline" size="sm">
              <Link href={filterUrl({ page: String(page + 1) })}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
