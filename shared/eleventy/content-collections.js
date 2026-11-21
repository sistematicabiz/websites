// Loads CMS-managed Markdown files (front matter + body) from content/ and exposes them
// as sorted arrays. content/ lives outside each site's input folder, so we read it here
// instead of using Eleventy's template collections.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import markdownIt from "markdown-it";

export const md = markdownIt({ html: true, typographer: false });

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function readEntry(file) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(FRONT_MATTER);
  const data = m ? yaml.load(m[1]) || {} : {};
  const body = (m ? m[2] : raw).trim();
  if (data.image && !data.image_alt) {
    console.warn(`[content] ${file}: image without image_alt (alt text). Please add a description in the CMS.`);
  }
  return {
    ...data,
    slug: path.basename(file, ".md"),
    body,
    html: body ? md.render(body) : "",
  };
}

// Sort by `order` (ascending, entries without it go last), then by `date` (newest first).
export function byOrderThenDate(a, b) {
  const oa = Number.isFinite(a.order) ? a.order : Infinity;
  const ob = Number.isFinite(b.order) ? b.order : Infinity;
  if (oa !== ob) return oa - ob;
  const da = a.date ? new Date(a.date).getTime() : 0;
  const db = b.date ? new Date(b.date).getTime() : 0;
  return db - da;
}

export function loadFolder(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readEntry(path.join(dir, f)))
    .filter((e) => !e.draft)
    .sort(byOrderThenDate);
}
