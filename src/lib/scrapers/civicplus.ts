import * as cheerio from "cheerio";
import type { Element } from "domhandler";

// ─── Types ──────────────────────────────────────────────────

export interface ScrapedMeeting {
  sourceId: string; // e.g. "1444" from "_03092026-1444"
  meetingDate: Date;
  postedAt: Date | null;
  title: string;
  category: string;
  status: string; // "upcoming" | "final" | "cancelled" | "draft" | "amended"
  agendaUrl: string | null;
  agendaHtmlUrl: string | null;
  agendaPacketUrl: string | null;
  minutesUrl: string | null;
  previousVersionsUrl: string | null;
  isAmended: boolean;
}

// ─── Constants ──────────────────────────────────────────────

const BASE_URL = "https://pattersonca.gov";
const SEARCH_URL = `${BASE_URL}/AgendaCenter/Search/`;
const CATEGORY_URL = `${BASE_URL}/AgendaCenter/UpdateCategoryList`;

const CATEGORY_IDS: Record<string, number> = {
  "Beautification Committee": 8,
  "Downtown Revitalization Committee": 18,
  "Economic Strategic Commission": 9,
  "Legal Notices & Public Hearings": 14,
  "Parks & Recreation Commission": 10,
  "Parks, Recreation & Beautification Commission": 13,
  "Planning Commission": 12,
  "Public Safety Committee": 16,
  "Senior Center Board of Directors": 11,
  "Senior Commission": 20,
};

// ─── Helpers ────────────────────────────────────────────────

/**
 * Format a Date as MM/DD/YYYY for the CivicPlus search endpoint.
 */
function formatDateParam(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Extract the numeric sourceId from a CivicPlus URL.
 * e.g. "/AgendaCenter/ViewFile/Agenda/_03092026-1444" → "1444"
 */
function extractSourceId(url: string): string | null {
  const match = url.match(/_\d{8}-(\d+)/);
  return match ? match[1] : null;
}

/**
 * Parse a display date like "Mar 9, 2026" into a Date object.
 */
function parseMeetingDate(text: string): Date | null {
  const cleaned = text.trim();
  const parsed = new Date(cleaned);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

/**
 * Parse the posted date from text like "Posted Mar 5, 2026 9:56 AM".
 */
function parsePostedDate(text: string): Date | null {
  const match = text.match(/Posted\s+(.+)/i);
  if (!match) return null;
  const parsed = new Date(match[1].trim());
  if (isNaN(parsed.getTime())) return null;
  return parsed;
}

/**
 * Determine meeting status from its title and other attributes.
 */
function determineStatus(
  title: string,
  meetingDate: Date,
  hasMinutes: boolean
): { status: string; isAmended: boolean } {
  const upperTitle = title.toUpperCase();

  if (upperTitle.includes("CANCEL")) {
    return { status: "cancelled", isAmended: false };
  }

  if (upperTitle.includes("AMEND")) {
    return { status: "amended", isAmended: true };
  }

  if (hasMinutes) {
    return { status: "final", isAmended: false };
  }

  if (meetingDate > new Date()) {
    return { status: "upcoming", isAmended: false };
  }

  return { status: "final", isAmended: false };
}

/**
 * Build a full URL from a relative path. Returns null if the path is falsy.
 */
function fullUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ─── HTML Parsing ───────────────────────────────────────────

/**
 * Parse meeting rows from a CivicPlus HTML response (search results or
 * category list). Both endpoints return HTML with similar structures:
 * category headers followed by meeting rows.
 */
function parseMeetingsFromHtml(html: string): ScrapedMeeting[] {
  const $ = cheerio.load(html);
  const meetings: ScrapedMeeting[] = [];

  // The search results page groups meetings under category sections.
  // Each category section has a header (often an h2 or a div with the
  // category name) followed by rows containing h3 date headings and links.

  // We track the current category as we iterate through the HTML.
  let currentCategory = "Unknown";

  // Look for category sections. CivicPlus uses various structures depending
  // on the endpoint. We handle both search results and category list HTML.

  // Strategy: iterate through all top-level structural elements.
  // Category headers are typically in elements before the meeting rows.

  // First, try the search results format where categories are in sections
  $("h2, .catHead, .CategoryName").each((_i, el) => {
    const catText = $(el).text().trim();
    if (catText) {
      currentCategory = catText;
    }
  });

  // If only one category header was found, it applies to all meetings.
  // Otherwise, we need to track which category each row belongs to.

  // More robust approach: walk through all children of the main container
  // and track category changes as we encounter them.
  const container = $(".AgendaCenter, #AgendaCenter, body").first();

  // Reset category tracking for the walk-through
  currentCategory = "Unknown";

  // Collect all relevant elements in document order
  container.find("h2, .catHead, .CategoryName, table tr, .Row, .MeetingRow").each((_i, el) => {
    const $el = $(el);
    const tagName = "tagName" in el ? (el as Element).tagName?.toLowerCase() : undefined;

    // Check if this is a category header
    if (
      tagName === "h2" ||
      $el.hasClass("catHead") ||
      $el.hasClass("CategoryName")
    ) {
      const catText = $el.text().trim();
      if (catText) {
        currentCategory = catText;
      }
      return;
    }

    // Otherwise try to parse as a meeting row
    const meeting = parseMeetingRow($, $el, currentCategory);
    if (meeting) {
      meetings.push(meeting);
    }
  });

  // If the above structure-based approach didn't find meetings,
  // fall back to finding all rows that contain the date pattern in h3 tags.
  if (meetings.length === 0) {
    currentCategory = "Unknown";

    // Walk through all elements in order
    $("*").each((_i, el) => {
      const $el = $(el);
      const tagName = "tagName" in el ? (el as Element).tagName?.toLowerCase() : undefined;

      // Category headers
      if (
        tagName === "h2" ||
        $el.hasClass("catHead") ||
        $el.hasClass("CategoryName")
      ) {
        const catText = $el.text().trim();
        if (catText && !catText.match(/^\*\*/)) {
          currentCategory = catText;
        }
        return;
      }

      // Meeting rows identified by h3 with date pattern
      if (tagName === "h3") {
        const h3Text = $el.text();
        // Match patterns like "**Mar 9, 2026** — Posted Mar 5, 2026 9:56 AM"
        // or "Mar 9, 2026 — Posted Mar 5, 2026 9:56 AM"
        const dateMatch = h3Text.match(
          /\*{0,2}([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\*{0,2}/i
        );
        if (!dateMatch) return;

        // The meeting row is the parent element containing both the h3 and links
        const $row = $el.parent() as cheerio.Cheerio<Element>;
        const meeting = parseMeetingFromH3Context($, $el as cheerio.Cheerio<Element>, $row, currentCategory);
        if (meeting) {
          meetings.push(meeting);
        }
      }
    });
  }

  return meetings;
}

/**
 * Parse a single meeting from a table row or div element.
 */
function parseMeetingRow(
  $: cheerio.CheerioAPI,
  $row: cheerio.Cheerio<Element>,
  category: string
): ScrapedMeeting | null {
  const $h3 = $row.find("h3").first();
  if (!$h3.length) return null;

  return parseMeetingFromH3Context($, $h3, $row, category);
}

/**
 * Parse a meeting given its h3 element and surrounding row context.
 */
function parseMeetingFromH3Context(
  $: cheerio.CheerioAPI,
  $h3: cheerio.Cheerio<Element>,
  $row: cheerio.Cheerio<Element>,
  category: string
): ScrapedMeeting | null {
  const h3Text = $h3.text().trim();

  // Extract meeting date: "**Mar 9, 2026** — Posted Mar 5, 2026 9:56 AM"
  // Handle both with and without ** markers
  const dateMatch = h3Text.match(
    /\*{0,2}([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})\*{0,2}/i
  );
  if (!dateMatch) return null;

  const meetingDate = parseMeetingDate(dateMatch[1]);
  if (!meetingDate) return null;

  // Extract posted date
  const postedAt = parsePostedDate(h3Text);

  // Find all links in the row context
  const links = $row.find("a");

  let agendaUrl: string | null = null;
  let minutesUrl: string | null = null;
  let previousVersionsUrl: string | null = null;
  let title = "";
  let sourceId: string | null = null;

  links.each((_i, linkEl) => {
    const $link = $(linkEl);
    const href = $link.attr("href") || "";
    const linkText = $link.text().trim();
    const imgSrc = $link.find("img").attr("src") || "";

    if (href.includes("/ViewFile/Agenda/")) {
      if (!agendaUrl) {
        agendaUrl = href;
        // Extract sourceId from the first agenda URL
        if (!sourceId) {
          sourceId = extractSourceId(href);
        }
      }
      // The first non-image link with an agenda URL is likely the title link
      if (!title && linkText && !imgSrc) {
        title = linkText;
      }
    } else if (
      href.includes("/ViewFile/Minutes/") ||
      imgSrc.includes("Minutes")
    ) {
      minutesUrl = href;
      // Also try to get sourceId from minutes URL if we don't have one
      if (!sourceId) {
        sourceId = extractSourceId(href);
      }
    } else if (href.includes("/PreviousVersions/")) {
      previousVersionsUrl = href;
    }

    // Check the Download div links for labeled items
    if ($link.closest(".Download").length) {
      if (linkText.toLowerCase() === "agenda" && href.includes("/ViewFile/Agenda/")) {
        agendaUrl = href;
        if (!sourceId) {
          sourceId = extractSourceId(href);
        }
      } else if (linkText.toLowerCase().includes("previous")) {
        previousVersionsUrl = href;
      }
    }
  });

  if (!sourceId) return null;

  // If we didn't extract a title from the links, use the category name with date
  if (!title) {
    title = `${category} - ${dateMatch[1]}`;
  }

  // Build full URLs
  const fullAgendaUrl = fullUrl(agendaUrl);

  // Derive HTML and packet URLs from the agenda URL
  let agendaHtmlUrl: string | null = null;
  let agendaPacketUrl: string | null = null;
  if (fullAgendaUrl) {
    agendaHtmlUrl = `${fullAgendaUrl}?html=true`;
    agendaPacketUrl = `${fullAgendaUrl}?packet=true`;
  }

  const { status, isAmended } = determineStatus(
    title,
    meetingDate,
    minutesUrl !== null
  );

  return {
    sourceId,
    meetingDate,
    postedAt,
    title,
    category,
    status,
    agendaUrl: fullAgendaUrl,
    agendaHtmlUrl,
    agendaPacketUrl,
    minutesUrl: fullUrl(minutesUrl),
    previousVersionsUrl: fullUrl(previousVersionsUrl),
    isAmended,
  };
}

// ─── Fetch Functions ────────────────────────────────────────

/**
 * Fetch meetings using the search endpoint (primary method).
 * Returns results across all categories within the given date range.
 */
async function fetchViaSearch(
  startDate: Date,
  endDate: Date
): Promise<string> {
  const url = `${SEARCH_URL}?term=&CIDs=all&startDate=${formatDateParam(startDate)}&endDate=${formatDateParam(endDate)}`;

  console.log(`[civicplus] Fetching search results: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "BPCS/2.0 (civic-tech scraper)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Search request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

/**
 * Fetch meetings for a specific category and year using the AJAX POST endpoint
 * (fallback method).
 */
async function fetchViaCategory(
  categoryId: number,
  year: number
): Promise<string> {
  console.log(
    `[civicplus] Fetching category ${categoryId} for year ${year}`
  );

  const response = await fetch(CATEGORY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "BPCS/2.0 (civic-tech scraper)",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "text/html, */*; q=0.01",
    },
    body: `year=${year}&catID=${categoryId}`,
  });

  if (!response.ok) {
    throw new Error(
      `Category request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

// ─── Main Exports ───────────────────────────────────────────

/**
 * Scrape meetings from the CivicPlus Agenda Center.
 *
 * By default uses the search endpoint with a 90-day lookback and 90-day
 * lookahead window. Can be narrowed with startDate/endDate options.
 *
 * If categoryIds are provided, falls back to the per-category AJAX endpoint
 * for each specified category.
 */
export async function scrapeCivicPlus(options?: {
  startDate?: Date;
  endDate?: Date;
  categoryIds?: number[];
}): Promise<ScrapedMeeting[]> {
  const now = new Date();
  const startDate =
    options?.startDate ?? new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const endDate =
    options?.endDate ?? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  try {
    // If specific category IDs are requested, use the category endpoint
    if (options?.categoryIds && options.categoryIds.length > 0) {
      return await scrapeByCategory(options.categoryIds, startDate, endDate);
    }

    // Primary method: search endpoint
    console.log(
      `[civicplus] Scraping via search: ${formatDateParam(startDate)} to ${formatDateParam(endDate)}`
    );

    const html = await fetchViaSearch(startDate, endDate);
    const meetings = parseMeetingsFromHtml(html);

    console.log(`[civicplus] Found ${meetings.length} meetings via search`);

    // Deduplicate by sourceId (in case of overlapping results)
    const seen = new Set<string>();
    const unique = meetings.filter((m) => {
      if (seen.has(m.sourceId)) return false;
      seen.add(m.sourceId);
      return true;
    });

    console.log(
      `[civicplus] ${unique.length} unique meetings after deduplication`
    );
    return unique;
  } catch (error) {
    console.error("[civicplus] Search endpoint failed, trying category fallback:", error);

    // Fallback: scrape all known categories
    const allCategoryIds = Object.values(CATEGORY_IDS);
    return scrapeByCategory(allCategoryIds, startDate, endDate);
  }
}

/**
 * Scrape meetings using the per-category AJAX endpoint (fallback method).
 */
async function scrapeByCategory(
  categoryIds: number[],
  startDate: Date,
  endDate: Date
): Promise<ScrapedMeeting[]> {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  // Build a reverse lookup from ID to category name
  const idToName: Record<number, string> = {};
  for (const [name, id] of Object.entries(CATEGORY_IDS)) {
    idToName[id] = name;
  }

  const allMeetings: ScrapedMeeting[] = [];

  for (const catId of categoryIds) {
    for (const year of years) {
      try {
        const html = await fetchViaCategory(catId, year);
        const categoryName = idToName[catId] || `Category ${catId}`;
        const meetings = parseMeetingsFromHtml(html);

        // Override category name since the AJAX response may not include it
        const withCategory = meetings.map((m) => ({
          ...m,
          category: categoryName,
        }));

        // Filter to the requested date range
        const filtered = withCategory.filter(
          (m) => m.meetingDate >= startDate && m.meetingDate <= endDate
        );

        allMeetings.push(...filtered);
        console.log(
          `[civicplus] Category "${categoryName}" year ${year}: ${filtered.length} meetings`
        );
      } catch (error) {
        console.error(
          `[civicplus] Failed to fetch category ${catId} year ${year}:`,
          error
        );
      }
    }
  }

  // Deduplicate by sourceId
  const seen = new Set<string>();
  return allMeetings.filter((m) => {
    if (seen.has(m.sourceId)) return false;
    seen.add(m.sourceId);
    return true;
  });
}

/**
 * Fetch and return the HTML body content from an agenda's ?html=true URL.
 * Useful for converting to markdown or displaying inline.
 */
export async function scrapeAgendaHtml(
  url: string
): Promise<string | null> {
  try {
    // Ensure the URL has the ?html=true parameter
    const htmlUrl = url.includes("html=true")
      ? url
      : url.includes("?")
        ? `${url}&html=true`
        : `${url}?html=true`;

    console.log(`[civicplus] Fetching agenda HTML: ${htmlUrl}`);

    const response = await fetch(htmlUrl, {
      headers: {
        "User-Agent": "BPCS/2.0 (civic-tech scraper)",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      console.error(
        `[civicplus] Agenda HTML request failed: ${response.status}`
      );
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and navigation elements
    $("script, style, nav, header, footer, .noprint").remove();

    // Extract the main content body
    const body =
      $("main").html() ||
      $(".AgendaContent, .agenda-content, #ContentPlaceHolder, article").html() ||
      $("body").html();

    if (!body || body.trim().length === 0) {
      console.log("[civicplus] Agenda HTML body is empty");
      return null;
    }

    // Clean up whitespace
    return body.trim();
  } catch (error) {
    console.error("[civicplus] Failed to fetch agenda HTML:", error);
    return null;
  }
}
