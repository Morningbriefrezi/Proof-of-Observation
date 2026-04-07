import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { fetchSkyForecast } from '@/lib/sky-data';
import { getVisiblePlanets } from '@/lib/planets';
import { getUpcomingEvents } from '@/lib/astro-events';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  let message: string;
  let history: { role: 'user' | 'assistant'; content: string }[];
  let locale: string;

  try {
    const body = await req.json() as {
      message: string;
      history: { role: 'user' | 'assistant'; content: string }[];
      locale?: string;
    };
    message = body.message;
    history = body.history ?? [];
    locale = body.locale ?? 'en';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'No message' }), { status: 400 });
  }

  // Fetch sky data — failures are non-fatal, Claude still responds
  let skyDataNote = '';
  const [forecast, planets, events] = await Promise.all([
    fetchSkyForecast(41.6941, 44.8337).catch(() => { skyDataNote = 'Sky data unavailable — answer generally and say current conditions are unknown.'; return null; }),
    Promise.resolve(getVisiblePlanets(41.6941, 44.8337, new Date())).catch(() => null),
    Promise.resolve(getUpcomingEvents(new Date())).catch(() => null),
  ]);

  const systemPrompt = `You are ASTRA — a personal AI astronomer inside STELLAR, an astronomy app.
You have access to real-time sky data for Tbilisi, Georgia (default location).
${skyDataNote ? `\nNOTE: ${skyDataNote}` : ''}
TONIGHT'S SKY CONDITIONS:
${forecast ? JSON.stringify(forecast[0]?.hours?.slice(18, 24)) : 'Sky data unavailable'}

PLANETS VISIBLE RIGHT NOW (altitude > 10°):
${planets ? JSON.stringify(planets.filter(p => p.visible).map(p => ({
  name: p.key, altitude: p.altitude, azimuth: p.azimuthDir, rise: p.rise, set: p.set
}))) : 'Planet data unavailable'}

ALL PLANETS (sorted by altitude):
${planets ? JSON.stringify(planets.map(p => ({ name: p.key, altitude: p.altitude, visible: p.visible }))) : 'Planet data unavailable'}

UPCOMING ASTRONOMY EVENTS (next 30 days):
${events ? JSON.stringify(events) : 'Event data unavailable'}

USER LANGUAGE: ${locale}
If the user writes in Georgian (ქართული), respond fully in Georgian.
If the user writes in English, respond in English.

RULES:
- Use real sky data when answering questions about tonight or current conditions
- Be specific: mention actual altitudes, compass directions, times
- Recommend objects based on what is ACTUALLY visible right now
- Mention ONE relevant Astroman telescope product if genuinely appropriate
- Keep responses concise: 2-4 sentences simple, up to 6 for complex questions
- Never invent sky data — only use what is provided above
- If sky data is unavailable, answer generally and say conditions are unknown`;

  const messages = [
    ...history.slice(-8),
    { role: 'user' as const, content: message },
  ];

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(`data: ${chunk.delta.text}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch {
          controller.enqueue(encoder.encode('data: [ERROR]\n\n'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[AstroChat] Claude API error:', err);
    return new Response(JSON.stringify({ error: 'AI temporarily unavailable' }), { status: 503 });
  }
}
