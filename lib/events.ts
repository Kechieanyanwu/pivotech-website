import ICAL from "ical.js";

export type EventLocation = { city: string; timeZone: string };
export type CommunityEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  city: string;
  timeZone: string;
  href?: string;
  cancelled: boolean;
};

// Luma's ICS omits city labels and original timezones. Only these annotations
// are local; titles, dates, URLs and cancellations are supplied by Luma.
export const eventLocations: Record<string, EventLocation> = {
  "evt-saS7WUGWgykJY89@events.lu.ma": { city: "Lagos", timeZone: "Africa/Lagos" },
  "evt-9EDg9heNICiH3YW@events.lu.ma": { city: "London", timeZone: "Europe/London" },
};

export const fallbackEvents: CommunityEvent[] = [
  {
    id: "evt-saS7WUGWgykJY89@events.lu.ma",
    title: "Conversations with Technologists: Lagos Edition",
    start: "2026-10-09T18:00:00.000Z", end: "2026-10-09T21:00:00.000Z",
    allDay: false, ...eventLocations["evt-saS7WUGWgykJY89@events.lu.ma"],
    href: "https://luma.com/b5xnf9hh", cancelled: false,
  },
  {
    id: "evt-9EDg9heNICiH3YW@events.lu.ma",
    title: "Conversations with Technologists: Winter Salon",
    start: "2026-11-19T18:30:00.000Z", end: "2026-11-19T21:30:00.000Z",
    allDay: false, ...eventLocations["evt-9EDg9heNICiH3YW@events.lu.ma"],
    href: "https://luma.com/o79jxq6q", cancelled: false,
  },
];

function lumaUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && ["luma.com", "lu.ma"].includes(url.hostname)) return url.href;
  } catch { /* Missing or invalid URLs use the calendar action. */ }
}

export function parseEvents(source: string, locations: Record<string, EventLocation> = eventLocations): CommunityEvent[] {
  const calendar = new ICAL.Component(ICAL.parse(source));
  if (calendar.name !== "vcalendar") throw new Error("Invalid event calendar");
  const entries = new Map<string, { event: CommunityEvent; sequence: number }>();
  for (const component of calendar.getAllSubcomponents("vevent")) {
    const id = String(component.getFirstPropertyValue("uid") ?? "");
    const title = String(component.getFirstPropertyValue("summary") ?? "").trim();
    if (!id || !title) continue;
    const start = component.getFirstPropertyValue("dtstart") as ICAL.Time | null;
    const end = component.getFirstPropertyValue("dtend") as ICAL.Time | null;
    if (!start) throw new Error("Event is missing its start date");
    // Luma exports individual UTC events. Do not silently misinterpret a new
    // recurrence or floating-time format if the provider changes its export.
    if (component.hasProperty("rrule") || component.hasProperty("recurrence-id")) throw new Error("Recurring events need expansion");
    if (!start.isDate && start.zone.tzid === "floating") throw new Error("Event time has no timezone");
    const startValue = start.isDate ? start.toString() : start.toJSDate().toISOString();
    const endValue = end ? (end.isDate ? end.toString() : end.toJSDate().toISOString()) : undefined;
    if (endValue && endValue <= startValue) throw new Error("Invalid event end date");
    const description = String(component.getFirstPropertyValue("description") ?? "");
    const href = lumaUrl(String(component.getFirstPropertyValue("url") ?? ""))
      ?? lumaUrl(description.match(/https:\/\/(?:luma\.com|lu\.ma)\/[^\s<>]+/)?.[0] ?? "");
    const location = locations[id] ?? { city: "Location on Luma", timeZone: "UTC" };
    const event: CommunityEvent = {
      id, title, start: startValue, end: endValue, allDay: start.isDate,
      ...location, href,
      cancelled: String(component.getFirstPropertyValue("status")).toUpperCase() === "CANCELLED",
    };
    const sequence = Number(component.getFirstPropertyValue("sequence") ?? 0);
    if (!entries.has(id) || sequence >= entries.get(id)!.sequence) entries.set(id, { event, sequence });
  }
  return [...entries.values()].map(({ event }) => event);
}

function localDay(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)!.value).join("-");
}

export function upcomingEvents(events: CommunityEvent[], now = new Date()): CommunityEvent[] {
  return events.filter((event) => {
    if (event.cancelled) return false;
    if (event.allDay) {
      const today = localDay(now, event.timeZone);
      // All-day DTEND is exclusive. Without one, retain the whole local day.
      return event.end ? today < event.end : today <= event.start;
    }
    return event.end ? Date.parse(event.end) > now.getTime()
      : localDay(now, event.timeZone) <= localDay(new Date(event.start), event.timeZone);
  }).sort((a, b) => a.start.localeCompare(b.start));
}

export function eventDate(event: CommunityEvent, short = false): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: event.allDay ? "UTC" : event.timeZone,
    day: "numeric", month: short ? "short" : "long", ...(short ? {} : { year: "numeric" }),
  }).format(new Date(event.allDay ? `${event.start}T12:00:00Z` : event.start));
}

export function eventTime(event: CommunityEvent): string {
  if (event.allDay) return "Time to be announced";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: event.timeZone, hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(new Date(event.start));
}
