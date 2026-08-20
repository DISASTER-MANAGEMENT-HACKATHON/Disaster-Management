"""Auditable priority scoring. No LLM calls belong in this numerical path."""

def score(*, affected: int = 0, medical: bool = False, vulnerable: int = 0, trapped: int = 0, access_limited: bool = False) -> dict:
    factors = {"people affected": min(25, affected // 50), "medical emergency": 20 if medical else 0, "vulnerable population": min(15, vulnerable // 10), "trapped people": min(15, trapped * 3), "limited nearby resources": 7 if access_limited else 0}
    total = min(100, 20 + sum(factors.values()))
    return {"score": total, "risk": "CRITICAL" if total >= 85 else "HIGH" if total >= 65 else "MODERATE", "factors": factors, "confidence": "DEMO"}
