export const TIMEZONE = "America/Los_Angeles";

export const MEETING_TYPES = [
  "City Council",
  "Downtown Revitalization Committee",
  "Economic Strategic Commission",
  "Planning Commission",
  "Parks, Recreation & Beautification Commission",
  "Senior Commission",
  "Legal Notices & Public Hearings",
  "Public Safety Committee",
  "Senior Center Board of Directors",
] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];

export const MEETING_TYPE_COLORS: Record<string, string> = {
  "City Council": "badge-council",
  "Planning Commission": "badge-planning",
  "Downtown Revitalization Committee": "badge-downtown",
  "Parks, Recreation & Beautification Commission": "badge-parks",
  "Senior Commission": "badge-senior",
  "Economic Strategic Commission": "badge-economic",
  "Legal Notices & Public Hearings": "badge-legal",
  "Public Safety Committee": "badge-legal",
  "Senior Center Board of Directors": "badge-senior",
};

/**
 * Badge colors as inline style objects.
 * Using inline styles because dynamic Tailwind class names in constants
 * are not detected by Tailwind's JIT content scanner, causing invisible badges.
 */
export const MEETING_TYPE_BADGE_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  "City Council": { bg: "#1B3A6B", text: "#FFFFFF" },
  "Planning Commission": { bg: "#0D9488", text: "#FFFFFF" },
  "Downtown Revitalization Committee": { bg: "#4F46E5", text: "#FFFFFF" },
  "Parks, Recreation & Beautification Commission": {
    bg: "#166534",
    text: "#FFFFFF",
  },
  "Senior Commission": { bg: "#7C3AED", text: "#FFFFFF" },
  "Economic Strategic Commission": { bg: "#EA580C", text: "#FFFFFF" },
  "Legal Notices & Public Hearings": { bg: "#C8102E", text: "#FFFFFF" },
  "Public Safety Committee": { bg: "#B91C1C", text: "#FFFFFF" },
  "Senior Center Board of Directors": { bg: "#A855F7", text: "#FFFFFF" },
};

export const DEFAULT_BADGE_COLOR = { bg: "#E5E7EB", text: "#1F2937" };

export const STATUS_BADGE_STYLES: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-800 border-blue-200",
  final: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200 line-through",
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  amended: "bg-orange-100 text-orange-800 border-orange-200",
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "tl", label: "Tagalog" },
] as const;

export const ITEMS_PER_PAGE = 30;
