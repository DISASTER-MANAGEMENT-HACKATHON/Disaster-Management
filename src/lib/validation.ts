import { z } from "zod";

export const incidentCategories = ["FLOOD", "FIRE", "MEDICAL", "ROAD_ACCIDENT", "BUILDING_COLLAPSE", "OTHER"] as const;
const safeText = (label: string, max: number) => z.string().trim().min(3, `${label} must be at least 3 characters.`).max(max, `${label} must be ${max} characters or fewer.`).refine((value) => !/[<>]/.test(value), `${label} cannot contain HTML characters.`);

export const incidentSchema = z.object({
  title: safeText("Title", 120), category: z.enum(incidentCategories), location: safeText("Location", 160),
  description: safeText("Description", 2000), countQuality: z.enum(["UNKNOWN", "ESTIMATE", "VERIFIED"]),
  affectedPeople: z.number().int().min(0).max(1_000_000).optional(),
});
export const searchSchema = z.string().trim().max(100).transform((value) => value.replace(/[<>]/g, ""));
export function getInternalPath(value: string | null | undefined, fallback = "/") { return value?.startsWith("/") && !value.startsWith("//") ? value : fallback; }
