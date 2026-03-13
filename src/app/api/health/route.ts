import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const status: {
    status: string;
    timestamp: string;
    database: string;
    error?: string;
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "disconnected",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database = "connected";
  } catch (error) {
    status.status = "degraded";
    status.database = "disconnected";
    status.error =
      error instanceof Error ? error.message : "Unknown database error";
  }

  return NextResponse.json(status, {
    status: status.status === "ok" ? 200 : 503,
  });
}
