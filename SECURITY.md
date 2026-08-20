# Security notes for RescueChain

RescueChain is a BCA college demonstration project. It uses synthetic data and is not an official government system.

## Security features

- Security headers: CSP, clickjacking protection, MIME sniffing protection, referrer policy, and production HSTS are set in `middleware.ts`.
- Input validation: incident fields have clear length, category, number-range, and HTML-character checks in Zod and the FastAPI boundary.
- XSS protection: React escapes displayed values by default; user-entered incident content is never rendered as HTML and HTML characters are rejected.
- Safe redirects: application navigation uses fixed internal routes; no user-controlled external redirect is accepted.
- Basic anti-spam: incident submissions validate before submission, disable repeated processing, and have a 15-second local cooldown. This is demo-level protection, not distributed rate limiting.
- Environment protection: `.env.example` contains placeholders only. Do not place secrets in `NEXT_PUBLIC_*` variables.
- Error handling: form validation shows simple user-facing messages; backend validation rejects malformed requests.
- Demo/admin protection: the displayed demo login is explicitly local-only. Browser state and roles are not treated as authorization for a real sensitive operation.

## Limitations

This prototype does not provide real government identity verification, production database security, enterprise authentication/authorization, SIEM monitoring, distributed DDoS protection, audit retention, or integrations with emergency infrastructure. A production system would require server-side sessions, role checks on every protected API action, secure secret management, database access controls, independent security testing, monitoring, and incident-response processes.
