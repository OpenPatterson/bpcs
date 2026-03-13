import * as cheerio from "cheerio";

const IQM2_BASE_URL = "https://pattersonca.iqm2.com";
const CALENDAR_URL = `${IQM2_BASE_URL}/Citizens/Calendar.aspx`;
const DETAIL_URL = `${IQM2_BASE_URL}/Citizens/Detail_Meeting.aspx`;
const FETCH_TIMEOUT = 30_000; // 30 seconds — IQM2 is slow

// Default date range: 2020-01-01 to 2025-10-01 (before CivicPlus migration)
const DEFAULT_FROM = new Date("2020-01-01T00:00:00");
const DEFAULT_TO = new Date("2025-10-01T00:00:00");
const EARLIEST_AGENDA_DATE = new Date("2020-01-01T00:00:00");

// ─── Types ──────────────────────────────────────────────────

export interface ScrapedIQM2Meeting {
  iqm2Id: number;
  meetingLink: string;
  meetingTime: Date;
  meetingType: string;
  meetingStatus: string;
  boardType: string;
  agendaUrl: string | null;
  agendaPacketUrl: string | null;
  minutesUrl: string | null;
  summaryUrl: string | null;
}

// ─── Helpers ────────────────────────────────────────────────

function formatDateParam(d: Date): string {
  // IQM2 expects M/D/YYYY
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = FETCH_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Extract the meeting ID from a detail link href.
 * Expects something like `/Citizens/Detail_Meeting.aspx?ID=1234`
 */
function extractMeetingId(href: string): number | null {
  const match = href.match(/[?&]ID=(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Build a full IQM2 URL from a relative path.
 */
function fullUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) return relativePath;
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${IQM2_BASE_URL}${path}`;
}

/**
 * Determine meeting status from date and any status text.
 */
function inferStatus(meetingTime: Date, statusText: string): string {
  const lower = statusText.toLowerCase();
  if (lower.includes("cancel")) return "cancelled";
  if (lower.includes("draft")) return "draft";
  const now = new Date();
  return meetingTime < now ? "final" : "upcoming";
}

/**
 * Parse a date string from the IQM2 calendar page.
 * IQM2 typically displays dates like "1/14/2020 7:00 PM" or "January 14, 2020 7:00 PM".
 */
function parseMeetingDate(text: string): Date | null {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return null;

  // Try direct Date parse — handles most US date formats
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;

  // Try M/D/YYYY with optional time
  const mdyMatch = cleaned.match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i
  );
  if (mdyMatch) {
    let [, month, day, year, hours, minutes, ampm] = mdyMatch;
    let h = hours ? parseInt(hours, 10) : 0;
    const m = minutes ? parseInt(minutes, 10) : 0;
    if (ampm) {
      if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
      if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
    }
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      h,
      m
    );
  }

  return null;
}

/**
 * Build document URLs for a meeting ID based on IQM2 file-type codes.
 */
function buildDocUrls(meetingId: number) {
  return {
    agendaUrl: `${IQM2_BASE_URL}/Citizens/FileOpen.aspx?Type=14&ID=${meetingId}`,
    minutesUrl: `${IQM2_BASE_URL}/Citizens/FileOpen.aspx?Type=12&ID=${meetingId}`,
    agendaPacketUrl: `${IQM2_BASE_URL}/Citizens/FileOpen.aspx?Type=1&ID=${meetingId}`,
    summaryUrl: `${IQM2_BASE_URL}/Citizens/FileOpen.aspx?Type=15&ID=${meetingId}`,
  };
}

// ─── Calendar Scraper ───────────────────────────────────────

export async function scrapeIQM2(options?: {
  fromDate?: Date;
  toDate?: Date;
}): Promise<ScrapedIQM2Meeting[]> {
  const fromDate = options?.fromDate ?? DEFAULT_FROM;
  const toDate = options?.toDate ?? DEFAULT_TO;

  const url = `${CALENDAR_URL}?From=${formatDateParam(fromDate)}&To=${formatDateParam(toDate)}`;
  console.log(`[IQM2] Fetching calendar: ${url}`);

  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new Error(
      `[IQM2] Calendar fetch failed: ${res.status} ${res.statusText}`
    );
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const meetings: ScrapedIQM2Meeting[] = [];

  // IQM2 calendar pages use table rows or div.Row elements.
  // We look for links to Detail_Meeting.aspx to identify meeting entries.
  const detailLinks = $(
    'a[href*="Detail_Meeting.aspx"], a[href*="detail_meeting.aspx"]'
  );
  console.log(`[IQM2] Found ${detailLinks.length} meeting links on calendar`);

  detailLinks.each((_i, el) => {
    const anchor = $(el);
    const href = anchor.attr("href") ?? "";
    const meetingId = extractMeetingId(href);
    if (meetingId === null) return;

    // Walk up to the containing row (tr or div.Row)
    const row = anchor.closest("tr, div.Row, div.MeetingRow, li");

    // Extract meeting date/time — look in the row cells or nearby text
    let dateText = "";
    if (row.length) {
      // Try first cell (td) or a date-specific element
      const dateCell = row.find(
        'td:first-child, .MeetingDate, [class*="date" i]'
      );
      dateText = dateCell.length ? dateCell.text().trim() : "";

      // Fallback: grab all row text and try to find a date pattern
      if (!dateText) {
        const rowText = row.text();
        const dateMatch = rowText.match(
          /\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?/i
        );
        if (dateMatch) dateText = dateMatch[0];
      }
    }

    // If we still have no date, try the link text itself
    if (!dateText) {
      const linkText = anchor.text().trim();
      const dateMatch = linkText.match(
        /\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?/i
      );
      if (dateMatch) dateText = dateMatch[0];
    }

    const meetingTime = parseMeetingDate(dateText);
    if (!meetingTime) {
      console.log(
        `[IQM2] Skipping meeting ${meetingId}: could not parse date from "${dateText}"`
      );
      return;
    }

    // Extract meeting type from the link text or a nearby cell
    let meetingType = anchor.text().trim();
    if (row.length) {
      const typeCell = row.find(
        '.MeetingType, [class*="type" i], td:nth-child(2)'
      );
      if (typeCell.length) {
        const typeCellText = typeCell.text().trim();
        if (typeCellText) meetingType = typeCellText;
      }
    }
    // Clean up: if the meeting type contains the date, strip it
    meetingType = meetingType
      .replace(
        /\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?/gi,
        ""
      )
      .trim();
    if (!meetingType) meetingType = "Unknown Meeting";

    // Extract board type
    let boardType = "";
    if (row.length) {
      const boardCell = row.find(
        '.BoardType, [class*="board" i], td:nth-child(3)'
      );
      if (boardCell.length) boardType = boardCell.text().trim();
    }
    if (!boardType) boardType = meetingType;

    // Extract status text
    let statusText = "";
    if (row.length) {
      const statusCell = row.find(
        '.MeetingStatus, [class*="status" i], td:last-child'
      );
      if (statusCell.length) statusText = statusCell.text().trim();
    }
    const meetingStatus = inferStatus(meetingTime, statusText);

    // Build document URLs
    const docUrls = buildDocUrls(meetingId);

    meetings.push({
      iqm2Id: meetingId,
      meetingLink: fullUrl(href),
      meetingTime,
      meetingType,
      meetingStatus,
      boardType,
      agendaUrl: docUrls.agendaUrl,
      agendaPacketUrl: docUrls.agendaPacketUrl,
      minutesUrl: docUrls.minutesUrl,
      summaryUrl: docUrls.summaryUrl,
    });
  });

  console.log(`[IQM2] Scraped ${meetings.length} meetings`);
  return meetings;
}

// ─── Agenda Scraper ─────────────────────────────────────────

/**
 * Scrape the agenda from an individual meeting detail page and convert
 * the IQM2 HTML table structure into hierarchical Markdown.
 *
 * IQM2 agendas use HTML tables with colspan-based indentation:
 * - Top-level sections span the full width (large colspan)
 * - Sub-sections have slightly smaller colspan
 * - Individual items have smaller colspan / are nested deeper
 */
export async function scrapeIQM2Agenda(
  meetingId: number
): Promise<string | null> {
  const url = `${DETAIL_URL}?ID=${meetingId}`;
  console.log(`[IQM2] Fetching agenda for meeting ${meetingId}: ${url}`);

  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    console.log(
      `[IQM2] Detail page fetch failed for ${meetingId}: ${res.status}`
    );
    return null;
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Find the agenda table(s). IQM2 typically puts agenda content in tables
  // within a specific container.
  const agendaTables = $(
    'table.MeetingDetail, table[id*="Agenda"], #divAgenda table, .AgendaContent table, table'
  );

  if (agendaTables.length === 0) {
    console.log(`[IQM2] No agenda table found for meeting ${meetingId}`);
    return null;
  }

  const lines: string[] = [];
  let foundAgendaContent = false;

  // Process each row in the agenda tables.
  // We look for the most specific agenda container first.
  const agendaContainer =
    $('#divAgenda, .AgendaContent, [id*="genda"]').first();
  const targetTables =
    agendaContainer.length > 0 ? agendaContainer.find("table") : agendaTables;

  targetTables.each((_tableIdx, table) => {
    $(table)
      .find("tr")
      .each((_rowIdx, tr) => {
        const cells = $(tr).find("td, th");
        if (cells.length === 0) return;

        // Determine indentation level from colspan.
        // Higher colspan = more prominent (section heading).
        // We look at the first cell with actual text content.
        let text = "";
        let maxColspan = 1;
        let textColspan = 1;

        cells.each((_cellIdx, td) => {
          const cellText = $(td).text().trim();
          const colspan = parseInt($(td).attr("colspan") ?? "1", 10);
          if (colspan > maxColspan) maxColspan = colspan;
          if (cellText) {
            if (!text) {
              text = cellText;
              textColspan = colspan;
            } else {
              // Concatenate text from multiple cells
              text += " — " + cellText;
            }
          }
        });

        if (!text) return;
        foundAgendaContent = true;

        // Clean up whitespace
        text = text.replace(/\s+/g, " ").trim();

        // Classify based on colspan relative to max in the row.
        // IQM2 uses colspan to indicate hierarchy:
        // - Full-width rows (high colspan) → top-level sections
        // - Medium colspan → sub-sections
        // - Low colspan → items
        // Also check for styling cues (bold, all-caps, font size).
        const isBold =
          cells.find("b, strong").length > 0 ||
          cells.filter(function () {
            const fw = $(this).css("font-weight");
            return fw === "bold" || parseInt(fw ?? "0", 10) >= 700;
          }).length > 0;

        const isAllCaps = text === text.toUpperCase() && text.length > 3;

        if (textColspan >= 4 || (isBold && isAllCaps)) {
          // Top-level section
          lines.push("");
          lines.push(`## ${text}`);
          lines.push("");
        } else if (textColspan >= 3 || isBold) {
          // Sub-section
          lines.push(`### ${text}`);
        } else if (textColspan >= 2) {
          // Regular item
          lines.push(`- ${text}`);
        } else {
          // Indented sub-item
          lines.push(`  - ${text}`);
        }
      });
  });

  if (!foundAgendaContent) {
    console.log(`[IQM2] No agenda content found for meeting ${meetingId}`);
    return null;
  }

  // Clean up: remove excessive blank lines
  const markdown = lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  console.log(
    `[IQM2] Extracted agenda for meeting ${meetingId} (${markdown.length} chars)`
  );
  return markdown || null;
}
