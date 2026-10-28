import sharedConfig from "../../shared/eleventy.shared.js";

export default function (eleventyConfig) {
  sharedConfig(eleventyConfig);
  eleventyConfig.addPassthroughCopy({ "sites/sistematica/src/css": "css" });
}

export const config = {
  dir: {
    input: "sites/sistematica/src",
    output: "sites/sistematica/_site",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
