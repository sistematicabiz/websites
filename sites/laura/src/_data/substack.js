// Latest Moral Revolution posts, fetched from the Substack RSS feed at build time.
// If the feed can't be reached the build carries on with the last successful fetch,
// saved in sites/laura/cache/substack.json (committed), or with no cards at all.
import fs from "node:fs";
import { load as loadYaml } from "js-yaml";

const COUNT = 3;
const EXCERPT_LENGTH = 200;
const CACHE = new URL("../../cache/substack.json", import.meta.url);

const profile = loadYaml(fs.readFileSync(new URL("../../../../shared/data/profile.yaml", import.meta.url), "utf8"));
// SUBSTACK_FEED overrides the feed address, e.g. to test the fallback with a bad URL.
const FEED = process.env.SUBSTACK_FEED || new URL("feed", profile.moralRevolution.substack).href;

const decode = (s) =>
  s
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, "&");

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1].trim()).trim() : "";
};

const excerpt = (html) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= EXCERPT_LENGTH) return text;
  return text.slice(0, text.lastIndexOf(" ", EXCERPT_LENGTH)).replace(/[,;:.\s]+$/, "") + "…";
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function parse(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, COUNT).map(([, item]) => ({
    title: tag(item, "title"),
    excerpt: excerpt(tag(item, "description")),
    url: tag(item, "link"),
    date: formatDate(tag(item, "pubDate")),
    kind: /<enclosure[^>]*type="audio\//.test(item) ? "Podcast" : "Essay",
  }));
}

export default async function () {
  try {
    const res = await fetch(FEED, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = parse(await res.text());
    if (!posts.length || posts.some((p) => !p.title || !p.url)) throw new Error("no usable items in feed");

    const json = JSON.stringify(posts, null, 2) + "\n";
    if (!fs.existsSync(CACHE) || fs.readFileSync(CACHE, "utf8") !== json) fs.writeFileSync(CACHE, json);
    return posts;
  } catch (err) {
    const cached = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : [];
    console.warn(`[substack] Could not fetch ${FEED} (${err.message}); using ${cached.length} cached post(s).`);
    return cached;
  }
}
