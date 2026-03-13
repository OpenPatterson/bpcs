import { NextRequest, NextResponse } from "next/server";
import { searchMeetings } from "@/lib/db/meetings";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10);

  if (!q.trim()) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const results = await searchMeetings(q, { page, perPage: 20 });
  return NextResponse.json(results);
}
