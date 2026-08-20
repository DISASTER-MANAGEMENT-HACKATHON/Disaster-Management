"""Optional Gemini adapter; callers must keep actions deterministic and approved."""

import os
from google import genai

SYSTEM_PROMPT = """
You are RescueChain AI, an emergency response assistant. 
Provide concise, actionable triage guidance, resource allocation suggestions, 
and disaster management support. Keep answers structured and precise.
"""


def mode() -> str:
    return "GEMINI" if os.getenv("GEMINI_API_KEY") else "DEMO_AI"


def analyze_report(text: str) -> dict:
    """Return a stable fallback until the SDK-backed adapter is configured."""
    return {
        "mode": mode(),
        "summary": text[:240],
        "confidence": "DEMO",
        "requires_review": True,
    }


def stream_disaster_response(user_prompt: str):
    """
    Streams disaster response chunks from Gemini LLM using google-genai.
    Falls back to a demo stream if GEMINI_API_KEY is not configured.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        demo_text = (
            f"[DEMO_AI] RescueChain AI received: '{user_prompt}'. "
            "Please configure GEMINI_API_KEY in your environment for live LLM response."
        )
        for word in demo_text.split():
            yield f"data: {word} \n\n"
        return

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content_stream(
        model="gemini-3.6-flash", contents=[SYSTEM_PROMPT, user_prompt]
    )

    for chunk in response:
        if chunk.text:
            yield f"data: {chunk.text}\n\n"
