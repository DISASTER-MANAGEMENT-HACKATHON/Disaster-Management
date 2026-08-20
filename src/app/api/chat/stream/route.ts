import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ [RESCUECHAIN AI]: GEMINI_API_KEY missing in .env.local");
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY missing in .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are RESCUECHAIN AI, an emergency operations assistant for dispatch officers in Guwahati, Assam. " +
          "RULES: Provide extremely short, concise answers. Use plain text dashes (-) instead of markdown asterisks or hashes. " +
          "Never use bold (**), headers (##), or markdown formatting. Keep responses clean, plain text, and ultra-short.",
      },
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err) {
          console.error("❌ [RESCUECHAIN AI STREAM ERROR]:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("❌ [RESCUECHAIN AI ROUTE ERROR]:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate AI response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}