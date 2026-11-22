// Run with: npm run fetch:substack
// Saves the latest Moral Revolution posts to sites/laura/src/_data/substack.json.
// If anything goes wrong it keeps the existing file and exits 0, so a Substack outage never breaks the build.
import fs from "node:fs";
import yaml from "js-yaml";

const OUTPUT = "sites/laura/src/_data/substack.json";
const MAX_ITEMS = 3;
const EXCERPT_LENGTH = 180;
const TIMEOUT_MS = 15000;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (all, e) => {
    if (e[0] !== "#") return ENTITIES[e.toLowerCase()] ?? all;
    const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : all;
  });

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  if (!m) return "";
  const cdata = m[1].trim().match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return cdata ? cdata[1] : decode(m[1]);
}

const plain = (html) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function excerpt(text) {
  if (text.length <= EXCERPT_LENGTH) return text;
  return text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, "").replace(/[,;:.\s]+$/, "") + "…";
}

export function parseFeed(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => {
      const date = new Date(tag(item, "pubDate"));
      const enclosure = item.match(/<enclosure\b[^>]*\btype="([^"]+)"/);
      return {
        title: plain(tag(item, "title")),
        date: Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10),
        type: enclosure?.[1].startsWith("audio/") ? "podcast" : "essay",
        excerpt: excerpt(plain(tag(item, "description"))),
        link: tag(item, "link").trim(),
      };
    })
    .filter((i) => i.title && /^https:\/\//.test(i.link))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_ITEMS);
}

try {
  const settings = yaml.load(fs.readFileSync("content/laura/settings.yml", "utf8"));
  const url = settings.links.substack_feed;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; site-build/1.0)", Accept: "application/rss+xml, application/xml" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const items = parseFeed(await res.text());
  if (!items.length) throw new Error("no items found in the feed");
  fs.writeFileSync(OUTPUT, JSON.stringify({ items }, null, 2) + "\n");
  console.log(`[substack] saved ${items.length} items; latest: ${items[0].title}`);
} catch (err) {
  console.warn(`[substack] could not update (${err.message}); keeping the existing data.`);
}
