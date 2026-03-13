import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";

const SYSTEM_PROMPT = `You are a civic assistant for Patterson, CA residents.
Summarize city meeting agendas in plain language accessible to all residents.

Rules:
- 8th grade reading level maximum
- Lead with what most affects residents' daily lives
- Explain all government acronyms and jargon
- Be factual and neutral — no editorializing
- Highlight: budgets, taxes, development/housing, public safety, parks/recreation
- Maximum 280 words
- End with a JSON block: {"keyTopics": ["topic1", "topic2", "topic3"]}

Respond with: plain summary paragraph(s), then the JSON block.`;

const MODEL = "claude-sonnet-4-20250514";

export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse optional body
  let meetingId: string | undefined;
  let limit = 10;

  try {
    const body = await request.json().catch(() => ({}));
    if (body.meetingId) meetingId = body.meetingId;
    if (body.limit && typeof body.limit === "number") limit = body.limit;
  } catch {
    // Empty body is fine, use defaults
  }

  const anthropic = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });

  let summarized = 0;
  let failed = 0;

  try {
    // Build query: meetings with agenda but no AI summary
    const whereClause = meetingId
      ? {
          id: meetingId,
          agenda: { isNot: null },
          aiSummary: null,
        }
      : {
          agenda: { isNot: null },
          aiSummary: null,
        };

    const meetings = await prisma.meeting.findMany({
      where: whereClause,
      include: {
        agenda: true,
      },
      take: meetingId ? 1 : limit,
      orderBy: { meetingTime: "desc" },
    });

    for (const meeting of meetings) {
      try {
        if (!meeting.agenda?.agendaMd) {
          console.warn(`Meeting ${meeting.id} has no agenda markdown, skipping`);
          failed++;
          continue;
        }

        const agendaContent = meeting.agenda.agendaMd;

        // Call Claude API
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: agendaContent,
            },
          ],
        });

        // Extract text content from response
        const textBlock = response.content.find(
          (block) => block.type === "text"
        );
        if (!textBlock || textBlock.type !== "text") {
          throw new Error("No text content in Claude response");
        }

        const fullResponse = textBlock.text;

        // Parse the response: extract summary and JSON block
        const { summary, keyTopics } = parseAIResponse(fullResponse);

        // Approximate token count from usage
        const tokenCount =
          (response.usage?.input_tokens ?? 0) +
          (response.usage?.output_tokens ?? 0);

        // Store in AISummary table
        await prisma.aISummary.create({
          data: {
            meetingId: meeting.id,
            summary,
            keyTopics,
            model: MODEL,
            tokenCount,
          },
        });

        summarized++;
      } catch (error) {
        console.error(
          `Failed to summarize meeting ${meeting.id}:`,
          error
        );
        failed++;
      }
    }

    return NextResponse.json({ success: true, summarized, failed });
  } catch (error) {
    console.error("Summarize route error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Parse the AI response into summary text and keyTopics array.
 * The response format is: plain text paragraphs followed by a JSON block
 * containing {"keyTopics": ["topic1", "topic2", ...]}.
 */
function parseAIResponse(response: string): {
  summary: string;
  keyTopics: string[];
} {
  // Find the last JSON block in the response
  const jsonMatch = response.match(/\{[\s\S]*"keyTopics"\s*:\s*\[[\s\S]*?\]\s*\}/);

  if (!jsonMatch) {
    // No JSON block found — use the full response as summary
    return {
      summary: response.trim(),
      keyTopics: [],
    };
  }

  // Summary is everything before the JSON block
  const jsonIndex = response.lastIndexOf(jsonMatch[0]);
  const summary = response.slice(0, jsonIndex).trim();

  // Parse the JSON block for keyTopics
  let keyTopics: string[] = [];
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (Array.isArray(parsed.keyTopics)) {
      keyTopics = parsed.keyTopics.filter(
        (t: unknown) => typeof t === "string"
      );
    }
  } catch {
    console.warn("Failed to parse keyTopics JSON block:", jsonMatch[0]);
  }

  return { summary, keyTopics };
}
