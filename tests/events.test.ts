import test from "node:test";
import assert from "node:assert/strict";
import { parseEvents, upcomingEvents, eventDate, eventTime, fallbackEvents } from "../lib/events";

const calendar = (...events: string[]) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events.join("\r\n")}\r\nEND:VCALENDAR`;
const event = (fields: string) => `BEGIN:VEVENT\r\n${fields}\r\nEND:VEVENT`;
const lagos = `UID:evt-saS7WUGWgykJY89@events.lu.ma\r\nSUMMARY:Lagos Edition\r\nDTSTART:20261009T180000Z\r\nDTEND:20261009T210000Z`;

test("unfolds feed links and renders Lagos local time", () => {
  const [parsed] = parseEvents(calendar(event(`${lagos}\r\nDESCRIPTION:Register: https://luma.com/\r\n b5xnf9hh\r\nSTATUS:TENTATIVE`)));
  assert.equal(parsed.href, "https://luma.com/b5xnf9hh");
  assert.equal(parsed.city, "Lagos");
  assert.equal(eventDate(parsed), "9 October 2026");
  assert.match(eventTime(parsed), /19:00/);
  assert.equal(upcomingEvents([parsed], new Date("2026-10-09T20:59:59Z")).length, 1);
  assert.equal(upcomingEvents([parsed], new Date("2026-10-09T21:00:00Z")).length, 0);
});

test("sorts events, expires Lagos before London and reaches empty state", () => {
  assert.deepEqual(upcomingEvents([...fallbackEvents].reverse(), new Date("2026-09-24")), fallbackEvents);
  assert.deepEqual(upcomingEvents(fallbackEvents, new Date("2026-10-10")).map(e => e.city), ["London"]);
  assert.equal(upcomingEvents(fallbackEvents, new Date("2026-11-20")).length, 0);
  assert.equal(eventTime(fallbackEvents[1]), "18:30 GMT");
});

test("newest duplicate cancellation takes precedence", () => {
  const parsed = parseEvents(calendar(event(`${lagos}\r\nSEQUENCE:2\r\nSTATUS:CANCELLED`), event(`${lagos}\r\nSEQUENCE:1`)));
  assert.equal(parsed.length, 1);
  assert.equal(upcomingEvents(parsed, new Date("2026-09-24")).length, 0);
});

test("all-day dates survive their local day without fabricated time", () => {
  const [parsed] = parseEvents(calendar(event("UID:all-day\r\nSUMMARY:Conversation\r\nDTSTART;VALUE=DATE:20261009")), { "all-day": { city:"Lagos", timeZone:"Africa/Lagos" } });
  assert.equal(eventDate(parsed), "9 October 2026");
  assert.equal(eventTime(parsed), "Time to be announced");
  assert.equal(upcomingEvents([parsed], new Date("2026-10-09T22:59:59Z")).length, 1);
  assert.equal(upcomingEvents([parsed], new Date("2026-10-09T23:00:00Z")).length, 0);
  assert.equal(upcomingEvents([{...parsed, end:"2026-10-11"}], new Date("2026-10-10T12:00:00Z")).length, 1);
});

test("unsafe or absent links use a calendar fallback; unknown cities are explicit", () => {
  const [parsed] = parseEvents(calendar(event("UID:unknown\r\nSUMMARY:New event\r\nDTSTART:20261201T180000Z\r\nURL:javascript:alert(1)")));
  assert.equal(parsed.href, undefined);
  assert.equal(parsed.city, "Location on Luma");
  assert.equal(parsed.timeZone, "UTC");
});

test("empty calendar is valid; malformed and unsupported input fail for cached fallback", () => {
  assert.deepEqual(parseEvents(calendar()), []);
  assert.throws(() => parseEvents("<html>upstream error</html>"));
  assert.throws(() => parseEvents(calendar(event(`${lagos}\r\nRRULE:FREQ=WEEKLY`))));
  assert.throws(() => parseEvents(calendar(event("UID:bad\r\nSUMMARY:Bad\r\nDTSTART:20261009T180000"))));
});
