import sharedConfig from "../../shared/eleventy.shared.js";

export default function (eleventyConfig) {
  sharedConfig(eleventyConfig);
  eleventyConfig.addPassthroughCopy({ "sites/laura/src/css": "css" });
}

export const config = {
  dir: {
    input: "sites/laura/src",
    output: "sites/laura/_site",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
