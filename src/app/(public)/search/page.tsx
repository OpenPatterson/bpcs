import { Metadata } from "next";
import Link from "next/link";
import { searchMeetings } from "@/lib/db/meetings";
import { formatShortDate } from "@/lib/dates";
import { MeetingTypeBadge } from "@/components/meeting-type-badge";
import { MeetingStatusBadge } from "@/components/meeting-status-badge";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Patterson city meeting agendas, minutes, and AI summaries.",
};

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = parseInt(params.page ?? "1", 10);

  const { results, total } = query
    ? await searchMeetings(query, { page, perPage: 20 })
    : { results: [], total: 0 };

  const pages = Math.ceil(total / 20);

  const matchTypeIcon = {
    title: null,
    agenda: <FileText className="h-3.5 w-3.5 text-muted" />,
    summary: <Sparkles className="h-3.5 w-3.5 text-amber-500" />,
  };

  const matchTypeLabel = {
    title: "Title match",
    agenda: "Agenda match",
    summary: "AI Summary match",
  };

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        Search Meetings
      </h1>

      <div className="mb-8 max-w-lg">
        <SearchBar />
      </div>

      {query && (
        <>
          <p className="text-sm text-muted mb-6">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((r, i) => (
                <Card key={`${r.meetingId}-${r.matchType}-${i}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MeetingTypeBadge type={r.meetingType} />
                      <MeetingStatusBadge status={r.status} />
                      <span className="flex items-center gap-1 text-xs text-muted ml-auto">
                        {matchTypeIcon[r.matchType]}
                        {matchTypeLabel[r.matchType]}
                      </span>
                    </div>
                    <Link
                      href={`/meetings/${r.meetingId}`}
                      className="font-semibold text-navy hover:underline"
                    >
                      {r.title || r.meetingType}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">
                      {formatShortDate(r.meetingTime)}
                    </p>
                    {r.matchExcerpt && (
                      <p className="text-sm text-foreground mt-2 line-clamp-2">
                        {r.matchExcerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted">
                No results found for &ldquo;{query}&rdquo;. Try different keywords.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-4">
              {page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>
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
                  <Link href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>
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
        </>
      )}

      {!query && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted mb-2">
            Search across all meeting titles, agenda content, and AI summaries.
          </p>
          <p className="text-xs text-muted">
            Try: &ldquo;budget&rdquo;, &ldquo;housing&rdquo;, &ldquo;parks&rdquo;, &ldquo;downtown&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
