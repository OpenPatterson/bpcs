import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Sparkles,
  Users,
  Bell,
  Bot,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    totalMeetings,
    meetingsWithAgendas,
    meetingsWithSummaries,
    totalUsers,
    notificationsSentThisMonth,
  ] = await Promise.all([
    prisma.meeting.count(),
    prisma.agenda.count(),
    prisma.aISummary.count(),
    prisma.user.count(),
    prisma.notificationLog.count({
      where: {
        sentAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const stats = [
    { label: "Total Meetings", value: totalMeetings, icon: Calendar },
    { label: "With Agendas", value: meetingsWithAgendas, icon: FileText },
    { label: "With AI Summaries", value: meetingsWithSummaries, icon: Sparkles },
    { label: "Users", value: totalUsers, icon: Users },
    { label: "Notifications (month)", value: notificationsSentThisMonth, icon: Bell },
  ];

  return (
    <div className="max-w-content mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-navy mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className="h-8 w-8 text-navy/50" />
              <div>
                <p className="text-2xl font-bold text-navy">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Scrapers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted mb-4">
              Trigger data scrapers to fetch new meeting data from CivicPlus and
              IQM2 sources.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/scraper">Manage Scrapers</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted mb-4">
              Generate AI summaries for meetings that have agendas but no summary
              yet.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/ai">Manage AI</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
