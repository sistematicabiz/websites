import fs from "node:fs";

const readJson = (file) =>
  JSON.parse(fs.readFileSync(new URL(`./data/${file}`, import.meta.url), "utf8"));

// Setup shared by both sites: global data, shared assets, filters.
// Paths are relative to the repo root, where the npm scripts run Eleventy.
export default function sharedConfig(eleventyConfig) {
  eleventyConfig.addGlobalData("profile", readJson("profile.json"));
  eleventyConfig.addGlobalData("roles", readJson("roles.json"));

  eleventyConfig.addPassthroughCopy({ "shared/css": "css/shared" });
  eleventyConfig.addPassthroughCopy({ "shared/img": "img" });
  eleventyConfig.addPassthroughCopy({ "shared/js": "js" });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("byOrder", (items) =>
    [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );
}
