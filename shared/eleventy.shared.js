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

  // `npm run build:local` sets ELEVENTY_LOCAL so the output opens straight from Finder (file://):
  // root-relative URLs become relative, and folder URLs point at their index.html.
  if (process.env.ELEVENTY_LOCAL) {
    eleventyConfig.addTransform("relative-urls", function (content) {
      if (!this.page.outputPath?.endsWith(".html")) return content;
      const prefix = "../".repeat(this.page.url.split("/").filter(Boolean).length);
      return content.replace(/(href|src|action)="\/(?!\/)([^"#?]*)([^"]*)"/g, (match, attr, path, rest) => {
        if (path === "" || path.endsWith("/")) path += "index.html";
        return `${attr}="${prefix}${path}${rest}"`;
      });
    });
  }

  eleventyConfig.addFilter("withChip", (roles) => roles.filter((r) => r.chip));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("byOrder", (items) =>
    [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );
}
