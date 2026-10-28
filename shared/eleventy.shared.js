import fs from "node:fs";
import { load as loadYaml } from "js-yaml";

const readYaml = (file) =>
  loadYaml(fs.readFileSync(new URL(`./data/${file}`, import.meta.url), "utf8"));

// Setup shared by both sites: global data, shared assets, filters.
// Paths are relative to the repo root, where the npm scripts run Eleventy.
export default function sharedConfig(eleventyConfig) {
  // Data files (_data/*.yaml) are written in YAML so they are easy to edit by hand.
  eleventyConfig.addDataExtension("yaml,yml", (contents) => loadYaml(contents));

  eleventyConfig.addGlobalData("profile", readYaml("profile.yaml"));
  eleventyConfig.addGlobalData("roles", readYaml("roles.yaml"));

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
