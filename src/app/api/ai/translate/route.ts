import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";

const SUPPORTED_LANGUAGES: Record<string, string> = {
  es: "Spanish",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  tl: "Tagalog",
};

export async function POST(request: NextRequest) {
  try {
    const { meetingId, language, field } = await request.json();

    if (!meetingId || !language || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!SUPPORTED_LANGUAGES[language]) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    if (!["summary", "keyTopics"].includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    // Check cache
    const cached = await prisma.translation.findUnique({
      where: { meetingId_language_field: { meetingId, language, field } },
    });
    if (cached) {
      return NextResponse.json({ content: cached.content });
    }

    // Get source content
    const summary = await prisma.aISummary.findUnique({
      where: { meetingId },
    });
    if (!summary) {
      return NextResponse.json({ error: "No AI summary found" }, { status: 404 });
    }

    const sourceText = field === "summary"
      ? summary.summary
      : summary.keyTopics.join(", ");

    if (!env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "AI not configured" }, { status: 503 });
    }

    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const langName = SUPPORTED_LANGUAGES[language];

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are a translator. Translate the following text into ${langName}. Keep it natural and accessible. Only output the translation, nothing else.`,
      messages: [{ role: "user", content: sourceText }],
    });

    const translated = (message.content[0] as { type: string; text: string }).text;

    // Cache translation
    await prisma.translation.create({
      data: { meetingId, language, field, content: translated },
    });

    return NextResponse.json({ content: translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
