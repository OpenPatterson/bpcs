import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 30;

// Include relations helper
const meetingWithRelations = {
  agenda: true,
  aiSummary: true,
  translations: true,
} satisfies Prisma.MeetingInclude;

/** Next upcoming meeting (not cancelled) with agenda + AI summary */
export async function getNextMeeting() {
  return prisma.meeting.findFirst({
    where: {
      meetingTime: { gt: new Date() },
      status: { not: "cancelled" },
    },
    orderBy: { meetingTime: "asc" },
    include: meetingWithRelations,
  });
}

/** Next N upcoming meetings */
export async function getUpcomingMeetings(limit = 5) {
  return prisma.meeting.findMany({
    where: {
      meetingTime: { gt: new Date() },
      status: { not: "cancelled" },
    },
    orderBy: { meetingTime: "asc" },
    take: limit,
    include: { agenda: true, aiSummary: true },
  });
}

/** Last N completed meetings */
export async function getRecentMeetings(limit = 5) {
  return prisma.meeting.findMany({
    where: {
      meetingTime: { lte: new Date() },
    },
    orderBy: { meetingTime: "desc" },
    take: limit,
    include: { agenda: true, aiSummary: true },
  });
}

/** Single meeting by ID with all relations */
export async function getMeetingById(id: string) {
  return prisma.meeting.findUnique({
    where: { id },
    include: meetingWithRelations,
  });
}

/** Paginated meetings with optional filters */
export async function getMeetings(options: {
  page?: number;
  perPage?: number;
  meetingType?: string;
  year?: number;
  status?: string;
  board?: string;
}) {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? ITEMS_PER_PAGE;
  const skip = (page - 1) * perPage;

  const where: Prisma.MeetingWhereInput = {};

  if (options.meetingType) {
    where.meetingType = options.meetingType;
  }
  if (options.status) {
    where.status = options.status;
  }
  if (options.board) {
    where.boardType = options.board;
  }
  if (options.year) {
    where.meetingTime = {
      gte: new Date(`${options.year}-01-01T00:00:00Z`),
      lt: new Date(`${options.year + 1}-01-01T00:00:00Z`),
    };
  }

  const [meetings, total] = await Promise.all([
    prisma.meeting.findMany({
      where,
      orderBy: { meetingTime: "desc" },
      skip,
      take: perPage,
      include: { agenda: true, aiSummary: true },
    }),
    prisma.meeting.count({ where }),
  ]);

  return {
    meetings,
    total,
    pages: Math.ceil(total / perPage),
    page,
  };
}

/** All distinct meeting types in the DB */
export async function getMeetingTypes(): Promise<string[]> {
  const result = await prisma.meeting.findMany({
    select: { meetingType: true },
    distinct: ["meetingType"],
    orderBy: { meetingType: "asc" },
  });
  return result.map((r) => r.meetingType);
}

/** All distinct years that have meetings */
export async function getMeetingYears(): Promise<number[]> {
  const result = await prisma.$queryRaw<{ year: number }[]>`
    SELECT DISTINCT EXTRACT(YEAR FROM "meetingTime")::int AS year
    FROM "Meeting"
    ORDER BY year DESC
  `;
  return result.map((r) => r.year);
}

// --- Search ---

export interface SearchResult {
  meetingId: string;
  meetingTime: Date;
  meetingType: string;
  title: string | null;
  status: string;
  matchType: "title" | "agenda" | "summary";
  matchExcerpt: string;
  rank: number;
}

/** Full-text search across meetings, agendas, and AI summaries */
export async function searchMeetings(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<{ results: SearchResult[]; total: number }> {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? ITEMS_PER_PAGE;
  const offset = (page - 1) * perPage;

  if (!query.trim()) {
    return { results: [], total: 0 };
  }

  const searchTerm = query.trim();

  // Use a combination of tsvector search + ILIKE fallback
  const results = await prisma.$queryRaw<
    Array<{
      meeting_id: string;
      meeting_time: Date;
      meeting_type: string;
      title: string | null;
      status: string;
      match_type: string;
      match_excerpt: string;
      rank: number;
    }>
  >`
    WITH ranked AS (
      -- Title matches
      SELECT
        m.id AS meeting_id,
        m."meetingTime" AS meeting_time,
        m."meetingType" AS meeting_type,
        m.title,
        m.status,
        'title' AS match_type,
        COALESCE(m.title, m."meetingType") AS match_excerpt,
        ts_rank(
          to_tsvector('english', COALESCE(m.title, '') || ' ' || m."meetingType"),
          plainto_tsquery('english', ${searchTerm})
        ) AS rank
      FROM "Meeting" m
      WHERE
        to_tsvector('english', COALESCE(m.title, '') || ' ' || m."meetingType")
          @@ plainto_tsquery('english', ${searchTerm})
        OR m.title ILIKE ${"%" + searchTerm + "%"}
        OR m."meetingType" ILIKE ${"%" + searchTerm + "%"}

      UNION ALL

      -- Agenda content matches
      SELECT
        m.id AS meeting_id,
        m."meetingTime" AS meeting_time,
        m."meetingType" AS meeting_type,
        m.title,
        m.status,
        'agenda' AS match_type,
        ts_headline('english', a."agendaMd",
          plainto_tsquery('english', ${searchTerm}),
          'MaxWords=40, MinWords=20, StartSel=**, StopSel=**'
        ) AS match_excerpt,
        ts_rank(
          to_tsvector('english', a."agendaMd"),
          plainto_tsquery('english', ${searchTerm})
        ) AS rank
      FROM "Agenda" a
      JOIN "Meeting" m ON m.id = a."meetingId"
      WHERE
        to_tsvector('english', a."agendaMd") @@ plainto_tsquery('english', ${searchTerm})
        OR a."agendaMd" ILIKE ${"%" + searchTerm + "%"}

      UNION ALL

      -- AI summary matches
      SELECT
        m.id AS meeting_id,
        m."meetingTime" AS meeting_time,
        m."meetingType" AS meeting_type,
        m.title,
        m.status,
        'summary' AS match_type,
        ts_headline('english', s.summary,
          plainto_tsquery('english', ${searchTerm}),
          'MaxWords=40, MinWords=20, StartSel=**, StopSel=**'
        ) AS match_excerpt,
        ts_rank(
          to_tsvector('english', s.summary),
          plainto_tsquery('english', ${searchTerm})
        ) AS rank
      FROM "AISummary" s
      JOIN "Meeting" m ON m.id = s."meetingId"
      WHERE
        to_tsvector('english', s.summary) @@ plainto_tsquery('english', ${searchTerm})
        OR s.summary ILIKE ${"%" + searchTerm + "%"}
    )
    SELECT * FROM ranked
    ORDER BY rank DESC, meeting_time DESC
    LIMIT ${perPage} OFFSET ${offset}
  `;

  const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(DISTINCT sub.meeting_id)::bigint AS count FROM (
      SELECT m.id AS meeting_id FROM "Meeting" m
      WHERE to_tsvector('english', COALESCE(m.title, '') || ' ' || m."meetingType")
        @@ plainto_tsquery('english', ${searchTerm})
        OR m.title ILIKE ${"%" + searchTerm + "%"}
        OR m."meetingType" ILIKE ${"%" + searchTerm + "%"}
      UNION
      SELECT a."meetingId" AS meeting_id FROM "Agenda" a
      WHERE to_tsvector('english', a."agendaMd") @@ plainto_tsquery('english', ${searchTerm})
        OR a."agendaMd" ILIKE ${"%" + searchTerm + "%"}
      UNION
      SELECT s."meetingId" AS meeting_id FROM "AISummary" s
      WHERE to_tsvector('english', s.summary) @@ plainto_tsquery('english', ${searchTerm})
        OR s.summary ILIKE ${"%" + searchTerm + "%"}
    ) sub
  `;

  return {
    results: results.map((r) => ({
      meetingId: r.meeting_id,
      meetingTime: r.meeting_time,
      meetingType: r.meeting_type,
      title: r.title,
      status: r.status,
      matchType: r.match_type as "title" | "agenda" | "summary",
      matchExcerpt: r.match_excerpt,
      rank: Number(r.rank),
    })),
    total: Number(countResult[0]?.count ?? 0),
  };
}
