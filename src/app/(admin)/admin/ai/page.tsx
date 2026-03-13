import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { formatShortDate } from "@/lib/dates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Summary Management",
};

export const dynamic = "force-dynamic";

export default async function AIManagementPage() {
  // Meetings with agendas but no AI summary
  const needsSummary = await prisma.meeting.findMany({
    where: {
      agenda: { isNot: null },
      aiSummary: { is: null },
    },
    include: { agenda: true },
    orderBy: { meetingTime: "desc" },
    take: 50,
  });

  // Recent AI summaries
  const recentSummaries = await prisma.aISummary.findMany({
    include: { meeting: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        AI Summary Management
      </h1>

      {/* Needs Summary */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-navy mb-4">
          Meetings Needing Summaries ({needsSummary.length})
        </h2>
        {needsSummary.length > 0 ? (
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-muted">Date</th>
                  <th className="text-left px-4 py-2 font-medium text-muted">Type</th>
                  <th className="text-left px-4 py-2 font-medium text-muted">Title</th>
                  <th className="text-left px-4 py-2 font-medium text-muted">Agenda</th>
                </tr>
              </thead>
              <tbody>
                {needsSummary.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-2">{formatShortDate(m.meetingTime)}</td>
                    <td className="px-4 py-2">{m.meetingType}</td>
                    <td className="px-4 py-2">{m.title || "—"}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline" className="text-xs">
                        {m.agenda ? `${m.agenda.agendaMd.length} chars` : "—"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-sm">All meetings with agendas have AI summaries.</p>
        )}
      </section>

      {/* Recent Summaries */}
      <section>
        <h2 className="font-display text-xl font-bold text-navy mb-4">
          Recent Summaries
        </h2>
        {recentSummaries.length > 0 ? (
          <div className="space-y-3">
            {recentSummaries.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-sm">
                      {s.meeting.title || s.meeting.meetingType}
                    </span>
                    <span className="text-xs text-muted ml-auto">
                      {formatShortDate(s.meeting.meetingTime)} &middot; {s.model}
                    </span>
                  </div>
                  <p className="text-sm text-muted line-clamp-2">{s.summary}</p>
                  {s.keyTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.keyTopics.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">No AI summaries generated yet.</p>
        )}
      </section>
    </div>
  );
}
