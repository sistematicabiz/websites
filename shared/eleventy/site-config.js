// Shared Eleventy setup used by every site in this repo.
// Each site has a tiny sites/<site>/eleventy.config.js that calls this with its id.
// Paths are relative to the repo root: always run Eleventy from there (see npm scripts).
import fs from "node:fs";
import yaml from "js-yaml";

export function configureSite(eleventyConfig, site) {
  const contentDir = `content/${site}`;

  // YAML data files (content/<site>/*.yml, sites/<site>/src/_data/*.yml)
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Site settings (default theme, name, ...) live with the content so the CMS can edit them.
  eleventyConfig.addGlobalData("site", () => ({
    id: site,
    ...yaml.load(fs.readFileSync(`${contentDir}/settings.yml`, "utf8")),
  }));

  // Shared static assets
  eleventyConfig.addPassthroughCopy({
    "shared/css": "css",
    "shared/js": "js",
    "shared/img": "img",
  });
  // Site-specific static assets, if any
  if (fs.existsSync(`sites/${site}/static`)) {
    eleventyConfig.addPassthroughCopy({ [`sites/${site}/static`]: "/" });
  }

  eleventyConfig.addWatchTarget("shared/");
  eleventyConfig.addWatchTarget(`${contentDir}/`);

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

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
