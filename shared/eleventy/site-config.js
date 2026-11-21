// Shared Eleventy setup used by every site in this repo.
// Each site has a tiny sites/<site>/eleventy.config.js that calls this with its id.
// Paths are relative to the repo root: always run Eleventy from there (see npm scripts).
import fs from "node:fs";
import yaml from "js-yaml";
import path from "node:path";
import { imageSize } from "image-size";
import { loadFolder, loadFiles, md, setOwnUrls, isExternal } from "./content-collections.js";

const SM = '<span class="sm">Sistem<i>at</i>ica</span>';
const brand = (s) => esc(s).replace(/Sistem(?:\(at\)|at)ica/g, SM);
// Style "Sistematica" in the text parts of HTML that is already safe (e.g. rendered Markdown)
const brandHtml = (html) => String(html ?? "").replace(/>[^<]*/g, (t) => t.replace(/Sistem(?:\(at\)|at)ica/g, SM));
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function configureSite(eleventyConfig, site) {
  const contentDir = `content/${site}`;

  // YAML data files (content/<site>/*.yml, sites/<site>/src/_data/*.yml)
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Site settings (default theme, name, ...) live with the content so the CMS can edit them.
  eleventyConfig.addGlobalData("site", () => ({
    id: site,
    ...yaml.load(fs.readFileSync(`${contentDir}/settings.yml`, "utf8")),
  }));

  // Public URL of every site, for cross-links (e.g. urls.sistematica in the laura footer)
  const urls = Object.fromEntries(
    fs.readdirSync("content", { withFileTypes: true })
      .filter((d) => d.isDirectory() && fs.existsSync(`content/${d.name}/settings.yml`))
      .map((d) => [d.name, yaml.load(fs.readFileSync(`content/${d.name}/settings.yml`, "utf8")).url])
  );
  eleventyConfig.addGlobalData("urls", urls);
  setOwnUrls(urls);

  // Page texts (one file per page, edited in the CMS "Pages" collection): pages.home, pages.about, …
  eleventyConfig.addGlobalData("pages", () => loadFiles(`${contentDir}/pages`));

  // CMS collections (Markdown files in content/). Available in every template of every site.
  eleventyConfig.addGlobalData("speaking", () => loadFolder("content/laura/speaking"));
  eleventyConfig.addGlobalData("roles", () => loadFolder("content/shared/roles"));
  eleventyConfig.addGlobalData("collaborations", () => loadFolder("content/sistematica/collaborations"));

  // Shared static assets
  eleventyConfig.addPassthroughCopy({
    "shared/css": "css",
    "shared/js": "js",
    // Images uploaded through the CMS (media_folder in sites/laura/src/admin/config.yml)
    "content/media": "media",
  });
  // Site-specific static assets, if any
  if (fs.existsSync(`sites/${site}/static`)) {
    eleventyConfig.addPassthroughCopy({ [`sites/${site}/static`]: "/" });
  }

  eleventyConfig.addWatchTarget("shared/");
  eleventyConfig.addWatchTarget(`${contentDir}/`);
  eleventyConfig.addWatchTarget("content/shared/");
  eleventyConfig.addWatchTarget("content/media/");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Long text from the CMS (Markdown) -> HTML. External links open in a new tab; "Sistematica" is styled.
  eleventyConfig.addFilter("md", (s) => (s ? brandHtml(md.render(String(s))) : ""));

  // Headings typed in the CMS: escape, but keep "&shy;" (where a long word may break) working.
  // Also styles the word "Sistematica".
  eleventyConfig.addFilter("soft", (s) => brand(s).replace(/&amp;shy;/g, "&shy;"));


  // width="…" height="…" for an image under /media/ (read from the file, so the page doesn't jump while loading)
  const sizes = new Map();
  eleventyConfig.addFilter("imgSize", (src) => {
    if (!src || !src.startsWith("/media/")) return "";
    if (!sizes.has(src)) {
      try {
        const { width, height } = imageSize(fs.readFileSync(path.join("content/media", src.slice(7))));
        sizes.set(src, ` width="${width}" height="${height}"`);
      } catch {
        sizes.set(src, "");
      }
    }
    return sizes.get(src);
  });

  // Wrap the word "Sistematica" in the brand markup (Sistem<i>at</i>ica). Input is escaped first.
  eleventyConfig.addFilter("brand", brand);

  // A link is external if it is absolute and does not point to one of our own sites.
  eleventyConfig.addFilter("isExternal", isExternal);

  return {
    dir: {
      input: `sites/${site}/src`,
      includes: "../../../shared/_includes",
      data: "_data",
      output: `sites/${site}/_site`,
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
