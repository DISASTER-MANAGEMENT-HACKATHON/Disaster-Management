import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  const developmentSources = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Content-Security-Policy", `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net${developmentSources}; connect-src 'self' http://localhost:8000${process.env.NODE_ENV === "development" ? " ws:" : ""};`);
  if (process.env.NODE_ENV === "production") response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return response;
}

export const config = { matcher: "/:path*" };
