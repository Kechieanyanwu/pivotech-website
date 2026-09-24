import test from "node:test";
import assert from "node:assert/strict";
import { parsePosts, latestPosts } from "../lib/posts";

const feed = (items: string) => `<?xml version="1.0"?><rss version="2.0"><channel><title>Pivotech</title><link>https://pivotech.substack.com</link><description>Writing</description>${items}</channel></rss>`;
const item = (slug: string, day: number, title = slug) => `<item><title>${title}</title><link>https://pivotech.substack.com/p/${slug}</link><pubDate>${new Date(Date.UTC(2026,8,day)).toUTCString()}</pubDate></item>`;

test("deduplicates canonical links, sorts newest-first, limits to three and excludes future posts", async () => {
  const posts = await parsePosts(feed(item("old",1)+item("new?source=feed",20)+item("middle",10)+item("new",20)+item("fourth",5)+item("future",30)));
  assert.deepEqual(latestPosts(posts,new Date("2026-09-24")).map(p=>p.title),["new?source=feed","middle","fourth"]);
});

test("renders decoded plain-text titles and rejects unsafe links and invalid dates", async () => {
  const posts = await parsePosts(feed(item("valid",20,"Ideas &amp; people") + '<item><title>Bad</title><link>javascript:alert(1)</link><pubDate>20 Sep 2026</pubDate></item><item><title>Undated</title><link>https://pivotech.substack.com/p/no-date</link></item>'));
  assert.equal(posts.length,1);
  assert.equal(posts[0].title,"Ideas & people");
});

test("empty/fewer-than-three feeds work and malformed XML rejects", async () => {
  assert.deepEqual(await parsePosts(feed("")),[]);
  assert.equal(latestPosts(await parsePosts(feed(item("only",1))),new Date("2026-09-24")).length,1);
  await assert.rejects(parsePosts("<rss><channel>"));
});
