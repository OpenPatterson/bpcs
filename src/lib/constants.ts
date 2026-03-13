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

export const MEETING_TYPE_BADGE_STYLES: Record<string, string> = {
  "City Council": "bg-navy text-white",
  "Planning Commission": "bg-teal-600 text-white",
  "Downtown Revitalization Committee": "bg-indigo-600 text-white",
  "Parks, Recreation & Beautification Commission": "bg-green-700 text-white",
  "Senior Commission": "bg-purple-600 text-white",
  "Economic Strategic Commission": "bg-orange-600 text-white",
  "Legal Notices & Public Hearings": "bg-red-600 text-white",
  "Public Safety Committee": "bg-red-700 text-white",
  "Senior Center Board of Directors": "bg-purple-500 text-white",
};

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
