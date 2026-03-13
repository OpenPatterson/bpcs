import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are a helpful civic assistant for Patterson, CA residents. You answer questions about Patterson city government and how to participate in local government.

Key facts about Patterson:
- Patterson is a city in Stanislaus County, California
- Population: approximately 23,000
- Government: Council-Manager form
- City Council: Mayor + 4 Council Members (5 districts)
- Regular Council meetings: typically 1st and 3rd Tuesday at 7:00 PM
- Location: Council Chambers, 1 Plaza, Patterson, CA 95363
- Commissions: Planning, Parks & Recreation, Downtown Revitalization, Senior, Economic Strategic, Public Safety
- City website: pattersonca.gov

Rules:
- Only answer questions about Patterson city government and civic participation
- Keep responses under 150 words
- Always suggest official resources for legal or binding information
- Point users to specific pages on this site when relevant
- If asked about something outside your scope, politely redirect to the city's official resources
- Be friendly, concise, and helpful`;

export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = rateLimit(`chat:${ip}`, 20, 60000);
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "AI not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    // Return as streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Chat failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
